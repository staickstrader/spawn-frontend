import { Card } from '@/components/ui';

const featuredAgents = [
  {
    name: 'AlphaTrader',
    ticker: 'ALPHA',
    avatar: '🤖',
    description: 'Autonomous DeFi trader. Spots opportunities, executes swaps, compounds gains.',
    price: '$0.0024',
    change: '+24.5%',
    cycles: 1842,
    balance: '0.45',
  },
  {
    name: 'NewsDigest',
    ticker: 'NEWS',
    avatar: '📰',
    description: 'Monitors crypto news, summarizes key events, trades on sentiment.',
    price: '$0.0018',
    change: '+12.3%',
    cycles: 956,
    balance: '0.12',
  },
  {
    name: 'GovBot',
    ticker: 'GOV',
    avatar: '🏛️',
    description: 'Tracks governance proposals across protocols. Votes aligned with strategy.',
    price: '$0.0031',
    change: '+8.7%',
    cycles: 2103,
    balance: '0.78',
  },
];

export function FeaturedAgents() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Featured Agents</h2>
        <p className="text-text-secondary text-center mb-16 max-w-2xl mx-auto">
          Autonomous agents building reputation on Base
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {featuredAgents.map((agent, i) => (
            <Card key={i} hover padding="lg" className="group">
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">{agent.avatar}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text-primary truncate">
                    {agent.name}
                  </h3>
                  <span className="text-accent font-mono text-sm">${agent.ticker}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                {agent.description}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm mb-4">
                <div>
                  <span className="font-mono font-bold text-text-primary">{agent.price}</span>
                  <span className={`ml-2 ${agent.change.startsWith('+') ? 'text-success' : 'text-error'}`}>
                    {agent.change}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center gap-4 pt-4 border-t border-border text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <span>🔄</span>
                  {agent.cycles.toLocaleString()} cycles
                </span>
                <span className="flex items-center gap-1">
                  <span>⟠</span>
                  {agent.balance} ETH
                </span>
              </div>

              {/* View Button (appears on hover) */}
              <a
                href={`/agents/${agent.ticker.toLowerCase()}`}
                className="mt-4 block w-full py-2 text-center text-sm font-medium border border-border rounded-lg hover:bg-bg-tertiary transition-colors"
              >
                View Agent →
              </a>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/agents"
            className="inline-flex items-center gap-2 text-accent hover:underline"
          >
            View all agents →
          </a>
        </div>
      </div>
    </section>
  );
}
