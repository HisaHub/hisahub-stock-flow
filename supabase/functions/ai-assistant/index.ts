import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const inputSchema = z.object({
  message: z.string().min(1).max(5000),
  session_id: z.string().uuid().optional().nullable(),
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

    // Input validation
    const body = await req.json();
    const { message, session_id: sessionId } = inputSchema.parse(body);

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    // Get user's portfolio context for personalized advice
    const { data: portfolios } = await supabaseClient
      .from('portfolios')
      .select(`
        *,
        holdings:holdings (
          *,
          stocks:stock_id (symbol, name, sector)
        )
      `)
      .eq('user_id', userId);

    const portfolioContext = portfolios?.map(p => ({
      name: p.name,
      holdings: p.holdings?.map((h: any) => ({
        stock: h.stocks?.symbol,
        quantity: h.quantity,
        sector: h.stocks?.sector
      }))
    }));

    // Create or get chat session
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      const { data: newSession } = await supabaseClient
        .from('chat_sessions')
        .insert({
          user_id: userId,
          title: 'Investment Chat',
          context: { portfolios: portfolioContext }
        })
        .select()
        .single();
      
      currentSessionId = newSession?.id;
    }

    // Get recent chat history
    const { data: chatHistory } = await supabaseClient
      .from('chat_messages')
      .select('role, content')
      .eq('session_id', currentSessionId)
      .order('created_at', { ascending: true })
      .limit(10);

    const messages = [
      {
        role: 'system',
        content: `You are Hisa AI, a knowledgeable Kenyan investment advisor specializing in the Nairobi Securities Exchange (NSE). 
        
        User's Portfolio Context: ${JSON.stringify(portfolioContext)}
        
        Provide personalized investment advice considering:
        - Kenyan market conditions and NSE-listed stocks
        - User's current portfolio diversification
        - Risk management strategies
        - Local economic factors affecting the market
        
        Keep responses concise, practical, and relevant to Kenyan investors. Use KES currency and reference NSE stocks when appropriate.`
      },
      ...(chatHistory || []),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Save user message
    await supabaseClient
      .from('chat_messages')
      .insert({
        session_id: currentSessionId,
        role: 'user',
        content: message
      });

    // Save AI response
    await supabaseClient
      .from('chat_messages')
      .insert({
        session_id: currentSessionId,
        role: 'assistant',
        content: aiResponse
      });

    return new Response(
      JSON.stringify({ 
        response: aiResponse, 
        session_id: currentSessionId 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: error.errors.map(e => e.message) }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    console.error('AI Assistant error:', error);
    return new Response(
      JSON.stringify({ error: 'An internal error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
