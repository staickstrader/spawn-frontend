'use client';

interface SpawnStepperProps {
  currentStep: number;
  steps: string[];
}

export function SpawnStepper({ currentStep, steps }: SpawnStepperProps) {
  return (
    <div className="w-full">
      {/* Desktop stepper */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <div key={step} className="flex-1 flex items-center">
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    font-mono text-sm font-medium transition-all duration-200
                    ${isCompleted 
                      ? 'bg-accent text-bg-primary' 
                      : isActive 
                        ? 'bg-accent/20 text-accent border-2 border-accent' 
                        : 'bg-bg-tertiary text-text-muted border border-border'
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>
                <span
                  className={`
                    mt-2 text-xs font-medium whitespace-nowrap
                    ${isActive ? 'text-text-primary' : 'text-text-muted'}
                  `}
                >
                  {step}
                </span>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-4 transition-all duration-200
                    ${isCompleted ? 'bg-accent' : 'bg-border'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile stepper */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-primary">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-sm text-text-secondary">
            {steps[currentStep - 1]}
          </span>
        </div>
        <div className="w-full bg-bg-tertiary rounded-full h-2">
          <div
            className="bg-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
