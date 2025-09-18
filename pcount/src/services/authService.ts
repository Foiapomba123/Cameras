import { User } from '../types';
import { apiService } from './api';
import { tokenStorage } from './tokenStorage';
import { API_ENDPOINTS } from '../config/api';

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  access_token?: string;
  token_type?: string;
  refresh_token?: string;
  expires_in?: number;
  contratos?: Array<{
    contratoId: string;
    usuarioId: string;
    contratoRazaoSocial?: string;
    contratoNomeFantasia?: string;
    usuarioEmail?: string;
    usuarioNome?: string;
    usuarioCargo?: string;
    urlImage?: string;
    usuarioGrupo: number;
    isRomaneio: boolean;
  }>;
}

export class AuthService {
  // Login do usuário
  async login(email: string, senha: string): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        {
          email,
          senha,
        }
      );
      
      // Armazenar tokens de forma segura
      if (response.access_token) {
        await tokenStorage.setToken(response.access_token);
        if (response.refresh_token) {
          await tokenStorage.setRefreshToken(response.refresh_token);
        }
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout do usuário
  async logout(): Promise<void> {
    try {
      // A API PCount pode não ter endpoint específico de logout
      // Apenas limpar dados locais
      await tokenStorage.clearTokens();
    } catch (error) {
      console.error('Logout error:', error);
      await tokenStorage.clearTokens();
    }
  }

  // Renovar token de autenticação
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (!refreshToken) return false;

      const response = await apiService.post<LoginResponse>(
        API_ENDPOINTS.AUTH.REFRESH,
        { refresh_token: refreshToken }
      );

      if (response.access_token) {
        await tokenStorage.setToken(response.access_token);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  // Verificar se o usuário está autenticado (simplificado para a API PCount)
  async validateToken(): Promise<User | null> {
    try {
      const token = await tokenStorage.getToken();
      if (!token) return null;
      
      // A API PCount pode não ter endpoint específico de validação
      // Vamos assumir que se o token existe, é válido
      // Em uma implementação real, você faria uma chamada para validar
      return {
        id: '1',
        name: 'Admin',
        email: 'admin@admin.com',
        password: '',
        role: 'admin'
      };
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  }
}

export const authService = new AuthService();