
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserPlus, UserMinus, MessageCircle } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type UserProfile = Database['public']['Tables']['profiles']['Row'];

interface UserProfileCardProps {
  user: UserProfile;
  isFollowed: boolean;
  onFollow: (userId: string) => void;
  onUnfollow: (userId: string) => void;
  onViewPosts: (userId: string) => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  isFollowed,
  onFollow,
  onUnfollow,
  onViewPosts
}) => {
  const displayName = user.first_name && user.last_name 
    ? `${user.first_name} ${user.last_name}`
    : user.first_name || user.last_name || 'Anonymous User';

  const initials = displayName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-secondary text-secondary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{displayName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {user.role || 'standard'}
              </Badge>
              <Badge 
                variant={user.account_status === 'active' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {user.account_status || 'pending'}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button
            variant={isFollowed ? "outline" : "default"}
            size="sm"
            onClick={() => isFollowed ? onUnfollow(user.id) : onFollow(user.id)}
            className="flex-1"
          >
            {isFollowed ? (
              <>
                <UserMinus className="w-4 h-4 mr-2" />
                Unfollow
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Follow
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewPosts(user.id)}
            className="flex-1"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Posts
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
