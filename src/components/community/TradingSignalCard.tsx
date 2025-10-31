import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertCircle, 
  Clock, 
  Users,
  Bell,
  BellOff
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Database } from '@/integrations/supabase/types';

type TradingSignal = Database['public']['Tables']['trading_signals']['Row'] & {
  profiles: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  is_following?: boolean;
};

interface TradingSignalCardProps {
  signal: TradingSignal;
  onFollow?: (signalId: string) => void;
  onUnfollow?: (signalId: string) => void;
}

const TradingSignalCard: React.FC<TradingSignalCardProps> = ({ 
  signal, 
  onFollow, 
  onUnfollow 
}) => {
  const [isFollowing, setIsFollowing] = useState(signal.is_following || false);

  const displayName = signal.profiles?.first_name && signal.profiles?.last_name
    ? `${signal.profiles.first_name} ${signal.profiles.last_name}`
    : 'Anonymous Trader';

  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase();

  const handleFollowToggle = () => {
    if (isFollowing) {
      onUnfollow?.(signal.id);
    } else {
      onFollow?.(signal.id);
    }
    setIsFollowing(!isFollowing);
  };

  const isBuy = signal.signal_type === 'buy';
  const signalColor = isBuy ? 'green' : signal.signal_type === 'sell' ? 'red' : 'blue';

  const timeframeLabels = {
    day: 'Day Trade',
    swing: 'Swing (1-5 days)',
    long: 'Long Term'
  };

  return (
    <Card className="bg-white/5 border-secondary/20 hover:bg-white/10 transition-colors">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-secondary text-primary text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium text-off-white">{displayName}</p>
                {signal.accuracy_rating && (
                  <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
                    {(signal.accuracy_rating * 100).toFixed(0)}% Accuracy
                  </Badge>
                )}
              </div>
              <p className="text-xs text-off-white/60">
                {formatDistanceToNow(new Date(signal.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleFollowToggle}
            className={`${isFollowing ? 'text-yellow-500' : 'text-off-white/60'}`}
          >
            {isFollowing ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </Button>
        </div>

        {/* Signal Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge 
              className={`bg-${signalColor}-500/10 text-${signalColor}-500 border-${signalColor}-500/30 text-base px-3 py-1`}
            >
              {isBuy ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {signal.signal_type.toUpperCase()} ${signal.ticker}
            </Badge>
            
            {signal.confidence_score && (
              <Badge variant="outline" className="text-off-white/70">
                {signal.confidence_score}/10 Confidence
              </Badge>
            )}

            {signal.timeframe && (
              <Badge variant="outline" className="text-off-white/70">
                <Clock className="w-3 h-3 mr-1" />
                {timeframeLabels[signal.timeframe]}
              </Badge>
            )}
          </div>

          {/* Price Levels */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-primary/30 rounded-lg">
            <div>
              <p className="text-xs text-off-white/60 mb-1">Entry</p>
              <p className="text-sm font-semibold text-off-white">
                KES {signal.entry_price.toFixed(2)}
              </p>
            </div>
            
            {signal.target_price && (
              <div>
                <p className="text-xs text-off-white/60 mb-1">Target</p>
                <p className={`text-sm font-semibold text-green-500`}>
                  <Target className="w-3 h-3 inline mr-1" />
                  {signal.target_price.toFixed(2)}
                </p>
              </div>
            )}
            
            {signal.stop_loss && (
              <div>
                <p className="text-xs text-off-white/60 mb-1">Stop Loss</p>
                <p className={`text-sm font-semibold text-red-500`}>
                  <AlertCircle className="w-3 h-3 inline mr-1" />
                  {signal.stop_loss.toFixed(2)}
                </p>
              </div>
            )}
          </div>

          {/* Reasoning */}
          {signal.reasoning && (
            <p className="text-sm text-off-white/80 p-3 bg-primary/20 rounded-lg">
              {signal.reasoning}
            </p>
          )}

          {/* Footer Stats */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="flex items-center gap-4 text-xs text-off-white/60">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {signal.followers_count} following
              </span>
              <Badge 
                variant="outline"
                className={signal.status === 'active' ? 'text-green-500 border-green-500/30' : 'text-off-white/60'}
              >
                {signal.status.toUpperCase()}
              </Badge>
            </div>

            {signal.expires_at && new Date(signal.expires_at) > new Date() && (
              <span className="text-xs text-off-white/60">
                Expires {formatDistanceToNow(new Date(signal.expires_at), { addSuffix: true })}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingSignalCard;
