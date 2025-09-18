import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { AuthContextType, User, Contract } from '../types';
import { authService } from '../services/authService';
import { contractService } from '../services/contractService';
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
  const [loading, setLoading] = useState(false);
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
      
      // Tratar erros específicos da API V2
      let errorMessage = 'Erro de conexão. Tente novamente.';
      if (err?.message?.includes('401') || err?.response?.status === 401) {
        errorMessage = 'Credenciais inválidas';
      } else if (mockFallbackEnabled) {
        errorMessage = 'Credenciais inválidas';
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const selectContract = (contract: Contract) => {
    setSelectedContract(contract);
    setError(null);
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
    } catch (err) {
      console.warn('Erro no logout da API:', err);
    } finally {
      setCurrentUser(null);
      setSelectedContract(null);
      setIsAuthenticated(false);
      setContracts([]);
      setLoading(false);
      setError(null);
    }
  };

  const clearError = () => {
    setError(null);
  };

  // V2 API: Contratos são carregados após login, não na inicialização
  // useEffect(() => {
  //   if (contracts.length === 0) {
  //     loadContracts();
  //   }
  // }, []);

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