import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, Bookmark, Share2, DollarSign, Repeat2, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Database } from '@/integrations/supabase/types';
import CommentSection from './CommentSection';
import SharePostDialog from './SharePostDialog';
import QuoteRepostDialog from './QuoteRepostDialog';
import SentimentBadge from './SentimentBadge';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useSentimentAnalysis } from '@/hooks/useSentimentAnalysis';

type Post = Database['public']['Tables']['posts']['Row'] & {
  profiles: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  is_liked: boolean;
  sentiment_label?: 'bullish' | 'bearish' | 'neutral' | null;
  sentiment_score?: number | null;
  sentiment_confidence?: number | null;
};

interface EnhancedPostCardProps {
  post: Post;
  onToggleLike: (postId: string) => void;
}

const EnhancedPostCard: React.FC<EnhancedPostCardProps> = ({ post, onToggleLike }) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [repostDialogOpen, setRepostDialogOpen] = useState(false);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { analyzing, analyzePost } = useSentimentAnalysis();

  useEffect(() => {
    // Auto-analyze sentiment if not yet analyzed
    if (!post.sentiment_label && !analyzing) {
      analyzePost(post.id, post.content);
    }
  }, [post.id]);
  
  const displayName = post.profiles?.first_name && post.profiles?.last_name 
    ? `${post.profiles.first_name} ${post.profiles.last_name}`
    : post.profiles?.first_name || post.profiles?.last_name || 'Anonymous Trader';

  const initials = displayName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Extract stock tickers from content
  const extractTickers = (content: string) => {
    const tickerRegex = /\$([A-Z]{2,5})/g;
    return content.match(tickerRegex) || [];
  };

  // Extract hashtags from content
  const extractHashtags = (content: string) => {
    const hashtagRegex = /#(\w+)/g;
    return content.match(hashtagRegex) || [];
  };

  const tickers = extractTickers(post.content);
  const hashtags = extractHashtags(post.content);

  // Enhanced content with clickable tickers and hashtags
  const enhancedContent = post.content
    .replace(/\$([A-Z]{2,5})/g, '<span class="ticker-tag">$$$1</span>')
    .replace(/#(\w+)/g, '<span class="hashtag-tag">#$1</span>');

  const handleShare = () => {
    setShareDialogOpen(true);
  };

  const handleRepost = () => {
    setRepostDialogOpen(true);
  };

  return (
    <>
      <div className="w-full mb-3 bg-white/5 border border-secondary/20 rounded-xl p-3.5 hover:bg-white/10 transition-colors">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarFallback className="bg-secondary text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-medium text-off-white truncate">{displayName}</h4>
                <Badge variant="secondary" className="text-xs bg-secondary/20 flex-shrink-0">
                  Trader
                </Badge>
                {post.sentiment_label && (
                  <SentimentBadge 
                    label={post.sentiment_label}
                    score={post.sentiment_score || undefined}
                    confidence={post.sentiment_confidence || undefined}
                    size="sm"
                  />
                )}
              </div>
              <p className="text-sm text-off-white/60 truncate">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          
          {analyzing && (
            <Button variant="ghost" size="sm" disabled className="text-off-white/60">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </Button>
          )}
        </div>
        
        <div className="space-y-4">
          {/* Post Content */}
          <div 
            className="text-off-white whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: enhancedContent }}
          />

          {/* Tickers and Hashtags */}
          {(tickers.length > 0 || hashtags.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {tickers.map((ticker, index) => (
                <Badge 
                  key={`ticker-${index}`} 
                  variant="outline" 
                  className="bg-green-500/10 text-green-500 border-green-500/30"
                >
                  <DollarSign className="w-3 h-3 mr-1" />
                  {ticker.replace('$', '')}
                </Badge>
              ))}
              {hashtags.map((hashtag, index) => (
                <Badge 
                  key={`hashtag-${index}`} 
                  variant="outline"
                  className="bg-blue-500/10 text-blue-500 border-blue-500/30"
                >
                  {hashtag}
                </Badge>
              ))}
            </div>
          )}

          {/* Engagement Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleLike(post.id)}
                className={`flex items-center gap-2 hover:bg-red-500/10 ${
                  post.is_liked ? 'text-red-500' : 'text-off-white/60'
                }`}
              >
                <Heart className={`w-4 h-4 ${post.is_liked ? 'fill-current' : ''}`} />
                {post.likes_count}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRepost}
                className="flex items-center gap-2 hover:bg-blue-500/10 text-off-white/60 hover:text-blue-500"
              >
                <Repeat2 className="w-4 h-4" />
                {(post as any).repost_count || 0}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleBookmark(post.id)}
                className={`p-2 hover:bg-yellow-500/10 ${
                  isBookmarked(post.id) ? 'text-yellow-500' : 'text-off-white/60'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked(post.id) ? 'fill-current' : ''}`} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="p-2 text-off-white/60 hover:bg-secondary/10 hover:text-secondary"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Comment Section */}
          <CommentSection postId={post.id} initialCommentsCount={post.replies_count || 0} />
        </div>
      </div>

      {/* Dialogs */}
      <SharePostDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        postId={post.id}
        postContent={post.content}
      />

      <QuoteRepostDialog
        open={repostDialogOpen}
        onOpenChange={setRepostDialogOpen}
        originalPost={post}
        onSuccess={() => {
          // Refresh feed or handle success
        }}
      />
    </>
  );
};

export default EnhancedPostCard;