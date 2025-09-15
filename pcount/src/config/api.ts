// Configurações da API
export const API_CONFIG = {
  // URL base da API - pode ser configurada via variável de ambiente
  // Em dispositivos, use o IP da máquina ao invés de localhost
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || (__DEV__ ? 'http://192.168.1.100:3000/api' : 'https://sua-api.com/api'),
  
  // Timeout para requests (em ms)
  TIMEOUT: 10000,
  
  // Configurações de retry
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  
  // Headers padrão
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Endpoints da API
export const API_ENDPOINTS = {
  // Autenticação
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },
  
  // Contratos
  CONTRACTS: '/contracts',
  
  // Linhas de produção
  PRODUCTION_LINES: '/production-lines',
  
  // Produções
  PRODUCTIONS: '/productions',
  PRODUCTION_STATS: '/productions/stats',
};