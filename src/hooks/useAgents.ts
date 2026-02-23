'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Agent, AgentFilters, AgentSort } from '@/lib/types';
import { getAgents, ApiError } from '@/lib/api';

interface UseAgentsOptions {
  filters?: AgentFilters;
  sort?: AgentSort;
  enabled?: boolean;
}

interface UseAgentsReturn {
  agents: Agent[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching and managing agent list
 * 
 * @example
 * const { agents, isLoading, error } = useAgents({
 *   filters: { category: 'trading' },
 *   sort: { field: 'most-active' }
 * });
 */
export function useAgents(options: UseAgentsOptions = {}): UseAgentsReturn {
  const { filters, sort, enabled = true } = options;
  
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAgents = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getAgents(filters, sort);
      setAgents(data);
    } catch (err) {
      const error = err instanceof ApiError 
        ? err 
        : new Error('Failed to fetch agents');
      setError(error);
      console.error('useAgents error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, JSON.stringify(filters), JSON.stringify(sort)]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return {
    agents,
    isLoading,
    error,
    refetch: fetchAgents,
  };
}

export default useAgents;
