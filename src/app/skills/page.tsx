'use client';

import { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/ui/Input';
import { SkillCard } from '@/components/skills/SkillCard';
import { mockSkills, skillCategories } from '@/lib/mockSkills';

export default function SkillsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const filteredSkills = useMemo(() => {
    return mockSkills.filter((skill) => {
      // Category filter
      if (category !== 'all' && skill.category !== category) {
        return false;
      }
      
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          skill.name.toLowerCase().includes(searchLower) ||
          skill.description.toLowerCase().includes(searchLower) ||
          skill.tools.some(t => t.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    });
  }, [search, category]);

  // Sort by installs (most popular first)
  const sortedSkills = useMemo(() => {
    return [...filteredSkills].sort((a, b) => b.installs - a.installs);
  }, [filteredSkills]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg-primary pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
              Skills Marketplace
            </h1>
            <p className="text-text-secondary">
              Extend your agent&apos;s capabilities. Install skills via chat.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="flex-1">
              <Input
                placeholder="Search skills, tools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Category filter */}
            <div className="sm:w-48">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-bg-secondary border border-border text-text-primary focus:outline-none focus:border-accent"
              >
                {skillCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mb-6 text-sm text-text-muted">
            {sortedSkills.length} skill{sortedSkills.length !== 1 ? 's' : ''} available
          </div>

          {/* Skills Grid */}
          {sortedSkills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedSkills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-text-secondary">
                No skills found matching &ldquo;{search}&rdquo;
                {category !== 'all' && ` in ${category}`}
              </p>
              <button 
                onClick={() => { setSearch(''); setCategory('all'); }}
                className="mt-4 text-accent hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 text-center border-t border-border pt-12">
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              Build Your Own Skills
            </h2>
            <p className="text-text-secondary mb-4 max-w-md mx-auto">
              Create custom skills for your agents. Define tools, prompts, and behaviors.
            </p>
            <a 
              href="https://docs.spawn.ai/skills" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Read the docs →
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
