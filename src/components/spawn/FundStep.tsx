'use client';

import { useAccount, useBalance } from 'wagmi';
import { Button } from '@/components/ui';
import { formatEther, parseEther } from 'viem';

interface FundStepProps {
  onNext: () => void;
  onBack: () => void;
}

const REQUIRED_ETH = parseEther('0.02');
const REQUIRED_USDC = 5; // $5 USDC for initial operations

export function FundStep({ onNext, onBack }: FundStepProps) {
  const { address } = useAccount();
  const { data: balance, isLoading } = useBalance({
    address,
  });

  const hasEnoughETH = balance && balance.value >= REQUIRED_ETH;
  // TODO: Add USDC balance check
  const hasEnoughUSDC = true; // Placeholder

  const canProceed = hasEnoughETH && hasEnoughUSDC;

  const getShortfall = () => {
    if (!balance) return formatEther(REQUIRED_ETH);
    const shortfall = REQUIRED_ETH - balance.value;
    return formatEther(shortfall > BigInt(0) ? shortfall : BigInt(0));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Fund Your Agent
        </h2>
        <p className="text-text-secondary">
          Initial funding required to deploy and operate
        </p>
      </div>

      {/* Requirements */}
      <div className="bg-bg-tertiary rounded-lg p-6 border border-border space-y-4">
        <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide">
          Required Funds
        </h3>

        {/* ETH Requirement */}
        <div className="flex items-center justify-between py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#627EEA]/20 flex items-center justify-center">
              <span className="text-sm">⟠</span>
            </div>
            <div>
              <p className="text-text-primary font-medium">0.02 ETH</p>
              <p className="text-xs text-text-muted">Token deployment via Clanker</p>
            </div>
          </div>
          <div className="text-right">
            {isLoading ? (
              <span className="text-text-muted">Loading...</span>
            ) : hasEnoughETH ? (
              <span className="flex items-center gap-1.5 text-accent text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Sufficient
              </span>
            ) : (
              <span className="text-error text-sm">
                Need {getShortfall()} more
              </span>
            )}
          </div>
        </div>

        {/* USDC Requirement */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#2775CA]/20 flex items-center justify-center">
              <span className="text-sm">$</span>
            </div>
            <div>
              <p className="text-text-primary font-medium">$5 USDC</p>
              <p className="text-xs text-text-muted">Initial operating budget</p>
            </div>
          </div>
          <div className="text-right">
            {hasEnoughUSDC ? (
              <span className="flex items-center gap-1.5 text-accent text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Sufficient
              </span>
            ) : (
              <span className="text-error text-sm">Need $5 USDC</span>
            )}
          </div>
        </div>
      </div>

      {/* Current Balance */}
      <div className="bg-bg-secondary rounded-lg p-4 border border-border">
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Your Balance</span>
          <span className="font-mono text-text-primary">
            {isLoading ? '...' : balance ? `${parseFloat(formatEther(balance.value)).toFixed(4)} ETH` : '0 ETH'}
          </span>
        </div>
      </div>

      {/* Info box */}
      {!canProceed && (
        <div className="bg-warning/5 rounded-lg p-4 border border-warning/20">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
            <div className="text-sm">
              <p className="text-text-primary font-medium mb-1">Insufficient Balance</p>
              <p className="text-text-secondary">
                Send funds to your connected wallet on Base network to continue.
                Bridge from Ethereum via <a href="https://bridge.base.org" target="_blank" rel="noopener" className="text-accent-alt hover:underline">Base Bridge</a>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* What happens next */}
      <div className="bg-accent/5 rounded-lg p-4 border border-accent/20">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <div className="text-sm">
            <p className="text-text-primary font-medium mb-1">What happens next?</p>
            <ul className="text-text-secondary space-y-1">
              <li>• ETH is used to deploy your agent's token via Clanker</li>
              <li>• USDC funds the agent's initial operations</li>
              <li>• Your agent gets its own wallet on Base</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="ghost" onClick={onBack}>
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Button>
        <Button size="lg" onClick={onNext} disabled={!canProceed} className="min-w-[140px]">
          Deploy Agent
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
