-- Create bookmarks table
CREATE TABLE IF NOT EXISTS public.post_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  collection_name TEXT DEFAULT 'Saved',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Enable RLS for bookmarks
ALTER TABLE public.post_bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS policies for bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON public.post_bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookmarks"
  ON public.post_bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON public.post_bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Create reposts table (quote retweets)
CREATE TABLE IF NOT EXISTS public.post_reposts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for reposts
ALTER TABLE public.post_reposts ENABLE ROW LEVEL SECURITY;

-- RLS policies for reposts
CREATE POLICY "Anyone can view reposts"
  ON public.post_reposts FOR SELECT
  USING (true);

CREATE POLICY "Users can create reposts"
  ON public.post_reposts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reposts"
  ON public.post_reposts FOR DELETE
  USING (auth.uid() = user_id);

-- Add repost_count to posts table
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS repost_count INTEGER NOT NULL DEFAULT 0;

-- Function to update repost count
CREATE OR REPLACE FUNCTION public.update_post_repost_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts 
    SET repost_count = repost_count + 1 
    WHERE id = NEW.original_post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts 
    SET repost_count = GREATEST(0, repost_count - 1)
    WHERE id = OLD.original_post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for repost count
DROP TRIGGER IF EXISTS update_repost_count_trigger ON public.post_reposts;
CREATE TRIGGER update_repost_count_trigger
  AFTER INSERT OR DELETE ON public.post_reposts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_post_repost_count();

-- Create post_shares table for tracking shares
CREATE TABLE IF NOT EXISTS public.post_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for shares
ALTER TABLE public.post_shares ENABLE ROW LEVEL SECURITY;

-- RLS policies for shares
CREATE POLICY "Users can create shares"
  ON public.post_shares FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all shares"
  ON public.post_shares FOR SELECT
  USING (true);

-- Add share_count to posts
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS share_count INTEGER NOT NULL DEFAULT 0;

-- Function to update share count
CREATE OR REPLACE FUNCTION public.update_post_share_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts 
    SET share_count = share_count + 1 
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts 
    SET share_count = GREATEST(0, share_count - 1)
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for share count
DROP TRIGGER IF EXISTS update_share_count_trigger ON public.post_shares;
CREATE TRIGGER update_share_count_trigger
  AFTER INSERT OR DELETE ON public.post_shares
  FOR EACH ROW
  EXECUTE FUNCTION public.update_post_share_count();