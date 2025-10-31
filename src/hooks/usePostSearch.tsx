import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Post = Database['public']['Tables']['posts']['Row'] & {
  profiles: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  is_liked: boolean;
};

interface SearchFilters {
  tickers: string[];
  timeRange: '24h' | '7d' | '30d' | 'all';
  hasMedia: boolean;
}

export const usePostSearch = () => {
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [searching, setSearching] = useState(false);
  const [trendingTickers, setTrendingTickers] = useState<string[]>([]);
  const [trendingHashtags, setTrendingHashtags] = useState<Array<{ hashtag: string; count: number }>>([]);

  const searchPosts = async (query: string, filters: SearchFilters) => {
    try {
      setSearching(true);

      let queryBuilder = supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      // Apply text search
      if (query) {
        queryBuilder = queryBuilder.ilike('content', `%${query}%`);
      }

      // Apply ticker filter
      if (filters.tickers.length > 0) {
        const tickerPattern = filters.tickers.map(t => `\\$${t}`).join('|');
        queryBuilder = queryBuilder.filter('content', 'match', tickerPattern);
      }

      // Apply time range filter
      if (filters.timeRange !== 'all') {
        const now = new Date();
        let cutoffDate: Date;

        switch (filters.timeRange) {
          case '24h':
            cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          case '7d':
            cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case '30d':
            cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          default:
            cutoffDate = new Date(0);
        }

        queryBuilder = queryBuilder.gte('created_at', cutoffDate.toISOString());
      }

      const { data, error } = await queryBuilder;

      if (error) throw error;

      // Get current user's likes
      const { data: session } = await supabase.auth.getSession();
      let likedPostIds: string[] = [];

      if (session?.session?.user) {
        const { data: likes } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', session.session.user.id);

        likedPostIds = likes?.map(like => like.post_id) || [];
      }

      const postsWithLikes = data?.map(post => ({
        ...post,
        is_liked: likedPostIds.includes(post.id)
      })) || [];

      setSearchResults(postsWithLikes);
    } catch (error) {
      console.error('Error searching posts:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const fetchTrendingTickers = async () => {
    try {
      const { data, error } = await supabase
        .from('trending_tickers')
        .select('*')
        .limit(10);

      if (error) throw error;

      setTrendingTickers(data?.map(t => (t as any).ticker) || []);
    } catch (error) {
      console.error('Error fetching trending tickers:', error);
    }
  };

  const fetchTrendingHashtags = async () => {
    try {
      const { data, error } = await supabase
        .from('trending_hashtags')
        .select('*')
        .limit(10);

      if (error) throw error;

      setTrendingHashtags(
        data?.map(h => ({
          hashtag: (h as any).hashtag,
          count: (h as any).usage_count
        })) || []
      );
    } catch (error) {
      console.error('Error fetching trending hashtags:', error);
    }
  };

  return {
    searchResults,
    searching,
    trendingTickers,
    trendingHashtags,
    searchPosts,
    fetchTrendingTickers,
    fetchTrendingHashtags
  };
};
