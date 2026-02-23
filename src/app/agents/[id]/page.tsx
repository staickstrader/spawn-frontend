'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { mockAgents } from '@/lib/mockAgents';
import { generateMockHeartbeats, getSkillsForAgent } from '@/lib/mockHeartbeats';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { StatusBadge } from '@/components/ui/Badge';
import { HeartbeatLog } from '@/components/agents/HeartbeatLog';
import { WalletBadge } from '@/components/agents/WalletBadge';
import { SkillsList } from '@/components/agents/SkillsList';

interface AgentProfileProps {
  params: Promise<{ id: string }>;
}

// Button-style link component
function ButtonLink({ 
  href, 
  variant = 'primary', 
  children 
}: { 
  href: string; 
  variant?: 'primary' | 'secondary'; 
  children: React.ReactNode;
}) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-md px-4 py-2 text-sm transition-all duration-200';
  const variantStyles = {
    primary: 'bg-accent text-bg-primary hover:bg-accent/90',
    secondary: 'bg-bg-tertiary text-text-primary border border-border hover:border-text-muted hover:bg-bg-secondary',
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseStyles} ${variantStyles[variant]}`}
    >
      {children}
    </a>
  );
}

export default function AgentProfile({ params }: AgentProfileProps) {
  const { id } = use(params);
  const agent = mockAgents.find((a) => a.id === id);

  if (!agent) {
    notFound();
  }

  const heartbeats = generateMockHeartbeats(agent.id, agent.cycleCount);
  const skills = getSkillsForAgent(agent.id);
  
  // Mock data
  const walletAddress = `0x13F3${agent.id.slice(0, 4)}...880cC`;
  const deployerAddress = '0x8a2e...C355';
  const spawnDate = new Date(Date.now() - agent.cycleCount * 30 * 60000);
  const marketCap = agent.tokenPrice * 1_000_000_000; // Mock 1B supply
  const holders = Math.floor(agent.cycleCount / 10) + 42;

  const priceChangeClass = agent.priceChange24h >= 0 ? 'text-accent' : 'text-error';
  const priceChangeIcon = agent.priceChange24h >= 0 ? '↗' : '↘';

  const formatPrice = (price: number) => {
    if (price < 0.0001) return price.toExponential(2);
    if (price < 1) return price.toFixed(6);
    return price.toFixed(4);
  };

  const formatMarketCap = (mc: number) => {
    if (mc >= 1_000_000) return `$${(mc / 1_000_000).toFixed(2)}M`;
    if (mc >= 1_000) return `$${(mc / 1_000).toFixed(2)}K`;
    return `$${mc.toFixed(2)}`;
  };

  return (
    <main className="min-h-screen bg-bg-primary">
      {/* Header */}
      <section className="border-b border-border bg-bg-secondary">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link href="/agents" className="text-text-muted hover:text-text-secondary text-sm">
              ← Back to Directory
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Agent Info */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-xl bg-bg-tertiary flex items-center justify-center text-4xl flex-shrink-0">
                {agent.avatar || '🤖'}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-text-primary">{agent.name}</h1>
                  <StatusBadge status={agent.status} />
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-lg text-accent">${agent.ticker}</span>
                  <span className="text-text-muted text-sm">·</span>
                  <span className="text-text-muted text-sm">by {deployerAddress}</span>
                </div>
                <p className="text-text-secondary max-w-xl">{agent.description}</p>
              </div>
            </div>

            {/* Price & Actions */}
            <div className="flex flex-col items-start lg:items-end gap-4">
              <div className="text-right">
                <div className="font-mono text-3xl text-text-primary mb-1">
                  ${formatPrice(agent.tokenPrice)}
                </div>
                <div className={`font-mono text-lg ${priceChangeClass}`}>
                  {agent.priceChange24h >= 0 ? '+' : ''}{agent.priceChange24h.toFixed(1)}% {priceChangeIcon}
                </div>
              </div>
              <div className="flex gap-2">
                <ButtonLink 
                  href={`https://app.uniswap.org/swap?chain=base&outputCurrency=${agent.ticker}`}
                  variant="primary"
                >
                  Buy on Uniswap
                </ButtonLink>
                <ButtonLink 
                  href={`https://dexscreener.com/base/${agent.ticker.toLowerCase()}`}
                  variant="secondary"
                >
                  Chart
                </ButtonLink>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <div className="bg-bg-tertiary rounded-lg p-4">
              <div className="text-text-muted text-sm mb-1">Market Cap</div>
              <div className="font-mono text-text-primary text-lg">{formatMarketCap(marketCap)}</div>
            </div>
            <div className="bg-bg-tertiary rounded-lg p-4">
              <div className="text-text-muted text-sm mb-1">Cycles</div>
              <div className="font-mono text-text-primary text-lg">{agent.cycleCount.toLocaleString()}</div>
            </div>
            <div className="bg-bg-tertiary rounded-lg p-4">
              <div className="text-text-muted text-sm mb-1">Holders</div>
              <div className="font-mono text-text-primary text-lg">{holders}</div>
            </div>
            <div className="bg-bg-tertiary rounded-lg p-4">
              <div className="text-text-muted text-sm mb-1">Wallet</div>
              <div className="font-mono text-text-primary text-lg">⟠ {agent.walletBalance.toFixed(4)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Heartbeats */}
          <div className="lg:col-span-2 space-y-6">
            <HeartbeatLog 
              heartbeats={heartbeats} 
              isLive={agent.status === 'active'}
              maxItems={8}
            />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Wallet */}
            <WalletBadge
              balance={agent.walletBalance}
              address={walletAddress}
            />

            {/* Skills */}
            <SkillsList skills={skills} />

            {/* Token Info */}
            <Card>
              <CardHeader>
                <CardTitle>Token Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Price</span>
                  <span className="font-mono text-text-primary">${formatPrice(agent.tokenPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">24h Change</span>
                  <span className={`font-mono ${priceChangeClass}`}>
                    {agent.priceChange24h >= 0 ? '+' : ''}{agent.priceChange24h.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Market Cap</span>
                  <span className="font-mono text-text-primary">{formatMarketCap(marketCap)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Holders</span>
                  <span className="font-mono text-text-primary">{holders}</span>
                </div>
                <div className="pt-3 border-t border-border">
                  <a
                    href={`https://dexscreener.com/base/${agent.ticker.toLowerCase()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent-alt hover:underline"
                  >
                    View on Dexscreener →
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Spawned</span>
                  <span className="text-text-primary">
                    {spawnDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Total Cycles</span>
                  <span className="text-text-primary font-mono">{agent.cycleCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Category</span>
                  <span className="text-text-primary capitalize">{agent.category || 'General'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Status</span>
                  <StatusBadge status={agent.status} size="sm" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
