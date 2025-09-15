import { ProductionLine } from '../types';
import { apiService } from './api';

export class ProductionLineService {
  // Buscar todas as linhas de produção
  async getProductionLines(): Promise<ProductionLine[]> {
    try {
      const response = await apiService.get<{ lines: ProductionLine[] }>('/production-lines');
      return response.lines;
    } catch (error) {
      console.error('Get production lines error:', error);
      throw error;
    }
  }

  // Buscar linhas de produção por contrato
  async getProductionLinesByContract(contractId: string): Promise<ProductionLine[]> {
    try {
      const response = await apiService.get<{ lines: ProductionLine[] }>(`/production-lines?contractId=${contractId}`);
      return response.lines;
    } catch (error) {
      console.error('Get production lines by contract error:', error);
      throw error;
    }
  }

  // Buscar linha de produção por ID
  async getProductionLineById(id: string): Promise<ProductionLine> {
    try {
      const response = await apiService.get<{ line: ProductionLine }>(`/production-lines/${id}`);
      return response.line;
    } catch (error) {
      console.error('Get production line by ID error:', error);
      throw error;
    }
  }

  // Atualizar status da linha de produção
  async updateLineStatus(id: string, status: ProductionLine['status']): Promise<ProductionLine> {
    try {
      const response = await apiService.put<{ line: ProductionLine }>(`/production-lines/${id}/status`, {
        status
      });
      return response.line;
    } catch (error) {
      console.error('Update line status error:', error);
      throw error;
    }
  }

  // Criar nova linha de produção (admin)
  async createProductionLine(line: Omit<ProductionLine, 'id'>): Promise<ProductionLine> {
    try {
      const response = await apiService.post<{ line: ProductionLine }>('/production-lines', line);
      return response.line;
    } catch (error) {
      console.error('Create production line error:', error);
      throw error;
    }
  }
}

export const productionLineService = new ProductionLineService();