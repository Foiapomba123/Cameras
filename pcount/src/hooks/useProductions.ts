import { useState, useEffect } from 'react';
import { Production, ProductionLine, ProductionStats } from '../types';
import { productionService } from '../services/productionService';
import { productionLineService } from '../services/productionLineService';
import { useApi } from './useApi';
import { useProductionLinesWithFallback, useProductionsWithFallback, useProductionStatsWithFallback } from './useMockFallback';

// Hook para buscar produções
export function useProductions(contratoId: string, filters?: {
  lineId?: string;
  status?: Production['status'];
  startDate?: string;
  endDate?: string;
}) {
  return useProductionsWithFallback(contratoId, filters);
}

// Hook para buscar linhas de produção
export function useProductionLines(contractId: string) {
  return useProductionLinesWithFallback(contractId);
}

// Hook para buscar estatísticas de produção
export function useProductionStats(contratoId: string, filters?: {
  lineId?: string;
  startDate?: string;
  endDate?: string;
  usuarioId?: string;
}) {
  return useProductionStatsWithFallback(contratoId, filters);
}

// Hook para operações manuais de produção
export function useProductionOperations(contratoId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduction = async (producaoData: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await productionService.createProduction(contratoId, producaoData);
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao criar produção';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduction = async (producaoData: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await productionService.updateProduction(contratoId, producaoData);
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao atualizar produção';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const finishProduction = async (producaoData: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await productionService.finishProduction(contratoId, producaoData);
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao finalizar produção';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // updateLineStatus removido - operação não disponível na API atual

  return {
    createProduction,
    updateProduction,
    finishProduction,
    loading,
    error,
    clearError: () => setError(null),
  };
}