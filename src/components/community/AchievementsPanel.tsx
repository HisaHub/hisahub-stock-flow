import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAchievements } from '@/hooks/useAchievements';
import AchievementBadge from './AchievementBadge';
import { Trophy, TrendingUp, Award } from 'lucide-react';

const AchievementsPanel: React.FC = () => {
  const { achievements, userStats, loading } = useAchievements();

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-white/5 rounded-lg"></div>
          <div className="h-64 bg-white/5 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progress = (unlockedCount / achievements.length) * 100;

  return (
    <div className="space-y-4 p-4">
      {/* User Stats Summary */}
      <Card className="bg-gradient-to-br from-secondary/20 to-primary/50 border-secondary/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-off-white">
                {userStats?.reputation_score || 0}
              </h3>
              <p className="text-sm text-off-white/70">Reputation Score</p>
            </div>
            <Trophy className="w-12 h-12 text-secondary" />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-off-white">
                {userStats?.achievement_points || 0}
              </p>
              <p className="text-xs text-off-white/60">Points</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-off-white">{unlockedCount}</p>
              <p className="text-xs text-off-white/60">Badges</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-off-white">
                {userStats?.current_streak || 0}
              </p>
              <p className="text-xs text-off-white/60">Day Streak</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-off-white/70">
              <span>Achievement Progress</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Achievement Categories */}
      {['trading', 'social', 'learning', 'special'].map(category => {
        const categoryAchievements = achievements.filter(a => a.category === category);
        const categoryUnlocked = categoryAchievements.filter(a => a.unlocked).length;

        return (
          <Card key={category} className="bg-white/5 border-secondary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-off-white capitalize">
                  {category === 'social' ? 'Community' : category} Achievements
                </CardTitle>
                <Badge variant="outline" className="text-off-white/70">
                  {categoryUnlocked}/{categoryAchievements.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {categoryAchievements.map(achievement => (
                  <div key={achievement.id} className="flex flex-col items-center">
                    <AchievementBadge
                      icon={achievement.icon}
                      name={achievement.name}
                      description={achievement.description}
                      tier={achievement.tier}
                      size="md"
                      unlocked={achievement.unlocked}
                    />
                    <p className="text-xs text-center text-off-white/60 mt-2 line-clamp-1">
                      {achievement.name}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Recent Activity Stats */}
      {userStats && (
        <Card className="bg-white/5 border-secondary/20">
          <CardHeader>
            <CardTitle className="text-lg text-off-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Your Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-off-white/70">Total Trades</span>
                <span className="font-semibold text-off-white">
                  {userStats.total_trades}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-off-white/70">Win Rate</span>
                <span className="font-semibold text-green-500">
                  {userStats.total_trades > 0
                    ? ((userStats.profitable_trades / userStats.total_trades) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-off-white/70">Trading Signals</span>
                <span className="font-semibold text-off-white">
                  {userStats.total_signals}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-off-white/70">Signal Accuracy</span>
                <span className="font-semibold text-secondary">
                  {userStats.total_signals > 0
                    ? ((userStats.accurate_signals / userStats.total_signals) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AchievementsPanel;
