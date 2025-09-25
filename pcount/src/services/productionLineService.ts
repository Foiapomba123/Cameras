import { ProductionLine } from '../types';
import { apiService } from './api';
import { API_ENDPOINTS_COMPAT as API_ENDPOINTS } from '../config/api';

export interface CircuitoLinhaDto {
  id: string;
  descricao: string;
  tag: string;
  machineKey: string;
  statusProducaoCodigo: number;
  statusProducaoDescricao: string;
  isManualStartOP: boolean;
  isFilaStartOP: boolean;
}

export class ProductionLineService {
  // Buscar todas as linhas de produção por contrato
  async getProductionLines(contratoId: string): Promise<ProductionLine[]> {
    try {
      const response = await apiService.get<CircuitoLinhaDto[]>(
        API_ENDPOINTS.CIRCUITOS(contratoId)
      );
      
      if (!response || !Array.isArray(response)) {
        return [];
      }
      
      // Mapear a resposta da API para o formato esperado pelo app
      return response.map(circuito => ({
        id: circuito.id,
        name: circuito.tag, // Usar 'tag' como nome da linha (ex: P1-MQA5)
        code: circuito.machineKey, // Usar 'machineKey' como código da máquina
        status: this.mapStatus(circuito.statusProducaoDescricao), // Usar status em texto
        // Dados adicionais das máquinas reais da API
        operator: circuito.descricao.includes('Guaravita') ? 'Operador Guaravita' : 'Operador',
        location: `Setor - ${circuito.tag}`,
        machineType: circuito.tag.includes('MQA') ? 'Injetora MQA' : 
                    circuito.tag.includes('MQM') ? 'Injetora MQM' : 'Injetora',
      }));
    } catch (error) {
      console.error('Get production lines error:', error);
      throw error;
    }
  }

  private mapStatus(apiStatus: string): ProductionLine['status'] {
    // Mapear status da API para os status esperados pelo app
    switch (apiStatus?.toLowerCase()) {
      case 'produzindo':
      case 'producao':
      case 'running':
        return 'produzindo';
      case 'aguardando':
      case 'waiting':
      case 'parado':
        return 'aguardando';
      case 'iniciando':
      case 'starting':
        return 'iniciando';
      default:
        return 'aguardando';
    }
  }

  // Buscar linhas de produção por contrato (método alternativo - mesmo que getProductionLines)
  async getProductionLinesByContract(contractId: string): Promise<ProductionLine[]> {
    return this.getProductionLines(contractId);
  }

  // Buscar linha de produção por ID
  async getProductionLineById(id: string, contratoId: string): Promise<ProductionLine> {
    try {
      const lines = await this.getProductionLines(contratoId);
      const line = lines.find(l => l.id === id);
      
      if (!line) {
        throw new Error(`Linha de produção com ID ${id} não encontrada`);
      }
      
      return line;
    } catch (error) {
      console.error('Get production line by ID error:', error);
      throw error;
    }
  }

  // As operações de atualização e criação não estão disponíveis na API atual
  // Mantendo os métodos para compatibilidade, mas retornando erro
  async updateLineStatus(id: string, status: ProductionLine['status']): Promise<ProductionLine> {
    throw new Error('Operação de atualização de status não disponível na API atual');
  }

  async createProductionLine(line: Omit<ProductionLine, 'id'>): Promise<ProductionLine> {
    throw new Error('Operação de criação de linha de produção não disponível na API atual');
  }
}

export const productionLineService = new ProductionLineService();