
import React, { useState } from "react";
import { Heart, MessageCircle, Share2, TrendingUp, TrendingDown, Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTheme } from "./ThemeProvider";

interface User {
  id: string;
  username: string;
  tier: "New Member" | "Active Trader" | "Top 1%" | "Pro Trader";
}

interface Reply {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: number;
  likes: number;
  userHasLiked: boolean;
  parentReplyId?: string;
  replies: Reply[];
}

interface Post {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: number;
  upvotes: number;
  downvotes: number;
  userHasUpvoted: boolean;
  userHasDownvoted: boolean;
  userHasLiked: boolean;
  likes: number;
  replies: Reply[];
  tickers?: string[];
}

const MOCK_USER: User = {
  id: "user1",
  username: "TraderJoe",
  tier: "Active Trader"
};

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    userId: "user1",
    username: "TraderJoe",
    content: "Just bought more $SCOM on this dip. Their Q4 earnings look promising and the PE ratio is attractive at current levels. Anyone else bullish on telco stocks? 📈",
    timestamp: Date.now() - 3600000,
    upvotes: 12,
    downvotes: 2,
    likes: 8,
    userHasUpvoted: false,
    userHasDownvoted: false,
    userHasLiked: false,
    tickers: ["SCOM"],
    replies: [
      {
        id: "r1",
        userId: "user2",
        username: "NSEQueen",
        content: "Agreed! SCOM has been oversold. Good entry point.",
        timestamp: Date.now() - 3000000,
        likes: 3,
        userHasLiked: false,
        replies: []
      }
    ]
  },
  {
    id: "2",
    userId: "user3",
    username: "MarketMaven",
    content: "PSA: Remember to diversify your portfolio! Don't put all your eggs in one basket. The NSE has been volatile lately but that creates opportunities for smart money. 🧠💰",
    timestamp: Date.now() - 7200000,
    upvotes: 25,
    downvotes: 1,
    likes: 15,
    userHasUpvoted: true,
    userHasDownvoted: false,
    userHasLiked: true,
    replies: []
  }
];

const AdvancedCommunity: React.FC = () => {
  const { theme } = useTheme();
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [newPostContent, setNewPostContent] = useState("");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [activeReplyPost, setActiveReplyPost] = useState<string | null>(null);

  const getTierColor = (tier: User["tier"]) => {
    switch (tier) {
      case "New Member": return "bg-gray-500";
      case "Active Trader": return "bg-blue-500";
      case "Top 1%": return "bg-purple-500";
      case "Pro Trader": return "bg-gold-500";
      default: return "bg-gray-500";
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor(diff / 60000);
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  const extractTickers = (content: string): string[] => {
    const tickerRegex = /\$([A-Z]{3,5})/g;
    const matches = content.match(tickerRegex);
    return matches ? matches.map(ticker => ticker.substring(1)) : [];
  };

  const handleCreatePost = () => {
    if (newPostContent.trim()) {
      const tickers = extractTickers(newPostContent);
      const newPost: Post = {
        id: Date.now().toString(),
        userId: MOCK_USER.id,
        username: MOCK_USER.username,
        content: newPostContent,
        timestamp: Date.now(),
        upvotes: 0,
        downvotes: 0,
        likes: 0,
        userHasUpvoted: false,
        userHasDownvoted: false,
        userHasLiked: false,
        tickers,
        replies: []
      };
      setPosts([newPost, ...posts]);
      setNewPostContent("");
      setIsCreatePostOpen(false);
    }
  };

  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newPost = { ...post };
        if (voteType === 'up') {
          if (newPost.userHasUpvoted) {
            newPost.upvotes--;
            newPost.userHasUpvoted = false;
          } else {
            newPost.upvotes++;
            newPost.userHasUpvoted = true;
            if (newPost.userHasDownvoted) {
              newPost.downvotes--;
              newPost.userHasDownvoted = false;
            }
          }
        } else {
          if (newPost.userHasDownvoted) {
            newPost.downvotes--;
            newPost.userHasDownvoted = false;
          } else {
            newPost.downvotes++;
            newPost.userHasDownvoted = true;
            if (newPost.userHasUpvoted) {
              newPost.upvotes--;
              newPost.userHasUpvoted = false;
            }
          }
        }
        return newPost;
      }
      return post;
    }));
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.userHasLiked ? post.likes - 1 : post.likes + 1,
          userHasLiked: !post.userHasLiked
        };
      }
      return post;
    }));
  };

  const handleReply = (postId: string) => {
    if (replyContent.trim()) {
      const newReply: Reply = {
        id: Date.now().toString(),
        userId: MOCK_USER.id,
        username: MOCK_USER.username,
        content: replyContent,
        timestamp: Date.now(),
        likes: 0,
        userHasLiked: false,
        replies: []
      };

      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            replies: [...post.replies, newReply]
          };
        }
        return post;
      }));

      setReplyContent("");
      setActiveReplyPost(null);
    }
  };

  const renderReply = (reply: Reply, depth: number = 0) => (
    <div key={reply.id} className={`ml-${Math.min(depth * 4, 12)} mt-3`}>
      <div className={`${theme === 'light' ? 'bg-gray-50' : 'bg-white/5'} p-3 rounded-lg border-l-2 border-secondary/30`}>
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="w-6 h-6">
            <AvatarFallback className="text-xs bg-secondary text-primary">
              {reply.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-off-white'}`}>
            {reply.username}
          </span>
          <span className="text-xs text-neutral">
            {formatTimestamp(reply.timestamp)}
          </span>
        </div>
        <p className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-off-white/90'} mb-2`}>
          {reply.content}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-6 text-xs">
            <Heart className="w-3 h-3 mr-1" />
            {reply.likes}
          </Button>
        </div>
      </div>
      {reply.replies.map(nestedReply => renderReply(nestedReply, depth + 1))}
    </div>
  );

  return (
    <div>
      {/* Posts Feed */}
      <div className="space-y-4 mb-6">
        {posts.map((post) => (
          <div key={post.id} className="glass-card">
            {/* Post Header */}
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-secondary text-primary font-bold">
                  {post.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-off-white'}`}>
                    {post.username}
                  </span>
                  <Badge className={`${getTierColor(MOCK_USER.tier)} text-white text-xs px-2 py-0.5`}>
                    {MOCK_USER.tier}
                  </Badge>
                </div>
                <span className="text-xs text-neutral">
                  {formatTimestamp(post.timestamp)}
                </span>
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-4">
              <p className={`${theme === 'light' ? 'text-gray-800' : 'text-off-white'} leading-relaxed`}>
                {post.content}
              </p>
              {post.tickers && post.tickers.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {post.tickers.map(ticker => (
                    <Badge key={ticker} variant="outline" className="text-secondary border-secondary">
                      ${ticker}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Post Actions */}
            <div className="flex items-center justify-between border-t border-white/10 pt-3">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote(post.id, 'up')}
                  className={`h-8 ${post.userHasUpvoted ? 'text-green-500' : 'text-neutral hover:text-green-500'}`}
                >
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {post.upvotes}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote(post.id, 'down')}
                  className={`h-8 ${post.userHasDownvoted ? 'text-red-500' : 'text-neutral hover:text-red-500'}`}
                >
                  <TrendingDown className="w-4 h-4 mr-1" />
                  {post.downvotes}
                </Button>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(post.id)}
                  className={`h-8 ${post.userHasLiked ? 'text-red-500' : 'text-neutral hover:text-red-500'}`}
                >
                  <Heart className={`w-4 h-4 mr-1 ${post.userHasLiked ? 'fill-current' : ''}`} />
                  {post.likes}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveReplyPost(activeReplyPost === post.id ? null : post.id)}
                  className="h-8 text-neutral hover:text-secondary"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {post.replies.length}
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-neutral hover:text-secondary">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Reply Input */}
            {activeReplyPost === post.id && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-secondary text-primary text-sm">
                      {MOCK_USER.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Write a reply..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveReplyPost(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleReply(post.id)}
                        disabled={!replyContent.trim()}
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Replies */}
            {post.replies.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                {post.replies.map(reply => renderReply(reply))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Floating Create Post Button */}
      <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-secondary text-primary shadow-lg hover:shadow-xl transition-all z-40"
            size="icon"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className={`${theme === 'light' ? 'bg-white' : 'bg-primary'} border-secondary/20`}>
          <DialogHeader>
            <DialogTitle className={`${theme === 'light' ? 'text-gray-900' : 'text-secondary'}`}>
              Create New Post
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-secondary text-primary font-bold">
                  {MOCK_USER.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <span className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-off-white'}`}>
                  {MOCK_USER.username}
                </span>
                <Badge className={`ml-2 ${getTierColor(MOCK_USER.tier)} text-white text-xs`}>
                  {MOCK_USER.tier}
                </Badge>
              </div>
            </div>
            <Textarea
              placeholder="What's on your mind? Use $TICKER to mention stocks..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="min-h-[120px] resize-none"
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-neutral">
                {newPostContent.length}/500 characters
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setIsCreatePostOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim()}
                  className="bg-secondary text-primary hover:bg-secondary/90"
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default AdvancedCommunity;
