import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

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
}

export const tokenStorage = new TokenStorage();