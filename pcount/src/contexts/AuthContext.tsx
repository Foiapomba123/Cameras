import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { AuthContextType, User, Contract } from '../types';
import { authService } from '../services/authService';
import { contractService } from '../services/contractService';
import { contractManager } from '../services/api';
import { tokenStorage } from '../services/tokenStorage';
import { users } from '../data/users'; // Fallback para desenvolvimento
import { contracts as mockContracts } from '../data/contracts'; // Fallback para desenvolvimento

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true); // Inicialmente true para carregamento da sessão
  const [error, setError] = useState<string | null>(null);

  // Carrega contratos da API
  const loadContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiContracts = await contractService.getContracts();
      setContracts(apiContracts);
    } catch (err) {
      const mockFallbackEnabled = process.env.EXPO_PUBLIC_ENABLE_MOCK_FALLBACK === 'true' && __DEV__;
      
      if (mockFallbackEnabled) {
        console.warn('API não disponível, usando dados mock:', err);
        setContracts(mockContracts);
        setError(null); // Não mostrar erro para usuário em modo desenvolvimento
      } else {
        setError('Erro ao carregar contratos. Verifique sua conexão.');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Tenta autenticar via API V2 (não precisa de contrato selecionado)
      const response = await authService.login(email, password);
      
      if (response.access_token) {
        // V2 API retorna contratos disponíveis após login
        if (response.contratos && response.contratos.length > 0) {
          // Converte contratos da API V2 para formato interno
          const apiContracts = response.contratos.map(c => ({
            id: c.contratoId,
            name: c.contratoNomeFantasia || c.contratoRazaoSocial || 'Contrato',
            company: c.contratoRazaoSocial || 'Empresa'
          }));
          setContracts(apiContracts);
        }
        
        // Criar usuário baseado na resposta da API V2
        const firstContract = response.contratos?.[0];
        const user: User = {
          id: firstContract?.usuarioId || '1',
          name: firstContract?.usuarioNome || email,
          email: firstContract?.usuarioEmail || email,
          password: '',
          role: 'admin'
        };
        
        setCurrentUser(user);
        setIsAuthenticated(true);
        return true;
      } else {
        setError('Credenciais inválidas');
        return false;
      }
    } catch (err: any) {
      // Fallback para desenvolvimento APENAS se habilitado
      const mockFallbackEnabled = process.env.EXPO_PUBLIC_ENABLE_MOCK_FALLBACK === 'true' && __DEV__;
      
      if (mockFallbackEnabled) {
        console.warn('API de login não disponível, usando autenticação mock:', err);
        
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          setCurrentUser(user);
          setIsAuthenticated(true);
          // Usar contratos mock em caso de fallback
          setContracts(mockContracts);
          return true;
        }
      }
      
      // Tratar erros específicos da API V2 com detecção robusta de status
      const status = err?.response?.status;
      let errorMessage = 'Erro de conexão com a API PCount. Verifique sua conexão.';
      
      if (status === 401 || err?.message?.includes('401')) {
        errorMessage = 'Credenciais inválidas. Use suas credenciais reais da API PCount (não Admin/Admin).';
      } else if (status === 400) {
        errorMessage = 'Formato de requisição inválido. Verifique os dados enviados.';
      } else if (status === 404) {
        errorMessage = 'Endpoint não encontrado. Verifique a configuração da API.';
      } else if (err?.code === 'ECONNABORTED' || err?.message?.includes('timeout')) {
        errorMessage = 'Tempo esgotado. Verifique sua conexão e tente novamente.';
      } else if (!err?.response && err?.request) {
        errorMessage = 'Erro de rede. Verifique sua conexão com a internet.';
      } else if (mockFallbackEnabled) {
        errorMessage = 'Credenciais inválidas';
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const selectContract = async (contract: Contract) => {
    try {
      setSelectedContract(contract);
      // Atualizar o contrato ativo no gerenciador de contratos para usar nas requisições API
      contractManager.setActiveContractId(contract.id);
      
      // Persistir o contrato selecionado no AsyncStorage
      await tokenStorage.setContractId(contract.id);
      await tokenStorage.setContractData(contract);
      
      setError(null);
    } catch (error) {
      console.error('Erro ao salvar contrato selecionado:', error);
      setError('Erro ao salvar contrato. Tente novamente.');
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      // Limpar todos os dados persistidos (tokens + contrato)
      await tokenStorage.clearAllData();
    } catch (err) {
      console.warn('Erro no logout da API:', err);
      // Mesmo se der erro na API, limpar dados locais
      await tokenStorage.clearAllData();
    } finally {
      setCurrentUser(null);
      setSelectedContract(null);
      // Limpar o contrato ativo no logout
      contractManager.setActiveContractId(null);
      setIsAuthenticated(false);
      setContracts([]);
      setLoading(false);
      setError(null);
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Função para restaurar sessão ao inicializar o app
  const restoreSession = async () => {
    try {
      setLoading(true);
      
      // Verificar se há token válido armazenado
      const hasToken = await tokenStorage.hasToken();
      if (!hasToken) {
        setLoading(false);
        return;
      }

      // Verificar se há contrato selecionado
      const storedContractData = await tokenStorage.getContractData();
      const storedContractId = await tokenStorage.getContractId();
      
      if (hasToken && storedContractData && storedContractId) {
        // Sessão completa: token + contrato selecionado
        setIsAuthenticated(true);
        setSelectedContract(storedContractData);
        contractManager.setActiveContractId(storedContractId);
        
        // Tentar validar o token (opcional)
        try {
          const user = await authService.validateToken();
          if (user) {
            setCurrentUser(user);
          }
        } catch (err) {
          console.warn('Token validation failed, but keeping session:', err);
          // Manter sessão mesmo se validação falhar
          setCurrentUser({
            id: '1',
            name: 'Usuário',
            email: 'user@example.com',
            password: '',
            role: 'admin'
          });
        }
      } else if (hasToken) {
        // Apenas token, sem contrato - usuário precisa selecionar contrato
        setIsAuthenticated(true);
        try {
          const user = await authService.validateToken();
          if (user) {
            setCurrentUser(user);
          }
          // Carregar contratos para seleção
          await loadContracts();
        } catch (err) {
          console.warn('Token inválido, fazendo logout:', err);
          await logout();
        }
      }
    } catch (error) {
      console.error('Erro ao restaurar sessão:', error);
      // Em caso de erro, limpar tudo e forçar novo login
      await tokenStorage.clearAllData();
    } finally {
      setLoading(false);
    }
  };

  // Restaurar sessão ao inicializar o app
  useEffect(() => {
    restoreSession();
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    currentUser,
    selectedContract,
    contracts,
    loading,
    error,
    login,
    selectContract,
    logout,
    loadContracts,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};