import { User } from '../types';
import { apiService } from './api';
import { tokenStorage } from './tokenStorage';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token?: string;
  refreshToken?: string;
}

export class AuthService {
  // Login do usuário
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>('/auth/login', {
        email,
        password,
      });
      
      // Armazenar tokens de forma segura
      if (response.token) {
        await tokenStorage.setToken(response.token);
        if (response.refreshToken) {
          await tokenStorage.setRefreshToken(response.refreshToken);
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
      await apiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Mesmo se falhar no servidor, limpar dados locais
    } finally {
      await tokenStorage.clearTokens();
    }
  }

  // Verificar se o usuário está autenticado
  async validateToken(): Promise<User | null> {
    try {
      const response = await apiService.get<{ user: User }>('/auth/me');
      return response.user;
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  }
}

export const authService = new AuthService();