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

  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className={`${isReply ? 'ml-8' : ''} mb-4`}>
      <div className="flex gap-3">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-secondary text-primary text-xs">
            {initials}
          </AvatarFallback>
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
              className={`flex items-center gap-1 text-xs ${
                comment.is_liked ? 'text-red-400' : 'text-off-white/60'
              } hover:text-red-400 transition-colors`}
            >
              <Heart className={`w-3.5 h-3.5 ${comment.is_liked ? 'fill-current' : ''}`} />
              <span>{comment.likes_count}</span>
            </button>

            {!isReply && (
              <button
                onClick={() => onReply(comment.id)}
                className="flex items-center gap-1 text-xs text-off-white/60 hover:text-off-white transition-colors"
              >
                <Reply className="w-3.5 h-3.5" />
                <span>Reply</span>
              </button>
            )}

            {currentUserId === comment.user_id && (
              <button
                onClick={() => onDelete(comment.id)}
                className="flex items-center gap-1 text-xs text-red-400/60 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}
          </div>

          {/* Replies */}
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

  const handleReply = (commentId: string) => {
    setReplyToId(commentId);
    setIsOpen(true);
  };

  return (
    <div className="border-t border-secondary/20 pt-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-off-white/70 hover:text-off-white transition-colors mb-3"
      >
        <MessageCircle className="w-4 h-4" />
        <span>{comments.length || initialCommentsCount} Comments</span>
      </button>

      {isOpen && (
        <div className="space-y-4">
          {/* Comment Input */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={replyToId ? "Write a reply..." : "Write a comment..."}
              className="min-h-[80px] bg-primary/30 border-secondary/30 text-off-white resize-none"
              maxLength={2000}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!newComment.trim()}
              className="bg-secondary hover:bg-secondary/90 text-primary h-fit"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>

          {replyToId && (
            <button
              onClick={() => setReplyToId(null)}
              className="text-xs text-off-white/60 hover:text-off-white"
            >
              Cancel reply
            </button>
          )}

          {/* Comments List */}
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
                  onReply={handleReply}
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
