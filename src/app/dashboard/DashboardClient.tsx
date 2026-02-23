'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Card, Button } from '@/components/ui';
import { StatusBadge } from '@/components/ui/Badge';
import type { Agent } from '@/lib/types';

// Mock data - in production, fetch from API filtered by deployer address
const mockUserAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'TraderBot',
    ticker: 'TBOT',
    description: 'Autonomous trading agent focused on Base memecoin alpha.',
    avatar: '🤖',
    status: 'active',
    cycleCount: 142,
    walletBalance: 0.0451,
    tokenPrice: 0.001234,
    priceChange24h: 12.5,
    category: 'trading',
    spawnDate: '2025-02-15',
    deployerAddress: '0x8a2ed7d5AE89Ae6a92A82B5e402045DC4372C355',
  },
  {
    id: 'agent-2',
    name: 'ResearchAI',
    ticker: 'RSRCH',
    description: 'Deep dives into DeFi protocols and token fundamentals.',
    avatar: '🔬',
    status: 'idle',
    cycleCount: 89,
    walletBalance: 0.0123,
    tokenPrice: 0.000456,
    priceChange24h: -3.2,
    category: 'research',
    spawnDate: '2025-02-18',
    deployerAddress: '0x8a2ed7d5AE89Ae6a92A82B5e402045DC4372C355',
  },
  {
    id: 'agent-3',
    name: 'AlphaHunter',
    ticker: 'ALPHA',
    description: 'Scans social signals for early momentum plays.',
    avatar: '🎯',
    status: 'active',
    cycleCount: 234,
    walletBalance: 0.0892,
    tokenPrice: 0.002341,
    priceChange24h: 45.8,
    category: 'trading',
    spawnDate: '2025-02-10',
    deployerAddress: '0x8a2ed7d5AE89Ae6a92A82B5e402045DC4372C355',
  },
];

function DashboardAgentCard({ agent }: { agent: Agent }) {
  const priceChangeClass = agent.priceChange24h >= 0 
    ? 'text-accent' 
    : 'text-error';
  
  const formatPrice = (price: number) => {
    if (price < 0.0001) return price.toExponential(2);
    if (price < 1) return price.toFixed(6);
    return price.toFixed(4);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card padding="lg" className="hover:border-accent/50 transition-colors">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-lg bg-bg-tertiary flex items-center justify-center text-2xl flex-shrink-0">
          {agent.avatar || '🤖'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-primary truncate">{agent.name}</span>
            <StatusBadge status={agent.status} size="sm" />
          </div>
          <span className="text-text-muted font-mono text-sm">${agent.ticker}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-bg-secondary rounded-lg p-3">
          <p className="text-xs text-text-muted mb-1">Token Price</p>
          <p className="font-mono text-text-primary">${formatPrice(agent.tokenPrice)}</p>
          <p className={`text-xs font-mono ${priceChangeClass}`}>
            {agent.priceChange24h >= 0 ? '+' : ''}{agent.priceChange24h.toFixed(1)}%
          </p>
        </div>
        <div className="bg-bg-secondary rounded-lg p-3">
          <p className="text-xs text-text-muted mb-1">Wallet</p>
          <p className="font-mono text-text-primary">⟠ {agent.walletBalance.toFixed(4)}</p>
          <p className="text-xs text-text-muted">ETH</p>
        </div>
        <div className="bg-bg-secondary rounded-lg p-3">
          <p className="text-xs text-text-muted mb-1">Cycles</p>
          <p className="font-mono text-text-primary">{agent.cycleCount}</p>
          <p className="text-xs text-text-muted">total</p>
        </div>
        <div className="bg-bg-secondary rounded-lg p-3">
          <p className="text-xs text-text-muted mb-1">Spawned</p>
          <p className="font-mono text-text-primary">{formatDate(agent.spawnDate || '')}</p>
          <p className="text-xs text-text-muted">{agent.category}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Link href={`/chat/${agent.id}`} className="flex-1">
          <Button variant="primary" className="w-full">
            Chat
          </Button>
        </Link>
        <Link href={`/agents/${agent.id}`}>
          <Button variant="secondary">
            View
          </Button>
        </Link>
      </div>
    </Card>
  );
}

function DashboardContent({ agents }: { agents: Agent[] }) {
  const totalValue = agents.reduce((sum, a) => sum + a.walletBalance, 0);
  const activeCount = agents.filter(a => a.status === 'active').length;
  const totalCycles = agents.reduce((sum, a) => sum + a.cycleCount, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary">Manage your autonomous agents</p>
        </div>
        <Link href="/spawn">
          <Button variant="primary" className="flex items-center gap-2">
            <span>+</span>
            <span>Spawn New Agent</span>
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card padding="lg" className="text-center">
          <p className="text-3xl font-bold text-text-primary mb-1">{agents.length}</p>
          <p className="text-sm text-text-secondary">Total Agents</p>
        </Card>
        <Card padding="lg" className="text-center">
          <p className="text-3xl font-bold text-accent mb-1">{activeCount}</p>
          <p className="text-sm text-text-secondary">Active Now</p>
        </Card>
        <Card padding="lg" className="text-center">
          <p className="text-3xl font-bold text-text-primary mb-1">{totalCycles.toLocaleString()}</p>
          <p className="text-sm text-text-secondary">Total Cycles</p>
        </Card>
        <Card padding="lg" className="text-center">
          <p className="text-3xl font-bold text-text-primary mb-1">⟠ {totalValue.toFixed(4)}</p>
          <p className="text-sm text-text-secondary">Total ETH</p>
        </Card>
      </div>

      {/* Agents Grid */}
      {agents.length === 0 ? (
        <Card padding="lg" className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🤖</span>
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">No Agents Yet</h2>
          <p className="text-text-secondary mb-6">Spawn your first autonomous agent to get started.</p>
          <Link href="/spawn">
            <Button variant="primary">Spawn Your First Agent</Button>
          </Link>
        </Card>
      ) : (
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Your Agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <DashboardAgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardClient() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected, isConnecting } = useAccount();

  useEffect(() => {
    setMounted(true);
  }, []);

  // In production, filter agents by connected wallet (deployer)
  // For now, show mock agents if wallet matches our test address
  const userAgents = isConnected && address?.toLowerCase() === '0x8a2ed7d5ae89ae6a92a82b5e402045dc4372c355'
    ? mockUserAgents
    : [];

  // SSR loading state
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Connecting state
  if (isConnecting) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-text-secondary">Connecting wallet...</p>
        </div>
      </div>
    );
  }

  // Not connected - prompt to connect
  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🔐</span>
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Connect Your Wallet
          </h2>
          <p className="text-text-secondary mb-6">
            Connect your wallet to view and manage your autonomous agents.
          </p>
          <div className="flex justify-center mb-6">
            <ConnectButton />
          </div>
          <p className="text-xs text-text-muted">
            Don&apos;t have any agents yet?{' '}
            <Link href="/spawn" className="text-accent hover:underline">
              Spawn one
            </Link>
          </p>
        </Card>
      </div>
    );
  }

  // Connected - show dashboard
  return <DashboardContent agents={userAgents} />;
}
