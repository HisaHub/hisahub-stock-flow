import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AchievementBadgeProps {
  icon: string;
  name: string;
  description: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  size?: 'sm' | 'md' | 'lg';
  unlocked?: boolean;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  icon,
  name,
  description,
  tier,
  size = 'md',
  unlocked = true
}) => {
  const tierColors = {
    bronze: 'from-orange-600 to-orange-800',
    silver: 'from-gray-400 to-gray-600',
    gold: 'from-yellow-400 to-yellow-600',
    platinum: 'from-cyan-400 to-purple-600'
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-base',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl'
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`
              ${sizeClasses[size]} 
              rounded-full 
              flex items-center justify-center
              bg-gradient-to-br ${tierColors[tier]}
              shadow-lg cursor-pointer
              transition-all hover:scale-110
              ${!unlocked && 'grayscale opacity-40'}
            `}
          >
            <span>{icon}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-primary border-secondary/30 max-w-xs">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-off-white">{name}</p>
              <Badge 
                variant="outline" 
                className={`text-xs bg-gradient-to-r ${tierColors[tier]} text-white border-0`}
              >
                {tier.toUpperCase()}
              </Badge>
            </div>
            <p className="text-sm text-off-white/70">{description}</p>
            {!unlocked && (
              <p className="text-xs text-off-white/50 italic">Not yet unlocked</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AchievementBadge;
