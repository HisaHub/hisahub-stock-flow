

# Comprehensive Fix Plan: Build Errors + Live Data Integration

## Problem Summary

The app has **21 TypeScript build errors** across 3 files, plus multiple components still using hardcoded mock data instead of live Supabase data. The `MARKETSTACK_API_KEY` secret also needs to be added to Supabase (only `LOVABLE_API_KEY` exists currently).

---

## Phase 1: Fix TypeScript Build Errors

### 1.1 Fix `FinancialDataContext.tsx` -- Update interfaces to match DB schema

The root cause of most errors is that the `Stock`, `Holding`, and `Transaction` interfaces are missing fields that exist in the database or are used by components.

**Changes:**
- Add `currency` to `Stock` interface (exists in `stocks` table)
- Add `currency` and `sector` to `Holding` interface
- Expand `stocks` optional type to include `sector` and `currency`
- Update `Transaction` interface to include `amount`, `order_type`, `created_at`, and `currency` (all exist in DB schema)
- Add `ADD_FUNDS` reducer case so `AccountSummaryCard` deposit/withdraw buttons work

### 1.2 Fix `PositionsOrders.tsx` -- Use correct Transaction fields

**4 errors** referencing `order_type`, `orderType`, `timestamp`, `created_at` which don't exist on `Transaction`.

**Changes:**
- Replace `order.order_type || order.orderType` with `order.order_type` (now added to interface)
- Replace `order.timestamp || order.created_at` with `order.created_at` (now added to interface)

### 1.3 Fix `Portfolio.tsx` -- Use correct field paths

**17 errors** referencing `sector`, `currency`, `amount`, `ex_date`, `pay_date` on wrong types.

**Changes:**
- Line 43: Change `h.stocks.sector` and `h.sector` to use the new `sector` field on Holding
- Lines 57-59: Replace `tx.amount` with `tx.total` (which exists), remove `tx.ex_date` and `tx.pay_date` (don't exist in DB)
- Lines 162-283: Replace all `holding.currency ?? holding.stocks?.currency` and `tx.currency` with the new fields from the updated interfaces

### 1.4 Fix `Trade.tsx` -- Use currency from Stock

**2 errors** referencing `stock.currency`.

**Changes:**
- Lines 68, 85: `stock.currency` will work after adding `currency` to the `Stock` interface

---

## Phase 2: Fix Market Data Edge Function + Add Fallback

### 2.1 Fix `supabase/functions/market-data/index.ts`

The previous security fix already corrected the `price` variable bug. Now add a **fallback price generator** so the app shows data even when the Marketstack API key is missing or the API fails:

- When `fetchFromMarketstack` returns null, generate a realistic price using the stock's `basePrice` and `volatility` with a random walk
- Also insert market index data (NSE20, NASI, NSE25) into the `market_data` table
- Deploy the updated function

### 2.2 Fix `useMarketData.tsx` -- Fetch 2 prices for change calculation

Currently fetches only 1 `stock_prices` record per stock but tries to compute change from 2 -- always returns 0.

**Changes:**
- Change `.limit(1, { foreignTable: 'stock_prices' })` to `.limit(2, { foreignTable: 'stock_prices' })`
- Include `currency` and `sector` from the `stocks` table in the select query
- This enables real change/changePercent calculations

---

## Phase 3: Replace Mock Data with Live Data

### 3.1 `OpenPositionsCard.tsx` -- Replace hardcoded positions

Currently has 3 hardcoded positions (SCOM, EQTY, KCB). Replace with live `state.holdings` from `FinancialDataContext`.

**Changes:**
- Import and use `useFinancialData`
- Replace `positions` array with `state.holdings` mapped to the display format
- Show "No open positions" empty state when holdings array is empty

### 3.2 `News.tsx` -- Replace DUMMY data with live data

Currently uses `DUMMY_NEWS`, `DUMMY_ARTICLES`, `DUMMY_FINANCIALS` arrays.

**Changes:**
- Import `useFinancialData` context
- Replace `DUMMY_FINANCIALS` with `state.stocks` mapped to show symbol, name, price, and change
- Update CSV download to export live stock data
- Keep `DUMMY_NEWS` and `DUMMY_ARTICLES` as static content (no news table exists in DB)

### 3.3 `MarketOverviewSection.tsx` -- Add market indices

Currently only shows stocks. Add a section for market indices (NSE20, NASI, NSE25) from `state.marketIndices`.

**Changes:**
- Display `state.marketIndices` in a separate row below stocks
- Show index name, value, change, and change percent

### 3.4 `Portfolio.tsx` -- Remove hardcoded performance values

**Changes:**
- Replace hardcoded dividend total `KES 530.00` with computed sum from dividend transactions
- Replace hardcoded performance metrics (Total Return 30.8%, etc.) with computed values based on portfolio data, or show "N/A"
- Keep `performanceData` chart array as-is (last value already uses live `portfolioData.totalValue`)

---

## Phase 4: Propagate Live Data Through Data Layer

### 4.1 `FinancialDataContext.tsx` -- Enhanced SET_HOLDINGS transform

When transforming holdings, propagate `sector` and `currency` from the joined `stocks` data:

```
sector: holding.stocks?.sector || 'Other',
currency: holding.stocks?.currency || 'KES',
```

### 4.2 `useMarketData.tsx` -- Include new fields in processed stocks

Add `currency` and `sector` to the processed stock objects so they flow through the entire app.

### 4.3 `FinancialDataContext.tsx` -- Update stock mapping

When mapping `backendStocks` to the `Stock` interface, include `currency` (default `'KES'`).

---

## Phase 5: Deploy and Verify

### 5.1 Deploy fixed `market-data` edge function

### 5.2 Invoke market-data to seed initial price data

---

## Files to Modify (11 files)

| # | File | Changes |
|---|------|---------|
| 1 | `src/contexts/FinancialDataContext.tsx` | Add `currency` to Stock, add `currency`/`sector` to Holding, expand Transaction, add `ADD_FUNDS` reducer, propagate fields in SET_HOLDINGS |
| 2 | `src/components/trading/PositionsOrders.tsx` | Fix `order_type` and `created_at` references |
| 3 | `src/pages/Portfolio.tsx` | Fix sector/currency/amount/ex_date/pay_date references, compute dividend total, replace hardcoded metrics |
| 4 | `src/pages/Trade.tsx` | No changes needed (will work after Stock interface update) |
| 5 | `src/hooks/useMarketData.tsx` | Fetch 2 prices, include currency/sector in select and processed output |
| 6 | `src/components/home/OpenPositionsCard.tsx` | Replace hardcoded positions with live holdings |
| 7 | `src/pages/News.tsx` | Replace DUMMY_FINANCIALS with live stock data |
| 8 | `src/components/home/MarketOverviewSection.tsx` | Add market indices section |
| 9 | `src/components/home/AccountSummaryCard.tsx` | No changes needed (will work after ADD_FUNDS reducer) |
| 10 | `supabase/functions/market-data/index.ts` | Add fallback price generator, add market index inserts |
| 11 | `src/pages/Portfolio.tsx` | Compute dividend total dynamically, replace hardcoded performance % |

---

## Required User Action

**Add `MARKETSTACK_API_KEY` to Supabase Edge Function secrets.** Currently only `LOVABLE_API_KEY` exists. The fallback generator will ensure the app works without it, but real NSE data requires this key.

