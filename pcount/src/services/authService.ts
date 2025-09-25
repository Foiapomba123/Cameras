import { User } from '../types';
import { apiService } from './api';
import { tokenStorage } from './tokenStorage';
import { API_ENDPOINTS_COMPAT as API_ENDPOINTS } from '../config/api';

export interface LoginRequest {
  Email: string;
  Senha: string;
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
          Email: email,
          Senha: senha,
        }
      );
      
      // Armazenar tokens e informações do usuário
      if (response.access_token) {
        await tokenStorage.setToken(response.access_token);
        if (response.refresh_token) {
          await tokenStorage.setRefreshToken(response.refresh_token);
        }
        
        // Armazenar informações do usuário do primeiro contrato
        if (response.contratos && response.contratos.length > 0) {
          const firstContract = response.contratos[0];
          const userInfo = {
            id: firstContract.usuarioId,
            name: firstContract.usuarioNome || email,
            email: firstContract.usuarioEmail || email,
            role: 'admin' // Assumir admin por padrão
          };
          await tokenStorage.setUserInfo(userInfo);
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

  // Verificar se o usuário está autenticado usando dados reais armazenados
  async validateToken(): Promise<User | null> {
    try {
      const token = await tokenStorage.getToken();
      if (!token) return null;
      
      // Recuperar informações reais do usuário armazenadas durante o login
      const userInfo = await tokenStorage.getUserInfo();
      if (userInfo) {
        return {
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          password: '',
          role: userInfo.role || 'admin'
        };
      }
      
      return null;
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  }
}

export const authService = new AuthService();