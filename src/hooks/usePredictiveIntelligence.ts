import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ProbabilisticScenario {
  name: string;
  probability: number;
  revenue: number;
  margin: number;
  confidence: number;
  drivers: string[];
}

export interface TippingPoint {
  metric: string;
  currentValue: number;
  threshold: number;
  direction: 'above' | 'below';
  risk: 'critical' | 'high' | 'medium';
  impact: string;
  timeframe: string;
}

export interface MonthlyProjection {
  month: string;
  central: number;
  haussier: number;
  baissier: number;
  confidence: { low: number; high: number };
}

export interface SimulationResult {
  baseCase: { revenue: number; margin: number; profit: number };
  simulatedCase: { revenue: number; margin: number; profit: number };
  delta: { revenue: number; margin: number; profit: number };
  secondOrderEffects: string[];
  hiddenRisks: string[];
  recommendation: string;
}

export interface PredictiveData {
  scenarios: ProbabilisticScenario[];
  monthlyProjections: MonthlyProjection[];
  tippingPoints: TippingPoint[];
  historicalAccuracy: {
    overall: number;
    trend: 'improving' | 'stable' | 'declining';
    confidence: 'high' | 'medium' | 'low';
  };
  metrics: {
    totalPipeline: number;
    avgDealValue: number;
    winRate: number;
    activeDeals: number;
    avgCycleTime: number;
    revenueVelocity: number;
  };
}

export function usePredictiveIntelligence() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PredictiveData | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  const fetchForecast = useCallback(async (horizonMonths: number = 12) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Refresh session before calling edge function
      const { data: session } = await supabase.auth.refreshSession();
      const accessToken = session?.session?.access_token;

      if (!accessToken) {
        throw new Error('Session expirée');
      }

      const response = await supabase.functions.invoke('predictive-intelligence', {
        body: { action: 'forecast', horizon: horizonMonths },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Erreur de prévision');
      }

      if (response.data) {
        setData({
          scenarios: response.data.forecast?.scenarios || [],
          monthlyProjections: response.data.forecast?.monthlyProjections || [],
          tippingPoints: response.data.tippingPoints || [],
          historicalAccuracy: response.data.historicalAccuracy || {
            overall: 75,
            trend: 'stable',
            confidence: 'medium',
          },
          metrics: response.data.metrics || {
            totalPipeline: 0,
            avgDealValue: 0,
            winRate: 0,
            activeDeals: 0,
            avgCycleTime: 45,
            revenueVelocity: 0,
          },
        });
      }
    } catch (err) {
      console.error('Predictive intelligence error:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const runSimulation = useCallback(async (params: {
    pricingChange?: number;
    salesTeamChange?: number;
    marketingChange?: number;
    costReduction?: number;
  }, horizonMonths: number = 12) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data: session } = await supabase.auth.refreshSession();
      const accessToken = session?.session?.access_token;

      if (!accessToken) {
        throw new Error('Session expirée');
      }

      const response = await supabase.functions.invoke('predictive-intelligence', {
        body: { action: 'simulate', params, horizon: horizonMonths },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Erreur de simulation');
      }

      if (response.data) {
        setSimulationResult(response.data);
      }

      return response.data;
    } catch (err) {
      console.error('Simulation error:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchTippingPoints = useCallback(async () => {
    if (!user) return;

    try {
      const response = await supabase.functions.invoke('predictive-intelligence', {
        body: { action: 'tipping-points' },
      });

      if (response.data?.tippingPoints) {
        setData(prev => prev ? { ...prev, tippingPoints: response.data.tippingPoints } : null);
      }

      return response.data?.tippingPoints || [];
    } catch (err) {
      console.error('Tipping points error:', err);
      return [];
    }
  }, [user]);

  const getBacktestResults = useCallback(async () => {
    if (!user) return null;

    try {
      const response = await supabase.functions.invoke('predictive-intelligence', {
        body: { action: 'backtest' },
      });

      return response.data;
    } catch (err) {
      console.error('Backtest error:', err);
      return null;
    }
  }, [user]);

  return {
    data,
    loading,
    error,
    simulationResult,
    fetchForecast,
    runSimulation,
    fetchTippingPoints,
    getBacktestResults,
  };
}
