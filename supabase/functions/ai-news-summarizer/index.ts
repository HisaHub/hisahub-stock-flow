import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { stock_symbol, news_items, community_posts } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Prepare news context
    const newsContext = news_items.map((item: any) => 
      `[${item.sentiment}] ${item.title}: ${item.summary}`
    ).join('\n');

    // Prepare community context
    const communityContext = community_posts.map((post: any) => 
      `[${post.sentiment}] ${post.user}: ${post.content}`
    ).join('\n');

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
            content: `You are a financial news analyst. Summarize news and community sentiment concisely.`
          },
          {
            role: 'user',
            content: `Summarize the latest news and community sentiment for ${stock_symbol}:

NEWS:
${newsContext}

COMMUNITY SENTIMENT:
${communityContext}

Provide a concise summary covering:
1. Key News Highlights (2-3 points)
2. Overall Market Sentiment (Bullish/Bearish/Neutral with %)
3. Community Consensus & Notable Opinions
4. Main Catalysts or Concerns
5. Short-term Sentiment Outlook

Keep it under 300 words, focused on actionable insights.`
          }
        ],
        max_tokens: 500,
        temperature: 0.6
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content || 'Summary unavailable';

    return new Response(
      JSON.stringify({ 
        success: true, 
        summary 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI news summarizer error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
