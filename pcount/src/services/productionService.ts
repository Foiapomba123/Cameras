import { Production, ProductionStats, DashboardResponseDto } from '../types';
import { apiService } from './api';
import { API_ENDPOINTS_COMPAT as API_ENDPOINTS, API_CONFIG, API_ENDPOINTS as API_ENDPOINTS_V1 } from '../config/api';
import { tokenStorage } from '../services/tokenStorage';

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
    usuarioId?: string;
  }): Promise<ProductionStats> {
    try {
      console.log('Chamando API Dashboard com contratoId:', contratoId);
      
      // Verificar se usuarioId foi fornecido
      if (!filters?.usuarioId) {
        throw new Error('usuarioId é obrigatório para a API Dashboard');
      }
      
      // Debug: verificar se token está disponível
      const token = await tokenStorage.getToken();
      console.log('Token disponível:', token ? 'SIM' : 'NÃO');
      
      // Usar sempre o usuarioId real da sessão autenticada
      const realUsuarioId = filters.usuarioId;
      
      // Verificar se usuarioId é um GUID válido - não usar fallback
      if (!realUsuarioId || realUsuarioId === '1' || !realUsuarioId.includes('-')) {
        throw new Error('usuarioId inválido. Por favor, faça login novamente para obter credenciais válidas.');
      }
      
      const validUsuarioId = realUsuarioId;
      
      // Preparar CircuitoIds - API requer array não-vazio
      let circuitoIds: string[] = [];
      
      if (filters?.lineId) {
        // Se linha específica foi selecionada
        circuitoIds = [filters.lineId];
      } else {
        // Se nenhuma linha específica, precisamos buscar todas as linhas do contrato
        try {
          const circuits = await apiService.get<any[]>(
            API_ENDPOINTS.CIRCUITOS(contratoId)
          );
          circuitoIds = circuits.map(c => c.id || c.circuitoId || c.Id || c.CircuitoId).filter(Boolean);
          console.log('Circuitos carregados para Dashboard:', circuitoIds);
        } catch (circuitError) {
          console.warn('Não foi possível carregar circuitos, usando array vazio:', circuitError);
          // Se não conseguir carregar circuitos, pular a chamada do Dashboard
          throw new Error('Não foi possível carregar as linhas de produção para o Dashboard.');
        }
      }
      
      // Mapear filtros para o DTO esperado pela API - DashboardSearchDto com campos lowercase
      const requestBody = {
        usuarioId: validUsuarioId,
        de: filters?.startDate ? `${filters.startDate}T00:00:00` : undefined,
        ate: filters?.endDate ? `${filters.endDate}T23:59:59` : undefined,
        circuitoIds: circuitoIds, // Array não-vazio conforme requerido pela API
      };

      // A API PCount Dashboard usa V1 conforme documentação Swagger
      const endpoint = API_ENDPOINTS_V1.V1.DASHBOARD(contratoId);
      console.log('Endpoint da API Dashboard V1:', endpoint);
      console.log('Dashboard Request Body:', requestBody);
      
      // O apiService já adiciona o header EquipamentoId automaticamente
      
      const response = await apiService.post<DashboardResponseDto>(
        endpoint,
        requestBody
      );
      
      
      // Mapear resposta do dashboard para ProductionStats usando dados reais da API
      const horaProdutiva = response.horaProdutiva ? parseFloat(response.horaProdutiva) : 0;
      const horaOciosa = response.horaOciosa ? parseFloat(response.horaOciosa) : 0;
      const totalHorasOperacao = horaProdutiva + horaOciosa;
      
      return {
        operationHours: totalHorasOperacao.toFixed(1),
        productiveHours: response.horaProdutiva || '--', 
        avgProduction: response.mediaHora || 0,
        totalProduced: response.totalProduzido?.total || 0,
        hourlyProduction: response.totalProduzidoHora?.map((item: any) => ({
          hour: `${item.dataHora}:00`,
          value: item.valor1 || 0
        })) || [],
      };
    } catch (error: any) {
      console.error('Get production stats error:', error);
      console.error('Erro detalhado da API Dashboard:', {
        message: error?.message,
        status: error?.status,
        response: error?.response,
        url: API_ENDPOINTS.DASHBOARD(contratoId)
      });
      
      // Não usar fallback - sempre rejeitar erro da API para forçar correção
      console.error('Dashboard API falhou - verificar configuração de endpoints e autenticação:', error?.message);
      
      throw error;
    }
  }
}

export const productionService = new ProductionService();