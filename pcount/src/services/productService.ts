import { apiService } from './api';
import { API_ENDPOINTS_COMPAT as API_ENDPOINTS } from '../config/api';

export interface ProdutoDto {
  id: string;
  codigo: string;
  nome: string;
  descricao?: string;
}

export interface FormacaoPaleteDto {
  id: string;
  produto: {
    codigo: string;
    nome: string;
  };
  quantidadePorPalete: number;
}

export class ProductService {
  // Buscar todos os produtos
  async getProducts(contratoId: string): Promise<ProdutoDto[]> {
    try {
      const response = await apiService.get<ProdutoDto[]>(
        API_ENDPOINTS.PRODUTOS(contratoId)
      );
      
      return response;
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  }

  // Buscar formação de paletes
  async getFormacaoPalete(contratoId: string): Promise<FormacaoPaleteDto[]> {
    try {
      const response = await apiService.get<FormacaoPaleteDto[]>(
        API_ENDPOINTS.FORMACAO_PALETE(contratoId)
      );
      
      return response;
    } catch (error) {
      console.error('Get formação palete error:', error);
      throw error;
    }
  }

  // Buscar produto por código
  async getProductByCode(contratoId: string, codigo: string): Promise<ProdutoDto | null> {
    try {
      const products = await this.getProducts(contratoId);
      return products.find(p => p.codigo === codigo) || null;
    } catch (error) {
      console.error('Get product by code error:', error);
      throw error;
    }
  }
}

export const productService = new ProductService();