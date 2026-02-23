/**
 * $SPAWN Frontend API Types
 * 
 * Central type definitions for the SPAWN platform.
 * These types match the expected backend API responses.
 */

// Agent status enum
export type AgentStatus = 'active' | 'idle' | 'offline';

// Heartbeat status enum
export type HeartbeatStatus = 'success' | 'no_action' | 'error';

// Heartbeat event type (for chat display)
export type HeartbeatEventType = 'cycle_start' | 'cycle_end' | 'action';

// Agent category
export type AgentCategory = 
  | 'trading' 
  | 'research' 
  | 'analytics' 
  | 'social' 
  | 'defi' 
  | 'nft';

// Core Agent type
export interface Agent {
  id: string;
  name: string;
  ticker: string;
  avatar: string;
  description: string;
  tokenPrice: number;
  priceChange24h: number;
  cycleCount: number;
  walletBalance: number;
  walletAddress?: string;
  status: AgentStatus;
  category: AgentCategory;
  spawnDate?: string;
  deployerAddress?: string;
  tokenAddress?: string;
  repoUrl?: string;
  streak?: number;
  holdersCount?: number;
}

// Heartbeat (cycle action)
export interface Heartbeat {
  id: string;
  cycleNumber: number;
  timestamp: Date | string;
  action: string;
  status: HeartbeatStatus;
}

// Skill type
export interface Skill {
  id: string;
  name: string;
  icon: string;
  description?: string;
  tools?: string[];
  installs?: number;
  author?: string;
  version?: string;
  category?: string;
}

// API Response wrappers
export interface ApiResponse<T> {
  data: T;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

// Agent filter/sort options
export interface AgentFilters {
  category?: AgentCategory | 'all';
  status?: AgentStatus | 'all';
  search?: string;
}

export interface AgentSort {
  field: 'newest' | 'most-active' | 'highest-volume' | 'price-change';
  direction?: 'asc' | 'desc';
}

// Chat message types
export type ChatMessageType = 'user' | 'agent' | 'system' | 'heartbeat';

// Message delivery status
export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'error';

export interface ChatMessage {
  id: string;
  type: ChatMessageType;
  content: string;
  timestamp: Date | string;
  cycleNumber?: number;
  status?: MessageStatus; // For user messages: delivery status
  // Heartbeat-specific fields
  heartbeatType?: HeartbeatEventType; // For heartbeat messages
  heartbeatStatus?: HeartbeatStatus; // For heartbeat messages
}

// Wallet info
export interface WalletInfo {
  address: string;
  balance: number; // ETH
  chain: 'base';
}

// Spawn request/response
export interface SpawnRequest {
  name: string;
  ticker: string;
  description: string;
  personality: string;
  avatar?: string;
  deployerAddress: string;
  githubUsername: string;
}

export interface SpawnResponse {
  agent: Agent;
  repoUrl: string;
  tokenAddress: string;
  txHash: string;
}

// Category and sort option types for UI
export interface CategoryOption {
  value: AgentCategory | 'all';
  label: string;
}

export interface SortOption {
  value: AgentSort['field'];
  label: string;
}
