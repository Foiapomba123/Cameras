import { Production, ProductionStats } from '../types';
import { apiService } from './api';
import { API_ENDPOINTS_COMPAT as API_ENDPOINTS } from '../config/api';

export interface ProductionFilters {
  lineId?: string;
  status?: Production['status'];
  startDate?: string;
  endDate?: string;
}

export interface ProducaoDetalhadaDto {
  id: string;
  circuitoId: string;
  produto: {
    codigo: string;
    nome: string;
  };
  tecnico: string;
  dataInicio: string;
  dataFim?: string;
  status: string;
}

export interface ProducaoLinhaCircuitoDto {
  id: string;
  circuitoId: string;
  produto: {
    codigo: string;
    nome: string;
  };
  tecnico: string;
  dataInicio: string;
  dataFim?: string;
  status: string;
}

export interface DashboardResponseDto {
  mediaProducao?: number;
  totalProduzido?: number;
  producaoHoraria?: Array<{ hora: string; valor: number }>;
  [key: string]: any;
}

export class ProductionService {
  // Buscar produções em andamento
  async getProductions(contratoId: string, filters?: ProductionFilters): Promise<Production[]> {
    try {
      let productions: Production[];
      
      // Se filtro de linha foi especificado, usar endpoint específico
      if (filters?.lineId) {
        const response = await apiService.get<ProducaoLinhaCircuitoDto[]>(
          API_ENDPOINTS.PRODUCTIONS.GET_BY_CIRCUITO(contratoId, filters.lineId)
        );
        productions = response.map(producao => this.mapProducaoToProduction(producao));
      } else {
        // Usar endpoint geral para produções em andamento
        const response = await apiService.get<ProducaoLinhaCircuitoDto[]>(
          API_ENDPOINTS.PRODUCTIONS.GET_EM_ANDAMENTO(contratoId)
        );
        productions = response.map(producao => this.mapProducaoToProduction(producao));
      }
      
      // Aplicar filtros do lado cliente se necessário
      if (filters?.status) {
        productions = productions.filter(p => p.status === filters.status);
      }
      
      if (filters?.startDate || filters?.endDate) {
        productions = productions.filter(p => {
          if (filters.startDate && p.startDate < filters.startDate) {
            return false;
          }
          if (filters.endDate && p.endDate && p.endDate > filters.endDate) {
            return false;
          }
          return true;
        });
      }
      
      return productions;
    } catch (error) {
      console.error('Get productions error:', error);
      throw error;
    }
  }

  private mapProducaoToProduction(producao: ProducaoLinhaCircuitoDto | ProducaoDetalhadaDto): Production {
    return {
      id: producao.id,
      lineId: producao.circuitoId,
      productCode: producao.produto.codigo,
      productName: producao.produto.nome,
      technician: producao.tecnico,
      startDate: producao.dataInicio,
      endDate: producao.dataFim,
      status: this.mapStatus(producao.status),
    };
  }

  private mapStatus(apiStatus: string): Production['status'] {
    switch (apiStatus?.toLowerCase()) {
      case 'em producao':
      case 'em_producao':
      case 'produzindo':
        return 'EM PRODUCAO';
      case 'finalizada':
      case 'finalizado':
      case 'concluida':
        return 'FINALIZADA';
      default:
        return 'EM PRODUCAO';
    }
  }

  // Buscar produções por linha (circuito)
  async getProductionsByLine(contratoId: string, circuitoId: string): Promise<Production[]> {
    try {
      const response = await apiService.get<ProducaoLinhaCircuitoDto[]>(
        API_ENDPOINTS.PRODUCTIONS.GET_BY_CIRCUITO(contratoId, circuitoId)
      );
      
      return response.map(producao => this.mapProducaoToProduction(producao));
    } catch (error) {
      console.error('Get productions by line error:', error);
      throw error;
    }
  }

  // Buscar produção por ID
  async getProductionById(contratoId: string, id: string): Promise<Production> {
    try {
      const response = await apiService.get<ProducaoDetalhadaDto>(
        API_ENDPOINTS.PRODUCTIONS.GET(contratoId, id)
      );
      
      return this.mapProducaoToProduction(response);
    } catch (error) {
      console.error('Get production by ID error:', error);
      throw error;
    }
  }

  // Iniciar nova produção
  async createProduction(contratoId: string, producaoData: any): Promise<Production> {
    try {
      const response = await apiService.post<ProducaoDetalhadaDto>(
        API_ENDPOINTS.PRODUCTIONS.INICIAR(contratoId), 
        producaoData
      );
      
      return this.mapProducaoToProduction(response);
    } catch (error) {
      console.error('Create production error:', error);
      throw error;
    }
  }

  // Atualizar produção
  async updateProduction(contratoId: string, producaoData: any): Promise<Production> {
    try {
      const response = await apiService.put<ProducaoDetalhadaDto>(
        API_ENDPOINTS.PRODUCTIONS.ATUALIZAR(contratoId), 
        producaoData
      );
      
      return this.mapProducaoToProduction(response);
    } catch (error) {
      console.error('Update production error:', error);
      throw error;
    }
  }

  // Finalizar produção
  async finishProduction(contratoId: string, producaoData: any): Promise<Production> {
    try {
      const response = await apiService.put<ProducaoDetalhadaDto>(
        API_ENDPOINTS.PRODUCTIONS.FINALIZAR(contratoId), 
        producaoData
      );
      
      return this.mapProducaoToProduction(response);
    } catch (error) {
      console.error('Finish production error:', error);
      throw error;
    }
  }

  // Apontar produção
  async apontarProducao(contratoId: string, apontamentoData: any): Promise<any> {
    try {
      const response = await apiService.post(
        API_ENDPOINTS.PRODUCTIONS.APONTAR(contratoId), 
        apontamentoData
      );
      
      return response;
    } catch (error) {
      console.error('Apontar produção error:', error);
      throw error;
    }
  }

  // Buscar estatísticas de produção via Dashboard
  async getProductionStats(contratoId: string, filters?: {
    lineId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ProductionStats> {
    try {
      // Mapear filtros para o DTO esperado pela API
      const searchDto = {
        de: filters?.startDate,
        ate: filters?.endDate,
        circuitoIds: filters?.lineId ? [filters.lineId] : undefined,
      };

      // A API PCount tem endpoint de Dashboard que pode fornecer estatísticas
      const response = await apiService.post<DashboardResponseDto>(
        API_ENDPOINTS.DASHBOARD(contratoId),
        searchDto
      );
      
      // Mapear resposta do dashboard para ProductionStats
      // Esta implementação pode precisar ser ajustada conforme a estrutura real da resposta
      return {
        operationHours: '08:00',
        productiveHours: '07:30',
        avgProduction: response.mediaProducao || 0,
        totalProduced: response.totalProduzido || 0,
        hourlyProduction: response.producaoHoraria?.map(item => ({
          hour: item.hora,
          value: item.valor
        })) || [],
      };
    } catch (error) {
      console.error('Get production stats error:', error);
      throw error;
    }
  }
}

export const productionService = new ProductionService();