'use client';

import { useState, useMemo } from 'react';
import { AgentCard, type Agent } from '@/components/agents';
import { Input } from '@/components/ui';
import { mockAgents, categories, sortOptions } from '@/lib/mockAgents';

type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'most-active' | 'highest-volume' | 'price-change';

export default function AgentsPage() {
  const [view, setView] = useState<ViewMode>('grid');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<SortOption>('most-active');

  const filteredAgents = useMemo(() => {
    let result = [...mockAgents];
    
    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        agent =>
          agent.name.toLowerCase().includes(searchLower) ||
          agent.ticker.toLowerCase().includes(searchLower) ||
          agent.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by category
    if (category !== 'all') {
      result = result.filter(agent => agent.category === category);
    }
    
    // Sort
    switch (sort) {
      case 'newest':
        // Mock: reverse order (assuming lower index = older)
        result.reverse();
        break;
      case 'most-active':
        result.sort((a, b) => b.cycleCount - a.cycleCount);
        break;
      case 'highest-volume':
        result.sort((a, b) => b.tokenPrice * b.walletBalance - a.tokenPrice * a.walletBalance);
        break;
      case 'price-change':
        result.sort((a, b) => b.priceChange24h - a.priceChange24h);
        break;
    }
    
    return result;
  }, [search, category, sort]);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Agent Directory</h1>
          <p className="text-text-secondary">
            Discover {mockAgents.length} autonomous agents on SPAWN
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1">
            <Input
              placeholder="Search agents by name, ticker, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Category Filter */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 bg-bg-tertiary text-text-primary border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            
            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="px-3 py-2 bg-bg-tertiary text-text-primary border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            
            {/* View Toggle */}
            <div className="flex rounded-md border border-border overflow-hidden">
              <button
                onClick={() => setView('grid')}
                className={`px-3 py-2 text-sm transition-colors ${
                  view === 'grid'
                    ? 'bg-accent text-bg-primary'
                    : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
                }`}
                aria-label="Grid view"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-3 py-2 text-sm transition-colors ${
                  view === 'list'
                    ? 'bg-accent text-bg-primary'
                    : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
                }`}
                aria-label="List view"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Results Count */}
        <div className="text-sm text-text-muted mb-4">
          Showing {filteredAgents.length} of {mockAgents.length} agents
        </div>
        
        {/* Agent Grid/List */}
        {filteredAgents.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">No agents found</h3>
            <p className="text-text-secondary">
              Try adjusting your search or filters
            </p>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAgents.map(agent => (
              <AgentCard key={agent.id} agent={agent} view="grid" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredAgents.map(agent => (
              <AgentCard key={agent.id} agent={agent} view="list" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
