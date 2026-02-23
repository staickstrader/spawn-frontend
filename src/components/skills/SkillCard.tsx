'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { SkillDetail } from '@/lib/mockSkills';

interface SkillCardProps {
  skill: SkillDetail;
}

export function SkillCard({ skill }: SkillCardProps) {
  const [expanded, setExpanded] = useState(false);

  const categoryColors: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
    trading: 'success',
    analytics: 'info',
    research: 'info',
    social: 'warning',
    defi: 'success',
    nft: 'warning',
    automation: 'default',
  };

  return (
    <Card 
      hover 
      padding="lg" 
      className="flex flex-col"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="text-4xl">{skill.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-semibold text-text-primary">{skill.name}</h3>
            <Badge variant={categoryColors[skill.category] || 'default'} size="sm">
              {skill.category}
            </Badge>
          </div>
          <p className="text-sm text-text-secondary mt-1 line-clamp-2">
            {skill.description}
          </p>
        </div>
      </div>

      {/* Tools preview */}
      <div className="mt-4 flex flex-wrap gap-2">
        {skill.tools.slice(0, expanded ? skill.tools.length : 3).map((tool) => (
          <code 
            key={tool} 
            className="text-xs bg-bg-tertiary px-2 py-1 rounded font-mono text-text-muted"
          >
            {tool}
          </code>
        ))}
        {!expanded && skill.tools.length > 3 && (
          <span className="text-xs text-text-muted">+{skill.tools.length - 3} more</span>
        )}
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-border space-y-3 animate-in fade-in duration-200">
          {/* Full description */}
          <p className="text-sm text-text-secondary">{skill.description}</p>
          
          {/* Meta info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-muted">Author:</span>
              <span className="ml-2 text-text-primary font-mono">{skill.author}</span>
            </div>
            <div>
              <span className="text-text-muted">Version:</span>
              <span className="ml-2 text-text-primary font-mono">v{skill.version}</span>
            </div>
          </div>

          {/* Install instruction */}
          <div className="bg-bg-tertiary rounded-lg p-3">
            <p className="text-xs text-text-muted mb-1">Install via chat:</p>
            <code className="text-sm font-mono text-accent">
              install skill {skill.id}
            </code>
          </div>
        </div>
      )}

      {/* Footer stats */}
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm text-text-muted">
          <span>📥</span>
          <span>{skill.installs.toLocaleString()} installs</span>
        </div>
        <button 
          className="text-sm text-accent hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {expanded ? 'Less' : 'Details'}
        </button>
      </div>
    </Card>
  );
}
