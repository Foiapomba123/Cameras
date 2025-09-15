export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'operator';
}

export interface Contract {
  id: string;
  name: string;
  company: string;
}

export interface ProductionLine {
  id: string;
  name: string;
  status: 'produzindo' | 'aguardando' | 'iniciando';
  code: string;
}

export interface Production {
  id: string;
  lineId: string;
  productCode: string;
  productName: string;
  technician: string;
  startDate: string;
  endDate?: string;
  status: 'EM PRODUCAO' | 'FINALIZADA';
}

export interface ProductionStats {
  operationHours: string;
  productiveHours: string;
  avgProduction: number;
  totalProduced: number;
  hourlyProduction: Array<{ hour: string; value: number }>;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  selectedContract: Contract | null;
  login: (email: string, password: string) => Promise<boolean>;
  selectContract: (contract: Contract) => void;
  logout: () => void;
}