
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Users, MessageSquare, Brain, GraduationCap, Signal, Bookmark } from 'lucide-react';
import { useCommunity } from '@/hooks/useCommunity';
import CommunityFeed from '@/components/community/CommunityFeed';
import SidebarWidgets from '@/components/community/SidebarWidgets';
import CreatePostFAB from '@/components/community/CreatePostFAB';
import LeaderboardWidget from '@/components/community/LeaderboardWidget';
import TrendingWidget from '@/components/community/TrendingWidget';

const Community = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const {
    posts,
    users,
    followedUsers,
    loading,
    followUser,
    unfollowUser,
    createPost,
    toggleLike,
    getUserPosts
  } = useCommunity();

  if (loading) {
    return (
      <div className="min-h-screen bg-primary p-4 flex items-center justify-center">
        <div className="text-center text-off-white">
          <div className="animate-spin w-8 h-8 border-2 border-secondary border-t-transparent rounded-full mx-auto mb-4"></div>
          Loading HisaHub Community...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <div className="bg-primary/95 backdrop-blur-md border-b border-secondary/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-off-white">HisaHub Community</h1>
              <p className="text-off-white/80">Your trading social hub</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-secondary/30">
                <Bookmark className="w-4 h-4 mr-2" />
                Saved
              </Button>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-primary/50 p-1 rounded-lg">
            {[
              { id: 'feed', label: 'Following', icon: MessageSquare },
              { id: 'trending', label: 'Trending', icon: TrendingUp },
              { id: 'discussions', label: 'Discussions', icon: Users },
              { id: 'signals', label: 'Signals', icon: Signal },
              { id: 'ai-insights', label: 'AI Insights', icon: Brain },
              { id: 'mentorship', label: 'Mentorship', icon: GraduationCap },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-secondary text-primary shadow-sm'
                    : 'text-off-white/70 hover:text-off-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Feed - 3 columns */}
          <div className="lg:col-span-3">
            <CommunityFeed 
              activeTab={activeTab}
              posts={posts}
              onToggleLike={toggleLike}
              onCreatePost={createPost}
            />
          </div>

          {/* Sidebar Widgets - 1 column */}
          <div className="lg:col-span-1 space-y-6">
            <SidebarWidgets />
            <LeaderboardWidget users={users} />
            <TrendingWidget />
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <CreatePostFAB onCreatePost={createPost} />
    </div>
  );
};

export default Community;
