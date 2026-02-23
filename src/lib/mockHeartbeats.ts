import type { Heartbeat, Skill } from './types';

// Generate mock heartbeats for an agent
export function generateMockHeartbeats(agentId: string, cycleCount: number): Heartbeat[] {
  const actions: Array<{ action: string; status: Heartbeat['status'] }> = [
    { action: 'Checked token prices. $PEPE up 12%. No action.', status: 'no_action' },
    { action: 'Swapped 0.01 ETH for $DEGEN. New position.', status: 'success' },
    { action: 'Updated personality per operator directive.', status: 'success' },
    { action: 'Scanned 42 new pairs. Nothing meets criteria.', status: 'no_action' },
    { action: 'Sold 50% $MEME position at +45%. Taking profits.', status: 'success' },
    { action: 'Whale alert: 0x7a9... accumulated 500 ETH of $ALPHA.', status: 'success' },
    { action: 'Market conditions unfavorable. Staying in stables.', status: 'no_action' },
    { action: 'New skill installed: trading. Ready to trade.', status: 'success' },
    { action: 'RPC rate limited. Retry scheduled.', status: 'error' },
    { action: 'Analyzed sentiment: 72% bullish. Increasing exposure.', status: 'success' },
    { action: 'Rebalanced portfolio. ETH weight now 40%.', status: 'success' },
    { action: 'Community engagement: posted meme, 234 reactions.', status: 'success' },
    { action: 'Monitoring $ARB breakout. Entry at $1.42 planned.', status: 'no_action' },
  ];

  const heartbeats: Heartbeat[] = [];
  const now = new Date();

  for (let i = 0; i < 10; i++) {
    const cycle = cycleCount - i;
    const minutesAgo = i * 30 + Math.floor(Math.random() * 5);
    const timestamp = new Date(now.getTime() - minutesAgo * 60000);
    const randomAction = actions[Math.floor(Math.random() * actions.length)];

    heartbeats.push({
      id: `${agentId}-hb-${cycle}`,
      cycleNumber: cycle,
      timestamp,
      action: randomAction.action,
      status: randomAction.status,
    });
  }

  return heartbeats;
}

// Mock skills for agents
export const mockSkillsByAgent: Record<string, Skill[]> = {
  'degen-trader': [
    { id: 'trading', name: 'Trading', icon: '📊' },
    { id: 'price-alerts', name: 'Price Alerts', icon: '🔔' },
    { id: 'whale-tracking', name: 'Whale Tracking', icon: '🐋' },
  ],
  'alpha-seeker': [
    { id: 'twitter-scanner', name: 'Twitter Scanner', icon: '🐦' },
    { id: 'sentiment', name: 'Sentiment Analysis', icon: '📈' },
  ],
  'whale-watcher': [
    { id: 'whale-tracking', name: 'Whale Tracking', icon: '🐋' },
    { id: 'on-chain', name: 'On-Chain Analytics', icon: '⛓️' },
    { id: 'alerts', name: 'Alert System', icon: '🚨' },
  ],
  'copy-cat': [
    { id: 'wallet-mirror', name: 'Wallet Mirror', icon: '🪞' },
    { id: 'trading', name: 'Trading', icon: '📊' },
  ],
  'meme-lord': [
    { id: 'meme-gen', name: 'Meme Generator', icon: '🎨' },
    { id: 'social', name: 'Social Media', icon: '📱' },
    { id: 'engagement', name: 'Engagement', icon: '💬' },
  ],
  'snipe-bot': [
    { id: 'sniping', name: 'Token Sniping', icon: '🎯' },
    { id: 'mempool', name: 'Mempool Watch', icon: '👁️' },
  ],
  'yield-farmer': [
    { id: 'defi', name: 'DeFi Protocols', icon: '🏦' },
    { id: 'yield', name: 'Yield Optimizer', icon: '🌾' },
    { id: 'compound', name: 'Auto-Compound', icon: '🔄' },
  ],
  'news-bot': [
    { id: 'news-agg', name: 'News Aggregator', icon: '📰' },
    { id: 'summary', name: 'AI Summarizer', icon: '✍️' },
  ],
  'nft-hunter': [
    { id: 'nft-scanner', name: 'NFT Scanner', icon: '🖼️' },
    { id: 'rarity', name: 'Rarity Checker', icon: '💎' },
  ],
  'arb-master': [
    { id: 'arbitrage', name: 'Arbitrage Engine', icon: '⚡' },
    { id: 'multi-dex', name: 'Multi-DEX', icon: '🔀' },
    { id: 'gas-opt', name: 'Gas Optimizer', icon: '⛽' },
  ],
};

// Get skills for an agent, with fallback
export function getSkillsForAgent(agentId: string): Skill[] {
  return mockSkillsByAgent[agentId] || [
    { id: 'basic', name: 'Basic Operations', icon: '⚙️' },
  ];
}
