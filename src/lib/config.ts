// Environment Configuration and Feature Flags
// This file centralizes all environment variables and provides type-safe access

export const config = {
  // Environment Mode
  env: import.meta.env.VITE_APP_ENV || 'development',
  isDevelopment: import.meta.env.VITE_APP_ENV === 'development',
  isSandbox: import.meta.env.VITE_APP_ENV === 'sandbox',
  isProduction: import.meta.env.VITE_APP_ENV === 'production',
  
  // Testing & Sandbox
  testing: {
    enabled: import.meta.env.VITE_TESTING_MODE === 'true',
    sandboxMode: import.meta.env.VITE_SANDBOX_MODE === 'true',
    mockDataEnabled: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
    realTradingEnabled: import.meta.env.VITE_ENABLE_REAL_TRADING === 'true',
  },

  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
    enableCache: import.meta.env.VITE_ENABLE_API_CACHE !== 'false',
    rateLimit: parseInt(import.meta.env.VITE_API_RATE_LIMIT || '100'),
    rateWindow: parseInt(import.meta.env.VITE_API_RATE_WINDOW || '60000'),
  },

  // Supabase
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    projectId: import.meta.env.VITE_SUPABASE_PROJECT_ID,
  },

  // Market Data Providers
  marketData: {
    provider: import.meta.env.VITE_MARKET_DATA_PROVIDER || 'polygon',
    polygon: {
      apiKey: import.meta.env.VITE_POLYGON_API_KEY,
      baseUrl: 'https://api.polygon.io',
    },
    alphaVantage: {
      apiKey: import.meta.env.VITE_ALPHA_VANTAGE_API_KEY,
      baseUrl: 'https://www.alphavantage.co/query',
    },
    iex: {
      apiKey: import.meta.env.VITE_IEX_API_KEY,
      sandbox: import.meta.env.VITE_IEX_SANDBOX === 'true',
      baseUrl: import.meta.env.VITE_IEX_SANDBOX === 'true' 
        ? 'https://sandbox.iexapis.com/stable'
        : 'https://cloud.iexapis.com/stable',
    },
    finnhub: {
      apiKey: import.meta.env.VITE_FINNHUB_API_KEY,
      baseUrl: 'https://finnhub.io/api/v1',
    },
  },

  // Payment Gateways
  payments: {
    mpesa: {
      environment: import.meta.env.VITE_MPESA_ENVIRONMENT || 'sandbox',
      consumerKey: import.meta.env.VITE_MPESA_CONSUMER_KEY,
      consumerSecret: import.meta.env.VITE_MPESA_CONSUMER_SECRET,
      passkey: import.meta.env.VITE_MPESA_PASSKEY,
      shortcode: import.meta.env.VITE_MPESA_SHORTCODE || '174379',
    },
    paypal: {
      mode: import.meta.env.VITE_PAYPAL_MODE || 'sandbox',
      clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    },
    stripe: {
      publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
      testMode: import.meta.env.VITE_STRIPE_TEST_MODE === 'true',
    },
  },

  // Analytics & Monitoring
  analytics: {
    enabled: import.meta.env.VITE_ANALYTICS_ENABLED === 'true',
    mixpanelToken: import.meta.env.VITE_MIXPANEL_TOKEN,
    sentryDsn: import.meta.env.VITE_SENTRY_DSN,
  },

  // Feature Flags
  features: {
    websockets: import.meta.env.VITE_ENABLE_WEBSOCKETS === 'true',
    notifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
    chat: import.meta.env.VITE_ENABLE_CHAT === 'true',
    aiFeatures: import.meta.env.VITE_ENABLE_AI_FEATURES === 'true',
    advancedCharts: import.meta.env.VITE_ENABLE_ADVANCED_CHARTS === 'true',
    communityFeatures: import.meta.env.VITE_ENABLE_COMMUNITY_FEATURES === 'true',
  },

  // Cache Configuration
  cache: {
    ttl: {
      short: parseInt(import.meta.env.VITE_CACHE_TTL_SHORT || '5000'),
      medium: parseInt(import.meta.env.VITE_CACHE_TTL_MEDIUM || '60000'),
      long: parseInt(import.meta.env.VITE_CACHE_TTL_LONG || '300000'),
    },
  },

  // WebSocket Configuration
  websocket: {
    url: import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws',
  },

  // Logging
  logging: {
    enabled: import.meta.env.VITE_ENABLE_LOGGING === 'true',
    level: import.meta.env.VITE_LOG_LEVEL || 'info',
  },

  // Security
  security: {
    csrfProtection: import.meta.env.VITE_ENABLE_CSRF_PROTECTION === 'true',
    secureCookies: import.meta.env.VITE_SECURE_COOKIES === 'true',
  },
} as const;

// Type-safe feature flag checker
export function isFeatureEnabled(feature: keyof typeof config.features): boolean {
  return config.features[feature];
}

// Environment checker helpers
export const isDevelopment = () => config.isDevelopment;
export const isSandbox = () => config.isSandbox;
export const isProduction = () => config.isProduction;
export const isTesting = () => config.testing.enabled;

// Safe mode checker - prevents real transactions in non-production
export const isSafeMode = () => !config.testing.realTradingEnabled || config.testing.sandboxMode;

// Log configuration status (only in development)
if (config.isDevelopment) {
  console.log('🔧 Environment Configuration:', {
    env: config.env,
    sandbox: config.testing.sandboxMode,
    realTrading: config.testing.realTradingEnabled,
    safeMode: isSafeMode(),
    marketDataProvider: config.marketData.provider,
  });
}

export default config;
