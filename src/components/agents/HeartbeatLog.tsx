'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import type { Heartbeat } from '@/lib/types';

// Re-export for convenience
export type { Heartbeat };

interface HeartbeatLogProps {
  heartbeats: Heartbeat[];
  isLive?: boolean;
  isLoading?: boolean;
  maxItems?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

function formatTimeAgo(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHour < 24) return `${diffHour}h ${diffMin % 60}m ago`;
  return `${diffDay}d ago`;
}

function HeartbeatItem({ heartbeat }: { heartbeat: Heartbeat }) {
  const statusColors = {
    success: 'border-l-accent',
    no_action: 'border-l-text-muted',
    error: 'border-l-error',
  };

  return (
    <div className={`border-l-2 ${statusColors[heartbeat.status]} pl-4 py-3`}>
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-sm text-text-secondary">
          Cycle {heartbeat.cycleNumber}
        </span>
        <span className="text-xs text-text-muted">
          {formatTimeAgo(heartbeat.timestamp)}
        </span>
      </div>
      <p className="text-text-primary text-sm font-mono leading-relaxed">
        &quot;{heartbeat.action}&quot;
      </p>
    </div>
  );
}

function HeartbeatSkeleton() {
  return (
    <div className="border-l-2 border-l-border pl-4 py-3 animate-pulse">
      <div className="flex items-center justify-between mb-1">
        <div className="h-4 w-20 bg-bg-tertiary rounded" />
        <div className="h-3 w-16 bg-bg-tertiary rounded" />
      </div>
      <div className="h-4 w-full bg-bg-tertiary rounded mt-2" />
    </div>
  );
}

export function HeartbeatLog({ 
  heartbeats, 
  isLive = false, 
  isLoading = false,
  maxItems = 10,
  onLoadMore,
  hasMore = false,
}: HeartbeatLogProps) {
  const displayHeartbeats = heartbeats.slice(0, maxItems);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Heartbeats</CardTitle>
          {isLive && (
            <div className="flex items-center gap-2 text-sm text-accent">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              Live
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && heartbeats.length === 0 ? (
          <div className="divide-y divide-border">
            {[...Array(3)].map((_, i) => (
              <HeartbeatSkeleton key={i} />
            ))}
          </div>
        ) : displayHeartbeats.length === 0 ? (
          <p className="text-text-muted text-sm text-center py-4">
            No heartbeats recorded yet.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {displayHeartbeats.map((heartbeat) => (
              <HeartbeatItem key={heartbeat.id} heartbeat={heartbeat} />
            ))}
          </div>
        )}
        {(hasMore || heartbeats.length > maxItems) && onLoadMore && (
          <div className="text-center pt-4">
            <button 
              className="text-sm text-accent-alt hover:underline disabled:opacity-50"
              onClick={onLoadMore}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Load more'}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
