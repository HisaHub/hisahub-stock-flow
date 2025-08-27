import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Bookmark, Share2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Database } from '@/integrations/supabase/types';

type Post = Database['public']['Tables']['posts']['Row'] & {
  profiles: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  is_liked: boolean;
};

interface EnhancedPostCardProps {
  post: Post;
  onToggleLike: (postId: string) => void;
}

const EnhancedPostCard: React.FC<EnhancedPostCardProps> = ({ post, onToggleLike }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  
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

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    // Share functionality
    console.log('Share post:', post.id);
  };

  return (
    <Card className="bg-card border-border hover:border-secondary/30 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-secondary text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-foreground">{displayName}</h4>
                <Badge variant="secondary" className="text-xs bg-secondary/20">
                  Trader
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Post Content */}
        <div 
          className="text-foreground whitespace-pre-wrap"
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
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleLike(post.id)}
              className={`flex items-center gap-2 hover:bg-red-500/10 ${
                post.is_liked ? 'text-red-500' : 'text-muted-foreground'
              }`}
            >
              <Heart className={`w-4 h-4 ${post.is_liked ? 'fill-current' : ''}`} />
              {post.likes_count}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-2 text-muted-foreground hover:bg-blue-500/10 hover:text-blue-500"
            >
              <MessageCircle className="w-4 h-4" />
              {post.replies_count}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className={`p-2 hover:bg-yellow-500/10 ${
                isBookmarked ? 'text-yellow-500' : 'text-muted-foreground'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="p-2 text-muted-foreground hover:bg-secondary/10 hover:text-secondary"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>

    </Card>
  );
};

export default EnhancedPostCard;