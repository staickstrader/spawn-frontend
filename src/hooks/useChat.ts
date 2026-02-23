/**
 * $SPAWN Chat Hook
 * 
 * Real-time chat functionality using WebSocket.
 * Handles message state, connection status, and sending messages.
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { SpawnWebSocket, ConnectionState, WebSocketMessage, getWebSocketUrl } from '@/lib/websocket';
import { ChatMessage, MessageStatus, HeartbeatEventType, HeartbeatStatus } from '@/lib/types';

interface UseChatOptions {
  agentId: string;
  initialMessages?: ChatMessage[];
  onAgentMessage?: (message: ChatMessage) => void;
  onHeartbeat?: (message: ChatMessage) => void;
}

interface UseChatReturn {
  messages: ChatMessage[];
  sendMessage: (content: string) => void;
  connectionState: ConnectionState;
  isConnected: boolean;
  reconnect: () => void;
}

// Generate unique message IDs
function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function useChat({
  agentId,
  initialMessages = [],
  onAgentMessage,
  onHeartbeat,
}: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const wsRef = useRef<SpawnWebSocket | null>(null);

  // Handle incoming WebSocket messages
  const handleMessage = useCallback((wsMessage: WebSocketMessage) => {
    let chatMessage: ChatMessage | null = null;

    switch (wsMessage.type) {
      case 'chat':
        // Agent response
        const chatPayload = wsMessage.payload as { content: string; timestamp?: string };
        chatMessage = {
          id: generateMessageId(),
          type: 'agent',
          content: chatPayload.content,
          timestamp: chatPayload.timestamp || new Date().toISOString(),
        };
        onAgentMessage?.(chatMessage);
        break;

      case 'heartbeat':
        // Heartbeat event (cycle start/end)
        const hbPayload = wsMessage.payload as {
          event: 'start' | 'end';
          cycleNumber: number;
          action?: string;
          status?: HeartbeatStatus;
        };
        chatMessage = {
          id: generateMessageId(),
          type: 'heartbeat',
          content: hbPayload.event === 'start' 
            ? 'Agent woke up' 
            : hbPayload.action || 'Cycle completed',
          timestamp: wsMessage.timestamp || new Date().toISOString(),
          cycleNumber: hbPayload.cycleNumber,
          heartbeatType: hbPayload.event === 'start' ? 'cycle_start' : 'cycle_end',
          heartbeatStatus: hbPayload.status || 'success',
        };
        onHeartbeat?.(chatMessage);
        break;

      case 'system':
        // System messages (connection events, errors, etc.)
        const sysPayload = wsMessage.payload as { message: string; level?: string };
        chatMessage = {
          id: generateMessageId(),
          type: 'system',
          content: sysPayload.message,
          timestamp: wsMessage.timestamp || new Date().toISOString(),
        };
        break;

      default:
        console.log('[useChat] Unknown message type:', wsMessage.type);
        return;
    }

    if (chatMessage) {
      setMessages((prev) => [...prev, chatMessage]);
    }
  }, [onAgentMessage, onHeartbeat]);

  // Handle connection state changes
  const handleStateChange = useCallback((state: ConnectionState) => {
    setConnectionState(state);

    // Add system message for connection events
    if (state === 'connected') {
      setMessages((prev) => [
        ...prev,
        {
          id: generateMessageId(),
          type: 'system',
          content: 'Connected to agent',
          timestamp: new Date().toISOString(),
        },
      ]);
    } else if (state === 'disconnected') {
      setMessages((prev) => [
        ...prev,
        {
          id: generateMessageId(),
          type: 'system',
          content: 'Disconnected from agent',
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, []);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!agentId) return;

    const ws = new SpawnWebSocket({
      url: getWebSocketUrl(),
      agentId,
      onMessage: handleMessage,
      onStateChange: handleStateChange,
    });

    wsRef.current = ws;
    ws.connect();

    return () => {
      ws.disconnect();
      wsRef.current = null;
    };
  }, [agentId, handleMessage, handleStateChange]);

  // Send a user message
  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return;

    const messageId = generateMessageId();

    // Immediately add user message to UI (optimistic update) with pending status
    const userMessage: ChatMessage = {
      id: messageId,
      type: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
      status: 'pending',
    };
    setMessages((prev) => [...prev, userMessage]);

    // Send via WebSocket
    const sent = wsRef.current?.sendChatMessage(content.trim());
    
    // Update message status based on send result
    setTimeout(() => {
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === messageId 
            ? { ...msg, status: sent ? 'sent' : 'error' } 
            : msg
        )
      );
    }, 150);

    if (!sent) {
      // If not sent (disconnected), add a system message
      setMessages((prev) => [
        ...prev,
        {
          id: generateMessageId(),
          type: 'system',
          content: 'Message queued - waiting for connection',
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, []);

  // Manual reconnect
  const reconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.disconnect();
      wsRef.current.connect();
    }
  }, []);

  return {
    messages,
    sendMessage,
    connectionState,
    isConnected: connectionState === 'connected',
    reconnect,
  };
}

/**
 * Mock version of useChat for development without backend
 * Uses simulated responses instead of real WebSocket
 */
export function useChatMock({
  agentId,
  initialMessages = [],
}: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [connectionState, setConnectionState] = useState<ConnectionState>('connected');
  const cycleNumberRef = useRef(143); // Start from next cycle after mock data

  // Simulate connection on mount
  useEffect(() => {
    setConnectionState('connecting');
    const timer = setTimeout(() => {
      setConnectionState('connected');
    }, 500);
    return () => clearTimeout(timer);
  }, [agentId]);

  // Simulate periodic heartbeat events (every 60 seconds for demo)
  useEffect(() => {
    const heartbeatInterval = setInterval(() => {
      const cycleNum = cycleNumberRef.current++;
      
      // Cycle start
      setMessages((prev) => [
        ...prev,
        {
          id: generateMessageId(),
          type: 'heartbeat',
          content: 'Agent woke up',
          timestamp: new Date().toISOString(),
          cycleNumber: cycleNum,
          heartbeatType: 'cycle_start' as HeartbeatEventType,
          heartbeatStatus: 'success' as HeartbeatStatus,
        },
      ]);

      // Simulate agent activity + cycle end after a short delay
      setTimeout(() => {
        const actions = [
          'Checked token prices. No significant changes.',
          'Analyzed $PEPE momentum. Holding position.',
          'Scanned for new opportunities. Nothing actionable.',
          'Monitoring watchlist. All quiet.',
        ];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        const status: HeartbeatStatus = Math.random() > 0.3 ? 'no_action' : 'success';

        setMessages((prev) => [
          ...prev,
          {
            id: generateMessageId(),
            type: 'heartbeat',
            content: randomAction,
            timestamp: new Date().toISOString(),
            cycleNumber: cycleNum,
            heartbeatType: 'cycle_end' as HeartbeatEventType,
            heartbeatStatus: status,
          },
        ]);
      }, 3000);
    }, 60000); // Every 60 seconds

    return () => clearInterval(heartbeatInterval);
  }, []);

  // Send message with simulated agent response
  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return;

    const messageId = generateMessageId();

    // Add user message with pending status
    const userMessage: ChatMessage = {
      id: messageId,
      type: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
      status: 'pending',
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate send confirmation
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, status: 'sent' as MessageStatus } : msg
        )
      );
    }, 200);

    // Simulate delivered status
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, status: 'delivered' as MessageStatus } : msg
        )
      );
    }, 500);

    // Simulate agent thinking and response
    setTimeout(() => {
      const responses = [
        'Acknowledged. Processing your request and will update behavior accordingly.',
        'Got it. Changes will apply on the next cycle.',
        'Understood. I\'ll adjust my strategy based on your input.',
        'Roger that. Updating my parameters now.',
        'Copy. Will implement changes and report back.',
        'Here\'s the current status:\n```\nPosition: $PEPE\nEntry: 0.00001234\nCurrent: 0.00001567 (+27%)\nStatus: Holding\n```\nLet me know if you want to adjust.',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const agentMessage: ChatMessage = {
        id: generateMessageId(),
        type: 'agent',
        content: randomResponse,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, agentMessage]);
    }, 800 + Math.random() * 700);
  }, []);

  const reconnect = useCallback(() => {
    setConnectionState('reconnecting');
    setTimeout(() => setConnectionState('connected'), 1000);
  }, []);

  return {
    messages,
    sendMessage,
    connectionState,
    isConnected: connectionState === 'connected',
    reconnect,
  };
}
