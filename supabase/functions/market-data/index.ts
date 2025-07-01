
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

    // Simulate real-time market data updates
    const stocks = ['SCOM', 'EQTY', 'KCB', 'COOP', 'BAT', 'EABL', 'ABSA', 'DTBK', 'SCBK', 'NBK'];
    
    for (const symbol of stocks) {
      // Get current stock
      const { data: stock } = await supabaseClient
        .from('stocks')
        .select('id')
        .eq('symbol', symbol)
        .single();

      if (stock) {
        // Generate realistic price data
        const basePrice = Math.random() * 100 + 20; // Random price between 20-120
        const price = Math.round(basePrice * 100) / 100;
        const volume = Math.floor(Math.random() * 1000000) + 10000;
        
        // Insert new price data
        await supabaseClient
          .from('stock_prices')
          .insert({
            stock_id: stock.id,
            price,
            volume,
            high: price * 1.02,
            low: price * 0.98,
            open: price * 0.99,
            close: price
          });
      }
    }

    // Update market indices
    const indices = [
      { symbol: 'NSE20', value: 1850.50 + (Math.random() - 0.5) * 20 },
      { symbol: 'NASI', value: 125.75 + (Math.random() - 0.5) * 5 },
      { symbol: 'NSE25', value: 3420.80 + (Math.random() - 0.5) * 50 }
    ];

    for (const index of indices) {
      const change_value = (Math.random() - 0.5) * 10;
      const change_percent = (change_value / index.value) * 100;
      
      await supabaseClient
        .from('market_data')
        .upsert({
          symbol: index.symbol,
          name: index.symbol === 'NSE20' ? 'NSE 20 Share Index' : 
                index.symbol === 'NASI' ? 'NSE All Share Index' : 'NSE 25 Share Index',
          value: Math.round(index.value * 100) / 100,
          change_value: Math.round(change_value * 100) / 100,
          change_percent: Math.round(change_percent * 100) / 100,
          timestamp: new Date().toISOString()
        }, { onConflict: 'symbol' });
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Market data updated' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error updating market data:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
