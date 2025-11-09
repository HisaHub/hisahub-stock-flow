import { useEffect, useRef, useState, useCallback } from 'react';

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

export interface WebSocketConfig {
  url: string;
  protocols?: string | string[];
  reconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  onMessage?: (message: WebSocketMessage) => void;
}

export const useWebSocket = (config: WebSocketConfig) => {
  const {
    url,
    protocols,
    reconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 10,
    heartbeatInterval = 30000,
    onOpen,
    onClose,
    onError,
    onMessage,
  } = config;

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const heartbeatIntervalRef = useRef<NodeJS.Timeout>();
  const messageQueueRef = useRef<any[]>([]);
  const isManualCloseRef = useRef(false);

  // Send message function
  const sendMessage = useCallback((data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      wsRef.current.send(message);
      return true;
    } else {
      // Queue message if not connected
      messageQueueRef.current.push(data);
      console.warn('WebSocket not connected. Message queued.');
      return false;
    }
  }, []);

  // Send queued messages
  const sendQueuedMessages = useCallback(() => {
    while (messageQueueRef.current.length > 0) {
      const message = messageQueueRef.current.shift();
      sendMessage(message);
    }
  }, [sendMessage]);

  // Heartbeat function
  const startHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }

    heartbeatIntervalRef.current = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        sendMessage({ type: 'ping', timestamp: Date.now() });
      }
    }, heartbeatInterval);
  }, [heartbeatInterval, sendMessage]);

  // Stop heartbeat
  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = undefined;
    }
  }, []);

  // Connect function
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN || isConnecting) {
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const ws = new WebSocket(url, protocols);

      ws.onopen = (event) => {
        console.log('WebSocket connected:', url);
        setIsConnected(true);
        setIsConnecting(false);
        reconnectAttemptsRef.current = 0;
        setError(null);
        
        startHeartbeat();
        sendQueuedMessages();
        
        if (onOpen) onOpen(event);
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = {
            type: 'message',
            data: JSON.parse(event.data),
            timestamp: Date.now(),
          };
          
          setLastMessage(message);
          if (onMessage) onMessage(message);
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
          setLastMessage({
            type: 'raw',
            data: event.data,
            timestamp: Date.now(),
          });
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('WebSocket connection error');
        setIsConnecting(false);
        if (onError) onError(event);
      };

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setIsConnected(false);
        setIsConnecting(false);
        stopHeartbeat();
        
        if (onClose) onClose(event);

        // Attempt reconnection if not manually closed
        if (reconnect && !isManualCloseRef.current) {
          if (reconnectAttemptsRef.current < maxReconnectAttempts) {
            reconnectAttemptsRef.current++;
            console.log(
              `Reconnecting... Attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`
            );
            
            reconnectTimeoutRef.current = setTimeout(() => {
              connect();
            }, reconnectInterval);
          } else {
            setError(`Failed to reconnect after ${maxReconnectAttempts} attempts`);
          }
        }
      };

      wsRef.current = ws;
    } catch (err) {
      console.error('Error creating WebSocket:', err);
      setError('Failed to create WebSocket connection');
      setIsConnecting(false);
    }
  }, [
    url,
    protocols,
    reconnect,
    reconnectInterval,
    maxReconnectAttempts,
    isConnecting,
    onOpen,
    onClose,
    onError,
    onMessage,
    startHeartbeat,
    sendQueuedMessages,
    stopHeartbeat,
  ]);

  // Disconnect function
  const disconnect = useCallback(() => {
    isManualCloseRef.current = true;
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    stopHeartbeat();

    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
  }, [stopHeartbeat]);

  // Reconnect function
  const reconnectNow = useCallback(() => {
    disconnect();
    isManualCloseRef.current = false;
    reconnectAttemptsRef.current = 0;
    setTimeout(() => connect(), 100);
  }, [disconnect, connect]);

  // Auto-connect on mount
  useEffect(() => {
    isManualCloseRef.current = false;
    connect();

    return () => {
      isManualCloseRef.current = true;
      disconnect();
    };
  }, [url]); // Only reconnect if URL changes

  // Get connection state
  const getReadyState = useCallback(() => {
    return wsRef.current?.readyState ?? WebSocket.CLOSED;
  }, []);

  return {
    isConnected,
    isConnecting,
    lastMessage,
    error,
    sendMessage,
    connect,
    disconnect,
    reconnect: reconnectNow,
    getReadyState,
  };
};

export default useWebSocket;
