/**
 * $SPAWN WebSocket Connection Manager
 * 
 * Handles real-time communication with the backend.
 * Features:
 * - Auto-reconnect with exponential backoff
 * - Connection state management
 * - Message queue for offline resilience
 * - Heartbeat/ping-pong to detect stale connections
 */

export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

export interface WebSocketMessage {
  type: 'chat' | 'heartbeat' | 'system' | 'ping' | 'pong';
  payload: unknown;
  timestamp?: string;
}

interface WebSocketConfig {
  url: string;
  agentId: string;
  onMessage: (message: WebSocketMessage) => void;
  onStateChange: (state: ConnectionState) => void;
  maxReconnectAttempts?: number;
  pingInterval?: number;
}

export class SpawnWebSocket {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private maxReconnectAttempts: number;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private pingInterval: number;
  private pingTimer: NodeJS.Timeout | null = null;
  private pongTimeout: NodeJS.Timeout | null = null;
  private messageQueue: WebSocketMessage[] = [];
  private state: ConnectionState = 'disconnected';
  private intentionalClose = false;

  constructor(config: WebSocketConfig) {
    this.config = config;
    this.maxReconnectAttempts = config.maxReconnectAttempts ?? 10;
    this.pingInterval = config.pingInterval ?? 30000; // 30 seconds
  }

  /**
   * Connect to WebSocket server
   */
  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.intentionalClose = false;
    this.setState('connecting');

    try {
      const url = `${this.config.url}?agentId=${this.config.agentId}`;
      this.ws = new WebSocket(url);

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error('[WS] Connection error:', error);
      this.scheduleReconnect();
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this.intentionalClose = true;
    this.cleanup();
    this.setState('disconnected');
  }

  /**
   * Send a message through WebSocket
   */
  send(message: WebSocketMessage): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
      return true;
    }

    // Queue message for later if not connected
    this.messageQueue.push(message);
    console.log('[WS] Message queued, connection not ready');
    return false;
  }

  /**
   * Send a chat message
   */
  sendChatMessage(content: string): boolean {
    return this.send({
      type: 'chat',
      payload: { content },
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Get current connection state
   */
  getState(): ConnectionState {
    return this.state;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.state === 'connected';
  }

  // Private methods

  private handleOpen(): void {
    console.log('[WS] Connected');
    this.reconnectAttempts = 0;
    this.setState('connected');
    this.startPingPong();
    this.flushMessageQueue();
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);

      // Handle ping-pong internally
      if (message.type === 'pong') {
        this.clearPongTimeout();
        return;
      }

      // Forward other messages to callback
      this.config.onMessage(message);
    } catch (error) {
      console.error('[WS] Message parse error:', error);
    }
  }

  private handleClose(event: CloseEvent): void {
    console.log('[WS] Closed:', event.code, event.reason);
    this.cleanup();

    if (!this.intentionalClose) {
      this.scheduleReconnect();
    }
  }

  private handleError(event: Event): void {
    console.error('[WS] Error:', event);
    // Close event will follow, handle reconnect there
  }

  private setState(state: ConnectionState): void {
    if (this.state !== state) {
      this.state = state;
      this.config.onStateChange(state);
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('[WS] Max reconnect attempts reached');
      this.setState('disconnected');
      return;
    }

    this.setState('reconnecting');
    this.reconnectAttempts++;

    // Exponential backoff: 1s, 2s, 4s, 8s, 16s, max 30s
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 30000);
    console.log(`[WS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private startPingPong(): void {
    this.pingTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping', payload: {} });
        
        // Expect pong within 5 seconds
        this.pongTimeout = setTimeout(() => {
          console.log('[WS] Pong timeout, closing connection');
          this.ws?.close();
        }, 5000);
      }
    }, this.pingInterval);
  }

  private clearPongTimeout(): void {
    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
      this.pongTimeout = null;
    }
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.send(message);
      }
    }
  }

  private cleanup(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }

    this.clearPongTimeout();

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onclose = null;
      this.ws.onerror = null;
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.close();
      }
      this.ws = null;
    }
  }
}

/**
 * Get WebSocket URL based on environment
 */
export function getWebSocketUrl(): string {
  // In production, use wss:// with the same host
  // In development, use localhost
  if (typeof window === 'undefined') {
    return 'ws://localhost:8787/ws';
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = process.env.NEXT_PUBLIC_WS_HOST || window.location.host;
  
  // Default to /ws endpoint, configurable via env
  const path = process.env.NEXT_PUBLIC_WS_PATH || '/ws';
  
  return `${protocol}//${host}${path}`;
}
