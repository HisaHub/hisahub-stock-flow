import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  category: 'trading' | 'social' | 'learning' | 'special';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
  requirement_type: string;
  requirement_value: number;
  unlocked?: boolean;
  unlocked_at?: string;
}

interface UserStats {
  user_id: string;
  total_trades: number;
  profitable_trades: number;
  total_posts: number;
  total_likes_received: number;
  total_signals: number;
  accurate_signals: number;
  achievement_points: number;
  reputation_score: number;
  current_streak: number;
  longest_streak: number;
}

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAchievements();
    fetchUserStats();
  }, []);

  const fetchAchievements = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        setLoading(false);
        return;
      }

      // Get all achievements
      const { data: allAchievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .order('points', { ascending: true });

      if (achievementsError) throw achievementsError;

      // Get user's unlocked achievements
      const { data: userAchievements, error: userError } = await supabase
        .from('user_achievements')
        .select('achievement_id, unlocked_at')
        .eq('user_id', session.session.user.id);

      if (userError) throw userError;

      const unlockedMap = new Map(
        userAchievements?.map(ua => [ua.achievement_id, ua.unlocked_at]) || []
      );

      const enrichedAchievements = (allAchievements || []).map(achievement => ({
        ...achievement,
        category: achievement.category as 'trading' | 'social' | 'learning' | 'special',
        tier: achievement.tier as 'bronze' | 'silver' | 'gold' | 'platinum',
        unlocked: unlockedMap.has(achievement.id),
        unlocked_at: unlockedMap.get(achievement.id)
      }));

      setAchievements(enrichedAchievements as Achievement[]);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return;

      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', session.session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setUserStats(data);
      } else {
        // Create initial stats if they don't exist
        const { data: newStats, error: insertError } = await supabase
          .from('user_stats')
          .insert({
            user_id: session.session.user.id
          })
          .select()
          .single();

        if (insertError) throw insertError;
        setUserStats(newStats);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const checkAndUnlockAchievements = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user || !userStats) return;

      const userId = session.session.user.id;
      const newlyUnlocked: Achievement[] = [];

      for (const achievement of achievements) {
        if (achievement.unlocked) continue;

        let shouldUnlock = false;

        switch (achievement.requirement_type) {
          case 'trades_count':
            shouldUnlock = userStats.total_trades >= achievement.requirement_value;
            break;
          case 'posts_count':
            shouldUnlock = userStats.total_posts >= achievement.requirement_value;
            break;
          case 'total_likes':
            shouldUnlock = userStats.total_likes_received >= achievement.requirement_value;
            break;
          case 'accurate_signals':
            shouldUnlock = userStats.accurate_signals >= achievement.requirement_value;
            break;
          case 'login_streak':
            shouldUnlock = userStats.current_streak >= achievement.requirement_value;
            break;
        }

        if (shouldUnlock) {
          const { error } = await supabase
            .from('user_achievements')
            .insert({
              user_id: userId,
              achievement_id: achievement.id
            });

          if (!error) {
            newlyUnlocked.push(achievement);

            // Update user stats with achievement points
            await supabase
              .from('user_stats')
              .update({
                achievement_points: (userStats.achievement_points || 0) + achievement.points,
                reputation_score: (userStats.reputation_score || 0) + Math.floor(achievement.points / 2)
              })
              .eq('user_id', userId);
          }
        }
      }

      if (newlyUnlocked.length > 0) {
        newlyUnlocked.forEach(achievement => {
          toast({
            title: `🎉 Achievement Unlocked!`,
            description: `${achievement.icon} ${achievement.name} - ${achievement.description}`
          });
        });

        await fetchAchievements();
        await fetchUserStats();
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  };

  return {
    achievements,
    userStats,
    loading,
    checkAndUnlockAchievements,
    refetch: () => {
      fetchAchievements();
      fetchUserStats();
    }
  };
};
