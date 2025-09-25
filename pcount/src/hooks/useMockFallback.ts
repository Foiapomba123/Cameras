import { useState, useEffect } from 'react';
import { Production, ProductionLine, ProductionStats } from '../types';
import { productions as mockProductions, productionStats as mockStats } from '../data/productions';
import { productionLines as mockLines } from '../data/productionLines';
import { productionLineService } from '../services/productionLineService';
import { productionService } from '../services/productionService';

// Hook para fallback de dados mock em desenvolvimento
export function useMockFallback<T>(
  apiCall: () => Promise<T>,
  mockData: T,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiCall();
      setData(result);
    } catch (err) {
      const mockFallbackEnabled = process.env.EXPO_PUBLIC_ENABLE_MOCK_FALLBACK === 'true' && __DEV__;
      
      if (mockFallbackEnabled) {
        console.warn('API falhou, usando dados mock:', err);
        setData(mockData);
        setError(null);
      } else {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

// Hook específico para linhas de produção com fallback
export function useProductionLinesWithFallback(contractId?: string) {
  return useMockFallback(
    async () => {
      return contractId 
        ? productionLineService.getProductionLinesByContract(contractId)
        : productionLineService.getProductionLines(contractId || '');
    },
    mockLines,
    [contractId]
  );
}

// Hook específico para produções com fallback
export function useProductionsWithFallback(contractId: string, filters?: {
  lineId?: string;
  status?: Production['status'];
  startDate?: string;
  endDate?: string;
}) {
  return useMockFallback(
    async () => {
      return productionService.getProductions(contractId, filters);
    },
    mockProductions,
    [contractId, filters?.lineId, filters?.status, filters?.startDate, filters?.endDate]
  );
}

// Hook específico para estatísticas com fallback
export function useProductionStatsWithFallback(contractId: string, filters?: {
  lineId?: string;
  startDate?: string;
  endDate?: string;
  usuarioId?: string;
}) {
  return useMockFallback(
    async () => {
      return productionService.getProductionStats(contractId, filters);
    },
    mockStats,
    [contractId, filters?.lineId, filters?.startDate, filters?.endDate, filters?.usuarioId]
  );
}