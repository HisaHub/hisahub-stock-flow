import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useBookmarks = () => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
        toast({
          title: "Authentication required",
          description: "Please sign in to bookmark posts",
          variant: "destructive"
        });
        return;
      }

      const userId = session.session.user.id;
      const isBookmarked = bookmarkedPosts.has(postId);

      if (isBookmarked) {
        await supabase
          .from('post_bookmarks')
          .delete()
          .eq('user_id', userId)
          .eq('post_id', postId);

        setBookmarkedPosts(prev => {
          const next = new Set(prev);
          next.delete(postId);
          return next;
        });

        toast({
          title: "Bookmark removed",
          description: "Post removed from your collection"
        });
      } else {
        await supabase
          .from('post_bookmarks')
          .insert({
            user_id: userId,
            post_id: postId,
            collection_name: collection
          });

        setBookmarkedPosts(prev => new Set([...prev, postId]));

        toast({
          title: "Post bookmarked",
          description: `Added to "${collection}" collection`
        });
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive"
      });
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
