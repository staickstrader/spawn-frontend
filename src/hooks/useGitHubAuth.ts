'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  getStoredGitHubUser, 
  storeGitHubUser, 
  clearGitHubAuth, 
  isGitHubConnected,
  type GitHubUser 
} from '@/lib/github';

export interface UseGitHubAuthReturn {
  isConnected: boolean;
  user: GitHubUser | null;
  error: string | null;
  isLoading: boolean;
  connect: () => void;
  disconnect: () => void;
}

/**
 * Hook for managing GitHub OAuth state
 * 
 * Handles:
 * - Reading stored auth state from localStorage
 * - Processing OAuth callback params
 * - Initiating OAuth flow
 * - Disconnecting/clearing auth
 */
export function useGitHubAuth(): UseGitHubAuthReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize from stored state
  useEffect(() => {
    const connected = isGitHubConnected();
    const storedUser = getStoredGitHubUser();
    
    setIsConnected(connected);
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  // Handle OAuth callback params
  useEffect(() => {
    const githubConnected = searchParams.get('github_connected');
    const githubUser = searchParams.get('github_user');
    const githubError = searchParams.get('github_error');

    if (githubError) {
      setError(decodeURIComponent(githubError));
      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete('github_error');
      router.replace(url.pathname + url.search);
      return;
    }

    if (githubConnected === 'true' && githubUser) {
      try {
        const userData = JSON.parse(decodeURIComponent(githubUser)) as GitHubUser;
        storeGitHubUser(userData);
        setUser(userData);
        setIsConnected(true);
        setError(null);
        
        // Clean up URL params
        const url = new URL(window.location.href);
        url.searchParams.delete('github_connected');
        url.searchParams.delete('github_user');
        router.replace(url.pathname + url.search);
      } catch (e) {
        console.error('Failed to parse GitHub user data:', e);
        setError('Failed to process GitHub login');
      }
    }
  }, [searchParams, router]);

  // Initiate OAuth flow
  const connect = useCallback(() => {
    setIsLoading(true);
    setError(null);
    // Redirect to our OAuth initiation endpoint
    window.location.href = '/api/auth/github';
  }, []);

  // Disconnect and clear auth
  const disconnect = useCallback(() => {
    clearGitHubAuth();
    setIsConnected(false);
    setUser(null);
    setError(null);
    
    // Also clear the server-side token cookie
    fetch('/api/auth/github/logout', { method: 'POST' }).catch(() => {
      // Ignore errors, local state is already cleared
    });
  }, []);

  return {
    isConnected,
    user,
    error,
    isLoading,
    connect,
    disconnect,
  };
}
