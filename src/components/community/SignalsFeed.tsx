import React from 'react';
import { useTradingSignals } from '@/hooks/useTradingSignals';
import TradingSignalCard from './TradingSignalCard';
import { Loader2 } from 'lucide-react';

const SignalsFeed: React.FC = () => {
  const { signals, loading, followSignal, unfollowSignal } = useTradingSignals();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (signals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-off-white/60">No active trading signals yet</p>
        <p className="text-sm text-off-white/40 mt-2">
          Be the first to share your trading insights!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4">
      {signals.map(signal => (
        <TradingSignalCard
          key={signal.id}
          signal={signal}
          onFollow={followSignal}
          onUnfollow={unfollowSignal}
        />
      ))}
    </div>
  );
};

export default SignalsFeed;
