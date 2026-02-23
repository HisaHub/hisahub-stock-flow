import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const inputSchema = z.object({
  action: z.enum(['check_price_alerts', 'mark_read', 'get_notifications']),
  notification_id: z.string().uuid().optional(),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Input validation
    const body = await req.json();
    const { action, notification_id } = inputSchema.parse(body);

    // check_price_alerts is a system/cron action - uses SERVICE_ROLE, no user auth needed
    if (action === 'check_price_alerts') {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

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

            await supabaseClient
              .from('price_alerts')
              .update({ is_active: false, triggered_at: new Date().toISOString() })
              .eq('id', alert.id);
          }
        }
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // User-facing actions require authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const userId = claimsData.claims.sub as string;

    // Use SERVICE_ROLE for DB operations but with verified userId
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    switch (action) {
      case 'mark_read':
        if (!notification_id) {
          return new Response(
            JSON.stringify({ error: 'notification_id is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        await adminClient
          .from('notifications')
          .update({ is_read: true })
          .eq('id', notification_id)
          .eq('user_id', userId);

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'get_notifications':
        const { data: notifications } = await adminClient
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
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
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: error.errors.map(e => e.message) }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    console.error('Notifications error:', error);
    return new Response(
      JSON.stringify({ error: 'An internal error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
