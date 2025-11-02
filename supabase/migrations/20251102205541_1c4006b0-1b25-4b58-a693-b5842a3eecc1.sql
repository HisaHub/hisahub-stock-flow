-- Fix #1: Enable RLS on achievements table
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view achievements (read-only for game mechanics)
CREATE POLICY "Anyone can view achievements" 
ON public.achievements 
FOR SELECT 
USING (true);

-- Fix #2: Add RLS policies to broker_accounts table
-- Allow users to manage their own broker accounts
CREATE POLICY "Users can view own broker accounts" 
ON public.broker_accounts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add own broker accounts" 
ON public.broker_accounts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own broker accounts" 
ON public.broker_accounts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own broker accounts" 
ON public.broker_accounts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Fix #3: Add RLS policies to price_alerts table
CREATE POLICY "Users can view own alerts" 
ON public.price_alerts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own alerts" 
ON public.price_alerts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts" 
ON public.price_alerts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own alerts" 
ON public.price_alerts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Fix #4: Recreate views without SECURITY DEFINER
DROP VIEW IF EXISTS public.trading_leaderboard;
DROP VIEW IF EXISTS public.trending_hashtags;
DROP VIEW IF EXISTS public.trending_tickers;

-- Recreate trading_leaderboard view WITHOUT security definer
CREATE VIEW public.trading_leaderboard AS
SELECT 
  p.id as user_id,
  p.first_name,
  p.last_name,
  COALESCE(us.reputation_score, 0) as reputation_score,
  COALESCE(us.achievement_points, 0) as achievement_points,
  COALESCE(us.total_trades, 0) as total_trades,
  COALESCE(us.profitable_trades, 0) as profitable_trades,
  COALESCE(us.total_signals, 0) as total_signals,
  COALESCE(us.accurate_signals, 0) as accurate_signals,
  CASE 
    WHEN us.total_trades > 0 THEN ROUND((us.profitable_trades::DECIMAL / us.total_trades::DECIMAL) * 100, 2)
    ELSE 0
  END as win_rate,
  CASE 
    WHEN us.total_signals > 0 THEN ROUND((us.accurate_signals::DECIMAL / us.total_signals::DECIMAL) * 100, 2)
    ELSE 0
  END as signal_accuracy,
  (SELECT COUNT(*) FROM user_achievements ua WHERE ua.user_id = p.id) as badges_count
FROM profiles p
LEFT JOIN user_stats us ON us.user_id = p.id
WHERE us.reputation_score > 0 OR us.total_trades > 0 OR us.total_signals > 0
ORDER BY us.reputation_score DESC NULLS LAST;

-- Recreate trending_hashtags view WITHOUT security definer
CREATE VIEW public.trending_hashtags AS
SELECT 
  regexp_matches(content, '#(\w+)', 'g') as matches,
  COUNT(*) as usage_count,
  MAX(created_at) as last_used
FROM posts
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY matches
ORDER BY usage_count DESC
LIMIT 10;

-- Recreate trending_tickers view WITHOUT security definer  
CREATE VIEW public.trending_tickers AS
SELECT 
  regexp_matches(content, '\$([A-Z]{2,5})', 'g') as matches,
  COUNT(*) as mention_count,
  MAX(created_at) as last_mentioned
FROM posts
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY matches
ORDER BY mention_count DESC
LIMIT 10;