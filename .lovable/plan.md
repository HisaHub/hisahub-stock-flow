
# HisaHub Export Plan

## Overview

This plan outlines how to export the complete HisaHub trading and portfolio architecture to another application. The export will include all source files, database schema, edge functions, styling, and integration documentation needed to recreate the full functionality.

---

## Export Structure

The export will be organized into a single comprehensive markdown file (`HISAHUB_COMPLETE_EXPORT.md`) containing all components with clear section headers for easy navigation and copy-paste integration.

```text
HISAHUB_COMPLETE_EXPORT.md
|
+-- 1. DATABASE SCHEMA (SQL)
|   +-- Custom types (enums)
|   +-- 15 tables with relationships
|   +-- RLS policies
|   +-- Indexes and triggers
|   +-- Sample data
|
+-- 2. PAGES (2 files)
|   +-- Trade.tsx - Full trading interface
|   +-- Portfolio.tsx - Portfolio management
|
+-- 3. TRADING COMPONENTS (9 files)
|   +-- TradingChart.tsx - Interactive charts with indicators
|   +-- OrderPanel.tsx - Buy/Sell order placement
|   +-- StockSummary.tsx - Stock info display
|   +-- PositionsOrders.tsx - Open positions
|   +-- WatchlistPanel.tsx - Watchlists
|   +-- AlertsPanel.tsx - Price alerts
|   +-- NewsFeed.tsx - Stock news
|   +-- ResearchPanel.tsx - Analysis tools
|   +-- AIAssistant.tsx - AI trading helper
|
+-- 4. DATA LAYER (6 files)
|   +-- FinancialDataContext.tsx - Central state
|   +-- useSupabaseData.tsx - Supabase integration
|   +-- useMarketData.tsx - Real-time prices
|   +-- useBackendData.tsx - Django backend
|   +-- useTrading.tsx - Trading operations
|   +-- useAIChat.tsx - AI chat hook
|
+-- 5. API LAYER (1 file)
|   +-- api.ts - HTTP client with caching
|
+-- 6. EDGE FUNCTIONS (4 files)
|   +-- portfolio-management/index.ts
|   +-- market-data/index.ts
|   +-- ai-assistant/index.ts
|   +-- ai-news-summarizer/index.ts
|
+-- 7. DESIGN SYSTEM (3 files)
|   +-- tailwind.config.ts
|   +-- index.css
|   +-- Glass-card patterns
|
+-- 8. SHARED COMPONENTS
|   +-- BottomNav.tsx
|   +-- ThemeProvider.tsx
|   +-- UI components (list)
|
+-- 9. INTEGRATION GUIDE
    +-- Step-by-step setup
    +-- Dependencies
    +-- Environment variables
    +-- Supabase configuration
```

---

## What Will Be Exported

### 1. Database Schema (Complete SQL)
- **15 tables**: profiles, kyc_documents, broker_accounts, stocks, stock_prices, portfolios, holdings, orders, transactions, watchlists, watchlist_items, price_alerts, notifications, chat_sessions, chat_messages, market_data
- **8 custom enum types**: user_role, account_status, order_type, order_status, order_side, broker_name, kyc_status, notification_type
- **Row Level Security policies** for all user-owned data
- **Performance indexes** for common queries
- **Triggers** for automatic timestamp updates
- **Sample stock data** for NSE (Safaricom, Equity, KCB, etc.)

### 2. Core Pages
- **Trade.tsx** (176 lines): Stock selector, chart view, order panel, tabbed mobile interface
- **Portfolio.tsx** (424 lines): Overview, holdings, allocation, transactions, dividends, performance charts

### 3. Trading Components
| Component | Lines | Features |
|-----------|-------|----------|
| TradingChart.tsx | 532 | Line/candlestick charts, RSI, MACD, Bollinger Bands, support/resistance, drawing tools |
| OrderPanel.tsx | 326 | Market/limit/stop orders, broker fee calculation, confirmation modal |
| StockSummary.tsx | 74 | Price display, watchlist toggle, key metrics |
| PositionsOrders.tsx | ~150 | Open positions list, order history |
| WatchlistPanel.tsx | ~100 | Multiple watchlists, add/remove stocks |
| AlertsPanel.tsx | ~120 | Price alert creation and management |
| NewsFeed.tsx | ~80 | Stock-related news display |
| ResearchPanel.tsx | ~100 | Analysis and research tools |
| AIAssistant.tsx | ~150 | Chat interface for AI trading advice |

### 4. State Management and Data Hooks
| Hook/Context | Purpose |
|--------------|---------|
| FinancialDataContext | Central state for stocks, holdings, portfolio, transactions |
| useSupabaseData | Auth, portfolio CRUD, real-time subscriptions |
| useMarketData | Stock prices, market indices, live updates |
| useBackendData | Django backend integration (optional) |
| useTrading | Buy/sell operations with validation |
| useAIChat | AI assistant conversation management |
| useUserProfile | User profile management |

### 5. API Client
- HTTP client with request caching
- Request deduplication
- Token-based authentication
- Cache invalidation strategies
- Debounce/throttle utilities

### 6. Edge Functions
| Function | Purpose |
|----------|---------|
| portfolio-management | Create portfolio, place orders, update holdings, get summary |
| market-data | Fetch and update market prices |
| ai-assistant | GPT-powered trading advisor with portfolio context |
| ai-news-summarizer | Summarize financial news |

### 7. Design System
- **Tailwind configuration**: Custom colors (primary navy, secondary amber), fonts (Poppins, Roboto Mono), animations
- **CSS**: Glass-card styles, light/dark theme support, mobile-responsive rules
- **Color palette**: Deep navy (#131b26), amber (#FFC000), off-white (#F8F9FA)

---

## Integration Requirements

### Dependencies (package.json additions)
```json
{
  "@supabase/supabase-js": "^2.50.2",
  "@tanstack/react-query": "^5.56.2",
  "recharts": "^2.12.7",
  "lucide-react": "^0.462.0",
  "@radix-ui/react-tabs": "^1.1.0",
  "@radix-ui/react-select": "^2.1.1",
  "@radix-ui/react-popover": "^1.1.1",
  "@radix-ui/react-dialog": "^1.1.2",
  "@radix-ui/react-sheet": "^1.0.0",
  "sonner": "^1.5.0",
  "class-variance-authority": "^0.7.1",
  "tailwind-merge": "^2.5.2",
  "tailwindcss-animate": "^1.0.7"
}
```

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_BASE_URL=your_backend_url (optional)
```

### Supabase Secrets (for edge functions)
- `OPENAI_API_KEY` - For AI assistant

---

## What You'll Need to Adapt

1. **Authentication**: Replace Supabase auth with your app's auth system OR keep Supabase auth
2. **AI Backend**: Currently uses OpenAI via edge function - adapt to use your app's AI gateway
3. **Backend API**: The Django backend integration is optional - can be removed if not needed
4. **Routing**: Integrate Trade and Portfolio routes into your app's router
5. **Theme Provider**: Wrap components with the ThemeProvider or use your existing theme system
6. **Bottom Navigation**: Replace or remove BottomNav component based on your app's navigation

---

## Implementation Steps

### Step 1: Set Up Database
1. Run the SQL migration in your Supabase project
2. Verify all tables and RLS policies are created
3. Add sample stock data if needed

### Step 2: Install Dependencies
```bash
npm install @supabase/supabase-js @tanstack/react-query recharts lucide-react \
  @radix-ui/react-tabs @radix-ui/react-select @radix-ui/react-popover \
  @radix-ui/react-dialog sonner class-variance-authority tailwind-merge \
  tailwindcss-animate
```

### Step 3: Copy Files
1. Create `src/contexts/` folder and add FinancialDataContext
2. Create `src/hooks/` folder and add all data hooks
3. Create `src/components/trading/` folder and add all trading components
4. Create `src/pages/` folder and add Trade.tsx and Portfolio.tsx
5. Create `src/lib/` folder and add api.ts and utils.ts
6. Update tailwind.config.ts with HisaHub colors and fonts
7. Merge index.css styles

### Step 4: Deploy Edge Functions
1. Copy edge function files to `supabase/functions/`
2. Deploy using Supabase CLI or Lovable
3. Add required secrets (OPENAI_API_KEY)

### Step 5: Wire Up Routes
```tsx
// In your App.tsx
import { FinancialDataProvider } from './contexts/FinancialDataContext';
import Trade from './pages/Trade';
import Portfolio from './pages/Portfolio';

// Wrap your app with the provider
<FinancialDataProvider>
  <Routes>
    <Route path="/trade" element={<Trade />} />
    <Route path="/portfolio" element={<Portfolio />} />
  </Routes>
</FinancialDataProvider>
```

### Step 6: Test
1. Verify Supabase connection
2. Test stock data loading
3. Test order placement (demo mode)
4. Test AI assistant
5. Verify mobile responsiveness

---

## File Count Summary

| Category | Files | Total Lines (approx) |
|----------|-------|---------------------|
| Pages | 2 | 600 |
| Trading Components | 9 | 1,500 |
| Hooks | 6 | 800 |
| Context | 1 | 450 |
| API/Utils | 2 | 400 |
| Edge Functions | 4 | 600 |
| Config/CSS | 3 | 300 |
| **Total** | **27 files** | **~4,650 lines** |

---

## Next Steps After Approval

Once you approve this plan, I will create a single comprehensive markdown file (`HISAHUB_COMPLETE_EXPORT.md`) containing:

1. Complete SQL migration with all tables, types, RLS policies, and indexes
2. All TypeScript/React component source code
3. All hooks and context providers
4. All edge function code
5. Tailwind and CSS configuration
6. Step-by-step integration guide
7. Troubleshooting section

This file will be self-contained and ready to copy into your other project.
