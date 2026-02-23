'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui';
import {
  SpawnStepper,
  ConnectStep,
  ConfigureStep,
  FundStep,
  DeployStep,
  SuccessStep,
} from '@/components/spawn';
import type { AgentConfig } from '@/components/spawn/ConfigureStep';

const STEPS = ['Connect', 'Configure', 'Fund', 'Deploy', 'Success'];

export default function SpawnWizard() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const [currentStep, setCurrentStep] = useState(1);
  const [githubConnected, setGithubConnected] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [config, setConfig] = useState<AgentConfig>({
    name: '',
    ticker: '',
    description: '',
    personality: '',
  });

  const goToStep = (step: number) => {
    if (step >= 1 && step <= STEPS.length) {
      setCurrentStep(step);
    }
  };

  const handleDeployComplete = (id: string) => {
    setAgentId(id);
    setCurrentStep(5);
  };

  const handleDeployError = (error: string) => {
    setDeployError(error);
    // Stay on deploy step to show error
  };

  return (
    <>
      {/* Stepper */}
      <div className="max-w-3xl mx-auto mb-8">
        <SpawnStepper currentStep={currentStep} steps={STEPS} />
      </div>

      {/* Step content */}
      <Card className="max-w-2xl mx-auto" padding="lg">
        {currentStep === 1 && (
          <ConnectStep
            onNext={() => goToStep(2)}
            githubConnected={githubConnected}
            onGitHubConnect={() => setGithubConnected(true)}
          />
        )}

        {currentStep === 2 && (
          <ConfigureStep
            config={config}
            onChange={setConfig}
            onNext={() => goToStep(3)}
            onBack={() => goToStep(1)}
          />
        )}

        {currentStep === 3 && (
          <FundStep
            onNext={() => goToStep(4)}
            onBack={() => goToStep(2)}
          />
        )}

        {currentStep === 4 && (
          <DeployStep
            config={config}
            onComplete={handleDeployComplete}
            onError={handleDeployError}
          />
        )}

        {currentStep === 5 && agentId && (
          <SuccessStep
            agentId={agentId}
            config={config}
          />
        )}
      </Card>
    </>
  );
}
