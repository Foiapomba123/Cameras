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

// Endpoints da API PCount conforme documentação Swagger
export const API_ENDPOINTS = {
  // API V2 - Apenas autenticação disponível
  V2: {
    // Autenticação
    AUTH: {
      LOGIN: '/Account/Login',
      REFRESH: '/Account/Refresh',
      REGISTER_DEVICE: '/Account/RegisterDevice',
    },
  },
  
  // API V1 - Todos os outros endpoints estão em V1 conforme documentação
  V1: {
    // Contratos
    CONTRACTS: '/Contrato/Get',
    
    // Circuitos (Linhas de produção) - Confirmado V1 na documentação
    CIRCUITOS: (contratoId: string) => `/Circuito/${contratoId}/Get`,
    
    // Dashboard - V1 com POST method
    DASHBOARD: (contratoId: string) => `/Dashboard/${contratoId}/Get`,
    
    // Produções - V1 conforme documentação
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
    
    // Produtos - V1 conforme documentação
    PRODUTOS: (contratoId: string) => `/Produto/${contratoId}/Get`,
    FORMACAO_PALETE: (contratoId: string) => `/Produto/${contratoId}/GetFormacaoPalete`,
    
    // Fila de Produção - V1 conforme documentação
    FILA_PRODUCAO: {
      INICIAR: (contratoId: string) => `/FilaProducao/${contratoId}/Iniciar`,
      ADICIONAR: (contratoId: string) => `/FilaProducao/${contratoId}/Adicionar`,
      ATUALIZAR: (contratoId: string) => `/FilaProducao/${contratoId}/Atualizar`,
    },
  },
};

// Mantém compatibilidade com código existente - Endpoints corretos por versão
export const API_ENDPOINTS_COMPAT = {
  // Autenticação (V2)
  AUTH: API_ENDPOINTS.V2.AUTH,
  
  // Todos os outros endpoints estão em V1 conforme documentação
  CONTRACTS: API_ENDPOINTS.V1.CONTRACTS,
  CIRCUITOS: API_ENDPOINTS.V1.CIRCUITOS,
  DASHBOARD: API_ENDPOINTS.V1.DASHBOARD,
  PRODUCTIONS: API_ENDPOINTS.V1.PRODUCTIONS,
  PRODUTOS: API_ENDPOINTS.V1.PRODUTOS,
  FORMACAO_PALETE: API_ENDPOINTS.V1.FORMACAO_PALETE,
  FILA_PRODUCAO: API_ENDPOINTS.V1.FILA_PRODUCAO,
};