
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

    const { action, user_id, notification_id } = await req.json();

    switch (action) {
      case 'check_price_alerts':
        // Get active price alerts
        const { data: alerts } = await supabaseClient
          .from('price_alerts')
          .select(`
            *,
            stocks:stock_id (symbol, name),
            stock_prices:stock_id (price)
          `)
          .eq('is_active', true);

        if (alerts) {
          for (const alert of alerts) {
            const currentPrice = alert.stock_prices?.[0]?.price;
            if (!currentPrice) continue;

            let shouldTrigger = false;
            if (alert.condition === 'above' && currentPrice >= alert.target_price) {
              shouldTrigger = true;
            } else if (alert.condition === 'below' && currentPrice <= alert.target_price) {
              shouldTrigger = true;
            }

            if (shouldTrigger) {
              // Create notification
              await supabaseClient
                .from('notifications')
                .insert({
                  user_id: alert.user_id,
                  type: 'price_alert',
                  title: `Price Alert: ${alert.stocks?.symbol}`,
                  message: `${alert.stocks?.name} has reached KES ${currentPrice.toFixed(2)} (${alert.condition} KES ${alert.target_price.toFixed(2)})`,
                  data: {
                    stock_symbol: alert.stocks?.symbol,
                    current_price: currentPrice,
                    target_price: alert.target_price,
                    condition: alert.condition
                  }
                });

              // Deactivate alert
              await supabaseClient
                .from('price_alerts')
                .update({ 
                  is_active: false, 
                  triggered_at: new Date().toISOString() 
                })
                .eq('id', alert.id);
            }
          }
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'mark_read':
        await supabaseClient
          .from('notifications')
          .update({ is_read: true })
          .eq('id', notification_id)
          .eq('user_id', user_id);

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'get_notifications':
        const { data: notifications } = await supabaseClient
          .from('notifications')
          .select('*')
          .eq('user_id', user_id)
          .order('created_at', { ascending: false })
          .limit(50);

        return new Response(
          JSON.stringify({ notifications }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Notifications error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
