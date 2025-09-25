// Configurações da API
export const API_CONFIG = {
  // URL base da API PCount V2 (para login e contratos)
  BASE_URL_V2: process.env.EXPO_PUBLIC_API_URL_V2 || 'https://pcountapi.homologa.click/api/v2',
  
  // URL base da API PCount V1 (para produção, circuitos, etc)
  BASE_URL_V1: process.env.EXPO_PUBLIC_API_URL_V1 || 'https://pcountapi.homologa.click/api/v1',
  
  // Mantém compatibilidade com BASE_URL (usa V2 por padrão)
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

// Endpoints da API PCount - TODOS NA V2 conforme documentação Swagger
export const API_ENDPOINTS = {
  // API V2 - TODOS os endpoints (conforme documentação Swagger)
  V2: {
    // Autenticação
    AUTH: {
      LOGIN: '/Account/Login',
      REFRESH: '/Account/Refresh',
      REGISTER_DEVICE: '/Account/RegisterDevice',
    },
    
    // Contratos
    CONTRACTS: '/Contrato/Get',
    
    // Circuitos (Linhas de produção) - MOVIDO PARA V2
    CIRCUITOS: (contratoId: string) => `/Circuito/GetByContrato/${contratoId}`,
    
    // Dashboard - CORRIGIDO PARA V1 conforme documentação Swagger
    DASHBOARD: (contratoId: string) => `/Dashboard/${contratoId}/Get`,
    
    // Produções - MOVIDAS PARA V2
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
    
    // Produtos - MOVIDOS PARA V2
    PRODUTOS: (contratoId: string) => `/Produto/${contratoId}/Get`,
    FORMACAO_PALETE: (contratoId: string) => `/Produto/${contratoId}/GetFormacaoPalete`,
  },
  
  // API V1 - Dashboard ainda usa V1 conforme Swagger
  V1: {
    DASHBOARD: (contratoId: string) => `/Dashboard/${contratoId}/Get`,
  },
};

// Mantém compatibilidade com código existente - TODOS os endpoints agora na V2
export const API_ENDPOINTS_COMPAT = {
  // Autenticação (V2)
  AUTH: API_ENDPOINTS.V2.AUTH,
  
  // Contratos (V2)
  CONTRACTS: API_ENDPOINTS.V2.CONTRACTS,
  
  // Todos os outros endpoints agora também na V2 (exceto Dashboard)
  CIRCUITOS: API_ENDPOINTS.V2.CIRCUITOS,
  DASHBOARD: API_ENDPOINTS.V1.DASHBOARD,
  PRODUCTIONS: API_ENDPOINTS.V2.PRODUCTIONS,
  PRODUTOS: API_ENDPOINTS.V2.PRODUTOS,
  FORMACAO_PALETE: API_ENDPOINTS.V2.FORMACAO_PALETE,
};