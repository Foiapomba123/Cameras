import { useState, useEffect } from 'react';
import { Production, ProductionLine, ProductionStats } from '../types';
import { productionService } from '../services/productionService';
import { productionLineService } from '../services/productionLineService';
import { useApi } from './useApi';

// Hook para buscar produções
export function useProductions(filters?: {
  lineId?: string;
  status?: Production['status'];
  startDate?: string;
  endDate?: string;
}) {
  return useApi(
    () => productionService.getProductions(filters),
    [filters?.lineId, filters?.status, filters?.startDate, filters?.endDate]
  );
}

// Hook para buscar linhas de produção
export function useProductionLines(contractId?: string) {
  return useApi(
    () => contractId 
      ? productionLineService.getProductionLinesByContract(contractId)
      : productionLineService.getProductionLines(),
    [contractId]
  );
}

// Hook para buscar estatísticas de produção
export function useProductionStats(filters?: {
  lineId?: string;
  startDate?: string;
  endDate?: string;
}) {
  return useApi(
    () => productionService.getProductionStats(filters),
    [filters?.lineId, filters?.startDate, filters?.endDate]
  );
}

// Hook para operações manuais de produção
export function useProductionOperations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduction = async (production: Omit<Production, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await productionService.createProduction(production);
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao criar produção';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduction = async (id: string, production: Partial<Production>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await productionService.updateProduction(id, production);
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao atualizar produção';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const finishProduction = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await productionService.finishProduction(id);
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao finalizar produção';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLineStatus = async (lineId: string, status: ProductionLine['status']) => {
    try {
      setLoading(true);
      setError(null);
      const result = await productionLineService.updateLineStatus(lineId, status);
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao atualizar status da linha';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createProduction,
    updateProduction,
    finishProduction,
    updateLineStatus,
    loading,
    error,
    clearError: () => setError(null),
  };
}