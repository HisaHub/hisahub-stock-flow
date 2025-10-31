-- Enable pg_trgm extension for full-text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create full-text search index on posts
CREATE INDEX IF NOT EXISTS posts_content_search_idx ON public.posts USING gin(content gin_trgm_ops);

-- Add search function
CREATE OR REPLACE FUNCTION public.search_posts(search_query TEXT)
RETURNS SETOF public.posts AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.posts
  WHERE content ILIKE '%' || search_query || '%'
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create trending hashtags view
CREATE OR REPLACE VIEW public.trending_hashtags AS
SELECT 
  hashtag,
  COUNT(*) as usage_count,
  MAX(created_at) as last_used
FROM (
  SELECT 
    unnest(regexp_matches(content, '#(\w+)', 'g')) as hashtag,
    created_at
  FROM public.posts
  WHERE created_at > NOW() - INTERVAL '7 days'
) hashtag_posts
GROUP BY hashtag
ORDER BY usage_count DESC, last_used DESC
LIMIT 20;

-- Create trending tickers view
CREATE OR REPLACE VIEW public.trending_tickers AS
SELECT 
  ticker,
  COUNT(*) as mention_count,
  MAX(created_at) as last_mentioned
FROM (
  SELECT 
    unnest(regexp_matches(content, '\$([A-Z]{2,5})', 'g')) as ticker,
    created_at
  FROM public.posts
  WHERE created_at > NOW() - INTERVAL '7 days'
) ticker_posts
GROUP BY ticker
ORDER BY mention_count DESC, last_mentioned DESC
LIMIT 20;

-- Add indexes for filtering
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS posts_user_id_idx ON public.posts(user_id);

-- Create user recommendations function based on followed users' follows
CREATE OR REPLACE FUNCTION public.get_recommended_users(for_user_id UUID, limit_count INTEGER DEFAULT 10)
RETURNS TABLE(
  user_id UUID,
  first_name TEXT,
  last_name TEXT,
  common_follows_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as user_id,
    p.first_name,
    p.last_name,
    COUNT(DISTINCT uf2.following_id) as common_follows_count
  FROM public.profiles p
  INNER JOIN public.user_follows uf2 ON p.id = uf2.follower_id
  INNER JOIN public.user_follows uf1 ON uf2.following_id = uf1.following_id
  WHERE uf1.follower_id = for_user_id
    AND p.id != for_user_id
    AND p.id NOT IN (
      SELECT following_id 
      FROM public.user_follows 
      WHERE follower_id = for_user_id
    )
  GROUP BY p.id, p.first_name, p.last_name
  ORDER BY common_follows_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;