
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
            name: 'Demo Portfolio',
            is_default: true,
            cash_balance: 10000, // KES 10,000 demo balance
            is_demo: true
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

        // Get latest stock price with realistic demo pricing
        let price = 0;
        const { data: latestPrice } = await supabaseClient
          .from('stock_prices')
          .select('price')
          .eq('stock_id', stock.id)
          .order('timestamp', { ascending: false })
          .limit(1)
          .single();

        if (latestPrice) {
          price = latestPrice.price;
        } else {
          // Generate realistic demo prices for Kenyan stocks
          const demoPrices: { [key: string]: number } = {
            'SCOM': 28.50,
            'EQTY': 45.75,
            'KCB': 38.25,
            'COOP': 12.85,
            'BAT': 550.00,
            'EABL': 146.00,
            'ABSA': 14.20,
            'DTBK': 95.50,
            'SCBK': 180.00,
            'NBK': 8.45
          };
          price = demoPrices[stock_symbol] || 25.00;
        }

        // Check portfolio balance for buy orders
        const { data: portfolio } = await supabaseClient
          .from('portfolios')
          .select('cash_balance')
          .eq('id', portfolio_id)
          .single();

        const totalCost = Math.abs(quantity) * price;
        
        if (quantity > 0 && portfolio && totalCost > portfolio.cash_balance) {
          throw new Error('Insufficient funds for this trade');
        }

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
        const brokerFee = totalCost * 0.005; // 0.5% fee
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
            amount: totalCost,
            fees: brokerFee
          });

        // Update portfolio cash balance
        if (!portfolio) {
          throw new Error('Portfolio not found');
        }
        
        const newCashBalance = quantity > 0 
          ? portfolio.cash_balance - totalCost - brokerFee
          : portfolio.cash_balance + totalCost - brokerFee;

        await supabaseClient
          .from('portfolios')
          .update({ cash_balance: newCashBalance })
          .eq('id', portfolio_id);

        // Update or create holding
        const { data: existingHolding } = await supabaseClient
          .from('holdings')
          .select('*')
          .eq('portfolio_id', portfolio_id)
          .eq('stock_id', stock.id)
          .single();

        if (existingHolding) {
          const newQuantity = existingHolding.quantity + quantity;
          
          if (newQuantity > 0) {
            const newAveragePrice = 
              ((existingHolding.quantity * existingHolding.average_price) + (quantity * price)) / newQuantity;

            await supabaseClient
              .from('holdings')
              .update({
                quantity: newQuantity,
                average_price: newAveragePrice,
                current_price: price,
                market_value: newQuantity * price,
                unrealized_pnl: (price - newAveragePrice) * newQuantity
              })
              .eq('id', existingHolding.id);
          } else {
            // Remove holding if quantity becomes 0 or negative
            await supabaseClient
              .from('holdings')
              .delete()
              .eq('id', existingHolding.id);
          }
        } else if (quantity > 0) {
          await supabaseClient
            .from('holdings')
            .insert({
              portfolio_id,
              stock_id: stock.id,
              quantity,
              average_price: price,
              current_price: price,
              market_value: quantity * price,
              unrealized_pnl: 0
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
            stocks:stock_id (symbol, name)
          `)
          .eq('portfolio_id', portfolio_id);

        const { data: portfolioInfo } = await supabaseClient
          .from('portfolios')
          .select('cash_balance')
          .eq('id', portfolio_id)
          .single();

        let totalValue = portfolioInfo?.cash_balance || 0;
        const processedHoldings = holdings?.map(holding => {
          // Add realistic price fluctuations for demo
          const priceVariation = (Math.random() - 0.5) * 0.1; // ±5% variation
          const currentPrice = holding.current_price * (1 + priceVariation);
          const marketValue = holding.quantity * currentPrice;
          const unrealizedPnL = marketValue - (holding.quantity * holding.average_price);
          
          totalValue += marketValue;

          return {
            ...holding,
            current_price: Number(currentPrice.toFixed(2)),
            market_value: Number(marketValue.toFixed(2)),
            unrealized_pnl: Number(unrealizedPnL.toFixed(2))
          };
        }) || [];

        return new Response(
          JSON.stringify({ 
            success: true, 
            holdings: processedHoldings,
            total_value: Number(totalValue.toFixed(2)),
            cash_balance: portfolioInfo?.cash_balance || 0
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Portfolio management error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
