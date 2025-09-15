import { Production, ProductionStats } from '../types';
import { apiService } from './api';

export interface ProductionFilters {
  lineId?: string;
  status?: Production['status'];
  startDate?: string;
  endDate?: string;
}

export class ProductionService {
  // Buscar todas as produções
  async getProductions(filters?: ProductionFilters): Promise<Production[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.lineId) queryParams.append('lineId', filters.lineId);
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.startDate) queryParams.append('startDate', filters.startDate);
      if (filters?.endDate) queryParams.append('endDate', filters.endDate);
      
      const url = `/productions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get<{ productions: Production[] }>(url);
      return response.productions;
    } catch (error) {
      console.error('Get productions error:', error);
      throw error;
    }
  }

  // Buscar produções por linha
  async getProductionsByLine(lineId: string): Promise<Production[]> {
    return this.getProductions({ lineId });
  }

  // Buscar produção por ID
  async getProductionById(id: string): Promise<Production> {
    try {
      const response = await apiService.get<{ production: Production }>(`/productions/${id}`);
      return response.production;
    } catch (error) {
      console.error('Get production by ID error:', error);
      throw error;
    }
  }

  // Criar nova produção
  async createProduction(production: Omit<Production, 'id'>): Promise<Production> {
    try {
      const response = await apiService.post<{ production: Production }>('/productions', production);
      return response.production;
    } catch (error) {
      console.error('Create production error:', error);
      throw error;
    }
  }

  // Atualizar produção
  async updateProduction(id: string, production: Partial<Production>): Promise<Production> {
    try {
      const response = await apiService.put<{ production: Production }>(`/productions/${id}`, production);
      return response.production;
    } catch (error) {
      console.error('Update production error:', error);
      throw error;
    }
  }

  // Finalizar produção
  async finishProduction(id: string): Promise<Production> {
    try {
      const response = await apiService.put<{ production: Production }>(`/productions/${id}/finish`, {});
      return response.production;
    } catch (error) {
      console.error('Finish production error:', error);
      throw error;
    }
  }

  // Buscar estatísticas de produção
  async getProductionStats(filters?: {
    lineId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ProductionStats> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.lineId) queryParams.append('lineId', filters.lineId);
      if (filters?.startDate) queryParams.append('startDate', filters.startDate);
      if (filters?.endDate) queryParams.append('endDate', filters.endDate);
      
      const url = `/productions/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get<{ stats: ProductionStats }>(url);
      return response.stats;
    } catch (error) {
      console.error('Get production stats error:', error);
      throw error;
    }
  }
}

export const productionService = new ProductionService();