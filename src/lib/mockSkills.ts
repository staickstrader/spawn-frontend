export interface SkillDetail {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'trading' | 'analytics' | 'social' | 'defi' | 'nft' | 'automation' | 'research';
  tools: string[];
  installs: number;
  author: string;
  version: string;
}

export const mockSkills: SkillDetail[] = [
  {
    id: 'trading',
    name: 'Trading',
    icon: '📊',
    description: 'On-chain trading tools for swapping tokens, checking prices, and managing positions across DEXs.',
    category: 'trading',
    tools: ['swap_token', 'check_price', 'get_balance', 'approve_token'],
    installs: 342,
    author: 'spawn-core',
    version: '1.2.0',
  },
  {
    id: 'whale-tracking',
    name: 'Whale Tracking',
    icon: '🐋',
    description: 'Monitor large wallet movements on-chain. Get alerts when whales accumulate or dump tokens.',
    category: 'analytics',
    tools: ['track_wallet', 'whale_alerts', 'transaction_history'],
    installs: 256,
    author: 'spawn-core',
    version: '1.0.4',
  },
  {
    id: 'twitter-scanner',
    name: 'Twitter Scanner',
    icon: '🐦',
    description: 'Scan Twitter/X for crypto alpha, trending tickers, and influencer activity.',
    category: 'research',
    tools: ['search_tweets', 'monitor_accounts', 'trending_topics'],
    installs: 189,
    author: 'alpha-labs',
    version: '2.1.0',
  },
  {
    id: 'sentiment',
    name: 'Sentiment Analysis',
    icon: '📈',
    description: 'Analyze market sentiment from social media, news, and on-chain data.',
    category: 'analytics',
    tools: ['analyze_sentiment', 'fear_greed_index', 'social_volume'],
    installs: 167,
    author: 'spawn-core',
    version: '1.1.2',
  },
  {
    id: 'meme-gen',
    name: 'Meme Generator',
    icon: '🎨',
    description: 'Create viral crypto memes with AI. Perfect for community engagement and marketing.',
    category: 'social',
    tools: ['generate_meme', 'caption_image', 'trending_templates'],
    installs: 423,
    author: 'meme-labs',
    version: '3.0.1',
  },
  {
    id: 'defi-protocols',
    name: 'DeFi Protocols',
    icon: '🏦',
    description: 'Interact with major DeFi protocols. Supply, borrow, stake, and earn yields.',
    category: 'defi',
    tools: ['supply_asset', 'borrow', 'stake', 'claim_rewards'],
    installs: 134,
    author: 'spawn-core',
    version: '1.3.0',
  },
  {
    id: 'nft-scanner',
    name: 'NFT Scanner',
    icon: '🖼️',
    description: 'Scout NFT collections, track floors, and find undervalued pieces.',
    category: 'nft',
    tools: ['scan_collection', 'floor_price', 'rarity_check', 'list_nft'],
    installs: 98,
    author: 'nft-tools',
    version: '1.0.0',
  },
  {
    id: 'arbitrage',
    name: 'Arbitrage Engine',
    icon: '⚡',
    description: 'Find and execute cross-DEX arbitrage opportunities automatically.',
    category: 'trading',
    tools: ['find_arb', 'execute_arb', 'gas_estimate', 'route_optimizer'],
    installs: 87,
    author: 'arb-labs',
    version: '2.0.0',
  },
  {
    id: 'telegram-bot',
    name: 'Telegram Integration',
    icon: '💬',
    description: 'Post updates to Telegram channels and groups. Engage your community.',
    category: 'social',
    tools: ['send_message', 'poll', 'pin_message', 'channel_stats'],
    installs: 312,
    author: 'spawn-core',
    version: '1.4.1',
  },
  {
    id: 'price-alerts',
    name: 'Price Alerts',
    icon: '🔔',
    description: 'Set custom price alerts for any token. Get notified on targets or stop losses.',
    category: 'automation',
    tools: ['set_alert', 'list_alerts', 'delete_alert'],
    installs: 445,
    author: 'spawn-core',
    version: '1.1.0',
  },
];

export const skillCategories = [
  { value: 'all', label: 'All Skills' },
  { value: 'trading', label: 'Trading' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'research', label: 'Research' },
  { value: 'social', label: 'Social' },
  { value: 'defi', label: 'DeFi' },
  { value: 'nft', label: 'NFT' },
  { value: 'automation', label: 'Automation' },
];
