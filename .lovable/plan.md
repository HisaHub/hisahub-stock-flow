

# Comprehensive Fix Plan: Live Data Integration + Remaining Mock Data Removal

## Current State Assessment

### What's Working
- **Database has live data**: 10 NSE stocks with 3-4 price records each, 3 market indices (NSE20, NASI, NSE25) present in `market_data` table
- **`useMarketData.tsx`**: Correctly fetches 2 most recent prices for change calculation
- **`MarketOverviewSection`**: Displays live stocks and market indices from context
- **`OpenPositionsCard`**: Uses live `state.holdings` from context
- **`AccountSummaryCard`**: Uses live context data with working `ADD_FUNDS` reducer
- **`PositionsOrders`**: Uses live context data, no mock arrays
- **`TradingChart`**: Fetches OHLC data directly from `stock_prices` table in Supabase
- **Interfaces**: `Stock`, `Holding`, `Transaction` all updated with `currency`, `sector`, `order_type`, `created_at`

### Critical Issues Found

#### Issue 1: `useBackendData.tsx` hitting localhost:8000 (Django) on every page load
The console shows 3 `ERR_CONNECTION_REFUSED` errors on every page load because `useBackendData.tsx` tries to connect to `http://localhost:8000` (Django backend that doesn't exist in production). This:
- Floods the console with errors
- Sets `loading: true` for ~2-3 seconds while requests timeout
- Sets `error` state which propagates to the context
- The `FinancialDataContext` prioritizes backend data over Supabase data, so when backend returns empty arrays, stocks may briefly show as empty

This is the **root cause** of data not flowing properly. The context checks `if (backendStocks.length > 0)` first, and only falls back to Supabase stocks when backend returns nothing. But the loading/error state from the failed Django requests delays everything.

#### Issue 2: Remaining mock data in 3 files
| File | Mock Data |
|------|-----------|
| `ResearchPanel.tsx` | Hardcoded `analystRatings`, `fundamentals`, `recentNews` arrays |
| `NewsFeed.tsx` | `mockNews` array used as initial state for news tab |
| `News.tsx` | `DUMMY_NEWS` and `DUMMY_ARTICLES` arrays |

#### Issue 3: TradingChart indicator placeholders
RSI, MACD, SMA, and Bollinger Bands are all set to placeholder values (`rsi: 50`, `macdLine: 0`, `sma: price`). The comment says "will be computed client-side if needed" but no computation happens.

#### Issue 4: Portfolio performance hardcoded
- `performanceData` array has hardcoded Jan-May values (95000, 98000, 105000, 112000)
- Performance metrics section shows hardcoded "+30.8%", "+18.2%", "+5.4%", "1.34"
- `weeklyChangePercent: 2.5` and `monthlyChangePercent: 8.2` are hardcoded TODOs in context

#### Issue 5: MARKETSTACK_API_KEY not in secrets
Only `LOVABLE_API_KEY` is in Supabase secrets. The market-data edge function already has a fallback price generator, so it works without the key, but prices are simulated rather than real. The fallback is functioning correctly (data exists in DB).

#### Issue 6: Sparse historical data
Each stock has only 3-4 price records. The TradingChart requests up to 730 records for the 1Y view. Most timeframes will show very sparse charts.

---

## Implementation Plan (8 files)

### Phase 1: Fix the Critical Data Flow Blocker

**File 1: `src/hooks/useBackendData.tsx`**

The Django backend (`localhost:8000`) does not exist in production. This hook should gracefully skip when no backend URL is configured, rather than erroring out on every page load.

Changes:
- Add a guard at the top of `fetchData`: if `VITE_API_BASE_URL` is `localhost` or not set, skip all fetches and immediately set `loading: false`
- This eliminates 3 failed network requests and the associated error state on every page load
- The `FinancialDataContext` will then immediately use Supabase data instead of waiting for Django timeouts

### Phase 2: Compute Real Technical Indicators for TradingChart

**File 2: `src/components/trading/TradingChart.tsx`**

Currently RSI=50, MACD=0, SMA=price for all data points. Add real client-side computation:

Changes:
- After fetching price data from Supabase, compute actual indicators:
  - **SMA(20)**: Simple Moving Average over 20 periods
  - **RSI(14)**: Relative Strength Index using standard formula
  - **MACD(12,26,9)**: MACD line, signal line, and histogram
  - **Bollinger Bands(20,2)**: Upper/lower bands using SMA + 2 standard deviations
- Extract indicator computation into a helper function `computeIndicators(data)` that processes the raw OHLC array
- Update the "Real-time data simulation" label at the bottom to "Live Supabase data" since charts now use real data

### Phase 3: Replace Remaining Mock Data

**File 3: `src/components/trading/NewsFeed.tsx`**

Changes:
- Remove the `mockNews` array entirely
- Initialize `newsItems` as empty array
- Attempt to load recent posts from `posts` table filtered by stock symbol mention in content
- Show "No news available" empty state when no data exists
- Keep the AI summary feature as-is (it already calls the edge function)

**File 4: `src/components/trading/ResearchPanel.tsx`**

Changes:
- Fetch stock-specific data from the `stocks` table (`market_cap`, `shares_outstanding`, etc.) to populate fundamentals
- Show "N/A" or "--" for metrics not available in the database
- Replace hardcoded `recentNews` with posts from `posts` table mentioning the stock symbol
- Replace hardcoded `analystRatings` with either computed values or "Data unavailable" state
- Keep the AI analysis feature as-is

**File 5: `src/pages/News.tsx`**

Changes:
- Replace `DUMMY_NEWS` with recent posts from `posts` table fetched via Supabase
- Keep `DUMMY_ARTICLES` as static educational content (no news/articles table exists)
- Add loading state while fetching posts

### Phase 4: Fix Portfolio Hardcoded Values

**File 6: `src/pages/Portfolio.tsx`**

Changes:
- Replace hardcoded `performanceData` array with dynamically computed values based on current portfolio value, or show "Insufficient data" if no historical records
- Replace hardcoded performance metrics (+30.8%, +18.2%, +5.4%, 1.34) with computed values from context data or "N/A"
- The dividend section is already computing from live transactions -- no change needed

**File 7: `src/contexts/FinancialDataContext.tsx`**

Changes:
- Remove hardcoded `weeklyChangePercent: 2.5` and `monthlyChangePercent: 8.2`
- Set both to `0` with a comment that historical data is needed for real computation
- This ensures the Portfolio overview doesn't show fake weekly/monthly percentages

### Phase 5: Seed More Historical Price Data

**File 8: `supabase/functions/market-data/index.ts`**

Currently each invocation inserts 1 price record per stock. To build chart history faster:

Changes:
- Add a `seed_history` mode that can be triggered with a request body parameter `{ "seed": true, "days": 90 }`
- When seed mode is active, generate 90 days of historical OHLC data using the random walk algorithm, inserting one record per day per stock
- This populates the `stock_prices` table with enough data for meaningful charts across all timeframes
- Normal invocations continue to insert a single current price as before

---

## Files Summary

| # | File | Changes |
|---|------|---------|
| 1 | `src/hooks/useBackendData.tsx` | Skip Django calls when backend URL is localhost or unset |
| 2 | `src/components/trading/TradingChart.tsx` | Compute real RSI, MACD, SMA, Bollinger from OHLC data |
| 3 | `src/components/trading/NewsFeed.tsx` | Remove `mockNews`, use empty initial state, load from `posts` |
| 4 | `src/components/trading/ResearchPanel.tsx` | Replace hardcoded fundamentals/news with live data or N/A |
| 5 | `src/pages/News.tsx` | Replace `DUMMY_NEWS` with live `posts` table data |
| 6 | `src/pages/Portfolio.tsx` | Remove hardcoded performance metrics |
| 7 | `src/contexts/FinancialDataContext.tsx` | Remove hardcoded weekly/monthly change percentages |
| 8 | `supabase/functions/market-data/index.ts` | Add `seed_history` mode for chart data backfill |

---

## Post-Implementation: Seed Historical Data

After deployment, invoke the edge function once with seed mode to populate 90 days of chart history:
```
supabase.functions.invoke('market-data', { body: { seed: true, days: 90 } })
```

This gives the TradingChart enough data points for all timeframes (1D through 1Y).

---

## Note on MARKETSTACK_API_KEY

The secrets scan shows only `LOVABLE_API_KEY` exists. The market-data edge function's fallback price generator is working correctly (DB has data). If you have added the key through a different mechanism or plan to add it, the function will automatically use real Marketstack data when available. The app will work fully with or without it.

