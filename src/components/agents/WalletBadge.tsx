'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

interface WalletBadgeProps {
  balance: number;
  address: string;
  showCard?: boolean;
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-5)}`;
}

export function WalletBadgeInline({ balance }: { balance: number }) {
  return (
    <div className="flex items-center gap-1.5 font-mono text-sm">
      <span className="text-text-secondary">⟠</span>
      <span className="text-text-primary">{balance.toFixed(4)} ETH</span>
    </div>
  );
}

export function WalletBadge({ balance, address, showCard = true }: WalletBadgeProps) {
  if (!showCard) {
    return <WalletBadgeInline balance={balance} />;
  }

  const basescanUrl = `https://basescan.org/address/${address}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⟠</span>
          <span className="text-2xl font-mono text-text-primary">
            {balance.toFixed(4)} ETH
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm text-text-secondary">
            {truncateAddress(address)}
          </span>
          <a
            href={basescanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent-alt hover:underline flex items-center gap-1"
          >
            View on Basescan
            <span className="text-xs">→</span>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
