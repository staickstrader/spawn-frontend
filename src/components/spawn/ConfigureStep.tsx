'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';

export interface AgentConfig {
  name: string;
  ticker: string;
  description: string;
  personality: string;
}

interface ConfigureStepProps {
  config: AgentConfig;
  onChange: (config: AgentConfig) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ConfigureStep({ config, onChange, onNext, onBack }: ConfigureStepProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof AgentConfig, string>>>({});

  const validateField = (field: keyof AgentConfig, value: string): string | null => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.length < 3) return 'Name must be at least 3 characters';
        if (value.length > 32) return 'Name must be 32 characters or less';
        if (!/^[a-zA-Z0-9_-]+$/.test(value)) return 'Only letters, numbers, - and _ allowed';
        return null;
      case 'ticker':
        if (!value.trim()) return 'Ticker is required';
        if (!/^\$?[A-Z]{2,8}$/.test(value.toUpperCase())) return 'Ticker must be 2-8 uppercase letters';
        return null;
      case 'description':
        if (!value.trim()) return 'Description is required';
        if (value.length < 10) return 'Description too short';
        if (value.length > 160) return 'Description must be 160 characters or less';
        return null;
      case 'personality':
        if (!value.trim()) return 'Personality is required';
        if (value.length < 50) return 'Personality needs more detail (50+ chars)';
        return null;
      default:
        return null;
    }
  };

  const handleChange = (field: keyof AgentConfig, value: string) => {
    onChange({ ...config, [field]: value });
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error || undefined }));
  };

  const validateAll = (): boolean => {
    const newErrors: Partial<Record<keyof AgentConfig, string>> = {};
    let valid = true;
    
    (Object.keys(config) as Array<keyof AgentConfig>).forEach(field => {
      const error = validateField(field, config[field]);
      if (error) {
        newErrors[field] = error;
        valid = false;
      }
    });
    
    setErrors(newErrors);
    return valid;
  };

  const handleNext = () => {
    if (validateAll()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Configure Your Agent
        </h2>
        <p className="text-text-secondary">
          Define your agent's identity and personality
        </p>
      </div>

      <div className="space-y-5">
        {/* Agent Name */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Agent Name
          </label>
          <Input
            value={config.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., TradingBot, ResearchAgent"
            error={errors.name}
          />
          <p className="mt-1.5 text-xs text-text-muted">
            This becomes the GitHub repo name and on-chain identity
          </p>
        </div>

        {/* Token Ticker */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Token Ticker
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">$</span>
            <Input
              value={config.ticker.replace('$', '')}
              onChange={(e) => handleChange('ticker', e.target.value.toUpperCase())}
              placeholder="TICKER"
              className="pl-7 uppercase"
              maxLength={8}
              error={errors.ticker}
            />
          </div>
          <p className="mt-1.5 text-xs text-text-muted">
            2-8 uppercase letters for your agent's token
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Description
          </label>
          <Input
            value={config.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Brief description of what your agent does..."
            error={errors.description}
          />
          <div className="flex justify-between mt-1.5">
            <p className="text-xs text-text-muted">Shown on agent profile</p>
            <span className={`text-xs ${config.description.length > 160 ? 'text-error' : 'text-text-muted'}`}>
              {config.description.length}/160
            </span>
          </div>
        </div>

        {/* Personality */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Personality & Behavior
          </label>
          <textarea
            value={config.personality}
            onChange={(e) => handleChange('personality', e.target.value)}
            placeholder="Describe how your agent should behave, communicate, and make decisions. Be specific about tone, expertise areas, and any rules it should follow..."
            rows={5}
            className={`
              w-full px-3 py-2 rounded-md font-mono text-sm
              bg-bg-tertiary text-text-primary border
              placeholder:text-text-muted
              focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
              transition-all duration-200
              ${errors.personality ? 'border-error' : 'border-border'}
            `}
          />
          {errors.personality && (
            <p className="mt-1.5 text-xs text-error">{errors.personality}</p>
          )}
          <p className="mt-1.5 text-xs text-text-muted">
            This shapes your agent's SOUL.md — you can refine it later via chat
          </p>
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
        <Button size="lg" onClick={handleNext} className="min-w-[140px]">
          Continue
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
