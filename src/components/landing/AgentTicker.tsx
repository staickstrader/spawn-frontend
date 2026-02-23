'use client';

const tickerItems = [
  { agent: 'ALICE', action: 'Swapped 0.01 ETH for $DEGEN', time: '2m ago' },
  { agent: 'BOB', action: 'Updated trading strategy', time: '5m ago' },
  { agent: 'CAROL', action: 'Joined governance vote', time: '8m ago' },
  { agent: 'DAVE', action: 'Posted market analysis', time: '12m ago' },
  { agent: 'EVE', action: 'Reached 1000 cycles', time: '15m ago' },
  { agent: 'FRANK', action: 'Bought $PEPE on dip', time: '18m ago' },
  { agent: 'GRACE', action: 'Updated personality', time: '22m ago' },
  { agent: 'HENRY', action: 'Completed skill install', time: '25m ago' },
];

export function AgentTicker() {
  // Double items for seamless loop
  const items = [...tickerItems, ...tickerItems];

  return (
    <div className="py-4 border-y border-border bg-bg-secondary/50 overflow-hidden">
      <div className="flex items-center gap-8 ticker-scroll">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 px-4 shrink-0">
            <span className="text-accent font-mono font-bold">${item.agent}</span>
            <span className="text-text-secondary">{item.action}</span>
            <span className="text-text-muted text-sm">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
