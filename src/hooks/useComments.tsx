import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;

      // Fetch top-level comments with profile data
      const { data: commentsData, error: commentsError } = await supabase
        .from('post_comments')
        .select('*')
        .eq('post_id', postId)
        .is('parent_comment_id', null)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;

      // Fetch profiles separately
      const userIds = [...new Set(commentsData?.map(c => c.user_id) || [])];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', userIds);

      const profilesMap = new Map(
        profilesData?.map(p => [p.id, p]) || []
      );

      if (commentsError) throw commentsError;

      // Fetch user's likes
      let likedCommentIds: string[] = [];
      if (userId) {
        const { data: likesData } = await supabase
          .from('comment_likes')
          .select('comment_id')
          .eq('user_id', userId);
        
        likedCommentIds = likesData?.map(like => like.comment_id) || [];
      }

      // Fetch replies for each comment
      const commentsWithReplies = await Promise.all(
        (commentsData || []).map(async (comment) => {
          const { data: repliesData } = await supabase
            .from('post_comments')
            .select('*')
            .eq('parent_comment_id', comment.id)
            .order('created_at', { ascending: true });

          // Get reply user IDs and fetch their profiles
          const replyUserIds = [...new Set(repliesData?.map(r => r.user_id) || [])];
          const { data: replyProfilesData } = await supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .in('id', replyUserIds);

          const replyProfilesMap = new Map(
            replyProfilesData?.map(p => [p.id, p]) || []
          );

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
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createComment = async (content: string, parentCommentId?: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to comment",
          variant: "destructive"
        });
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
      
      toast({
        title: "Success",
        description: parentCommentId ? "Reply posted" : "Comment posted"
      });

      return true;
    } catch (error) {
      console.error('Error creating comment:', error);
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive"
      });
      return false;
    }
  };

  const toggleLike = async (commentId: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to like comments",
          variant: "destructive"
        });
        return;
      }

      const userId = session.session.user.id;

      // Check if already liked
      const { data: existingLike } = await supabase
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('comment_likes')
          .delete()
          .eq('id', existingLike.id);
      } else {
        // Like
        await supabase
          .from('comment_likes')
          .insert({
            comment_id: commentId,
            user_id: userId
          });
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
      
      toast({
        title: "Success",
        description: "Comment deleted"
      });

      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchComments();

    // Set up realtime subscription
    const channel = supabase
      .channel('post_comments_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_comments',
          filter: `post_id=eq.${postId}`
        },
        () => {
          fetchComments();
        }
      )
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
