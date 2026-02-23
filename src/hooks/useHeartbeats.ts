'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Heartbeat } from '@/lib/types';
import { getHeartbeats, ApiError } from '@/lib/api';

interface UseHeartbeatsOptions {
  limit?: number;
  refreshInterval?: number; // ms, 0 to disable
  enabled?: boolean;
}

interface UseHeartbeatsReturn {
  heartbeats: Heartbeat[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching agent heartbeats with auto-refresh and pagination
 * 
 * @example
 * const { heartbeats, isLoading, loadMore, hasMore } = useHeartbeats('degen-trader', {
 *   limit: 10,
 *   refreshInterval: 30000 // refresh every 30s
 * });
 */
export function useHeartbeats(
  agentId: string | undefined,
  options: UseHeartbeatsOptions = {}
): UseHeartbeatsReturn {
  const { 
    limit = 10, 
    refreshInterval = 0, 
    enabled = true 
  } = options;
  
  const [heartbeats, setHeartbeats] = useState<Heartbeat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchHeartbeats = useCallback(async (isRefresh = false) => {
    if (!enabled || !agentId) {
      setIsLoading(false);
      return;
    }

    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await getHeartbeats(agentId, { limit, offset: 0 });
      setHeartbeats(data);
      setOffset(data.length);
      setHasMore(data.length === limit);
    } catch (err) {
      const error = err instanceof ApiError 
        ? err 
        : new Error('Failed to fetch heartbeats');
      setError(error);
      console.error('useHeartbeats error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [agentId, enabled, limit]);

  const loadMore = useCallback(async () => {
    if (!enabled || !agentId || !hasMore || isLoading) {
      return;
    }

    try {
      const data = await getHeartbeats(agentId, { limit, offset });
      setHeartbeats(prev => [...prev, ...data]);
      setOffset(prev => prev + data.length);
      setHasMore(data.length === limit);
    } catch (err) {
      console.error('useHeartbeats loadMore error:', err);
    }
  }, [agentId, enabled, limit, offset, hasMore, isLoading]);

  // Initial fetch
  useEffect(() => {
    fetchHeartbeats();
  }, [fetchHeartbeats]);

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval > 0 && enabled && agentId) {
      refreshTimerRef.current = setInterval(() => {
        fetchHeartbeats(true);
      }, refreshInterval);
    }

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [refreshInterval, enabled, agentId, fetchHeartbeats]);

  return {
    heartbeats,
    isLoading,
    isRefreshing,
    error,
    hasMore,
    loadMore,
    refetch: () => fetchHeartbeats(false),
  };
}

export default useHeartbeats;
