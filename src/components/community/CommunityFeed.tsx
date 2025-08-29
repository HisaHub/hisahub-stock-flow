import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MessageSquare, TrendingUp, Users, Signal, Brain, GraduationCap, Plus } from 'lucide-react';
import PostCard from './PostCard';
import CreatePostDialog from './CreatePostDialog';
import EnhancedPostCard from './EnhancedPostCard';

interface CommunityFeedProps {
  activeTab: string;
  posts: any[];
  onToggleLike: (postId: string) => void;
  onCreatePost: (content: string) => Promise<boolean>;
}

const CommunityFeed: React.FC<CommunityFeedProps> = ({
  activeTab,
  posts,
  onToggleLike,
  onCreatePost
}) => {
  const renderFeedContent = () => {
    switch (activeTab) {
      case 'feed':
        return (
          <div className="w-full">
            <div className="space-y-3">
              <div className="hidden lg:flex items-center justify-between">
                <h2 className="text-xl font-semibold text-off-white">Following Feed</h2>
                <CreatePostDialog onCreatePost={onCreatePost} />
              </div>
              <div className="space-y-3 pb-20 lg:pb-4">
                {posts.length === 0 ? (
                  <div className="text-center text-off-white/60 py-12 px-4">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No posts from people you follow yet.</p>
                    <p className="text-sm mt-2">Follow some traders to see their content here!</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <EnhancedPostCard
                      key={post.id}
                      post={post}
                      onToggleLike={onToggleLike}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case 'trending':
        return (
          <div className="w-full">
            <div className="space-y-6 pb-20 lg:pb-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-secondary" />
                <h2 className="text-xl font-semibold text-off-white">Trending Now</h2>
              </div>
              <div className="space-y-4">
                <div className="glass-card">
                  <h3 className="font-semibold text-off-white mb-3">🔥 Hot Topics</h3>
                  <div className="space-y-3">
                    {['$KCB earnings surprise', '$EABL dividend announcement', 'NSE IPO pipeline', 'Forex volatility'].map((topic, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-off-white">{topic}</span>
                        <span className="text-secondary text-sm">#{i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'discussions':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-secondary" />
              <h2 className="text-xl font-semibold text-off-white">Active Discussions</h2>
            </div>
            <div className="pb-20 lg:pb-4">
              <div className="text-center text-off-white/60 py-12">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Discussion forums coming soon!</p>
                <p className="text-sm mt-2">Engage in structured trading discussions</p>
              </div>
            </div>
          </div>
        );

      case 'signals':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Signal className="w-6 h-6 text-secondary" />
              <h2 className="text-xl font-semibold text-off-white">Trading Signals</h2>
            </div>
            <div className="pb-20 lg:pb-4">
              <div className="text-center text-off-white/60 py-12">
                <Signal className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Trading signals feature coming soon!</p>
                <p className="text-sm mt-2">Get verified trading signals from experts</p>
              </div>
            </div>
          </div>
        );

      case 'ai-insights':
        return (
          <div className="w-full">
            <div className="space-y-6 pb-20 lg:pb-4">
              <div className="flex items-center gap-3">
                <Brain className="w-6 h-6 text-secondary" />
                <h2 className="text-xl font-semibold text-off-white">AI Market Insights</h2>
              </div>
              <div className="glass-card">
                <h3 className="font-semibold text-off-white mb-3">🤖 Invisa Daily Summary</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                    <p className="text-off-white mb-2"><strong>Market Sentiment:</strong> Bullish</p>
                    <p className="text-off-white/80 text-sm">Most traders are optimistic about $KCB and $EABL based on recent discussions.</p>
                  </div>
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <p className="text-off-white mb-2"><strong>Top Discussions:</strong></p>
                    <p className="text-off-white/80 text-sm">1. Earnings season expectations<br/>2. Currency hedge strategies<br/>3. Tech stock valuations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'mentorship':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-secondary" />
              <h2 className="text-xl font-semibold text-off-white">Mentorship Hub</h2>
            </div>
            <div className="pb-20 lg:pb-4">
              <div className="text-center text-off-white/60 py-12">
                <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Mentorship program coming soon!</p>
                <p className="text-sm mt-2">Connect with experienced traders for guidance</p>
              </div>
            </div>
          </div>
        );

      default:
        return renderFeedContent();
    }
  };

  return (
    <div className="w-full">
      {renderFeedContent()}
    </div>
  );
};

export default CommunityFeed;