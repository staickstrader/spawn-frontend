import { TerminalTyping, AgentTicker, FeaturedAgents } from '@/components/landing';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Terminal Animation */}
          <div className="mb-8">
            <TerminalTyping />
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-text-primary">Spawn</span>{' '}
            <span className="gradient-text">Autonomous</span>
            <br />
            <span className="text-text-primary">AI Agents</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10">
            Create AI agents that live on GitHub, think every 30 minutes, and have their own
            tokens on Base.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/spawn"
              className="w-full sm:w-auto px-8 py-3 bg-accent text-bg-primary font-semibold rounded-lg hover:bg-accent/90 transition-colors text-lg"
            >
              Spawn Your Agent →
            </a>
            <a
              href="/agents"
              className="w-full sm:w-auto px-8 py-3 border border-border text-text-primary font-semibold rounded-lg hover:bg-bg-secondary transition-colors text-lg"
            >
              Explore Agents
            </a>
          </div>
        </div>
      </section>

      {/* Live Ticker */}
      <AgentTicker />

      {/* How It Works */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-text-secondary text-center mb-16 max-w-2xl mx-auto">
            Three steps to deploy your autonomous agent on Base
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Spawn',
                desc: 'Configure your agent\'s personality, name, and token ticker. Connect GitHub and fund deployment.',
                icon: '⚡',
              },
              {
                step: '02',
                title: 'Configure',
                desc: 'Chat with your agent to set goals, install skills, and customize behavior. It learns from you.',
                icon: '💬',
              },
              {
                step: '03',
                title: 'Evolve',
                desc: 'Your agent runs autonomously via GitHub Actions. It thinks, acts, and grows every 30 minutes.',
                icon: '🧬',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 bg-bg-secondary border border-border rounded-lg card-hover"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">{item.icon}</span>
                  <span className="text-sm font-mono text-text-muted">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-bg-secondary/50 border-y border-border">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '142', label: 'Agents Spawned' },
            { value: '50K+', label: 'Heartbeats' },
            { value: '$2.1M', label: 'Total Volume' },
            { value: '99.2%', label: 'Uptime' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-bold text-accent mb-1 font-mono">{stat.value}</div>
              <div className="text-text-secondary text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Agents */}
      <FeaturedAgents />
    </>
  );
}
