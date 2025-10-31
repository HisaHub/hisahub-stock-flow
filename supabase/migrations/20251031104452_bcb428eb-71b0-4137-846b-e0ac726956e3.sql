-- ==========================================
-- AI SENTIMENT ANALYSIS SCHEMA
-- ==========================================

-- Add sentiment fields to posts table
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS sentiment_score DECIMAL(3,2);
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS sentiment_label TEXT CHECK (sentiment_label IN ('bullish', 'bearish', 'neutral'));
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS sentiment_confidence DECIMAL(3,2);
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS ai_analyzed_at TIMESTAMP WITH TIME ZONE;

-- Index for sentiment queries
CREATE INDEX IF NOT EXISTS posts_sentiment_label_idx ON public.posts(sentiment_label) WHERE sentiment_label IS NOT NULL;
CREATE INDEX IF NOT EXISTS posts_sentiment_score_idx ON public.posts(sentiment_score DESC) WHERE sentiment_score IS NOT NULL;

-- ==========================================
-- TRADING SIGNALS SCHEMA
-- ==========================================

-- Create trading signals table
CREATE TABLE IF NOT EXISTS public.trading_signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  signal_type TEXT NOT NULL CHECK (signal_type IN ('buy', 'sell', 'hold')),
  entry_price DECIMAL(12,2) NOT NULL,
  target_price DECIMAL(12,2),
  stop_loss DECIMAL(12,2),
  confidence_score INTEGER CHECK (confidence_score >= 1 AND confidence_score <= 10),
  timeframe TEXT CHECK (timeframe IN ('day', 'swing', 'long')),
  reasoning TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'expired')),
  actual_close_price DECIMAL(12,2),
  closed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  followers_count INTEGER NOT NULL DEFAULT 0,
  accuracy_rating DECIMAL(3,2)
);

-- Enable RLS
ALTER TABLE public.trading_signals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for signals
CREATE POLICY "Anyone can view signals"
  ON public.trading_signals FOR SELECT
  USING (true);

CREATE POLICY "Users can create own signals"
  ON public.trading_signals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own signals"
  ON public.trading_signals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own signals"
  ON public.trading_signals FOR DELETE
  USING (auth.uid() = user_id);

-- Create signal followers table
CREATE TABLE IF NOT EXISTS public.signal_followers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  signal_id UUID NOT NULL REFERENCES public.trading_signals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(signal_id, user_id)
);

-- Enable RLS
ALTER TABLE public.signal_followers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view signal followers"
  ON public.signal_followers FOR SELECT
  USING (true);

CREATE POLICY "Users can follow signals"
  ON public.signal_followers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unfollow signals"
  ON public.signal_followers FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update signal follower count
CREATE OR REPLACE FUNCTION public.update_signal_followers_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.trading_signals 
    SET followers_count = followers_count + 1 
    WHERE id = NEW.signal_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.trading_signals 
    SET followers_count = GREATEST(0, followers_count - 1)
    WHERE id = OLD.signal_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for signal follower count
DROP TRIGGER IF EXISTS update_signal_followers_count_trigger ON public.signal_followers;
CREATE TRIGGER update_signal_followers_count_trigger
  AFTER INSERT OR DELETE ON public.signal_followers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_signal_followers_count();

-- Indexes for signals
CREATE INDEX IF NOT EXISTS trading_signals_ticker_idx ON public.trading_signals(ticker);
CREATE INDEX IF NOT EXISTS trading_signals_user_id_idx ON public.trading_signals(user_id);
CREATE INDEX IF NOT EXISTS trading_signals_status_idx ON public.trading_signals(status);
CREATE INDEX IF NOT EXISTS trading_signals_created_at_idx ON public.trading_signals(created_at DESC);

-- ==========================================
-- ACHIEVEMENTS & GAMIFICATION SCHEMA
-- ==========================================

-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('trading', 'social', 'learning', 'special')),
  tier TEXT NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  points INTEGER NOT NULL DEFAULT 0,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Seed initial achievements
INSERT INTO public.achievements (code, name, description, icon, category, tier, points, requirement_type, requirement_value) VALUES
('first_trade', 'First Trade', 'Complete your first trade', '🎯', 'trading', 'bronze', 10, 'trades_count', 1),
('trade_10', 'Trading Active', 'Complete 10 trades', '📈', 'trading', 'silver', 50, 'trades_count', 10),
('trade_100', 'Trading Pro', 'Complete 100 trades', '💎', 'trading', 'gold', 200, 'trades_count', 100),
('profitable_week', 'Profitable Week', 'Achieve profits for 7 consecutive days', '🔥', 'trading', 'gold', 100, 'profit_streak', 7),
('first_post', 'Community Member', 'Create your first post', '✍️', 'social', 'bronze', 10, 'posts_count', 1),
('popular_post', 'Popular Creator', 'Get 50 likes on a single post', '⭐', 'social', 'silver', 50, 'post_likes', 50),
('helpful_100', 'Community Hero', 'Receive 100 likes across all posts', '🏆', 'social', 'gold', 150, 'total_likes', 100),
('signal_master', 'Signal Master', 'Post 5 accurate trading signals (80%+ accuracy)', '📡', 'trading', 'platinum', 300, 'accurate_signals', 5),
('early_adopter', 'Early Adopter', 'Join HisaHub in the first month', '🚀', 'special', 'gold', 500, 'registration_date', 1),
('streak_7', '7 Day Streak', 'Log in for 7 consecutive days', '🔥', 'social', 'bronze', 50, 'login_streak', 7),
('streak_30', '30 Day Streak', 'Log in for 30 consecutive days', '💪', 'social', 'silver', 200, 'login_streak', 30)
ON CONFLICT (code) DO NOTHING;

-- Create user achievements table
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  progress INTEGER DEFAULT 0,
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view others achievements"
  ON public.user_achievements FOR SELECT
  USING (true);

CREATE POLICY "System can grant achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (true);

-- Create user stats table for leaderboard
CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_trades INTEGER NOT NULL DEFAULT 0,
  profitable_trades INTEGER NOT NULL DEFAULT 0,
  total_posts INTEGER NOT NULL DEFAULT 0,
  total_likes_received INTEGER NOT NULL DEFAULT 0,
  total_signals INTEGER NOT NULL DEFAULT 0,
  accurate_signals INTEGER NOT NULL DEFAULT 0,
  achievement_points INTEGER NOT NULL DEFAULT 0,
  reputation_score INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view user stats"
  ON public.user_stats FOR SELECT
  USING (true);

CREATE POLICY "Users can update own stats"
  ON public.user_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- Create function to calculate trading accuracy
CREATE OR REPLACE FUNCTION public.calculate_trading_accuracy(p_user_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  total_closed INTEGER;
  profitable INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_closed
  FROM public.trading_signals
  WHERE user_id = p_user_id AND status = 'closed';
  
  IF total_closed = 0 THEN
    RETURN 0;
  END IF;
  
  SELECT COUNT(*) INTO profitable
  FROM public.trading_signals
  WHERE user_id = p_user_id 
    AND status = 'closed'
    AND actual_close_price IS NOT NULL
    AND (
      (signal_type = 'buy' AND actual_close_price >= target_price)
      OR (signal_type = 'sell' AND actual_close_price <= target_price)
    );
  
  RETURN ROUND((profitable::DECIMAL / total_closed::DECIMAL) * 100, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create leaderboard view
CREATE OR REPLACE VIEW public.trading_leaderboard AS
SELECT 
  us.user_id,
  p.first_name,
  p.last_name,
  us.reputation_score,
  us.achievement_points,
  us.total_trades,
  us.profitable_trades,
  us.total_signals,
  us.accurate_signals,
  CASE 
    WHEN us.total_trades > 0 
    THEN ROUND((us.profitable_trades::DECIMAL / us.total_trades::DECIMAL) * 100, 2)
    ELSE 0
  END as win_rate,
  CASE 
    WHEN us.total_signals > 0 
    THEN ROUND((us.accurate_signals::DECIMAL / us.total_signals::DECIMAL) * 100, 2)
    ELSE 0
  END as signal_accuracy,
  (SELECT COUNT(*) FROM public.user_achievements WHERE user_id = us.user_id) as badges_count
FROM public.user_stats us
JOIN public.profiles p ON p.id = us.user_id
ORDER BY us.reputation_score DESC, us.achievement_points DESC
LIMIT 100;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS user_stats_reputation_idx ON public.user_stats(reputation_score DESC);
CREATE INDEX IF NOT EXISTS user_stats_points_idx ON public.user_stats(achievement_points DESC);
CREATE INDEX IF NOT EXISTS user_achievements_user_id_idx ON public.user_achievements(user_id);