import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Crown, Medal, Award, TrendingUp } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type UserProfile = Database['public']['Tables']['profiles']['Row'];

interface LeaderboardWidgetProps {
  users: UserProfile[];
}

const LeaderboardWidget: React.FC<LeaderboardWidgetProps> = ({ users }) => {
  // Build leaderboard entries from provided `users` prop. If engagement metrics
  // exist on the profile rows (posts_count, followers_count, xp), use them;
  // otherwise fall back to sensible defaults and show an empty state when no
  // users are provided.
  const leaderboardData = (users || []).slice(0, 10).map((u, idx) => ({
    user: u,
    score: (u as any).xp || ((u as any).posts_count || 0) * 10 + ((u as any).followers_count || 0) * 2,
    badge: (u as any).badge || (idx === 0 ? 'Market Guru' : idx === 1 ? 'Top Analyst' : 'Contributor'),
    posts: (u as any).posts_count || 0,
    followers: (u as any).followers_count || 0
  }));

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-secondary font-bold">#{index + 1}</span>;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Market Guru':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Top Analyst':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Rising Star':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Active Trader':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Mentor':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-secondary/20 text-secondary border-secondary/30';
    }
  };

  const getDisplayName = (user: any) => {
    return user.first_name && user.last_name 
      ? `${user.first_name} ${user.last_name}`
      : user.first_name || user.last_name || 'Anonymous Trader';
  };

  const getInitials = (user: any) => {
    const name = getDisplayName(user);
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-secondary" />
          Community Leaders
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {leaderboardData.map((entry, index) => (
          <div
            key={entry.user.id}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-white/5 ${
              index < 3 ? 'bg-secondary/5 border border-secondary/10' : 'bg-white/5'
            }`}
          >
            {/* Rank */}
            <div className="flex items-center justify-center w-8">
              {getRankIcon(index)}
            </div>

            {/* Avatar */}
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-secondary text-primary font-semibold">
                {getInitials(entry.user)}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-foreground truncate">
                  {getDisplayName(entry.user)}
                </h4>
              </div>
              <Badge 
                variant="outline" 
                className={`text-xs mt-1 ${getBadgeColor(entry.badge)}`}
              >
                {entry.badge}
              </Badge>
            </div>

            {/* Score */}
            <div className="text-right">
              <div className="text-sm font-bold text-secondary">{entry.score.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">XP</div>
            </div>
          </div>
        ))}

        {/* Call to Action */}
        <div className="mt-4 p-3 bg-secondary/10 rounded-lg border border-secondary/20 text-center">
          <p className="text-sm text-foreground font-medium mb-1">
            🎯 Climb the leaderboard!
          </p>
          <p className="text-xs text-muted-foreground">
            Share insights, help others, and earn XP to unlock badges
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardWidget;