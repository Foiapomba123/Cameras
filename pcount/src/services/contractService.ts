import { Contract } from '../types';
import { apiService } from './api';

export class ContractService {
  // Buscar todos os contratos
  async getContracts(): Promise<Contract[]> {
    try {
      const response = await apiService.get<{ contracts: Contract[] }>('/contracts');
      return response.contracts;
    } catch (error) {
      console.error('Get contracts error:', error);
      throw error;
    }
  }

  // Buscar contrato por ID
  async getContractById(id: string): Promise<Contract> {
    try {
      const response = await apiService.get<{ contract: Contract }>(`/contracts/${id}`);
      return response.contract;
    } catch (error) {
      console.error('Get contract by ID error:', error);
      throw error;
    }
  }

  // Criar novo contrato (admin)
  async createContract(contract: Omit<Contract, 'id'>): Promise<Contract> {
    try {
      const response = await apiService.post<{ contract: Contract }>('/contracts', contract);
      return response.contract;
    } catch (error) {
      console.error('Create contract error:', error);
      throw error;
    }
  }

  // Atualizar contrato (admin)
  async updateContract(id: string, contract: Partial<Contract>): Promise<Contract> {
    try {
      const response = await apiService.put<{ contract: Contract }>(`/contracts/${id}`, contract);
      return response.contract;
    } catch (error) {
      console.error('Update contract error:', error);
      throw error;
    }
  }

  // Deletar contrato (admin)
  async deleteContract(id: string): Promise<void> {
    try {
      await apiService.delete(`/contracts/${id}`);
    } catch (error) {
      console.error('Delete contract error:', error);
      throw error;
    }
  }
}

export const contractService = new ContractService();