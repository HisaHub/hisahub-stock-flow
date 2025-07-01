
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
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { action, user_id, portfolio_id, stock_symbol, quantity, order_type = 'market' } = await req.json();

    switch (action) {
      case 'create_portfolio':
        const { data: newPortfolio } = await supabaseClient
          .from('portfolios')
          .insert({
            user_id,
            name: 'Main Portfolio',
            is_default: true
          })
          .select()
          .single();

        return new Response(
          JSON.stringify({ success: true, portfolio: newPortfolio }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'place_order':
        // Get stock information
        const { data: stock } = await supabaseClient
          .from('stocks')
          .select('id')
          .eq('symbol', stock_symbol)
          .single();

        if (!stock) {
          throw new Error('Stock not found');
        }

        // Get latest stock price
        const { data: latestPrice } = await supabaseClient
          .from('stock_prices')
          .select('price')
          .eq('stock_id', stock.id)
          .order('timestamp', { ascending: false })
          .limit(1)
          .single();

        const price = latestPrice?.price || 0;

        // Create order
        const { data: order } = await supabaseClient
          .from('orders')
          .insert({
            user_id,
            portfolio_id,
            stock_id: stock.id,
            order_type,
            side: quantity > 0 ? 'buy' : 'sell',
            quantity: Math.abs(quantity),
            price: order_type === 'market' ? price : null,
            status: 'filled' // Simulate immediate execution for demo
          })
          .select()
          .single();

        // Create transaction
        await supabaseClient
          .from('transactions')
          .insert({
            user_id,
            portfolio_id,
            order_id: order.id,
            stock_id: stock.id,
            type: quantity > 0 ? 'buy' : 'sell',
            quantity: Math.abs(quantity),
            price,
            amount: Math.abs(quantity) * price,
            fees: Math.abs(quantity) * price * 0.005 // 0.5% fee
          });

        // Update or create holding
        const { data: existingHolding } = await supabaseClient
          .from('holdings')
          .select('*')
          .eq('portfolio_id', portfolio_id)
          .eq('stock_id', stock.id)
          .single();

        if (existingHolding) {
          const newQuantity = existingHolding.quantity + quantity;
          const newAveragePrice = newQuantity > 0 ? 
            ((existingHolding.quantity * existingHolding.average_price) + (quantity * price)) / newQuantity :
            0;

          await supabaseClient
            .from('holdings')
            .update({
              quantity: newQuantity,
              average_price: newAveragePrice,
              current_price: price
            })
            .eq('id', existingHolding.id);
        } else if (quantity > 0) {
          await supabaseClient
            .from('holdings')
            .insert({
              portfolio_id,
              stock_id: stock.id,
              quantity,
              average_price: price,
              current_price: price
            });
        }

        return new Response(
          JSON.stringify({ success: true, order }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'get_portfolio_summary':
        const { data: holdings } = await supabaseClient
          .from('holdings')
          .select(`
            *,
            stocks:stock_id (symbol, name),
            stock_prices:stock_id (price)
          `)
          .eq('portfolio_id', portfolio_id);

        let totalValue = 0;
        const processedHoldings = holdings?.map(holding => {
          const currentPrice = holding.stock_prices?.[0]?.price || holding.current_price;
          const marketValue = holding.quantity * currentPrice;
          const unrealizedPnL = marketValue - (holding.quantity * holding.average_price);
          
          totalValue += marketValue;

          return {
            ...holding,
            current_price: currentPrice,
            market_value: marketValue,
            unrealized_pnl: unrealizedPnL
          };
        }) || [];

        return new Response(
          JSON.stringify({ 
            success: true, 
            holdings: processedHoldings,
            total_value: totalValue
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Portfolio management error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
