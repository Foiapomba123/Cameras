import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const CONTRACT_ID_KEY = 'selected_contract_id';
const CONTRACT_DATA_KEY = 'selected_contract_data';
const USER_INFO_KEY = 'user_info';
const DEVICE_UUID_KEY = 'device_uuid';

export class TokenStorage {
  private isSecureStoreAvailable: boolean | null = null;
  private hasLoggedFallback = false;

  private async checkSecureStoreAvailability(): Promise<boolean> {
    if (this.isSecureStoreAvailable !== null) {
      return this.isSecureStoreAvailable;
    }

    try {
      // Check if SecureStore is available
      this.isSecureStoreAvailable = await SecureStore.isAvailableAsync();
      
      // Log fallback warning once
      if (!this.isSecureStoreAvailable && !this.hasLoggedFallback && Platform.OS === 'web') {
        console.warn('SecureStore não disponível na web, usando localStorage como fallback');
        this.hasLoggedFallback = true;
      }
      
      return this.isSecureStoreAvailable;
    } catch (error) {
      this.isSecureStoreAvailable = false;
      
      if (!this.hasLoggedFallback && Platform.OS === 'web') {
        console.warn('SecureStore não disponível na web, usando localStorage como fallback');
        this.hasLoggedFallback = true;
      }
      
      return false;
    }
  }

  private async getFromStorage(key: string): Promise<string | null> {
    const isSecureAvailable = await this.checkSecureStoreAvailability();
    
    if (isSecureAvailable) {
      return await SecureStore.getItemAsync(key);
    }
    
    // Fallback to localStorage on web
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    
    return null;
  }

  private async setToStorage(key: string, value: string): Promise<void> {
    const isSecureAvailable = await this.checkSecureStoreAvailability();
    
    if (isSecureAvailable) {
      await SecureStore.setItemAsync(key, value);
      return;
    }
    
    // Fallback to localStorage on web
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  }

  private async removeFromStorage(key: string): Promise<void> {
    const isSecureAvailable = await this.checkSecureStoreAvailability();
    
    if (isSecureAvailable) {
      await SecureStore.deleteItemAsync(key);
      return;
    }
    
    // Fallback to localStorage on web
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  }

  // Armazenar token de forma segura
  async setToken(token: string): Promise<void> {
    try {
      await this.setToStorage(TOKEN_KEY, token);
    } catch (error) {
      console.error('Erro ao armazenar token:', error);
    }
  }

  // Recuperar token armazenado
  async getToken(): Promise<string | null> {
    try {
      return await this.getFromStorage(TOKEN_KEY);
    } catch (error) {
      return null;
    }
  }

  // Armazenar refresh token
  async setRefreshToken(refreshToken: string): Promise<void> {
    try {
      await this.setToStorage(REFRESH_TOKEN_KEY, refreshToken);
    } catch (error) {
      console.error('Erro ao armazenar refresh token:', error);
    }
  }

  // Recuperar refresh token
  async getRefreshToken(): Promise<string | null> {
    try {
      return await this.getFromStorage(REFRESH_TOKEN_KEY);
    } catch (error) {
      return null;
    }
  }

  // Remover todos os tokens
  async clearTokens(): Promise<void> {
    try {
      await this.removeFromStorage(TOKEN_KEY);
      await this.removeFromStorage(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Erro ao limpar tokens:', error);
    }
  }

  // Verificar se há token armazenado
  async hasToken(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null;
  }

  // Armazenar ID do contrato selecionado
  async setContractId(contractId: string): Promise<void> {
    try {
      await this.setToStorage(CONTRACT_ID_KEY, contractId);
    } catch (error) {
      console.error('Erro ao armazenar contract ID:', error);
    }
  }

  // Recuperar ID do contrato armazenado
  async getContractId(): Promise<string | null> {
    try {
      return await this.getFromStorage(CONTRACT_ID_KEY);
    } catch (error) {
      return null;
    }
  }

  // Armazenar dados completos do contrato selecionado
  async setContractData(contractData: any): Promise<void> {
    try {
      await this.setToStorage(CONTRACT_DATA_KEY, JSON.stringify(contractData));
    } catch (error) {
      console.error('Erro ao armazenar dados do contrato:', error);
    }
  }

  // Recuperar dados completos do contrato
  async getContractData(): Promise<any | null> {
    try {
      const data = await this.getFromStorage(CONTRACT_DATA_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      return null;
    }
  }

  // Remover dados do contrato
  async clearContractData(): Promise<void> {
    try {
      await this.removeFromStorage(CONTRACT_ID_KEY);
      await this.removeFromStorage(CONTRACT_DATA_KEY);
    } catch (error) {
      console.error('Erro ao limpar dados do contrato:', error);
    }
  }

  // Armazenar informações do usuário
  async setUserInfo(userInfo: any): Promise<void> {
    try {
      await this.setToStorage(USER_INFO_KEY, JSON.stringify(userInfo));
    } catch (error) {
      console.error('Erro ao armazenar informações do usuário:', error);
    }
  }

  // Recuperar informações do usuário
  async getUserInfo(): Promise<any | null> {
    try {
      const data = await this.getFromStorage(USER_INFO_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      return null;
    }
  }

  // Gerar e recuperar UUID único do dispositivo
  async getDeviceUUID(): Promise<string> {
    try {
      let uuid = await this.getFromStorage(DEVICE_UUID_KEY);
      if (!uuid) {
        // Gerar UUID simples para dispositivo
        uuid = 'device-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36);
        await this.setToStorage(DEVICE_UUID_KEY, uuid);
      }
      return uuid;
    } catch (error) {
      // Fallback UUID se houver erro
      return 'device-fallback-' + Date.now();
    }
  }

  // Limpar informações do usuário
  async clearUserInfo(): Promise<void> {
    try {
      await this.removeFromStorage(USER_INFO_KEY);
    } catch (error) {
      console.error('Erro ao limpar informações do usuário:', error);
    }
  }

  // Limpar todos os dados (tokens + contrato + usuário)
  async clearAllData(): Promise<void> {
    try {
      await this.clearTokens();
      await this.clearContractData();
      await this.clearUserInfo();
      // Não limpar device UUID - deve persistir
    } catch (error) {
      console.error('Erro ao limpar todos os dados:', error);
    }
  }
}

export const tokenStorage = new TokenStorage();