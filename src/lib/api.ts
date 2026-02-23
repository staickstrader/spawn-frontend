/**
 * $SPAWN API Client
 * 
 * Handles all API communication with the SPAWN backend.
 * Currently uses mock data, ready for real backend integration.
 * 
 * Expected Backend Endpoints:
 * - GET  /api/agents          - List all agents
 * - GET  /api/agents/:id      - Get single agent
 * - GET  /api/agents/:id/heartbeats - Get agent heartbeats
 * - GET  /api/agents/:id/wallet - Get agent wallet info
 * - GET  /api/skills          - List all skills
 * - POST /api/agents          - Spawn new agent
 * - WS   /api/chat/:agentId   - Chat WebSocket
 */

import type { 
  Agent, 
  Heartbeat, 
  Skill,
  AgentFilters,
  AgentSort,
  PaginatedResponse,
  WalletInfo,
  SpawnRequest,
  SpawnResponse
} from './types';
import { mockAgents } from './mockAgents';
import { generateMockHeartbeats, getSkillsForAgent } from './mockHeartbeats';
import { mockSkills } from './mockSkills';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const USE_MOCK = !API_BASE_URL || process.env.NEXT_PUBLIC_USE_MOCK === 'true';

// Simulated network delay for mock data
const MOCK_DELAY = 300;

async function mockDelay(): Promise<void> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  }
}

/**
 * API Error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Fetch wrapper with error handling
 */
async function fetchApi<T>(
  endpoint: string, 
  options?: RequestInit
): Promise<T> {
  if (USE_MOCK) {
    throw new Error('Mock mode - use specific mock functions');
  }

  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      error.message || 'API request failed',
      response.status,
      error.code
    );
  }

  return response.json();
}

// ============================================
// Agent API
// ============================================

/**
 * Get all agents with optional filtering and sorting
 */
export async function getAgents(
  filters?: AgentFilters,
  sort?: AgentSort
): Promise<Agent[]> {
  await mockDelay();

  if (USE_MOCK) {
    let agents = [...mockAgents];

    // Apply filters
    if (filters?.category && filters.category !== 'all') {
      agents = agents.filter(a => a.category === filters.category);
    }
    if (filters?.status && filters.status !== 'all') {
      agents = agents.filter(a => a.status === filters.status);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      agents = agents.filter(
        a => 
          a.name.toLowerCase().includes(search) ||
          a.ticker.toLowerCase().includes(search) ||
          a.description.toLowerCase().includes(search)
      );
    }

    // Apply sorting
    if (sort?.field) {
      agents.sort((a, b) => {
        switch (sort.field) {
          case 'most-active':
            return b.cycleCount - a.cycleCount;
          case 'highest-volume':
            return b.walletBalance - a.walletBalance;
          case 'price-change':
            return b.priceChange24h - a.priceChange24h;
          case 'newest':
          default:
            return 0; // Maintain original order for newest
        }
      });
    }

    return agents;
  }

  return fetchApi<Agent[]>('/api/agents', {
    method: 'GET',
  });
}

/**
 * Get a single agent by ID
 */
export async function getAgent(id: string): Promise<Agent | null> {
  await mockDelay();

  if (USE_MOCK) {
    const agent = mockAgents.find(a => a.id === id);
    if (!agent) return null;
    
    // Add extra details for single agent view
    return {
      ...agent,
      walletAddress: `0x${id.slice(0, 4)}...${id.slice(-4)}F3880cC`,
      spawnDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      deployerAddress: `0x8a2e...C355`,
      tokenAddress: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      streak: Math.floor(Math.random() * 50) + 5,
      holdersCount: Math.floor(Math.random() * 500) + 50,
    };
  }

  return fetchApi<Agent>(`/api/agents/${id}`);
}

/**
 * Get heartbeats for an agent
 */
export async function getHeartbeats(
  agentId: string,
  options?: { limit?: number; offset?: number }
): Promise<Heartbeat[]> {
  await mockDelay();

  if (USE_MOCK) {
    const agent = mockAgents.find(a => a.id === agentId);
    if (!agent) return [];
    
    const heartbeats = generateMockHeartbeats(agentId, agent.cycleCount);
    const limit = options?.limit || 10;
    const offset = options?.offset || 0;
    
    return heartbeats.slice(offset, offset + limit);
  }

  return fetchApi<Heartbeat[]>(`/api/agents/${agentId}/heartbeats`);
}

/**
 * Get wallet info for an agent
 */
export async function getWalletInfo(agentId: string): Promise<WalletInfo | null> {
  await mockDelay();

  if (USE_MOCK) {
    const agent = mockAgents.find(a => a.id === agentId);
    if (!agent) return null;

    return {
      address: `0x13F3...${agentId.slice(0, 4)}880cC`,
      balance: agent.walletBalance,
      chain: 'base',
    };
  }

  return fetchApi<WalletInfo>(`/api/agents/${agentId}/wallet`);
}

/**
 * Get skills for an agent
 */
export async function getAgentSkills(agentId: string): Promise<Skill[]> {
  await mockDelay();

  if (USE_MOCK) {
    return getSkillsForAgent(agentId);
  }

  return fetchApi<Skill[]>(`/api/agents/${agentId}/skills`);
}

// ============================================
// Skills API
// ============================================

/**
 * Get all available skills
 */
export async function getSkills(
  options?: { category?: string; search?: string }
): Promise<Skill[]> {
  await mockDelay();

  if (USE_MOCK) {
    let skills = [...mockSkills];

    if (options?.category && options.category !== 'all') {
      skills = skills.filter(s => s.category === options.category);
    }

    if (options?.search) {
      const search = options.search.toLowerCase();
      skills = skills.filter(
        s =>
          s.name.toLowerCase().includes(search) ||
          s.description?.toLowerCase().includes(search) ||
          s.tools?.some(t => t.toLowerCase().includes(search))
      );
    }

    return skills;
  }

  return fetchApi<Skill[]>('/api/skills');
}

/**
 * Get a single skill by ID
 */
export async function getSkill(id: string): Promise<Skill | null> {
  await mockDelay();

  if (USE_MOCK) {
    return mockSkills.find(s => s.id === id) || null;
  }

  return fetchApi<Skill>(`/api/skills/${id}`);
}

// ============================================
// Spawn API
// ============================================

/**
 * Spawn a new agent
 */
export async function spawnAgent(request: SpawnRequest): Promise<SpawnResponse> {
  if (USE_MOCK) {
    throw new ApiError('Spawn not available in mock mode', 501);
  }

  return fetchApi<SpawnResponse>('/api/agents', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

// ============================================
// Utility exports
// ============================================

export { USE_MOCK, API_BASE_URL };
