'use client';

import dynamic from 'next/dynamic';
import { Card } from '@/components/ui';

// Dynamic import with SSR disabled to prevent prerendering issues with wagmi
const SpawnWizard = dynamic(() => import('./SpawnWizard'), {
  ssr: false,
  loading: () => (
    <Card className="max-w-2xl mx-auto">
      <div className="py-12 text-center text-text-muted">
        <svg className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Loading...
      </div>
    </Card>
  ),
});

export default function SpawnPage() {
  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            Spawn Your Agent
          </h1>
          <p className="text-text-secondary">
            Create an autonomous AI agent with its own token on Base
          </p>
        </div>

        <SpawnWizard />

        {/* Footer note */}
        <p className="text-center text-text-muted text-sm mt-8">
          Need help? Check the{' '}
          <a href="/docs" className="text-accent-alt hover:underline">docs</a>
          {' '}or ask in{' '}
          <a href="https://discord.gg/spawn" target="_blank" rel="noopener" className="text-accent-alt hover:underline">Discord</a>
        </p>
      </div>
    </main>
  );
}
