import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface RecommendedUser {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  common_follows_count: number;
}

interface PeopleRecommendationsProps {
  onFollow: (userId: string) => void;
}

const PeopleRecommendations: React.FC<PeopleRecommendationsProps> = ({ onFollow }) => {
  const [recommendations, setRecommendations] = useState<RecommendedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return;

      const { data, error } = await supabase.rpc('get_recommended_users', {
        for_user_id: session.session.user.id,
        limit_count: 5
      });

      if (error) throw error;

      setRecommendations(data || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="bg-primary/50 border-secondary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-off-white">People to Follow</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((user) => {
          const displayName = user.first_name && user.last_name
            ? `${user.first_name} ${user.last_name}`
            : 'Anonymous Trader';
          const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase();

          return (
            <div key={user.user_id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-secondary text-primary text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-off-white">{displayName}</p>
                  <p className="text-xs text-off-white/60">
                    {user.common_follows_count} mutual follow{user.common_follows_count !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => onFollow(user.user_id)}
                className="bg-secondary hover:bg-secondary/90 text-primary"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                Follow
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default PeopleRecommendations;
