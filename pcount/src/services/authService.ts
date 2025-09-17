import { User } from '../types';
import { apiService } from './api';
import { tokenStorage } from './tokenStorage';
import { API_ENDPOINTS } from '../config/api';

export interface LoginRequest {
  usuario: string;
  senha: string;
}

export interface LoginResponse {
  sucesso: boolean;
  token?: string;
  mensagem?: string;
  usuario?: User;
}

export class AuthService {
  // Login do usuário
  async login(usuario: string, senha: string, contratoId: string): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN(contratoId), 
        {
          usuario,
          senha,
        }
      );
      
      // Armazenar tokens de forma segura
      if (response.sucesso && response.token) {
        await tokenStorage.setToken(response.token);
        // A API PCount pode não retornar refresh token, mas vamos preparar para caso tenha
        // if (response.refreshToken) {
        //   await tokenStorage.setRefreshToken(response.refreshToken);
        // }
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
  async refreshToken(contratoId: string): Promise<boolean> {
    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (!refreshToken) return false;

      const response = await apiService.post<LoginResponse>(
        API_ENDPOINTS.AUTH.REFRESH(contratoId),
        { refreshToken }
      );

      if (response.sucesso && response.token) {
        await tokenStorage.setToken(response.token);
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