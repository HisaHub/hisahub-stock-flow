// API Configuration for Django Backend
// Note: If VITE_API_BASE_URL is not set, backend features will be disabled
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/api/accounts/login/',
    register: '/api/accounts/register/',
    logout: '/api/accounts/logout/',
    profile: '/api/accounts/profile/',
  },
  // Stocks
  stocks: {
    list: '/api/stocks/',
    detail: (symbol: string) => `/api/stocks/${symbol}/`,
    prices: (symbol: string) => `/api/stocks/${symbol}/prices/`,
    trending: '/api/stocks/trending/',
    batch: '/api/stocks/batch/',
  },
  // Trading
  trading: {
    orders: '/api/trading/orders/',
    portfolio: '/api/trading/portfolio/',
    positions: '/api/trading/positions/',
  },
  // Payments
  payments: {
    mpesa: '/api/payments/mpesa/',
    paypal: '/api/payments/paypal/',
    stripe: '/api/payments/stripe/',
  },
  // News
  news: {
    list: '/api/news/',
    detail: (id: string) => `/api/news/${id}/`,
  },
};

// Cache configuration
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// Request deduplication map
const pendingRequests = new Map<string, Promise<any>>();

// Cache strategy definitions
export const CACHE_STRATEGIES = {
  // No cache
  NONE: { ttl: 0, skipCache: true },
  // Short cache (5 seconds) - for frequently changing data
  SHORT: { ttl: 5000 },
  // Medium cache (1 minute) - for stable data
  MEDIUM: { ttl: 60000 },
  // Long cache (5 minutes) - for rarely changing data
  LONG: { ttl: 300000 },
  // Very long cache (30 minutes) - for static data
  VERY_LONG: { ttl: 1800000 },
};

// HTTP client configuration with optimization
class ApiClient {
  private baseURL: string;
  private token: string | null = null;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly DEFAULT_CACHE_TIME = 60000; // 1 minute
  private requestStats = {
    hits: 0,
    misses: 0,
    dedups: 0,
  };

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
    
    // Clear expired cache entries every 5 minutes
    setInterval(() => this.cleanCache(), 300000);
    
    // Log stats every minute in development
    if (import.meta.env.DEV) {
      setInterval(() => this.logStats(), 60000);
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
    this.clearCache();
  }

  // Cache management
  private getCacheKey(endpoint: string, options?: RequestInit): string {
    const method = options?.method || 'GET';
    const body = options?.body ? JSON.stringify(options.body) : '';
    return `${method}:${endpoint}:${body}`;
  }

  private getCachedData<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      this.requestStats.misses++;
      return null;
    }
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.requestStats.misses++;
      return null;
    }
    
    this.requestStats.hits++;
    return entry.data;
  }

  private setCachedData<T>(key: string, data: T, ttl: number = this.DEFAULT_CACHE_TIME): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
    });
  }

  private cleanCache(): void {
    const now = Date.now();
    let cleaned = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    if (cleaned > 0 && import.meta.env.DEV) {
      console.log(`[API Cache] Cleaned ${cleaned} expired entries`);
    }
  }

  private logStats(): void {
    const total = this.requestStats.hits + this.requestStats.misses;
    const hitRate = total > 0 ? ((this.requestStats.hits / total) * 100).toFixed(1) : 0;
    console.log(
      `[API Stats] Hits: ${this.requestStats.hits}, Misses: ${this.requestStats.misses}, ` +
      `Dedups: ${this.requestStats.dedups}, Hit Rate: ${hitRate}%, Cache Size: ${this.cache.size}`
    );
  }

  clearCache(): void {
    this.cache.clear();
  }

  invalidateCache(pattern?: string): void {
    if (!pattern) {
      this.clearCache();
      return;
    }
    
    let invalidated = 0;
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        invalidated++;
      }
    }
    
    if (invalidated > 0 && import.meta.env.DEV) {
      console.log(`[API Cache] Invalidated ${invalidated} entries matching "${pattern}"`);
    }
  }

  getStats() {
    return { ...this.requestStats };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    cacheOptions?: { ttl?: number; skipCache?: boolean }
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = this.getCacheKey(endpoint, options);
    
    // Check cache for GET requests
    const method = options.method || 'GET';
    if (method === 'GET' && !cacheOptions?.skipCache) {
      const cachedData = this.getCachedData<T>(cacheKey);
      if (cachedData) {
        if (import.meta.env.DEV) {
          console.log(`[API Cache] Hit: ${endpoint}`);
        }
        return cachedData;
      }
      
      // Check for pending request (request deduplication)
      if (pendingRequests.has(cacheKey)) {
        this.requestStats.dedups++;
        if (import.meta.env.DEV) {
          console.log(`[API Dedup] Reusing pending request: ${endpoint}`);
        }
        return pendingRequests.get(cacheKey);
      }
    }

    // Build headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      ...(options.headers || {}),
    };

    // Create the request promise
    const requestPromise = fetch(url, {
      ...options,
      headers,
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorJson.detail || errorMessage;
          } catch {
            // Use default error message
          }
          
          throw new Error(errorMessage);
        }
        return response.json();
      })
      .then((data) => {
        // Cache successful GET requests
        if (method === 'GET' && !cacheOptions?.skipCache) {
          const ttl = cacheOptions?.ttl || this.DEFAULT_CACHE_TIME;
          this.setCachedData(cacheKey, data, ttl);
        }
        
        // Remove from pending requests
        pendingRequests.delete(cacheKey);
        
        return data as T;
      })
      .catch((error) => {
        // Remove from pending requests on error
        pendingRequests.delete(cacheKey);
        throw error;
      });

    // Store pending GET requests for deduplication
    if (method === 'GET') {
      pendingRequests.set(cacheKey, requestPromise);
    }

    return requestPromise;
  }

  async get<T>(endpoint: string, cacheOptions?: { ttl?: number; skipCache?: boolean }): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' }, cacheOptions);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    // Invalidate related cache entries on mutations
    this.invalidateCache(endpoint.split('?')[0]);
    
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    // Invalidate related cache entries on mutations
    this.invalidateCache(endpoint.split('?')[0]);
    
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    // Invalidate related cache entries on mutations
    this.invalidateCache(endpoint.split('?')[0]);
    
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    // Invalidate related cache entries on mutations
    this.invalidateCache(endpoint.split('?')[0]);
    
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Batch request functionality with intelligent caching
  async batchGet<T>(endpoints: string[], cacheOptions?: { ttl?: number }): Promise<T[]> {
    return Promise.all(endpoints.map(endpoint => this.get<T>(endpoint, cacheOptions)));
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Utility: Debounce function for search/filter operations
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Utility: Throttle function for scroll/resize events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}