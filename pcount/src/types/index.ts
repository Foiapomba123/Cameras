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

// DTOs para API PCount Dashboard
export interface DashboardSearchDto {
  usuarioId: string;
  de?: string;
  ate?: string;
  circuitoIds?: string[];
}

export interface DashboardResponseDto {
  horaProdutiva?: string | null;
  horaOciosa?: string | null;
  mediaHora?: number;
  totalProduzido?: {
    maximo: number;
    minimo: number;
    total: number;
  };
  totalProduzidoHora?: Array<{
    dataHora: string;
    valor1: number;
    valor2: number;
  }>;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  selectedContract: Contract | null;
  contracts: Contract[];
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  selectContract: (contract: Contract) => void;
  logout: () => void;
  loadContracts: () => Promise<void>;
  clearError: () => void;
}