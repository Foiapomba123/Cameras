import { useState, useEffect } from 'react';
import { Production, ProductionLine, ProductionStats } from '../types';
import { productions as mockProductions, productionStats as mockStats } from '../data/productions';
import { productionLines as mockLines } from '../data/productionLines';

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
      const { productionLineService } = await import('../services/productionLineService');
      return contractId 
        ? productionLineService.getProductionLinesByContract(contractId)
        : productionLineService.getProductionLines();
    },
    mockLines,
    [contractId]
  );
}

// Hook específico para produções com fallback
export function useProductionsWithFallback(filters?: {
  lineId?: string;
  status?: Production['status'];
  startDate?: string;
  endDate?: string;
}) {
  return useMockFallback(
    async () => {
      const { productionService } = await import('../services/productionService');
      return productionService.getProductions(filters);
    },
    mockProductions,
    [filters?.lineId, filters?.status, filters?.startDate, filters?.endDate]
  );
}

// Hook específico para estatísticas com fallback
export function useProductionStatsWithFallback(filters?: {
  lineId?: string;
  startDate?: string;
  endDate?: string;
}) {
  return useMockFallback(
    async () => {
      const { productionService } = await import('../services/productionService');
      return productionService.getProductionStats(filters);
    },
    mockStats,
    [filters?.lineId, filters?.startDate, filters?.endDate]
  );
}