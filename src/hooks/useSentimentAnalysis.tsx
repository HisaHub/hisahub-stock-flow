import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSentimentAnalysis = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const { toast } = useToast();

  const analyzePost = async (postId: string, content: string) => {
    try {
      setAnalyzing(true);

      const { data, error } = await supabase.functions.invoke('analyze-sentiment', {
        body: { post_id: postId, content }
      });

      if (error) throw error;

      if (data?.error) {
        if (data.error.includes('Rate limit')) {
          toast({
            title: "Rate Limit",
            description: "Too many AI requests. Please wait a moment.",
            variant: "destructive"
          });
        } else if (data.error.includes('credits')) {
          toast({
            title: "AI Credits Low",
            description: "AI analysis temporarily unavailable.",
            variant: "destructive"
          });
        } else {
          throw new Error(data.error);
        }
        return null;
      }

      return data?.sentiment;
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze post sentiment",
        variant: "destructive"
      });
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  const batchAnalyzePosts = async (posts: Array<{ id: string; content: string }>) => {
    const results = [];
    
    for (const post of posts) {
      // Add small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
      const result = await analyzePost(post.id, post.content);
      if (result) {
        results.push({ postId: post.id, sentiment: result });
      }
    }

    return results;
  };

  return {
    analyzing,
    analyzePost,
    batchAnalyzePosts
  };
};
