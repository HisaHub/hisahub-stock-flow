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
    const { message, user_id, session_id } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch user's portfolio context
    const { data: portfolio } = await supabase
      .from('portfolios')
      .select(`
        *,
        holdings:holdings(
          *,
          stock:stocks(symbol, name, current_price)
        )
      `)
      .eq('user_id', user_id)
      .single();

    // Fetch recent market data
    const { data: trendingStocks } = await supabase
      .from('trending_tickers')
      .select('*')
      .order('mentions', { ascending: false })
      .limit(5);

    // Fetch user's watchlist
    const { data: watchlist } = await supabase
      .from('watchlists')
      .select('stocks(*)')
      .eq('user_id', user_id)
      .limit(5);

    // Build context for AI
    const portfolioContext = portfolio
      ? `Current Portfolio Value: KES ${portfolio.total_value?.toLocaleString() || 0}
Holdings: ${portfolio.holdings?.map((h: any) => 
  `${h.stock.symbol} (${h.quantity} shares @ KES ${h.stock.current_price})`
).join(', ') || 'None'}`
      : 'No portfolio data available';

    const marketContext = `
Trending Stocks Today: ${trendingStocks?.map(s => s.symbol).join(', ') || 'None'}
User Watchlist: ${watchlist?.map((w: any) => w.stocks.symbol).join(', ') || 'None'}`;

    // Fetch conversation history
    let conversationHistory: any[] = [];
    if (session_id) {
      const { data: messages } = await supabase
        .from('chat_messages')
        .select('role, content')
        .eq('session_id', session_id)
        .order('created_at', { ascending: true })
        .limit(10);

      conversationHistory = messages || [];
    }

    // Create or get chat session
    let currentSessionId = session_id;
    if (!currentSessionId) {
      const { data: newSession, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({ user_id })
        .select()
        .single();

      if (sessionError) {
        console.error('Error creating session:', sessionError);
      } else {
        currentSessionId = newSession.id;
      }
    }

    // Call Lovable AI
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are Invisa AI, an intelligent trading assistant for HisaHub, a Kenyan stock trading platform focused on the Nairobi Securities Exchange (NSE).

Context about the user:
${portfolioContext}

Market Context:
${marketContext}

Your role:
- Provide insightful analysis of stocks, portfolios, and market trends
- Answer questions about trading strategies specific to NSE
- Help users understand their portfolio performance
- Suggest potential investment opportunities based on trends
- Be concise, friendly, and actionable
- Use KES currency format
- Reference Kenyan market specifics when relevant

Guidelines:
- Keep responses under 100 words unless asked for detailed analysis
- Use emojis sparingly but effectively 📈 💰 📊
- Always remind users that you provide information, not financial advice
- Be encouraging and supportive of their trading journey`
          },
          ...conversationHistory,
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Save messages to database
    if (currentSessionId) {
      await supabase.from('chat_messages').insert([
        { session_id: currentSessionId, role: 'user', content: message },
        { session_id: currentSessionId, role: 'assistant', content: aiResponse }
      ]);

      // Update session last activity
      await supabase
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', currentSessionId);
    }

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        session_id: currentSessionId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        response: "I'm having trouble connecting right now. Please try again in a moment." 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
