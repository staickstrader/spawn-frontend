'use client';

import { useState, useCallback } from 'react';
import { cn, formatTimeAgo } from '@/lib/utils';
import { ChatMessage as ChatMessageType } from '@/lib/types';
import { HeartbeatEvent } from './HeartbeatEvent';

interface ChatMessageProps {
  message: ChatMessageType;
}

/**
 * Render markdown-like content with code block support
 */
function renderContent(content: string, isAgent: boolean) {
  // Split by code blocks (```...```)
  const parts = content.split(/(```[\s\S]*?```)/);
  
  return parts.map((part, index) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      // Code block
      const code = part.slice(3, -3);
      const [lang, ...lines] = code.split('\n');
      const codeContent = lang.match(/^[a-z]+$/i) ? lines.join('\n') : code;
      
      return (
        <pre key={index} className="mt-2 mb-2 p-3 bg-bg-primary rounded border border-border overflow-x-auto">
          <code className="text-xs font-mono text-text-primary whitespace-pre">
            {codeContent.trim()}
          </code>
        </pre>
      );
    }
    
    // Regular text - handle inline code and basic formatting
    return (
      <span key={index} className={cn("whitespace-pre-wrap", isAgent && "font-mono")}>
        {part.split(/(`[^`]+`)/).map((segment, i) => {
          if (segment.startsWith('`') && segment.endsWith('`')) {
            // Inline code
            return (
              <code key={i} className="px-1.5 py-0.5 bg-bg-primary rounded text-accent text-xs font-mono">
                {segment.slice(1, -1)}
              </code>
            );
          }
          return segment;
        })}
      </span>
    );
  });
}

/**
 * Format absolute time for tooltip
 */
function formatAbsoluteTime(timestamp: Date | string): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  const isUser = message.type === 'user';
  const isHeartbeat = message.type === 'heartbeat';
  const isSystem = message.type === 'system';
  
  const timestamp = typeof message.timestamp === 'string' 
    ? new Date(message.timestamp) 
    : message.timestamp;
  
  const relativeTime = formatTimeAgo(timestamp);
  const absoluteTime = formatAbsoluteTime(timestamp);

  const copyMessage = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setShowCopyFeedback(true);
      setTimeout(() => setShowCopyFeedback(false), 1500);
    } catch {
      // Clipboard API not available
    }
  }, [message.content]);

  // Heartbeat messages use dedicated component
  if (isHeartbeat && message.cycleNumber) {
    return (
      <HeartbeatEvent
        eventType={message.heartbeatType || 'cycle_end'}
        cycleNumber={message.cycleNumber}
        timestamp={message.timestamp}
        action={message.content}
        status={message.heartbeatStatus || 'success'}
      />
    );
  }

  // System messages (simple, non-heartbeat system events)
  if (isSystem) {
    return (
      <div className="flex justify-center py-2">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <div className="h-px w-8 bg-border" />
          <span className="font-mono">
            {message.cycleNumber && `[Cycle ${message.cycleNumber}] `}
            {message.content}
          </span>
          <span 
            className="cursor-help"
            title={absoluteTime}
          >
            — {relativeTime}
          </span>
          <div className="h-px w-8 bg-border" />
        </div>
      </div>
    );
  }

  // User/Agent messages
  return (
    <div className={cn(
      "flex w-full group",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-lg px-4 py-3 relative",
        isUser 
          ? "bg-accent/20 border border-accent/30" 
          : "bg-bg-tertiary border border-border"
      )}>
        {/* Header: label + timestamp + status */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className={cn(
            "text-xs font-medium",
            isUser ? "text-accent" : "text-accent-alt"
          )}>
            {isUser ? '[You]' : '[Agent]'}
          </span>
          <span 
            className="text-xs text-text-muted cursor-help"
            title={absoluteTime}
          >
            {relativeTime}
          </span>
          
          {/* Message status indicator (for user messages) */}
          {isUser && message.status && (
            <span className="text-xs text-text-muted">
              {message.status === 'pending' && (
                <span className="inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-pulse" />
                </span>
              )}
              {message.status === 'sent' && (
                <span className="text-accent">✓</span>
              )}
              {message.status === 'delivered' && (
                <span className="text-accent">✓✓</span>
              )}
              {message.status === 'error' && (
                <span className="text-error">!</span>
              )}
            </span>
          )}
        </div>

        {/* Message content with markdown support */}
        <div className="text-sm text-text-primary">
          {renderContent(message.content, !isUser)}
        </div>

        {/* Copy button (visible on hover) */}
        <button
          onClick={copyMessage}
          className={cn(
            "absolute top-2 right-2 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity",
            "hover:bg-white/10 text-text-muted hover:text-text-primary",
            showCopyFeedback && "opacity-100 text-accent"
          )}
          title={showCopyFeedback ? "Copied!" : "Copy message"}
        >
          {showCopyFeedback ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
