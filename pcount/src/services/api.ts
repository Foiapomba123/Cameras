import { API_CONFIG } from '../config/api';
import { tokenStorage } from './tokenStorage';

// API Base Service
export class ApiService {
  private baseURL: string;
  
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Recupera token para autenticação
    const token = await tokenStorage.getToken();
    
    // Controller para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
    
    const config: RequestInit = {
      ...options,
      signal: controller.signal,
      headers: {
        ...API_CONFIG.DEFAULT_HEADERS,
        ...(token && { 'Authorization': `Bearer ${token}` }),
        'equipamentoId': 'replit-web-client', // Header obrigatório para a API
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

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify({ refreshToken }),
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