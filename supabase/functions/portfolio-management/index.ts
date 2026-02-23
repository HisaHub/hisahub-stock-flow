import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const baseSchema = z.object({
  action: z.enum(['create_portfolio', 'place_order', 'get_portfolio_summary']),
});

const createPortfolioSchema = z.object({
  action: z.literal('create_portfolio'),
  name: z.string().min(1).max(100).default('Portfolio'),
  initial_balance: z.number().min(0).max(100000000).default(0),
  is_demo: z.boolean().default(false),
});

const placeOrderSchema = z.object({
  action: z.literal('place_order'),
  portfolio_id: z.string().uuid(),
  stock_symbol: z.string().min(1).max(10),
  quantity: z.number().int().min(-10000).max(10000).refine(v => v !== 0, 'Quantity cannot be zero'),
  order_type: z.enum(['market', 'limit', 'stop_loss', 'stop_limit']).default('market'),
});

const getPortfolioSummarySchema = z.object({
  action: z.literal('get_portfolio_summary'),
  portfolio_id: z.string().uuid(),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth verification
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const userId = claimsData.claims.sub as string;

    // Parse body once
    const body = await req.json();
    const { action } = baseSchema.parse(body);

    switch (action) {
      case 'create_portfolio': {
        const { name, initial_balance, is_demo } = createPortfolioSchema.parse(body);
        const { data: newPortfolio } = await userClient
          .from('portfolios')
          .insert({
            user_id: userId,
            name,
            is_default: false,
            cash_balance: initial_balance,
          })
          .select()
          .single();

        return new Response(
          JSON.stringify({ success: true, portfolio: newPortfolio }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'place_order': {
        const { portfolio_id, stock_symbol, quantity, order_type } = placeOrderSchema.parse(body);

        // Verify portfolio ownership
        const { data: portfolio, error: portfolioError } = await userClient
          .from('portfolios')
          .select('id, cash_balance')
          .eq('id', portfolio_id)
          .eq('user_id', userId)
          .single();

        if (portfolioError || !portfolio) {
          return new Response(
            JSON.stringify({ error: 'Portfolio not found or access denied' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get stock
        const { data: stock } = await userClient
          .from('stocks')
          .select('id')
          .eq('symbol', stock_symbol)
          .single();

        if (!stock) {
          throw new Error('Stock not found');
        }

        // Get latest price
        const { data: latestPrice } = await userClient
          .from('stock_prices')
          .select('price')
          .eq('stock_id', stock.id)
          .order('timestamp', { ascending: false })
          .limit(1)
          .single();

        if (!latestPrice) {
          throw new Error('No live price available for this stock');
        }
        const price = latestPrice.price;
        const totalCost = Math.abs(quantity) * price;

        if (quantity > 0 && totalCost > portfolio.cash_balance) {
          throw new Error('Insufficient funds for this trade');
        }

        // Create order
        const { data: order } = await userClient
          .from('orders')
          .insert({
            user_id: userId,
            portfolio_id,
            stock_id: stock.id,
            order_type,
            side: quantity > 0 ? 'buy' : 'sell',
            quantity: Math.abs(quantity),
            price: order_type === 'market' ? price : null,
            status: 'filled'
          })
          .select()
          .single();

        // Create transaction
        const brokerFee = totalCost * 0.005;
        await userClient
          .from('transactions')
          .insert({
            user_id: userId,
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
        const newCashBalance = quantity > 0 
          ? portfolio.cash_balance - totalCost - brokerFee
          : portfolio.cash_balance + totalCost - brokerFee;

        await userClient
          .from('portfolios')
          .update({ cash_balance: newCashBalance })
          .eq('id', portfolio_id);

        // Update or create holding
        const { data: existingHolding } = await userClient
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
            await userClient
              .from('holdings')
              .update({
                quantity: newQuantity,
                average_price: newAveragePrice,
                current_price: price,
                unrealized_pnl: (price - newAveragePrice) * newQuantity
              })
              .eq('id', existingHolding.id);
          } else {
            await userClient
              .from('holdings')
              .delete()
              .eq('id', existingHolding.id);
          }
        } else if (quantity > 0) {
          await userClient
            .from('holdings')
            .insert({
              portfolio_id,
              stock_id: stock.id,
              quantity,
              average_price: price,
              current_price: price,
              unrealized_pnl: 0
            });
        }

        return new Response(
          JSON.stringify({ success: true, order }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_portfolio_summary': {
        const { portfolio_id } = getPortfolioSummarySchema.parse(body);

        // Verify portfolio ownership
        const { data: portfolioInfo, error: portfolioError } = await userClient
          .from('portfolios')
          .select('cash_balance')
          .eq('id', portfolio_id)
          .eq('user_id', userId)
          .single();

        if (portfolioError || !portfolioInfo) {
          return new Response(
            JSON.stringify({ error: 'Portfolio not found or access denied' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data: holdings } = await userClient
          .from('holdings')
          .select(`
            *,
            stocks:stock_id (symbol, name)
          `)
          .eq('portfolio_id', portfolio_id);

        let totalValue = portfolioInfo?.cash_balance || 0;
        const processedHoldings = [];
        for (const holding of holdings || []) {
          const { data: latest } = await userClient
            .from('stock_prices')
            .select('price')
            .eq('stock_id', holding.stock_id)
            .order('timestamp', { ascending: false })
            .limit(1)
            .maybeSingle();

          const currentPrice = latest?.price ?? holding.current_price ?? 0;
          const marketValue = holding.quantity * currentPrice;
          const unrealizedPnL = marketValue - (holding.quantity * holding.average_price);
          totalValue += marketValue;

          processedHoldings.push({
            ...holding,
            current_price: Number(currentPrice.toFixed(2)),
            market_value: Number(marketValue.toFixed(2)),
            unrealized_pnl: Number(unrealizedPnL.toFixed(2))
          });
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            holdings: processedHoldings,
            total_value: Number(totalValue.toFixed(2)),
            cash_balance: portfolioInfo?.cash_balance || 0
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: error.errors.map(e => e.message) }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    console.error('Portfolio management error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'An internal error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
