
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

    try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const MARKETSTACK_KEY = Deno.env.get('MARKETSTACK_API_KEY') ?? '';

    // Realistic Kenyan stock data with proper price movements (preferred: Marketstack)
    const kenyaStocks = [
      { symbol: 'SCOM', basePrice: 28.50, volatility: 0.03 },
      { symbol: 'EQTY', basePrice: 45.75, volatility: 0.025 },
      { symbol: 'KCB', basePrice: 38.25, volatility: 0.025 },
      { symbol: 'COOP', basePrice: 12.85, volatility: 0.02 },
      { symbol: 'BAT', basePrice: 550.00, volatility: 0.015 },
      { symbol: 'EABL', basePrice: 146.00, volatility: 0.02 },
      { symbol: 'ABSA', basePrice: 14.20, volatility: 0.025 },
      { symbol: 'DTBK', basePrice: 95.50, volatility: 0.02 },
      { symbol: 'SCBK', basePrice: 180.00, volatility: 0.015 },
      { symbol: 'NBK', basePrice: 8.45, volatility: 0.03 }
    ];
    
    // Helper: try to fetch recent EOD data for a symbol from Marketstack
    async function fetchFromMarketstack(symbol: string) {
      if (!MARKETSTACK_KEY) return null;
      try {
        const url = `https://api.marketstack.com/v1/eod?access_key=${encodeURIComponent(MARKETSTACK_KEY)}&symbols=${encodeURIComponent(symbol)}&limit=1`;
        const res = await fetch(url);
        if (!res.ok) return null;
        const json = await res.json();
        const item = json.data && json.data.length ? json.data[0] : null;
        if (!item) return null;
        return {
          price: Number(item.close),
          high: Number(item.high),
          low: Number(item.low),
          open: Number(item.open),
          volume: item.volume ? Number(item.volume) : Math.floor(Math.random() * 500000),
          timestamp: item.date
        };
      } catch (e) {
        console.error('Marketstack fetch error for', symbol, e);
        return null;
      }
    }

    for (const stockInfo of kenyaStocks) {
      // Get or create stock
      let { data: stock } = await supabaseClient
        .from('stocks')
        .select('id')
        .eq('symbol', stockInfo.symbol)
        .single();

      if (!stock) {
        const { data: newStock } = await supabaseClient
          .from('stocks')
          .insert({
            symbol: stockInfo.symbol,
            name: getStockName(stockInfo.symbol),
            sector: getStockSector(stockInfo.symbol),
            is_active: true
          })
          .select('id')
          .single();
        stock = newStock;
      }

      if (stock) {
        // Prefer Marketstack data when available
        const ms = await fetchFromMarketstack(stockInfo.symbol).catch(() => null);
        let price: number, high: number, low: number, volume: number, open: number;

        if (ms) {
          price = ms.price;
          high = ms.high;
          low = ms.low;
          volume = ms.volume;
          open = ms.open;
        } else {
          // Fallback: simulate realistic price movement
          const priceChange = (Math.random() - 0.5) * stockInfo.volatility * 2;
          price = Math.max(0.01, stockInfo.basePrice * (1 + priceChange));
          volume = Math.floor(Math.random() * 500000) + 50000;
          high = price * (1 + Math.random() * 0.02);
          low = price * (1 - Math.random() * 0.02);
          open = Number((price * 0.998).toFixed(2));
        }

        // Insert new price data
        await supabaseClient
          .from('stock_prices')
          .insert({
            stock_id: stock.id,
            price: Number(price.toFixed(2)),
            volume,
            high: Number(high.toFixed(2)),
            low: Number(low.toFixed(2)),
            open: Number(open.toFixed(2)),
            close: Number(price.toFixed(2))
          });

        // Update current price in holdings for demo users
        const { data: holdings } = await supabaseClient
          .from('holdings')
          .select('id, quantity, average_price')
          .eq('stock_id', stock.id);

        if (holdings) {
          for (const holding of holdings) {
            await supabaseClient
              .from('holdings')
              .update({ 
                current_price: Number(price.toFixed(2)),
                market_value: holding.quantity * price,
                unrealized_pnl: (price - holding.average_price) * holding.quantity
              })
              .eq('id', holding.id);
          }
        }
      }
    }

    // Update market indices with realistic movements
    const indices = [
      { symbol: 'NSE20', name: 'NSE 20 Share Index', baseValue: 1850.50 },
      { symbol: 'NASI', name: 'NSE All Share Index', baseValue: 125.75 },
      { symbol: 'NSE25', name: 'NSE 25 Share Index', baseValue: 3420.80 }
    ];

    for (const index of indices) {
      const changePercent = (Math.random() - 0.5) * 2; // ±1% change
      const newValue = index.baseValue * (1 + changePercent / 100);
      const changeValue = newValue - index.baseValue;
      
      await supabaseClient
        .from('market_data')
        .upsert({
          symbol: index.symbol,
          name: index.name,
          value: Number(newValue.toFixed(2)),
          change_value: Number(changeValue.toFixed(2)),
          change_percent: Number(changePercent.toFixed(2)),
          timestamp: new Date().toISOString()
        }, { onConflict: 'symbol' });
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Market data updated with realistic movements' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error updating market data:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getStockName(symbol: string): string {
  const names: { [key: string]: string } = {
    'SCOM': 'Safaricom PLC',
    'EQTY': 'Equity Group Holdings',
    'KCB': 'KCB Group PLC',
    'COOP': 'Co-operative Bank',
    'BAT': 'British American Tobacco',
    'EABL': 'East African Breweries',
    'ABSA': 'Absa Bank Kenya',
    'DTBK': 'Diamond Trust Bank',
    'SCBK': 'Standard Chartered Bank',
    'NBK': 'National Bank of Kenya'
  };
  return names[symbol] || symbol;
}

function getStockSector(symbol: string): string {
  const sectors: { [key: string]: string } = {
    'SCOM': 'Telecommunications',
    'EQTY': 'Banking',
    'KCB': 'Banking',
    'COOP': 'Banking',
    'BAT': 'Manufacturing',
    'EABL': 'Manufacturing',
    'ABSA': 'Banking',
    'DTBK': 'Banking',
    'SCBK': 'Banking',
    'NBK': 'Banking'
  };
  return sectors[symbol] || 'Other';
}
