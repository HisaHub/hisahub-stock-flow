
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Users, MessageSquare, Brain, GraduationCap, Signal, Bookmark } from 'lucide-react';
import { useCommunity } from '@/hooks/useCommunity';
import { usePostSearch } from '@/hooks/usePostSearch';
import CommunityFeed from '@/components/community/CommunityFeed';
import SidebarWidgets from '@/components/community/SidebarWidgets';
import CreatePostFAB from '@/components/community/CreatePostFAB';
import LeaderboardWidget from '@/components/community/LeaderboardWidget';
import TrendingWidget from '@/components/community/TrendingWidget';
import SearchBar from '@/components/community/SearchBar';
import PeopleRecommendations from '@/components/community/PeopleRecommendations';

const Community = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [showSearch, setShowSearch] = useState(false);
  
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

  const {
    searchResults,
    searching,
    trendingTickers,
    trendingHashtags,
    searchPosts,
    fetchTrendingTickers,
    fetchTrendingHashtags
  } = usePostSearch();

  useEffect(() => {
    fetchTrendingTickers();
    fetchTrendingHashtags();
  }, []);

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
      {/* Fullscreen Header */}
      <div className="bg-primary/95 backdrop-blur-md sticky top-0 z-40">
        <div className="w-full px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-off-white">HisaHub Community</h1>
              <p className="text-sm text-off-white/70">Your trading social hub</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-off-white">
                <Bookmark className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-3">
            <SearchBar
              onSearch={(query, filters) => {
                searchPosts(query, filters);
                setShowSearch(!!query || filters.tickers.length > 0);
              }}
              trendingTickers={trendingTickers}
            />
          </div>
          
          {/* Navigation Tabs - Scrollable on mobile */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex space-x-1 bg-primary/50 p-1 rounded-lg min-w-max">
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
                  onClick={() => {
                    setActiveTab(tab.id);
                    setShowSearch(false);
                  }}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
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
      </div>

      {/* Fullscreen Main Content */}
      <div className="w-full">
        <div className="flex flex-col lg:flex-row">
          {/* Main Feed - Full width on mobile */}
          <div className="flex-1 lg:max-w-3xl lg:mx-auto">
            {showSearch && searchResults.length > 0 ? (
              <CommunityFeed 
                activeTab="search"
                posts={searchResults}
                onToggleLike={toggleLike}
                onCreatePost={createPost}
              />
            ) : showSearch && !searching ? (
              <div className="text-center py-12 text-off-white/60">
                <p>No posts found matching your search</p>
              </div>
            ) : (
              <CommunityFeed 
                activeTab={activeTab}
                posts={posts}
                onToggleLike={toggleLike}
                onCreatePost={createPost}
              />
            )}
          </div>

          {/* Sidebar Widgets - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:block lg:w-80 lg:sticky lg:top-32 lg:self-start space-y-4 lg:pr-4">
            <PeopleRecommendations onFollow={followUser} />
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
