
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Users, MessageSquare, TrendingUp } from 'lucide-react';
import { useCommunity } from '@/hooks/useCommunity';
import UserProfileCard from '@/components/community/UserProfileCard';
import PostCard from '@/components/community/PostCard';
import CreatePostDialog from '@/components/community/CreatePostDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Community = () => {
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

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [showUserPosts, setShowUserPosts] = useState(false);

  const handleViewPosts = async (userId: string) => {
    const posts = await getUserPosts(userId);
    setUserPosts(posts);
    setSelectedUserId(userId);
    setShowUserPosts(true);
  };

  const selectedUser = users.find(user => user.id === selectedUserId);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-off-white">Loading community...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-off-white mb-2">Community</h1>
          <p className="text-off-white/80">Connect with other traders and investors</p>
        </div>

        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="bg-primary border border-secondary/20">
            <TabsTrigger 
              value="feed" 
              className="text-off-white data-[state=active]:bg-secondary data-[state=active]:text-primary"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Feed
            </TabsTrigger>
            <TabsTrigger 
              value="discover" 
              className="text-off-white data-[state=active]:bg-secondary data-[state=active]:text-primary"
            >
              <Users className="w-4 h-4 mr-2" />
              Discover
            </TabsTrigger>
            <TabsTrigger 
              value="trending" 
              className="text-off-white data-[state=active]:bg-secondary data-[state=active]:text-primary"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-off-white">Recent Posts</h2>
              <CreatePostDialog onCreatePost={createPost} />
            </div>
            
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {posts.length === 0 ? (
                  <div className="text-center text-off-white/60 py-8">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No posts yet. Be the first to share something!</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onToggleLike={toggleLike}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="discover" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-off-white">Discover Traders</h2>
              <div className="text-sm text-off-white/60">
                {users.length} traders to discover
              </div>
            </div>
            
            <ScrollArea className="h-[600px]">
              <div className="grid gap-4 md:grid-cols-2">
                {users.map((user) => (
                  <UserProfileCard
                    key={user.id}
                    user={user}
                    isFollowed={followedUsers.includes(user.id)}
                    onFollow={followUser}
                    onUnfollow={unfollowUser}
                    onViewPosts={handleViewPosts}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="trending" className="space-y-6">
            <div className="text-center text-off-white/60 py-8">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Trending posts feature coming soon!</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* User Posts Modal */}
      <Dialog open={showUserPosts} onOpenChange={setShowUserPosts}>
        <DialogContent className="bg-primary border-secondary/20 max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-off-white">
              Posts by {selectedUser?.first_name} {selectedUser?.last_name}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4">
              {userPosts.length === 0 ? (
                <div className="text-center text-off-white/60 py-8">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>This user hasn't posted anything yet.</p>
                </div>
              ) : (
                userPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onToggleLike={toggleLike}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Community;
