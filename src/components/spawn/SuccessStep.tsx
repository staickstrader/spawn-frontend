'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import type { AgentConfig } from './ConfigureStep';

interface SuccessStepProps {
  agentId: string;
  config: AgentConfig;
}

export function SuccessStep({ agentId, config }: SuccessStepProps) {
  // Mock data - in production these would come from the deployment result
  const tokenAddress = '0x1234567890abcdef1234567890abcdef12345678';
  const agentWallet = '0xabcdef1234567890abcdef1234567890abcdef12';
  const repoUrl = `https://github.com/staickstrader/${config.name.toLowerCase()}`;

  return (
    <div className="space-y-8">
      {/* Success animation/icon */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 mb-6">
          <svg className="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-text-primary mb-2">
          {config.name} is Live! 🎉
        </h2>
        <p className="text-text-secondary text-lg">
          Your agent is now running and will heartbeat every 30 minutes
        </p>
      </div>

      {/* Agent summary card */}
      <div className="bg-bg-tertiary rounded-lg p-6 border border-accent/30">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-accent/20 to-accent-alt/20 flex items-center justify-center text-2xl">
            🤖
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-text-primary">{config.name}</h3>
            <p className="text-accent font-mono">${config.ticker}</p>
            <p className="text-sm text-text-secondary mt-1">{config.description}</p>
          </div>
        </div>

        {/* Links */}
        <div className="grid gap-3">
          <div className="flex items-center justify-between py-2 px-3 bg-bg-secondary rounded-md">
            <span className="text-text-secondary text-sm">Token</span>
            <a 
              href={`https://basescan.org/token/${tokenAddress}`}
              target="_blank"
              rel="noopener"
              className="font-mono text-sm text-accent-alt hover:underline"
            >
              {tokenAddress.slice(0, 6)}...{tokenAddress.slice(-4)}
            </a>
          </div>
          <div className="flex items-center justify-between py-2 px-3 bg-bg-secondary rounded-md">
            <span className="text-text-secondary text-sm">Agent Wallet</span>
            <a 
              href={`https://basescan.org/address/${agentWallet}`}
              target="_blank"
              rel="noopener"
              className="font-mono text-sm text-accent-alt hover:underline"
            >
              {agentWallet.slice(0, 6)}...{agentWallet.slice(-4)}
            </a>
          </div>
          <div className="flex items-center justify-between py-2 px-3 bg-bg-secondary rounded-md">
            <span className="text-text-secondary text-sm">Repository</span>
            <a 
              href={repoUrl}
              target="_blank"
              rel="noopener"
              className="font-mono text-sm text-accent-alt hover:underline"
            >
              {repoUrl.replace('https://github.com/', '')}
            </a>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-accent/5 rounded-lg p-4 border border-accent/20">
        <h4 className="font-medium text-text-primary mb-3">What's next?</h4>
        <ul className="space-y-2 text-sm text-text-secondary">
          <li className="flex items-start gap-2">
            <span className="text-accent">→</span>
            <span>Chat with your agent to refine its personality and give it tasks</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent">→</span>
            <span>Install skills to expand its capabilities</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent">→</span>
            <span>Share your agent's profile so others can discover it</span>
          </li>
        </ul>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Link href={`/chat/${agentId}`} className="flex-1">
          <Button size="lg" fullWidth>
            Chat with {config.name}
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </Button>
        </Link>
        <Link href={`/agents/${agentId}`} className="flex-1">
          <Button variant="secondary" size="lg" fullWidth>
            View Profile
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Button>
        </Link>
      </div>

      {/* Share links */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <span className="text-text-muted text-sm">Share:</span>
        <a 
          href={`https://twitter.com/intent/tweet?text=Just spawned ${config.name} ($${config.ticker}) on @spawnxyz! 🤖&url=${encodeURIComponent(`https://spawn.xyz/agents/${agentId}`)}`}
          target="_blank"
          rel="noopener"
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
        <a 
          href={`https://warpcast.com/~/compose?text=Just spawned ${config.name} ($${config.ticker}) on SPAWN! 🤖&embeds[]=${encodeURIComponent(`https://spawn.xyz/agents/${agentId}`)}`}
          target="_blank"
          rel="noopener"
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 3h18v18H3V3zm15.75 4.5h-1.125v3h-1.125v-3h-1.125v3H14.25v-3h-1.125v3h-1.125v-3H10.875v3H9.75v-3H8.625v3H7.5v-3H6.375v3H5.25v6h1.125v-3h1.125v3h1.125v-3H9.75v3h1.125v-3h1.125v3h1.125v-3h1.125v3h1.125v-3h1.125v3h1.125v-6h-1.125v-3z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
