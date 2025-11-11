# Community Feature - Complete Export Package

This document contains everything needed to implement the community feature in another app.

---

## 📦 Table of Contents
1. [Dependencies](#dependencies)
2. [Database Schema](#database-schema)
3. [Design System Setup](#design-system-setup)
4. [Custom Hooks](#custom-hooks)
5. [UI Components](#ui-components)
6. [Edge Functions](#edge-functions)
7. [Integration Steps](#integration-steps)

---

## 1. Dependencies

Install these packages:

```bash
npm install @supabase/supabase-js@^2.50.2
npm install @tanstack/react-query@^5.56.2
npm install date-fns@^3.6.0
npm install lucide-react@^0.462.0
npm install sonner@^1.5.0
npm install react-router-dom@^6.26.2

# Shadcn UI components (or use your UI library)
npm install @radix-ui/react-avatar
npm install @radix-ui/react-dialog
npm install @radix-ui/react-tabs
npm install @radix-ui/react-badge
npm install @radix-ui/react-scroll-area
```

---

## 2. Database Schema

Run this SQL in your Supabase SQL Editor:

```sql
-- ============================================
-- PROFILES TABLE (if not exists)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- POSTS TABLE
-- ============================================
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER NOT NULL DEFAULT 0,
  replies_count INTEGER NOT NULL DEFAULT 0,
  repost_count INTEGER NOT NULL DEFAULT 0,
  share_count INTEGER NOT NULL DEFAULT 0,
  sentiment_label TEXT CHECK (sentiment_label IN ('bullish', 'bearish', 'neutral')),
  sentiment_score NUMERIC,
  sentiment_confidence NUMERIC,
  ai_analyzed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read posts" ON public.posts
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can create posts" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON public.posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON public.posts
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- POST LIKES TABLE
-- ============================================
CREATE TABLE public.post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view post likes" ON public.post_likes
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can like posts" ON public.post_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts" ON public.post_likes
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- POST COMMENTS TABLE
-- ============================================
CREATE TABLE public.post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES public.post_comments ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER NOT NULL DEFAULT 0,
  replies_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comments" ON public.post_comments
  FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated users can create comments" ON public.post_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON public.post_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON public.post_comments
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- COMMENT LIKES TABLE
-- ============================================
CREATE TABLE public.comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES public.post_comments ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comment likes" ON public.comment_likes
  FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated users can like comments" ON public.comment_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike comments" ON public.comment_likes
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- POST BOOKMARKS TABLE
-- ============================================
CREATE TABLE public.post_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  collection_name TEXT DEFAULT 'Saved',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.post_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookmarks" ON public.post_bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookmarks" ON public.post_bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks" ON public.post_bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- POST REPOSTS TABLE
-- ============================================
CREATE TABLE public.post_reposts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_post_id UUID NOT NULL REFERENCES public.posts ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE public.post_reposts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reposts" ON public.post_reposts
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can create reposts" ON public.post_reposts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reposts" ON public.post_reposts
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- POST SHARES TABLE
-- ============================================
CREATE TABLE public.post_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  platform TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE public.post_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all shares" ON public.post_shares
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can create shares" ON public.post_shares
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- USER FOLLOWS TABLE
-- ============================================
CREATE TABLE public.user_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view follows they're involved in" ON public.user_follows
  FOR SELECT USING (auth.uid() = follower_id OR auth.uid() = following_id);

CREATE POLICY "Users can follow others" ON public.user_follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others" ON public.user_follows
  FOR DELETE USING (auth.uid() = follower_id);

-- ============================================
-- TRENDING TICKERS VIEW (OPTIONAL)
-- ============================================
CREATE OR REPLACE VIEW trending_tickers AS
SELECT 
  regexp_matches(content, '\$([A-Z]{2,5})', 'g')[1] AS ticker,
  COUNT(*) AS mention_count,
  MAX(created_at) AS last_mentioned
FROM posts
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY ticker
ORDER BY mention_count DESC
LIMIT 20;

-- ============================================
-- TRENDING HASHTAGS VIEW (OPTIONAL)
-- ============================================
CREATE OR REPLACE VIEW trending_hashtags AS
SELECT 
  regexp_matches(content, '#(\w+)', 'g')[1] AS hashtag,
  COUNT(*) AS usage_count,
  MAX(created_at) AS last_used
FROM posts
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY hashtag
ORDER BY usage_count DESC
LIMIT 20;

-- ============================================
-- TRIGGERS FOR COUNTERS
-- ============================================

-- Update post likes_count
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_likes_count_trigger
AFTER INSERT OR DELETE ON post_likes
FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

-- Update post replies_count
CREATE OR REPLACE FUNCTION update_post_replies_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET replies_count = replies_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET replies_count = GREATEST(0, replies_count - 1) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_replies_count_trigger
AFTER INSERT OR DELETE ON post_comments
FOR EACH ROW EXECUTE FUNCTION update_post_replies_count();

-- Update comment likes_count
CREATE OR REPLACE FUNCTION update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE post_comments SET likes_count = likes_count + 1 WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE post_comments SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.comment_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comment_likes_count_trigger
AFTER INSERT OR DELETE ON comment_likes
FOR EACH ROW EXECUTE FUNCTION update_comment_likes_count();

-- Update comment replies_count
CREATE OR REPLACE FUNCTION update_comment_replies_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.parent_comment_id IS NOT NULL THEN
    UPDATE post_comments SET replies_count = replies_count + 1 WHERE id = NEW.parent_comment_id;
  ELSIF TG_OP = 'DELETE' AND OLD.parent_comment_id IS NOT NULL THEN
    UPDATE post_comments SET replies_count = GREATEST(0, replies_count - 1) WHERE id = OLD.parent_comment_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comment_replies_count_trigger
AFTER INSERT OR DELETE ON post_comments
FOR EACH ROW EXECUTE FUNCTION update_comment_replies_count();

-- Enable realtime for posts
ALTER PUBLICATION supabase_realtime ADD TABLE posts;
ALTER PUBLICATION supabase_realtime ADD TABLE post_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE post_comments;
```

---

## 3. Design System Setup

### Tailwind Config (`tailwind.config.ts`)

```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#131b26", // Deep navy
          foreground: "#F8F9FA",
        },
        secondary: {
          DEFAULT: "#FFC000", // Amber/Gold
          foreground: "#131b26",
        },
        background: "#131b26",
        charcoal: "#2A2A2A",
        neutral: "#8E9196",
        "off-white": "#F8F9FA",
        card: "#1b2230",
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

### CSS Styles (`index.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: 'Poppins', sans-serif;
    background: #131b26;
  }
  
  body {
    @apply bg-primary text-secondary font-sans;
    background: #131b26 !important;
    color: #F8F9FA;
  }
}

.glass-card {
  @apply bg-white/5 shadow-xl rounded-2xl p-6 border border-secondary/20 backdrop-blur-[8px];
}

/* Community post styling */
.ticker-tag {
  color: #10B981;
  font-weight: 600;
  cursor: pointer;
}

.ticker-tag:hover {
  text-decoration: underline;
}

.hashtag-tag {
  color: #3B82F6;
  font-weight: 500;
  cursor: pointer;
}

.hashtag-tag:hover {
  text-decoration: underline;
}
```

---

## 4. Custom Hooks

### 4.1 `useCommunity.tsx`

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type Post = Database['public']['Tables']['posts']['Row'] & {
  profiles: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  is_liked: boolean;
};

type UserProfile = Database['public']['Tables']['profiles']['Row'];

export const useCommunity = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);

  const fetchPosts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_user_id_fkey (
            first_name,
            last_name
          ),
          post_likes!left (
            user_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const postsWithLikes = data?.map(post => ({
        ...post,
        is_liked: post.post_likes?.some(like => like.user_id === user.id) || false
      })) || [];

      setPosts(postsWithLikes);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchFollowedUsers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_follows')
        .select('following_id')
        .eq('follower_id', user.id);

      if (error) throw error;
      setFollowedUsers(data?.map(follow => follow.following_id) || []);
    } catch (error) {
      console.error('Error fetching followed users:', error);
    }
  };

  const followUser = async (userId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('user_follows')
        .insert({ follower_id: user.id, following_id: userId });

      if (error) throw error;

      setFollowedUsers(prev => [...prev, userId]);
      toast.success('User followed successfully');
      return true;
    } catch (error) {
      console.error('Error following user:', error);
      toast.error('Failed to follow user');
      return false;
    }
  };

  const unfollowUser = async (userId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('user_follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', userId);

      if (error) throw error;

      setFollowedUsers(prev => prev.filter(id => id !== userId));
      toast.success('User unfollowed successfully');
      return true;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      toast.error('Failed to unfollow user');
      return false;
    }
  };

  const createPost = async (content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('posts')
        .insert({ user_id: user.id, content });

      if (error) throw error;

      toast.success('Post created successfully');
      await fetchPosts();
      return true;
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
      return false;
    }
  };

  const toggleLike = async (postId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const post = posts.find(p => p.id === postId);
      if (!post) return;

      if (post.is_liked) {
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('post_likes')
          .insert({ post_id: postId, user_id: user.id });

        if (error) throw error;
      }

      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { 
              ...p, 
              is_liked: !p.is_liked,
              likes_count: p.is_liked ? p.likes_count - 1 : p.likes_count + 1
            }
          : p
      ));

    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const getUserPosts = async (userId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_user_id_fkey (
            first_name,
            last_name
          ),
          post_likes!left (
            user_id
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const postsWithLikes = data?.map(post => ({
        ...post,
        is_liked: post.post_likes?.some(like => like.user_id === user.id) || false
      })) || [];

      return postsWithLikes;
    } catch (error) {
      console.error('Error fetching user posts:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchUsers();
    fetchFollowedUsers();

    const postsChannel = supabase
      .channel('posts_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, fetchPosts)
      .subscribe();

    const likesChannel = supabase
      .channel('likes_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_likes' }, fetchPosts)
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(likesChannel);
    };
  }, []);

  return {
    posts,
    users,
    followedUsers,
    loading,
    followUser,
    unfollowUser,
    createPost,
    toggleLike,
    getUserPosts,
    refetch: fetchPosts
  };
};
```

### 4.2 `useComments.tsx`

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  parent_comment_id: string | null;
  content: string;
  likes_count: number;
  replies_count: number;
  created_at: string;
  updated_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
  };
  is_liked: boolean;
  replies?: Comment[];
}

export const useComments = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;

      const { data: commentsData, error: commentsError } = await supabase
        .from('post_comments')
        .select('*')
        .eq('post_id', postId)
        .is('parent_comment_id', null)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;

      const userIds = [...new Set(commentsData?.map(c => c.user_id) || [])];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', userIds);

      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

      let likedCommentIds: string[] = [];
      if (userId) {
        const { data: likesData } = await supabase
          .from('comment_likes')
          .select('comment_id')
          .eq('user_id', userId);
        
        likedCommentIds = likesData?.map(like => like.comment_id) || [];
      }

      const commentsWithReplies = await Promise.all(
        (commentsData || []).map(async (comment) => {
          const { data: repliesData } = await supabase
            .from('post_comments')
            .select('*')
            .eq('parent_comment_id', comment.id)
            .order('created_at', { ascending: true });

          const replyUserIds = [...new Set(repliesData?.map(r => r.user_id) || [])];
          const { data: replyProfilesData } = await supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .in('id', replyUserIds);

          const replyProfilesMap = new Map(replyProfilesData?.map(p => [p.id, p]) || []);
          const profile = profilesMap.get(comment.user_id) || { first_name: null, last_name: null };

          return {
            ...comment,
            profiles: profile,
            is_liked: likedCommentIds.includes(comment.id),
            replies: (repliesData || []).map(reply => {
              const replyProfile = replyProfilesMap.get(reply.user_id) || { first_name: null, last_name: null };
              return {
                ...reply,
                profiles: replyProfile,
                is_liked: likedCommentIds.includes(reply.id)
              };
            })
          };
        })
      );

      setComments(commentsWithReplies as Comment[]);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const createComment = async (content: string, parentCommentId?: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast.error('Please sign in to comment');
        return false;
      }

      const { error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: session.session.user.id,
          parent_comment_id: parentCommentId || null,
          content: content.trim()
        });

      if (error) throw error;

      await fetchComments();
      toast.success(parentCommentId ? 'Reply posted' : 'Comment posted');
      return true;
    } catch (error) {
      console.error('Error creating comment:', error);
      toast.error('Failed to post comment');
      return false;
    }
  };

  const toggleLike = async (commentId: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast.error('Please sign in to like comments');
        return;
      }

      const userId = session.session.user.id;

      const { data: existingLike } = await supabase
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        await supabase.from('comment_likes').delete().eq('id', existingLike.id);
      } else {
        await supabase.from('comment_likes').insert({ comment_id: commentId, user_id: userId });
      }

      await fetchComments();
    } catch (error) {
      console.error('Error toggling comment like:', error);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('post_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      await fetchComments();
      toast.success('Comment deleted');
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
      return false;
    }
  };

  useEffect(() => {
    fetchComments();

    const channel = supabase
      .channel('post_comments_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_comments', filter: `post_id=eq.${postId}` }, fetchComments)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  return {
    comments,
    loading,
    createComment,
    toggleLike,
    deleteComment,
    refetch: fetchComments
  };
};
```

### 4.3 `useBookmarks.tsx`

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useBookmarks = () => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return;

      const { data } = await supabase
        .from('post_bookmarks')
        .select('post_id')
        .eq('user_id', session.session.user.id);

      if (data) {
        setBookmarkedPosts(new Set(data.map(b => b.post_id)));
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  const toggleBookmark = async (postId: string, collection: string = 'Saved') => {
    try {
      setLoading(true);
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast.error('Please sign in to bookmark posts');
        return;
      }

      const userId = session.session.user.id;
      const isBookmarked = bookmarkedPosts.has(postId);

      if (isBookmarked) {
        await supabase.from('post_bookmarks').delete().eq('user_id', userId).eq('post_id', postId);
        setBookmarkedPosts(prev => {
          const next = new Set(prev);
          next.delete(postId);
          return next;
        });
        toast.success('Bookmark removed');
      } else {
        await supabase.from('post_bookmarks').insert({ user_id: userId, post_id: postId, collection_name: collection });
        setBookmarkedPosts(prev => new Set([...prev, postId]));
        toast.success(`Added to "${collection}" collection`);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Failed to update bookmark');
    } finally {
      setLoading(false);
    }
  };

  return {
    bookmarkedPosts,
    loading,
    toggleBookmark,
    isBookmarked: (postId: string) => bookmarkedPosts.has(postId)
  };
};
```

### 4.4 `useSentimentAnalysis.tsx` (Optional AI feature)

```typescript
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useSentimentAnalysis = () => {
  const [analyzing, setAnalyzing] = useState(false);

  const analyzePost = async (postId: string, content: string) => {
    try {
      setAnalyzing(true);

      const { data, error } = await supabase.functions.invoke('analyze-sentiment', {
        body: { post_id: postId, content }
      });

      if (error) throw error;

      if (data?.error) {
        if (data.error.includes('Rate limit')) {
          toast.error('Too many AI requests. Please wait a moment.');
        } else if (data.error.includes('credits')) {
          toast.error('AI analysis temporarily unavailable.');
        } else {
          throw new Error(data.error);
        }
        return null;
      }

      return data?.sentiment;
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      toast.error('Could not analyze post sentiment');
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  return { analyzing, analyzePost };
};
```

---

## 5. UI Components

### 5.1 `EnhancedPostCard.tsx`

```typescript
import React, { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Bookmark, Share2, DollarSign } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import CommentSection from './CommentSection';
import { useBookmarks } from '@/hooks/useBookmarks';

interface EnhancedPostCardProps {
  post: any;
  onToggleLike: (postId: string) => void;
}

const EnhancedPostCard: React.FC<EnhancedPostCardProps> = ({ post, onToggleLike }) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  
  const displayName = post.profiles?.first_name && post.profiles?.last_name 
    ? `${post.profiles.first_name} ${post.profiles.last_name}`
    : 'Anonymous Trader';

  const initials = displayName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const extractTickers = (content: string) => {
    const tickerRegex = /\$([A-Z]{2,5})/g;
    return content.match(tickerRegex) || [];
  };

  const extractHashtags = (content: string) => {
    const hashtagRegex = /#(\w+)/g;
    return content.match(hashtagRegex) || [];
  };

  const tickers = extractTickers(post.content);
  const hashtags = extractHashtags(post.content);

  const enhancedContent = post.content
    .replace(/\$([A-Z]{2,5})/g, '<span class="ticker-tag">$$$1</span>')
    .replace(/#(\w+)/g, '<span class="hashtag-tag">#$1</span>');

  return (
    <div className="w-full mb-3 bg-white/5 border border-secondary/20 rounded-xl p-3.5 hover:bg-white/10 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-secondary text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-off-white">{displayName}</h4>
              <Badge variant="secondary" className="text-xs">Trader</Badge>
            </div>
            <p className="text-sm text-off-white/60">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div 
          className="text-off-white whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: enhancedContent }}
        />

        {(tickers.length > 0 || hashtags.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {tickers.map((ticker, index) => (
              <Badge key={`ticker-${index}`} variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                <DollarSign className="w-3 h-3 mr-1" />
                {ticker.replace('$', '')}
              </Badge>
            ))}
            {hashtags.map((hashtag, index) => (
              <Badge key={`hashtag-${index}`} variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">
                {hashtag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleLike(post.id)}
              className={`flex items-center gap-2 ${post.is_liked ? 'text-red-500' : 'text-off-white/60'}`}
            >
              <Heart className={`w-4 h-4 ${post.is_liked ? 'fill-current' : ''}`} />
              {post.likes_count}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleBookmark(post.id)}
              className={isBookmarked(post.id) ? 'text-yellow-500' : 'text-off-white/60'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked(post.id) ? 'fill-current' : ''}`} />
            </Button>
            
            <Button variant="ghost" size="sm" className="text-off-white/60">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <CommentSection postId={post.id} initialCommentsCount={post.replies_count || 0} />
      </div>
    </div>
  );
};

export default EnhancedPostCard;
```

### 5.2 `CommentSection.tsx`

```typescript
import React, { useState } from 'react';
import { MessageCircle, Heart, Reply, Trash2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useComments, Comment } from '@/hooks/useComments';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface CommentSectionProps {
  postId: string;
  initialCommentsCount?: number;
}

const CommentItem: React.FC<{
  comment: Comment;
  onReply: (commentId: string) => void;
  onLike: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  isReply?: boolean;
  currentUserId?: string;
}> = ({ comment, onReply, onLike, onDelete, isReply = false, currentUserId }) => {
  const displayName = comment.profiles?.first_name && comment.profiles?.last_name
    ? `${comment.profiles.first_name} ${comment.profiles.last_name}`
    : 'Anonymous User';

  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className={`${isReply ? 'ml-8' : ''} mb-4`}>
      <div className="flex gap-3">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-secondary text-primary text-xs">{initials}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="bg-primary/30 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-sm text-off-white">{displayName}</span>
              <span className="text-xs text-off-white/60">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm text-off-white/90">{comment.content}</p>
          </div>

          <div className="flex items-center gap-4 mt-2 ml-3">
            <button
              onClick={() => onLike(comment.id)}
              className={`flex items-center gap-1 text-xs ${comment.is_liked ? 'text-red-400' : 'text-off-white/60'}`}
            >
              <Heart className={`w-3.5 h-3.5 ${comment.is_liked ? 'fill-current' : ''}`} />
              <span>{comment.likes_count}</span>
            </button>

            {!isReply && (
              <button onClick={() => onReply(comment.id)} className="flex items-center gap-1 text-xs text-off-white/60">
                <Reply className="w-3.5 h-3.5" />
                <span>Reply</span>
              </button>
            )}

            {currentUserId === comment.user_id && (
              <button onClick={() => onDelete(comment.id)} className="flex items-center gap-1 text-xs text-red-400/60">
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}
          </div>

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onLike={onLike}
                  onDelete={onDelete}
                  isReply={true}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentSection: React.FC<CommentSectionProps> = ({ postId, initialCommentsCount = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();
  const { comments, loading, createComment, toggleLike, deleteComment } = useComments(postId);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUserId(session?.user?.id);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const success = await createComment(newComment, replyToId || undefined);
    if (success) {
      setNewComment('');
      setReplyToId(null);
    }
  };

  return (
    <div className="border-t border-secondary/20 pt-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-off-white/70 hover:text-off-white mb-3"
      >
        <MessageCircle className="w-4 h-4" />
        <span>{comments.length || initialCommentsCount} Comments</span>
      </button>

      {isOpen && (
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={replyToId ? "Write a reply..." : "Write a comment..."}
              className="min-h-[80px] bg-primary/30 border-secondary/30 text-off-white resize-none"
              maxLength={2000}
            />
            <Button type="submit" size="sm" disabled={!newComment.trim()} className="bg-secondary hover:bg-secondary/90 text-primary h-fit">
              <Send className="w-4 h-4" />
            </Button>
          </form>

          {replyToId && (
            <button onClick={() => setReplyToId(null)} className="text-xs text-off-white/60">
              Cancel reply
            </button>
          )}

          {loading ? (
            <div className="text-center py-8 text-off-white/60">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-off-white/60">No comments yet. Be the first!</div>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onReply={(id) => { setReplyToId(id); }}
                  onLike={toggleLike}
                  onDelete={deleteComment}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
```

### 5.3 `CreatePostDialog.tsx`

```typescript
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PenSquare } from 'lucide-react';

interface CreatePostDialogProps {
  onCreatePost: (content: string) => Promise<boolean>;
}

const CreatePostDialog: React.FC<CreatePostDialogProps> = ({ onCreatePost }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const success = await onCreatePost(content.trim());
    setIsSubmitting(false);

    if (success) {
      setContent('');
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-secondary text-primary hover:bg-secondary/90">
          <PenSquare className="w-4 h-4 mr-2" />
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-primary border-secondary/20">
        <DialogHeader>
          <DialogTitle className="text-off-white">Create New Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] bg-primary border-secondary/20 text-off-white"
            maxLength={500}
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-off-white/60">{content.length}/500 characters</span>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!content.trim() || isSubmitting} className="bg-secondary text-primary">
                {isSubmitting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
```

---

## 6. Edge Functions (Optional AI Sentiment Analysis)

Create `supabase/functions/analyze-sentiment/index.ts`:

```typescript
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
    const { post_id, content } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Call AI for sentiment analysis
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
            content: `Analyze sentiment and return JSON: {"sentiment_label": "bullish|bearish|neutral", "sentiment_score": <-1 to 1>, "confidence": <0 to 1>, "reasoning": "<text>"}`
          },
          { role: 'user', content: `Analyze: ${content}` }
        ],
      }),
    });

    if (!response.ok) throw new Error(`AI error: ${response.status}`);

    const data = await response.json();
    const sentiment = JSON.parse(data.choices[0].message.content);

    // Update post
    await supabaseClient
      .from('posts')
      .update({
        sentiment_score: sentiment.sentiment_score,
        sentiment_label: sentiment.sentiment_label,
        sentiment_confidence: sentiment.confidence,
        ai_analyzed_at: new Date().toISOString()
      })
      .eq('id', post_id);

    return new Response(
      JSON.stringify({ success: true, sentiment }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

---

## 7. Integration Steps

### Step 1: Install Dependencies
```bash
npm install [all packages from section 1]
```

### Step 2: Setup Supabase
1. Create Supabase project
2. Run SQL schema from section 2
3. Get your project URL and anon key
4. Create `src/integrations/supabase/client.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Step 3: Add Design System
- Copy Tailwind config from section 3
- Copy CSS styles to your `index.css`
- Import Poppins font in your HTML

### Step 4: Add Hooks
- Create `src/hooks/` directory
- Copy all hooks from section 4

### Step 5: Add Components
- Create `src/components/community/` directory
- Copy all components from section 5

### Step 6: Create Community Page

```typescript
import React from 'react';
import { useCommunity } from '@/hooks/useCommunity';
import EnhancedPostCard from '@/components/community/EnhancedPostCard';
import CreatePostDialog from '@/components/community/CreatePostDialog';

const CommunityPage = () => {
  const { posts, loading, createPost, toggleLike } = useCommunity();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-primary p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-off-white">Community</h1>
          <CreatePostDialog onCreatePost={createPost} />
        </div>

        <div className="space-y-4">
          {posts.map(post => (
            <EnhancedPostCard
              key={post.id}
              post={post}
              onToggleLike={toggleLike}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
```

### Step 7: (Optional) Deploy Edge Function
If using AI sentiment analysis:
1. Install Supabase CLI
2. Run: `supabase functions deploy analyze-sentiment`
3. Set secret: `supabase secrets set LOVABLE_API_KEY=your_key`

---

## 🎉 You're Done!

Your community feature is now ready to use in any app. All components are modular and can be customized to fit your design system.

### Key Features Included:
✅ Posts with likes, comments, bookmarks, shares
✅ Nested comment threads
✅ Real-time updates
✅ User profiles and following
✅ Hashtag and ticker extraction
✅ (Optional) AI sentiment analysis
✅ Fully responsive design
✅ Dark mode ready

### Need Help?
- Check Supabase docs: https://supabase.com/docs
- Shadcn UI: https://ui.shadcn.com
- React Query: https://tanstack.com/query
