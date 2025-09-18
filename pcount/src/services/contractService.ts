import { Contract } from '../types';
import { apiService } from './api';
import { API_ENDPOINTS_COMPAT as API_ENDPOINTS } from '../config/api';

export interface ContratoDto {
  id: string;
  nome: string;
  empresa: string;
}

export class ContractService {
  // Buscar todos os contratos
  async getContracts(): Promise<Contract[]> {
    try {
      const response = await apiService.get<ContratoDto[]>(API_ENDPOINTS.CONTRACTS);
      
      // Mapear a resposta da API para o formato esperado pelo app
      return response.map(contrato => ({
        id: contrato.id,
        name: contrato.nome,
        company: contrato.empresa,
      }));
    } catch (error) {
      console.error('Get contracts error:', error);
      throw error;
    }
  }

  // Buscar contrato por ID (não disponível na API atual, usar o array de contratos)
  async getContractById(id: string): Promise<Contract> {
    try {
      const contracts = await this.getContracts();
      const contract = contracts.find(c => c.id === id);
      
      if (!contract) {
        throw new Error(`Contrato com ID ${id} não encontrado`);
      }
      
      return contract;
    } catch (error) {
      console.error('Get contract by ID error:', error);
      throw error;
    }
  }

  // As operações de CRUD não estão disponíveis na API atual
  // Mantendo os métodos para compatibilidade, mas retornando erro
  async createContract(contract: Omit<Contract, 'id'>): Promise<Contract> {
    throw new Error('Operação de criação de contrato não disponível na API atual');
  }

  async updateContract(id: string, contract: Partial<Contract>): Promise<Contract> {
    throw new Error('Operação de atualização de contrato não disponível na API atual');
  }

  async deleteContract(id: string): Promise<void> {
    throw new Error('Operação de exclusão de contrato não disponível na API atual');
  }
}

export const contractService = new ContractService();