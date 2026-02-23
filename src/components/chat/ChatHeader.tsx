'use client';

import Link from 'next/link';
import { Agent } from '@/lib/types';
import { ConnectionState } from '@/lib/websocket';

interface ChatHeaderProps {
  agent: Agent;
  connectionState?: ConnectionState;
  onReconnect?: () => void;
}

const connectionStyles: Record<ConnectionState, { color: string; label: string; pulse: boolean }> = {
  connected: { color: 'bg-accent', label: 'Connected', pulse: false },
  connecting: { color: 'bg-accent-alt', label: 'Connecting', pulse: true },
  reconnecting: { color: 'bg-warning', label: 'Reconnecting', pulse: true },
  disconnected: { color: 'bg-error', label: 'Disconnected', pulse: false },
};

export function ChatHeader({ agent, connectionState = 'connected', onReconnect }: ChatHeaderProps) {
  const connStyle = connectionStyles[connectionState];

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-secondary">
      <div className="flex items-center gap-3">
        <Link 
          href={`/agents/${agent.id}`}
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          ←
        </Link>
        <div className="w-10 h-10 rounded-full bg-bg-tertiary border border-border flex items-center justify-center text-lg">
          {agent.avatar || '🤖'}
        </div>
        <div>
          <h1 className="font-semibold text-text-primary">{agent.name}</h1>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-accent">${agent.ticker}</span>
            <span className="text-text-muted">•</span>
            <div className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${agent.status === 'active' ? 'bg-accent animate-pulse' : 'bg-text-muted'}`} />
              <span className="text-text-secondary capitalize">{agent.status}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Connection Status Indicator */}
        <button
          onClick={onReconnect}
          disabled={connectionState === 'connected' || connectionState === 'connecting'}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
            connectionState === 'disconnected' 
              ? 'hover:bg-bg-tertiary cursor-pointer' 
              : 'cursor-default'
          }`}
          title={connectionState === 'disconnected' ? 'Click to reconnect' : connStyle.label}
        >
          <div className={`w-2 h-2 rounded-full ${connStyle.color} ${connStyle.pulse ? 'animate-pulse' : ''}`} />
          <span className="text-xs text-text-secondary hidden sm:inline">{connStyle.label}</span>
        </button>

        {/* Wallet Balance */}
        <div className="text-right hidden sm:block">
          <span className="text-sm font-mono text-text-primary">
            ⟠ {agent.walletBalance.toFixed(4)} ETH
          </span>
        </div>

        {/* Settings Link */}
        <Link
          href={`/agents/${agent.id}`}
          className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors text-text-secondary hover:text-text-primary"
          title="Agent Settings"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
