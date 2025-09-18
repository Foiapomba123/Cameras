// Configurações da API
export const API_CONFIG = {
  // URL base da API PCount
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://pcountapi.homologa.click/api/v2',
  
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

// Endpoints da API PCount
export const API_ENDPOINTS = {
  // Autenticação
  AUTH: {
    LOGIN: '/Account/Login',
    REFRESH: '/Account/Refresh',
    REGISTER_DEVICE: '/Account/RegisterDevice',
  },
  
  // Contratos
  CONTRACTS: '/Contrato/Get',
  
  // Circuitos (Linhas de produção)
  CIRCUITOS: (contratoId: string) => `/Circuito/GetByContrato/${contratoId}`,
  
  // Dashboard
  DASHBOARD: (contratoId: string) => `/Dashboard/${contratoId}/Get`,
  
  // Produções
  PRODUCTIONS: {
    GET: (contratoId: string, id: string) => `/Producao/${contratoId}/Get/${id}`,
    GET_BY_CIRCUITO: (contratoId: string, circuitoId: string) => `/Producao/${contratoId}/GetByCircuito/${circuitoId}`,
    GET_EM_ANDAMENTO: (contratoId: string) => `/Producao/${contratoId}/GetEmAndamento`,
    GET_CAPTURAS: (contratoId: string, id: string) => `/Producao/${contratoId}/GetCapturas/${id}`,
    INICIAR: (contratoId: string) => `/Producao/${contratoId}/Iniciar`,
    ATUALIZAR: (contratoId: string) => `/Producao/${contratoId}/Atualizar`,
    FINALIZAR: (contratoId: string) => `/Producao/${contratoId}/Finalizar`,
    APONTAR: (contratoId: string) => `/Producao/${contratoId}/ApontarProducao`,
  },
  
  // Produtos
  PRODUTOS: (contratoId: string) => `/Produto/${contratoId}/Get`,
  FORMACAO_PALETE: (contratoId: string) => `/Produto/${contratoId}/GetFormacaoPalete`,
  
  // Fila de Produção
  FILA_PRODUCAO: {
    INICIAR: (contratoId: string) => `/FilaProducao/${contratoId}/Iniciar`,
    ADICIONAR: (contratoId: string) => `/FilaProducao/${contratoId}/Adicionar`,
    ATUALIZAR: (contratoId: string) => `/FilaProducao/${contratoId}/Atualizar`,
  },
};