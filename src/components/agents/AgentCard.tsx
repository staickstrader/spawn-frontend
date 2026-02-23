'use client';

import Link from 'next/link';
import { Card } from '@/components/ui';
import { StatusBadge } from '@/components/ui/Badge';
import type { Agent } from '@/lib/types';

// Re-export Agent type for convenience
export type { Agent };

interface AgentCardProps {
  agent: Agent;
  view?: 'grid' | 'list';
}

export function AgentCard({ agent, view = 'grid' }: AgentCardProps) {
  const priceChangeClass = agent.priceChange24h >= 0 
    ? 'text-accent' 
    : 'text-error';
  
  const priceChangeIcon = agent.priceChange24h >= 0 ? '↗' : '↘';
  
  const formatPrice = (price: number) => {
    if (price < 0.0001) return price.toExponential(2);
    if (price < 1) return price.toFixed(6);
    return price.toFixed(4);
  };

  if (view === 'list') {
    return (
      <Link href={`/agents/${agent.id}`}>
        <Card hover padding="md" className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-lg bg-bg-tertiary flex items-center justify-center text-2xl flex-shrink-0">
            {agent.avatar || '🤖'}
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-text-primary truncate">{agent.name}</span>
              <span className="text-text-muted font-mono text-sm">${agent.ticker}</span>
              <StatusBadge status={agent.status} size="sm" />
            </div>
            <p className="text-text-secondary text-sm truncate mt-0.5">{agent.description}</p>
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-6 flex-shrink-0">
            <div className="text-right">
              <div className="font-mono text-text-primary">${formatPrice(agent.tokenPrice)}</div>
              <div className={`text-sm font-mono ${priceChangeClass}`}>
                {agent.priceChange24h >= 0 ? '+' : ''}{agent.priceChange24h.toFixed(1)}% {priceChangeIcon}
              </div>
            </div>
            <div className="text-right text-sm text-text-secondary hidden sm:block">
              <div>🔄 {agent.cycleCount} cycles</div>
              <div>⟠ {agent.walletBalance.toFixed(4)} ETH</div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/agents/${agent.id}`}>
      <Card hover padding="lg" className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
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
        
        {/* Description */}
        <p className="text-text-secondary text-sm line-clamp-2 flex-1 mb-4">
          {agent.description}
        </p>
        
        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-mono text-lg text-text-primary">${formatPrice(agent.tokenPrice)}</span>
          <span className={`text-sm font-mono ${priceChangeClass}`}>
            {agent.priceChange24h >= 0 ? '+' : ''}{agent.priceChange24h.toFixed(1)}% {priceChangeIcon}
          </span>
        </div>
        
        {/* Footer Stats */}
        <div className="flex items-center justify-between text-sm text-text-secondary pt-3 border-t border-border">
          <span>🔄 {agent.cycleCount} cycles</span>
          <span>⟠ {agent.walletBalance.toFixed(4)} ETH</span>
        </div>
      </Card>
    </Link>
  );
}
