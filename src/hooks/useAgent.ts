'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Agent, Skill, WalletInfo } from '@/lib/types';
import { getAgent, getAgentSkills, getWalletInfo, ApiError } from '@/lib/api';

interface UseAgentOptions {
  includeSkills?: boolean;
  includeWallet?: boolean;
  enabled?: boolean;
}

interface UseAgentReturn {
  agent: Agent | null;
  skills: Skill[];
  wallet: WalletInfo | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching a single agent with optional related data
 * 
 * @example
 * const { agent, skills, wallet, isLoading } = useAgent('degen-trader', {
 *   includeSkills: true,
 *   includeWallet: true
 * });
 */
export function useAgent(
  agentId: string | undefined,
  options: UseAgentOptions = {}
): UseAgentReturn {
  const { 
    includeSkills = false, 
    includeWallet = false, 
    enabled = true 
  } = options;
  
  const [agent, setAgent] = useState<Agent | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAgent = useCallback(async () => {
    if (!enabled || !agentId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch agent and optionally related data in parallel
      const promises: Promise<unknown>[] = [getAgent(agentId)];
      
      if (includeSkills) {
        promises.push(getAgentSkills(agentId));
      }
      if (includeWallet) {
        promises.push(getWalletInfo(agentId));
      }

      const results = await Promise.all(promises);
      
      const agentData = results[0] as Agent | null;
      setAgent(agentData);

      if (includeSkills) {
        const skillsData = results[includeWallet ? 1 : 1] as Skill[];
        setSkills(skillsData || []);
      }

      if (includeWallet) {
        const walletData = results[includeSkills ? 2 : 1] as WalletInfo | null;
        setWallet(walletData);
      }

      if (!agentData) {
        setError(new Error('Agent not found'));
      }
    } catch (err) {
      const error = err instanceof ApiError 
        ? err 
        : new Error('Failed to fetch agent');
      setError(error);
      console.error('useAgent error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [agentId, enabled, includeSkills, includeWallet]);

  useEffect(() => {
    fetchAgent();
  }, [fetchAgent]);

  return {
    agent,
    skills,
    wallet,
    isLoading,
    error,
    refetch: fetchAgent,
  };
}

export default useAgent;
