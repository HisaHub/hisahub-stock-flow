import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const SentimentRequestSchema = z.object({
  post_id: z.string().uuid('Invalid post ID format'),
  content: z.string()
    .min(1, 'Content cannot be empty')
    .max(5000, 'Content too long (max 5000 characters)')
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate input
    const body = await req.json();
    const validatedInput = SentimentRequestSchema.parse(body);
    const { post_id, content } = validatedInput;
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Call Lovable AI for sentiment analysis
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
            content: `You are a financial sentiment analyzer for the Kenyan stock market (NSE). 
            
Analyze trading posts and return sentiment in this EXACT JSON format (no markdown, no code blocks):
{
  "sentiment_label": "bullish" | "bearish" | "neutral",
  "sentiment_score": <number between -1.0 and 1.0>,
  "confidence": <number between 0.0 and 1.0>,
  "reasoning": "<brief explanation>"
}

Sentiment Guidelines:
- "bullish": Positive outlook, buying recommendations, optimistic predictions
- "bearish": Negative outlook, selling recommendations, pessimistic predictions  
- "neutral": Mixed signals, informational posts, questions

Score Scale:
- 1.0: Extremely bullish
- 0.5: Moderately bullish
- 0.0: Neutral
- -0.5: Moderately bearish
- -1.0: Extremely bearish

Consider:
- Stock tickers mentioned ($SCOM, $EQTY, etc.)
- Action words (buy, sell, hold, long, short)
- Price predictions and targets
- Market conditions and economic factors
- Emoji sentiment (🚀 bullish, 📉 bearish)`
          },
          {
            role: 'user',
            content: `Analyze this trading post:\n\n${content}`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_sentiment",
              description: "Return structured sentiment analysis for a trading post",
              parameters: {
                type: "object",
                properties: {
                  sentiment_label: {
                    type: "string",
                    enum: ["bullish", "bearish", "neutral"]
                  },
                  sentiment_score: {
                    type: "number",
                    minimum: -1.0,
                    maximum: 1.0
                  },
                  confidence: {
                    type: "number",
                    minimum: 0.0,
                    maximum: 1.0
                  },
                  reasoning: {
                    type: "string"
                  }
                },
                required: ["sentiment_label", "sentiment_score", "confidence", "reasoning"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "analyze_sentiment" } }
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
    console.log('AI Response:', JSON.stringify(data, null, 2));

    // Extract sentiment from tool call
    let sentiment;
    const choice = data.choices?.[0];
    
    if (choice?.message?.tool_calls?.[0]) {
      const toolCall = choice.message.tool_calls[0];
      sentiment = JSON.parse(toolCall.function.arguments);
    } else {
      // Fallback: try to parse from content
      const contentText = choice?.message?.content || '';
      try {
        sentiment = JSON.parse(contentText);
      } catch {
        console.error('Failed to parse sentiment from AI response');
        throw new Error('Invalid AI response format');
      }
    }

    console.log('Parsed sentiment:', sentiment);

    // Update post with sentiment data
    const { error: updateError } = await supabaseClient
      .from('posts')
      .update({
        sentiment_score: sentiment.sentiment_score,
        sentiment_label: sentiment.sentiment_label,
        sentiment_confidence: sentiment.confidence,
        ai_analyzed_at: new Date().toISOString()
      })
      .eq('id', post_id);

    if (updateError) {
      console.error('Error updating post:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        sentiment 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid input',
          details: error.errors
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.error('Sentiment analysis error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
