/**
 * Market Data Streaming Service
 * 
 * High-performance market data streaming with:
 * - Data compression
 * - Connection pooling
 * - Automatic batching
 * - Rate limiting
 * - Error recovery
 */

interface StreamConfig {
  maxConnections?: number;
  batchSize?: number;
  batchInterval?: number;
  compressionEnabled?: boolean;
  rateLimitPerSecond?: number;
}

interface StreamSubscription {
  id: string;
  symbols: string[];
  callback: (data: any) => void;
  priority: number;
}

class MarketDataStream {
  private config: StreamConfig;
  private subscriptions: Map<string, StreamSubscription> = new Map();
  private dataBuffer: Map<string, any[]> = new Map();
  private lastFlush: number = Date.now();
  private messageCount: number = 0;
  private startTime: number = Date.now();

  constructor(config: StreamConfig = {}) {
    this.config = {
      maxConnections: config.maxConnections || 10,
      batchSize: config.batchSize || 100,
      batchInterval: config.batchInterval || 50, // 50ms
      compressionEnabled: config.compressionEnabled ?? true,
      rateLimitPerSecond: config.rateLimitPerSecond || 1000,
    };

    this.startBatchProcessor();
  }

  /**
   * Subscribe to market data for symbols
   */
  subscribe(
    id: string,
    symbols: string[],
    callback: (data: any) => void,
    priority: number = 0
  ): void {
    this.subscriptions.set(id, {
      id,
      symbols,
      callback,
      priority,
    });

    console.log(`Subscription added: ${id} for ${symbols.length} symbols`);
  }

  /**
   * Unsubscribe from market data
   */
  unsubscribe(id: string): void {
    this.subscriptions.delete(id);
    console.log(`Subscription removed: ${id}`);
  }

  /**
   * Process incoming market data
   */
  processData(symbol: string, data: any): void {
    this.messageCount++;

    // Check rate limit
    const elapsed = (Date.now() - this.startTime) / 1000;
    const currentRate = this.messageCount / elapsed;

    if (currentRate > this.config.rateLimitPerSecond!) {
      console.warn(`Rate limit exceeded: ${currentRate} msg/s`);
      return;
    }

    // Add to buffer
    if (!this.dataBuffer.has(symbol)) {
      this.dataBuffer.set(symbol, []);
    }

    const buffer = this.dataBuffer.get(symbol)!;
    buffer.push(data);

    // Compress data if enabled
    if (this.config.compressionEnabled && buffer.length > 10) {
      const compressed = this.compressData(buffer);
      this.dataBuffer.set(symbol, [compressed]);
    }

    // Flush if buffer is full
    if (buffer.length >= this.config.batchSize!) {
      this.flushSymbol(symbol);
    }
  }

  /**
   * Compress data (simple aggregation)
   */
  private compressData(data: any[]): any {
    if (data.length === 0) return null;

    const latest = data[data.length - 1];
    const oldest = data[0];

    return {
      symbol: latest.symbol,
      price: latest.price,
      volume: data.reduce((sum, d) => sum + (d.volume || 0), 0),
      high: Math.max(...data.map(d => d.high || 0)),
      low: Math.min(...data.filter(d => d.low > 0).map(d => d.low)),
      change: latest.price - oldest.price,
      changePercent: ((latest.price - oldest.price) / oldest.price) * 100,
      timestamp: latest.timestamp,
      count: data.length,
      compressed: true,
    };
  }

  /**
   * Flush data for a specific symbol
   */
  private flushSymbol(symbol: string): void {
    const buffer = this.dataBuffer.get(symbol);
    if (!buffer || buffer.length === 0) return;

    // Get subscriptions interested in this symbol
    const interestedSubs = Array.from(this.subscriptions.values())
      .filter(sub => sub.symbols.includes(symbol))
      .sort((a, b) => b.priority - a.priority); // Higher priority first

    // Send data to subscribers
    buffer.forEach(data => {
      interestedSubs.forEach(sub => {
        try {
          sub.callback(data);
        } catch (error) {
          console.error(`Error in subscription callback ${sub.id}:`, error);
        }
      });
    });

    // Clear buffer
    this.dataBuffer.set(symbol, []);
  }

  /**
   * Start batch processor
   */
  private startBatchProcessor(): void {
    setInterval(() => {
      const now = Date.now();
      
      if (now - this.lastFlush >= this.config.batchInterval!) {
        this.flushAll();
        this.lastFlush = now;
      }
    }, this.config.batchInterval);
  }

  /**
   * Flush all buffered data
   */
  private flushAll(): void {
    const symbols = Array.from(this.dataBuffer.keys());
    symbols.forEach(symbol => this.flushSymbol(symbol));
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    const elapsed = (Date.now() - this.startTime) / 1000;
    const avgRate = this.messageCount / elapsed;

    return {
      totalMessages: this.messageCount,
      averageRate: Math.round(avgRate),
      activeSubscriptions: this.subscriptions.size,
      bufferedSymbols: this.dataBuffer.size,
      uptime: Math.round(elapsed),
    };
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.messageCount = 0;
    this.startTime = Date.now();
  }

  /**
   * Destroy stream and cleanup
   */
  destroy(): void {
    this.flushAll();
    this.subscriptions.clear();
    this.dataBuffer.clear();
  }
}

// Singleton instance
let streamInstance: MarketDataStream | null = null;

export const getMarketDataStream = (config?: StreamConfig): MarketDataStream => {
  if (!streamInstance) {
    streamInstance = new MarketDataStream(config);
  }
  return streamInstance;
};

export const destroyMarketDataStream = (): void => {
  if (streamInstance) {
    streamInstance.destroy();
    streamInstance = null;
  }
};

export default MarketDataStream;
