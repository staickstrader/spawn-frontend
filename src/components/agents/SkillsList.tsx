'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import type { Skill } from '@/lib/types';

// Re-export for convenience
export type { Skill };

interface SkillsListProps {
  skills: Skill[];
  isLoading?: boolean;
}

function SkillsSkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      {[...Array(3)].map((_, i) => (
        <div 
          key={i} 
          className="h-6 w-24 bg-bg-tertiary rounded animate-pulse" 
        />
      ))}
    </div>
  );
}

export function SkillsList({ skills, isLoading = false }: SkillsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SkillsSkeleton />
        ) : skills.length === 0 ? (
          <p className="text-text-muted text-sm text-center py-2">
            No skills installed.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill.id} variant="outline">
                <span className="mr-1">{skill.icon}</span>
                {skill.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
