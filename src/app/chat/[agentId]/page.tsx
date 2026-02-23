'use client';

import { useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ChatMessage, ChatInput, ChatSidebar, ChatHeader, ChatAccessGate } from '@/components/chat';
import { useChatMock } from '@/hooks';
import { Agent, ChatMessage as ChatMessageType, Skill, Heartbeat } from '@/lib/types';

// Mock data for initial UI development
// Using a real-looking address for testing wallet-gating
const MOCK_DEPLOYER_ADDRESS = '0x8a2ed7d5AE89Ae6a92A82B5e402045DC4372C355';

const mockAgent: Agent = {
  id: 'agent-1',
  name: 'TraderBot',
  ticker: 'TBOT',
  description: 'Autonomous trading agent focused on Base memecoin alpha.',
  avatar: '🤖',
  deployerAddress: MOCK_DEPLOYER_ADDRESS,
  status: 'active',
  cycleCount: 142,
  walletBalance: 0.0451,
  walletAddress: '0x13F3...880cC',
  tokenPrice: 0.001234,
  priceChange24h: 12.5,
  category: 'trading',
  spawnDate: '2025-02-15',
  tokenAddress: '0xabcd...ef01',
  holdersCount: 342,
  streak: 15,
};

const mockSkills: Skill[] = [
  { id: 'trading', name: 'Trading', icon: '📊', description: 'Execute swaps and trades', category: 'defi', tools: ['swap_token', 'check_price'], installs: 142 },
  { id: 'research', name: 'Research', icon: '🔬', description: 'Analyze tokens and trends', category: 'analysis', tools: ['analyze_token'], installs: 98 },
];

const mockHeartbeats: Heartbeat[] = [
  { id: 'hb-1', cycleNumber: 142, timestamp: new Date(Date.now() - 2 * 60000), action: 'Checked token prices. $PEPE up 12%. No action.', status: 'no_action' },
  { id: 'hb-2', cycleNumber: 141, timestamp: new Date(Date.now() - 32 * 60000), action: 'Swapped 0.01 ETH for $DEGEN. New position.', status: 'success' },
  { id: 'hb-3', cycleNumber: 140, timestamp: new Date(Date.now() - 62 * 60000), action: 'Updated personality per operator directive.', status: 'success' },
];

// Messages with heartbeat events interleaved
const initialMessages: ChatMessageType[] = [
  // Cycle 141 - previous cycle
  { 
    id: 'hb-141-start', 
    type: 'heartbeat', 
    content: 'Agent woke up', 
    timestamp: new Date(Date.now() - 35 * 60000), 
    cycleNumber: 141,
    heartbeatType: 'cycle_start',
    heartbeatStatus: 'success',
  },
  { 
    id: 'msg-141-1', 
    type: 'agent', 
    content: 'Scanning watchlist. Found opportunity in $DEGEN — momentum building.', 
    timestamp: new Date(Date.now() - 34 * 60000) 
  },
  { 
    id: 'hb-141-end', 
    type: 'heartbeat', 
    content: 'Swapped 0.01 ETH for $DEGEN. New position.', 
    timestamp: new Date(Date.now() - 32 * 60000), 
    cycleNumber: 141,
    heartbeatType: 'cycle_end',
    heartbeatStatus: 'success',
  },
  
  // Cycle 142 - current cycle
  { 
    id: 'hb-142-start', 
    type: 'heartbeat', 
    content: 'Agent woke up', 
    timestamp: new Date(Date.now() - 10 * 60000), 
    cycleNumber: 142,
    heartbeatType: 'cycle_start',
    heartbeatStatus: 'success',
  },
  { 
    id: 'msg-142-1', 
    type: 'agent', 
    content: 'Checked 3 tokens in watchlist. Current positions:\n```\n$PEPE    +12.3%  Holding\n$DEGEN   +0.5%   Holding\n$BRETT   -3.1%   Watching\n```\nNo action taken this cycle.', 
    timestamp: new Date(Date.now() - 9 * 60000) 
  },
  { 
    id: 'msg-142-2', 
    type: 'user', 
    content: 'be more aggressive on entries', 
    timestamp: new Date(Date.now() - 5 * 60000),
    status: 'delivered'
  },
  { 
    id: 'msg-142-3', 
    type: 'agent', 
    content: 'Got it. Updating strategy to enter earlier on momentum signals. Changes:\n\n- Entry threshold: `10%` → `5%`\n- Position size: increased 20%\n- Stop loss: tightened to `-8%`\n\nWill apply next cycle.', 
    timestamp: new Date(Date.now() - 4 * 60000) 
  },
  { 
    id: 'hb-142-end', 
    type: 'heartbeat', 
    content: 'Checked token prices. $PEPE up 12%. No action.', 
    timestamp: new Date(Date.now() - 2 * 60000), 
    cycleNumber: 142,
    heartbeatType: 'cycle_end',
    heartbeatStatus: 'no_action',
  },
];

function ChatContent() {
  const params = useParams();
  const agentId = params.agentId as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use mock chat hook for development (switch to useChat when backend ready)
  const { messages, sendMessage, connectionState, reconnect } = useChatMock({
    agentId,
    initialMessages,
  });

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with connection status */}
        <ChatHeader 
          agent={mockAgent} 
          connectionState={connectionState}
          onReconnect={reconnect}
        />

        {/* Reconnecting Banner */}
        {connectionState === 'reconnecting' && (
          <div className="bg-warning/20 border-b border-warning/30 px-4 py-2 text-center">
            <span className="text-sm text-warning">Reconnecting to agent...</span>
          </div>
        )}

        {/* Disconnected Banner */}
        {connectionState === 'disconnected' && (
          <div className="bg-error/20 border-b border-error/30 px-4 py-2 text-center">
            <span className="text-sm text-error">Connection lost. </span>
            <button 
              onClick={reconnect}
              className="text-sm text-error underline hover:no-underline"
            >
              Reconnect
            </button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput 
          onSend={sendMessage}
          disabled={connectionState === 'disconnected'}
        />
      </div>

      {/* Sidebar (Desktop) */}
      <ChatSidebar 
        agent={mockAgent} 
        skills={mockSkills}
        recentHeartbeats={mockHeartbeats}
      />
    </>
  );
}

export default function ChatPage() {
  return (
    <div className="flex h-[calc(100vh-64px)]">
      <ChatAccessGate 
        deployerAddress={MOCK_DEPLOYER_ADDRESS}
        agentName={mockAgent.name}
      >
        <ChatContent />
      </ChatAccessGate>
    </div>
  );
}
