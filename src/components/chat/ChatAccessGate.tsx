'use client';

import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Card } from '../ui';
import { useState, useEffect } from 'react';

interface ChatAccessGateProps {
  deployerAddress: string;
  agentName: string;
  children: React.ReactNode;
}

export function ChatAccessGate({ deployerAddress, agentName, children }: ChatAccessGateProps) {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected, isConnecting } = useAccount();

  // Handle SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  // Normalize addresses for comparison (lowercase)
  const isDeployer = address && deployerAddress 
    ? address.toLowerCase() === deployerAddress.toLowerCase()
    : false;

  // SSR loading state
  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isConnecting) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-text-secondary">Connecting wallet...</p>
        </div>
      </div>
    );
  }

  // Not connected - show connect prompt
  if (!isConnected) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Connect to Chat
          </h2>
          <p className="text-text-secondary mb-6">
            Connect your wallet to chat with <span className="text-accent font-mono">{agentName}</span>. 
            Only the deployer can access this chat.
          </p>
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        </Card>
      </div>
    );
  }

  // Connected but not the deployer - show unauthorized
  if (!isDeployer) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Access Denied
          </h2>
          <p className="text-text-secondary mb-4">
            Only the deployer can chat with this agent.
          </p>
          <div className="bg-bg-secondary rounded-lg p-4 mb-6">
            <p className="text-xs text-text-muted mb-1">Connected wallet</p>
            <p className="font-mono text-sm text-text-secondary break-all">{address}</p>
          </div>
          <div className="bg-bg-secondary rounded-lg p-4">
            <p className="text-xs text-text-muted mb-1">Required wallet (deployer)</p>
            <p className="font-mono text-sm text-text-secondary break-all">{deployerAddress}</p>
          </div>
        </Card>
      </div>
    );
  }

  // Authorized - render chat
  return <>{children}</>;
}
