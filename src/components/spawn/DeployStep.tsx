'use client';

import { useEffect, useState } from 'react';
import type { AgentConfig } from './ConfigureStep';

interface DeployStepProps {
  config: AgentConfig;
  onComplete: (agentId: string) => void;
  onError: (error: string) => void;
}

type DeployStage = 
  | 'github' 
  | 'token' 
  | 'registry' 
  | 'agent' 
  | 'complete';

interface StageInfo {
  id: DeployStage;
  label: string;
  description: string;
}

const stages: StageInfo[] = [
  { id: 'github', label: 'Creating Repository', description: 'Setting up GitHub repo with agent code...' },
  { id: 'token', label: 'Deploying Token', description: 'Deploying token via Clanker protocol...' },
  { id: 'registry', label: 'Registering On-Chain', description: 'Recording agent in SPAWN registry...' },
  { id: 'agent', label: 'Initializing Agent', description: 'Starting first heartbeat cycle...' },
  { id: 'complete', label: 'Complete', description: 'Agent is live!' },
];

export function DeployStep({ config, onComplete, onError }: DeployStepProps) {
  const [currentStage, setCurrentStage] = useState<DeployStage>('github');
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  useEffect(() => {
    // Simulate deployment process
    // TODO: Replace with actual API calls
    const deployAgent = async () => {
      try {
        // Stage 1: GitHub
        addLog(`Creating repository: ${config.name}...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        addLog('✓ Repository created');
        setCurrentStage('token');

        // Stage 2: Token
        addLog(`Deploying $${config.ticker} token...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        addLog('✓ Token deployed at 0x1234...abcd');
        setCurrentStage('registry');

        // Stage 3: Registry
        addLog('Registering in SPAWN registry...');
        await new Promise(resolve => setTimeout(resolve, 1500));
        addLog('✓ Agent registered');
        setCurrentStage('agent');

        // Stage 4: Agent init
        addLog('Initializing agent wallet...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        addLog('✓ Agent wallet: 0x5678...efgh');
        addLog('Starting first heartbeat...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog('✓ Agent is alive!');
        setCurrentStage('complete');

        // Delay before completing
        await new Promise(resolve => setTimeout(resolve, 500));
        onComplete('mock-agent-id-' + config.name.toLowerCase());

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        addLog(`✗ Error: ${errorMessage}`);
        onError(errorMessage);
      }
    };

    deployAgent();
  }, [config, onComplete, onError]);

  const currentStageIndex = stages.findIndex(s => s.id === currentStage);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Deploying {config.name}
        </h2>
        <p className="text-text-secondary">
          {error ? 'Deployment failed' : 'Please wait while we set up your agent...'}
        </p>
      </div>

      {/* Progress stages */}
      <div className="space-y-3">
        {stages.slice(0, -1).map((stage, index) => {
          const isActive = stage.id === currentStage;
          const isComplete = index < currentStageIndex;
          const isPending = index > currentStageIndex;

          return (
            <div
              key={stage.id}
              className={`
                flex items-center gap-4 p-4 rounded-lg border transition-all duration-300
                ${isActive ? 'bg-accent/10 border-accent' : 'bg-bg-tertiary border-border'}
                ${error && isActive ? 'bg-error/10 border-error' : ''}
              `}
            >
              {/* Status icon */}
              <div className="flex-shrink-0">
                {isComplete ? (
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                    <svg className="w-5 h-5 text-bg-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : isActive ? (
                  error ? (
                    <div className="w-8 h-8 rounded-full bg-error flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-accent animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    </div>
                  )
                ) : (
                  <div className="w-8 h-8 rounded-full bg-bg-secondary border border-border flex items-center justify-center">
                    <span className="text-sm text-text-muted">{index + 1}</span>
                  </div>
                )}
              </div>

              {/* Stage info */}
              <div className="flex-1">
                <p className={`font-medium ${isPending ? 'text-text-muted' : 'text-text-primary'}`}>
                  {stage.label}
                </p>
                {isActive && (
                  <p className="text-sm text-text-secondary mt-0.5">
                    {error || stage.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Terminal log */}
      <div className="bg-bg-primary rounded-lg border border-border overflow-hidden">
        <div className="px-3 py-2 bg-bg-tertiary border-b border-border flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-error/50" />
          <div className="w-3 h-3 rounded-full bg-warning/50" />
          <div className="w-3 h-3 rounded-full bg-accent/50" />
          <span className="text-xs text-text-muted ml-2 font-mono">deploy.log</span>
        </div>
        <div className="p-3 h-40 overflow-y-auto font-mono text-xs text-text-secondary">
          {logs.map((log, i) => (
            <div key={i} className="mb-1">
              {log}
            </div>
          ))}
          {!error && currentStage !== 'complete' && (
            <span className="inline-block w-2 h-4 bg-accent animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
}
