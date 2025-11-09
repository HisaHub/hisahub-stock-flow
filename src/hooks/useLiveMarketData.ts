import { useState, useEffect, useCallback, useRef } from 'react';
import { useWebSocket, WebSocketMessage } from './useWebSocket';

interface MarketDataUpdate {
  symbol: string;
  price: number;
  volume: number;
  high: number;
  low: number;
  change: number;
  changePercent: number;
  timestamp: number;
  bid?: number;
  ask?: number;
  bidSize?: number;
  askSize?: number;
}

interface OrderBookUpdate {
  symbol: string;
  bids: Array<{ price: number; quantity: number; total: number }>;
  asks: Array<{ price: number; quantity: number; total: number }>;
  timestamp: number;
}

interface UseLiveMarketDataConfig {
  symbols?: string[];
  enableOrderBook?: boolean;
  throttleInterval?: number; // ms between UI updates
  bufferSize?: number; // max messages to buffer
  wsUrl?: string;
}

export const useLiveMarketData = (config: UseLiveMarketDataConfig = {}) => {
  const {
    symbols = [],
    enableOrderBook = false,
    throttleInterval = 100, // Update UI every 100ms max
    bufferSize = 1000,
    wsUrl = 'ws://127.0.0.1:8000/ws/market/',
  } = config;

  const [marketData, setMarketData] = useState<Map<string, MarketDataUpdate>>(new Map());
  const [orderBooks, setOrderBooks] = useState<Map<string, OrderBookUpdate>>(new Map());
  const [subscribedSymbols, setSubscribedSymbols] = useState<Set<string>>(new Set(symbols));
  const [messageCount, setMessageCount] = useState(0);
  const [dataRate, setDataRate] = useState(0); // messages per second

  // Buffers for batching updates
  const marketDataBuffer = useRef<Map<string, MarketDataUpdate>>(new Map());
  const orderBookBuffer = useRef<Map<string, OrderBookUpdate>>(new Map());
  const messageCountBuffer = useRef(0);
  const lastUpdateTime = useRef(Date.now());
  const throttleTimeout = useRef<NodeJS.Timeout>();

  // WebSocket message handler
  const handleMessage = useCallback((message: WebSocketMessage) => {
    const { type, data } = message;

    messageCountBuffer.current++;

    switch (type) {
      case 'market_data':
      case 'price_update':
        if (data.symbol) {
          // Buffer the update instead of immediately setting state
          marketDataBuffer.current.set(data.symbol, {
            symbol: data.symbol,
            price: data.price || data.last_price || 0,
            volume: data.volume || 0,
            high: data.high || 0,
            low: data.low || 0,
            change: data.change || 0,
            changePercent: data.change_percent || data.changePercent || 0,
            timestamp: data.timestamp || Date.now(),
            bid: data.bid,
            ask: data.ask,
            bidSize: data.bid_size || data.bidSize,
            askSize: data.ask_size || data.askSize,
          });
        }
        break;

      case 'order_book':
      case 'depth_update':
        if (data.symbol && enableOrderBook) {
          orderBookBuffer.current.set(data.symbol, {
            symbol: data.symbol,
            bids: data.bids || [],
            asks: data.asks || [],
            timestamp: data.timestamp || Date.now(),
          });
        }
        break;

      case 'bulk_update':
        // Handle bulk updates efficiently
        if (Array.isArray(data.updates)) {
          data.updates.forEach((update: any) => {
            if (update.symbol) {
              marketDataBuffer.current.set(update.symbol, {
                symbol: update.symbol,
                price: update.price || 0,
                volume: update.volume || 0,
                high: update.high || 0,
                low: update.low || 0,
                change: update.change || 0,
                changePercent: update.changePercent || 0,
                timestamp: update.timestamp || Date.now(),
              });
            }
          });
        }
        break;

      case 'subscription_confirmed':
        console.log('Subscription confirmed:', data);
        break;

      default:
        console.log('Unknown message type:', type, data);
    }

    // Limit buffer size to prevent memory issues
    if (marketDataBuffer.current.size > bufferSize) {
      const entries = Array.from(marketDataBuffer.current.entries());
      marketDataBuffer.current = new Map(entries.slice(-bufferSize));
    }
  }, [enableOrderBook, bufferSize]);

  // Throttled state update function
  const flushBuffers = useCallback(() => {
    const now = Date.now();
    const timeDiff = (now - lastUpdateTime.current) / 1000; // seconds

    // Update market data
    if (marketDataBuffer.current.size > 0) {
      setMarketData(prev => {
        const newMap = new Map(prev);
        marketDataBuffer.current.forEach((value, key) => {
          newMap.set(key, value);
        });
        return newMap;
      });
      marketDataBuffer.current.clear();
    }

    // Update order books
    if (orderBookBuffer.current.size > 0) {
      setOrderBooks(prev => {
        const newMap = new Map(prev);
        orderBookBuffer.current.forEach((value, key) => {
          newMap.set(key, value);
        });
        return newMap;
      });
      orderBookBuffer.current.clear();
    }

    // Update metrics
    if (messageCountBuffer.current > 0) {
      setMessageCount(prev => prev + messageCountBuffer.current);
      setDataRate(timeDiff > 0 ? messageCountBuffer.current / timeDiff : 0);
      messageCountBuffer.current = 0;
    }

    lastUpdateTime.current = now;
  }, []);

  // Setup throttled updates
  useEffect(() => {
    const interval = setInterval(() => {
      flushBuffers();
    }, throttleInterval);

    return () => clearInterval(interval);
  }, [throttleInterval, flushBuffers]);

  // WebSocket connection
  const {
    isConnected,
    isConnecting,
    error: wsError,
    sendMessage,
    reconnect,
  } = useWebSocket({
    url: wsUrl,
    reconnect: true,
    reconnectInterval: 3000,
    maxReconnectAttempts: 10,
    heartbeatInterval: 30000,
    onMessage: handleMessage,
    onOpen: () => {
      console.log('Market data WebSocket connected');
      // Subscribe to symbols on connection
      if (subscribedSymbols.size > 0) {
        sendMessage({
          type: 'subscribe',
          symbols: Array.from(subscribedSymbols),
          order_book: enableOrderBook,
        });
      }
    },
    onClose: () => {
      console.log('Market data WebSocket disconnected');
    },
  });

  // Subscribe to symbols
  const subscribe = useCallback((symbols: string[]) => {
    const newSymbols = symbols.filter(s => !subscribedSymbols.has(s));
    
    if (newSymbols.length > 0) {
      setSubscribedSymbols(prev => {
        const newSet = new Set(prev);
        newSymbols.forEach(s => newSet.add(s));
        return newSet;
      });

      if (isConnected) {
        sendMessage({
          type: 'subscribe',
          symbols: newSymbols,
          order_book: enableOrderBook,
        });
      }
    }
  }, [subscribedSymbols, isConnected, sendMessage, enableOrderBook]);

  // Unsubscribe from symbols
  const unsubscribe = useCallback((symbols: string[]) => {
    setSubscribedSymbols(prev => {
      const newSet = new Set(prev);
      symbols.forEach(s => newSet.delete(s));
      return newSet;
    });

    if (isConnected) {
      sendMessage({
        type: 'unsubscribe',
        symbols,
      });
    }

    // Clear data for unsubscribed symbols
    setMarketData(prev => {
      const newMap = new Map(prev);
      symbols.forEach(s => newMap.delete(s));
      return newMap;
    });

    setOrderBooks(prev => {
      const newMap = new Map(prev);
      symbols.forEach(s => newMap.delete(s));
      return newMap;
    });
  }, [isConnected, sendMessage]);

  // Get market data for a symbol
  const getMarketData = useCallback((symbol: string): MarketDataUpdate | undefined => {
    return marketData.get(symbol);
  }, [marketData]);

  // Get order book for a symbol
  const getOrderBook = useCallback((symbol: string): OrderBookUpdate | undefined => {
    return orderBooks.get(symbol);
  }, [orderBooks]);

  // Get all market data as array
  const getAllMarketData = useCallback((): MarketDataUpdate[] => {
    return Array.from(marketData.values());
  }, [marketData]);

  // Request snapshot (full refresh)
  const requestSnapshot = useCallback((symbols?: string[]) => {
    if (isConnected) {
      sendMessage({
        type: 'snapshot',
        symbols: symbols || Array.from(subscribedSymbols),
      });
    }
  }, [isConnected, sendMessage, subscribedSymbols]);

  // Auto-subscribe to initial symbols
  useEffect(() => {
    if (symbols.length > 0 && isConnected) {
      subscribe(symbols);
    }
  }, [isConnected]); // Only run when connection status changes

  return {
    // Connection state
    isConnected,
    isConnecting,
    error: wsError,
    
    // Data
    marketData: getAllMarketData(),
    orderBooks: Array.from(orderBooks.values()),
    getMarketData,
    getOrderBook,
    
    // Subscriptions
    subscribedSymbols: Array.from(subscribedSymbols),
    subscribe,
    unsubscribe,
    
    // Actions
    requestSnapshot,
    reconnect,
    
    // Metrics
    messageCount,
    dataRate: Math.round(dataRate),
    activeSymbolCount: marketData.size,
  };
};

export default useLiveMarketData;
