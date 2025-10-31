import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Post = Database['public']['Tables']['posts']['Row'] & {
  profiles: {
    first_name: string | null;
    last_name: string | null;
  } | null;
};

interface QuoteRepostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  originalPost: Post;
  onSuccess: () => void;
}

const QuoteRepostDialog: React.FC<QuoteRepostDialogProps> = ({
  open,
  onOpenChange,
  originalPost,
  onSuccess
}) => {
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const displayName = originalPost.profiles?.first_name && originalPost.profiles?.last_name
    ? `${originalPost.profiles.first_name} ${originalPost.profiles.last_name}`
    : 'Anonymous Trader';

  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase();

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast({
        title: "Add your thoughts",
        description: "Please add a comment to your repost",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to repost",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('post_reposts')
        .insert({
          user_id: session.session.user.id,
          original_post_id: originalPost.id,
          comment: comment.trim()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post reposted with your comment"
      });

      setComment('');
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error creating repost:', error);
      toast({
        title: "Error",
        description: "Failed to create repost",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-primary border-secondary/30 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-off-white">Quote Repost</DialogTitle>
          <DialogDescription className="text-off-white/70">
            Add your thoughts and share this post
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* User's comment input */}
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add your commentary..."
            className="min-h-[100px] bg-primary/50 border-secondary/30 text-off-white"
            maxLength={500}
          />

          {/* Original post preview */}
          <div className="border border-secondary/30 rounded-lg p-4 bg-primary/30">
            <div className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-secondary text-primary text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-off-white">{displayName}</p>
                <p className="text-sm text-off-white/80 mt-1 line-clamp-3">
                  {originalPost.content}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="border-secondary/30 text-off-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || !comment.trim()}
              className="bg-secondary hover:bg-secondary/90 text-primary"
            >
              {submitting ? 'Posting...' : 'Repost'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteRepostDialog;
