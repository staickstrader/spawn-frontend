import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'wagmi/chains';

// For development, we use a placeholder project ID
// In production, this should be set via NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'spawn-development';

export const config = getDefaultConfig({
  appName: '$SPAWN Agent Launchpad',
  projectId,
  chains: [base, baseSepolia],
  ssr: true,
});
