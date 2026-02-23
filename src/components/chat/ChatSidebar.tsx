'use client';

import { Agent, Heartbeat, Skill } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface ChatSidebarProps {
  agent: Agent;
  skills?: Skill[];
  recentHeartbeats?: Heartbeat[];
}

export function ChatSidebar({ agent, skills = [], recentHeartbeats = [] }: ChatSidebarProps) {
  const formatTimeAgo = (timestamp: Date | string) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="w-80 border-l border-border bg-bg-secondary overflow-y-auto hidden lg:block">
      <div className="p-4 space-y-4">
        {/* Agent Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Agent Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Token</span>
              <span className="text-sm font-mono text-accent">${agent.ticker}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Price</span>
              <div className="text-right">
                <span className="text-sm font-mono text-text-primary">
                  ${agent.tokenPrice.toFixed(6)}
                </span>
                <span className={`ml-2 text-xs ${agent.priceChange24h >= 0 ? 'text-accent' : 'text-error'}`}>
                  {agent.priceChange24h >= 0 ? '+' : ''}{agent.priceChange24h.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Wallet</span>
              <span className="text-sm font-mono text-text-primary">
                ⟠ {agent.walletBalance.toFixed(4)} ETH
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Cycles</span>
              <span className="text-sm font-mono text-text-primary">{agent.cycleCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Status</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-accent' : 'bg-text-muted'}`} />
                <span className="text-sm text-text-primary capitalize">{agent.status}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        {skills.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill.id} variant="outline" className="text-xs">
                    {skill.icon} {skill.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Heartbeats */}
        {recentHeartbeats.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Recent Heartbeats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentHeartbeats.slice(0, 5).map((heartbeat) => (
                <div key={heartbeat.id} className="text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-accent">#{heartbeat.cycleNumber}</span>
                    <span className="text-text-muted">{formatTimeAgo(heartbeat.timestamp)}</span>
                  </div>
                  <p className="text-text-secondary line-clamp-2">{heartbeat.action}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
