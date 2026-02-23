'use client';

import { cn, formatTimeAgo } from '@/lib/utils';
import { Heartbeat } from '@/lib/types';

type HeartbeatEventType = 'cycle_start' | 'cycle_end' | 'action';

interface HeartbeatEventProps {
  /** Type of heartbeat event */
  eventType: HeartbeatEventType;
  /** Cycle number */
  cycleNumber: number;
  /** Event timestamp */
  timestamp: Date | string;
  /** Action summary (for cycle_end or action events) */
  action?: string;
  /** Status indicator */
  status?: 'success' | 'no_action' | 'error';
}

/**
 * HeartbeatEvent component
 * 
 * Displays heartbeat/cycle events inline in the chat with distinct styling.
 * Shows cycle start, cycle end (with action summary), or standalone actions.
 */
export function HeartbeatEvent({
  eventType,
  cycleNumber,
  timestamp,
  action,
  status = 'success',
}: HeartbeatEventProps) {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const relativeTime = formatTimeAgo(date);
  const absoluteTime = date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  // Status icons
  const statusIcon = {
    success: '✓',
    no_action: '—',
    error: '✗',
  }[status];

  const statusColor = {
    success: 'text-accent',
    no_action: 'text-text-muted',
    error: 'text-error',
  }[status];

  // Event content based on type
  const getEventContent = () => {
    switch (eventType) {
      case 'cycle_start':
        return (
          <div className="flex items-center gap-2">
            <span className="text-accent">●</span>
            <span>Agent woke up</span>
          </div>
        );
      case 'cycle_end':
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className={statusColor}>{statusIcon}</span>
              <span>Cycle completed</span>
            </div>
            {action && (
              <div className="ml-5 text-text-secondary italic">
                "{action}"
              </div>
            )}
          </div>
        );
      case 'action':
        return (
          <div className="flex items-center gap-2">
            <span className={statusColor}>{statusIcon}</span>
            <span className="text-text-secondary">{action || 'Action completed'}</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative py-3">
      {/* Horizontal line with cycle badge */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Event card */}
      <div className="relative flex justify-center">
        <div className={cn(
          "inline-flex flex-col items-center gap-1 px-4 py-2 rounded-lg",
          "bg-bg-secondary border border-border",
          "font-mono text-xs"
        )}>
          {/* Cycle header */}
          <div className="flex items-center gap-2 text-text-muted">
            <span className="px-1.5 py-0.5 bg-bg-primary rounded text-accent font-medium">
              Cycle {cycleNumber}
            </span>
            <span>·</span>
            <span 
              className="cursor-help" 
              title={`${date.toLocaleDateString()} ${absoluteTime}`}
            >
              {relativeTime}
            </span>
          </div>

          {/* Event content */}
          <div className="text-text-primary">
            {getEventContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact inline heartbeat for simpler display
 */
export function HeartbeatInline({
  cycleNumber,
  timestamp,
  action,
  status = 'success',
}: Omit<HeartbeatEventProps, 'eventType'> & { action: string }) {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const relativeTime = formatTimeAgo(date);

  const statusColor = {
    success: 'text-accent',
    no_action: 'text-text-muted',
    error: 'text-error',
  }[status];

  return (
    <div className="flex items-start gap-3 py-2 px-3 bg-bg-secondary/50 rounded border-l-2 border-border hover:border-accent/50 transition-colors">
      <div className="flex-shrink-0">
        <span className={cn(
          "inline-flex items-center justify-center w-8 h-8 rounded-full",
          "bg-bg-primary border border-border font-mono text-xs font-medium",
          statusColor
        )}>
          {cycleNumber}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-primary truncate font-mono">
          {action}
        </p>
        <p className="text-xs text-text-muted mt-0.5">
          {relativeTime}
        </p>
      </div>
    </div>
  );
}

/**
 * Convert a Heartbeat object to HeartbeatEvent props
 */
export function heartbeatToEventProps(heartbeat: Heartbeat): HeartbeatEventProps {
  return {
    eventType: heartbeat.action.toLowerCase().includes('woke up') ? 'cycle_start' : 'cycle_end',
    cycleNumber: heartbeat.cycleNumber,
    timestamp: heartbeat.timestamp,
    action: heartbeat.action,
    status: heartbeat.status,
  };
}
