Supabase Functions - Market Data
-------------------------------

This folder contains Supabase Edge Functions used by the app. The `market-data` function
now attempts to fetch recent EOD prices from Marketstack (if `MARKETSTACK_API_KEY` is set)
and falls back to simulated realistic data when external data is not available.

Required environment variables (set in Supabase dashboard or locally when testing):

- `SUPABASE_URL` - your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - your service role key (used by functions to write DB)
- `MARKETSTACK_API_KEY` - optional but recommended; used to fetch real market data

How it prioritizes data:
- If Marketstack returns data for a symbol, the function uses that data (price, high, low, volume).
- If Marketstack has no data for a symbol (common for some local tickers), the function simulates realistic movements as a fallback.

Triggering the function:
- The frontend calls this function via `supabase.functions.invoke('market-data')` from `src/hooks/useMarketData.tsx`.

Important:
- Do NOT commit real secret keys into the repository. Use Supabase dashboard or a secure secret manager to store `SUPABASE_SERVICE_ROLE_KEY` and `MARKETSTACK_API_KEY`.
