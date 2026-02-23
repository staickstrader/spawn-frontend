'use client';

import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui';
import { useGitHubAuth } from '@/hooks/useGitHubAuth';
import { useEffect } from 'react';

interface ConnectStepProps {
  onNext: () => void;
  githubConnected: boolean;
  onGitHubConnect: () => void;
}

export function ConnectStep({ onNext, githubConnected, onGitHubConnect }: ConnectStepProps) {
  const { isConnected: walletConnected } = useAccount();
  const { 
    isConnected: ghConnected, 
    user: ghUser, 
    error: ghError,
    isLoading: ghLoading,
    connect: connectGitHub,
    disconnect: disconnectGitHub,
  } = useGitHubAuth();
  
  // Sync GitHub connection state to parent
  useEffect(() => {
    if (ghConnected && !githubConnected) {
      onGitHubConnect();
    }
  }, [ghConnected, githubConnected, onGitHubConnect]);
  
  const canProceed = walletConnected && ghConnected;

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Connect Your Accounts
        </h2>
        <p className="text-text-secondary">
          Link your wallet and GitHub to spawn an agent
        </p>
      </div>

      {/* GitHub Error */}
      {ghError && (
        <div className="bg-error/10 rounded-lg p-4 border border-error/30">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-error flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <div className="text-sm">
              <p className="text-error font-medium mb-1">GitHub Connection Failed</p>
              <p className="text-text-secondary">{ghError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Connection */}
      <div className="bg-bg-tertiary rounded-lg p-6 border border-border">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Wallet</h3>
              <p className="text-sm text-text-secondary">
                {walletConnected 
                  ? 'Connected to Base network' 
                  : 'Connect your wallet to deploy agents'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {walletConnected && (
              <span className="flex items-center gap-1.5 text-accent text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Connected
              </span>
            )}
            <ConnectButton.Custom>
              {({ openConnectModal, openAccountModal, account }) => (
                <Button
                  variant={walletConnected ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={walletConnected ? openAccountModal : openConnectModal}
                >
                  {walletConnected ? account?.displayName : 'Connect Wallet'}
                </Button>
              )}
            </ConnectButton.Custom>
          </div>
        </div>
      </div>

      {/* GitHub Connection */}
      <div className="bg-bg-tertiary rounded-lg p-6 border border-border">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-bg-secondary flex items-center justify-center">
              <svg className="w-6 h-6 text-text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" 
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">GitHub</h3>
              <p className="text-sm text-text-secondary">
                {ghConnected && ghUser
                  ? `Connected as @${ghUser.login}` 
                  : 'Authorize SPAWN to create agent repositories'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {ghConnected && (
              <span className="flex items-center gap-1.5 text-accent text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Connected
              </span>
            )}
            {ghConnected ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={disconnectGitHub}
              >
                {ghUser?.login ? `@${ghUser.login}` : 'Disconnect'}
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={connectGitHub}
                loading={ghLoading}
              >
                Connect GitHub
              </Button>
            )}
          </div>
        </div>
        
        {/* Show avatar when connected */}
        {ghConnected && ghUser?.avatar_url && (
          <div className="mt-4 pt-4 border-t border-border flex items-center gap-3">
            <img 
              src={ghUser.avatar_url} 
              alt={ghUser.login}
              className="w-8 h-8 rounded-full"
            />
            <div className="text-sm">
              <span className="text-text-primary font-medium">{ghUser.name || ghUser.login}</span>
              <span className="text-text-muted ml-2">@{ghUser.login}</span>
            </div>
          </div>
        )}
      </div>

      {/* Info box */}
      <div className="bg-accent/5 rounded-lg p-4 border border-accent/20">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <div className="text-sm">
            <p className="text-text-primary font-medium mb-1">Why do we need these?</p>
            <p className="text-text-secondary">
              Your wallet signs transactions and owns the agent. GitHub hosts the agent's code 
              and runs it via GitHub Actions. You control both.
            </p>
          </div>
        </div>
      </div>

      {/* Next button */}
      <div className="flex justify-end pt-4">
        <Button
          size="lg"
          onClick={onNext}
          disabled={!canProceed}
          className="min-w-[140px]"
        >
          Continue
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
