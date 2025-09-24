import { API_CONFIG } from '../config/api';
import { tokenStorage } from './tokenStorage';

// Interface para gerenciar o contrato ativo
interface ContractManager {
  getActiveContractId(): string | null;
  setActiveContractId(contractId: string | null): void;
}

// Singleton para gerenciar o contrato ativo
class ContractManagerImpl implements ContractManager {
  private activeContractId: string | null = null;

  getActiveContractId(): string | null {
    return this.activeContractId;
  }

  setActiveContractId(contractId: string | null): void {
    this.activeContractId = contractId;
  }
}

export const contractManager = new ContractManagerImpl();

// API Base Service
export class ApiService {
  private baseURLV1: string;
  private baseURLV2: string;
  
  constructor() {
    this.baseURLV1 = API_CONFIG.BASE_URL_V1;
    this.baseURLV2 = API_CONFIG.BASE_URL_V2;
  }

  /**
   * Determina qual versão da API usar baseada no endpoint
   * V2: Login e Contratos (/Account/*, /Contrato/*)
   * V1: Todos os outros endpoints
   */
  private getBaseURL(endpoint: string): string {
    // Endpoints que devem usar V2
    if (endpoint.startsWith('/Account/') || endpoint.startsWith('/Contrato/')) {
      return this.baseURLV2;
    }
    
    // Todos os outros endpoints usam V1
    return this.baseURLV1;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const baseURL = this.getBaseURL(endpoint);
    const url = `${baseURL}${endpoint}`;
    
    // Recupera token para autenticação
    const token = await tokenStorage.getToken();
    
    // Controller para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
    
    // Obter contractId do contractManager ou do storage como fallback
    let activeContractId = contractManager.getActiveContractId();
    if (!activeContractId) {
      try {
        activeContractId = await tokenStorage.getContractId();
        // Se encontrou no storage, atualizar o contractManager também
        if (activeContractId) {
          contractManager.setActiveContractId(activeContractId);
        }
      } catch (error) {
        console.warn('Erro ao recuperar contractId do storage:', error);
      }
    }

    const config: RequestInit = {
      ...options,
      signal: controller.signal,
      headers: {
        ...API_CONFIG.DEFAULT_HEADERS,
        ...(token && { 'Authorization': `Bearer ${token}` }),
        // Usar o ID do contrato ativo como equipamentoId, ou fallback para replit-web-client
        'equipamentoId': activeContractId || 'replit-web-client',
        ...options.headers,
      },
    };


    try {
      const response = await fetch(url, config);
      
      // Limpa timeout se request completou
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expirado, tentar refresh
          const refreshed = await this.tryRefreshToken();
          if (refreshed) {
            // Retry request com novo token
            return this.request(endpoint, options);
          } else {
            // Redirect to login
            await tokenStorage.clearTokens();
            throw new Error('Sessão expirada');
          }
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Handle 204 No Content
      if (response.status === 204) {
        return null as T;
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      console.error(`API request failed: ${url}`, error);
      throw error;
    }
  }

  private async tryRefreshToken(): Promise<boolean> {
    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (!refreshToken) return false;

      const response = await fetch(`${this.baseURLV2}/Account/Refresh`, {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      if (data.token) {
        await tokenStorage.setToken(data.token);
        if (data.refreshToken) {
          await tokenStorage.setRefreshToken(data.refreshToken);
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  // Métodos HTTP
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiService = new ApiService();