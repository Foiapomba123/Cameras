import React, { createContext, useState, useContext, ReactNode } from 'react';
import { users } from '../data/users';
import { contracts } from '../data/contracts';
import { AuthContextType, User, Contract } from '../types';

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

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simula validação com usuário padrão Admin/Admin
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const selectContract = (contract: Contract) => {
    setSelectedContract(contract);
  };

  const logout = () => {
    setCurrentUser(null);
    setSelectedContract(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    isAuthenticated,
    currentUser,
    selectedContract,
    login,
    selectContract,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};