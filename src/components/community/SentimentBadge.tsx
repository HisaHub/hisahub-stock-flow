import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SentimentBadgeProps {
  label: 'bullish' | 'bearish' | 'neutral' | null;
  score?: number;
  confidence?: number;
  size?: 'sm' | 'md';
}

const SentimentBadge: React.FC<SentimentBadgeProps> = ({ 
  label, 
  score, 
  confidence, 
  size = 'md' 
}) => {
  if (!label) return null;

  const config = {
    bullish: {
      icon: TrendingUp,
      className: 'bg-green-500/10 text-green-500 border-green-500/30',
      label: 'Bullish'
    },
    bearish: {
      icon: TrendingDown,
      className: 'bg-red-500/10 text-red-500 border-red-500/30',
      label: 'Bearish'
    },
    neutral: {
      icon: Minus,
      className: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
      label: 'Neutral'
    }
  };

  const { icon: Icon, className, label: displayLabel } = config[label];
  const sizeClass = size === 'sm' ? 'text-xs py-0.5 px-2' : 'text-sm';

  return (
    <Badge 
      variant="outline" 
      className={`${className} ${sizeClass} flex items-center gap-1`}
      title={confidence ? `Confidence: ${(confidence * 100).toFixed(0)}%` : undefined}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      {displayLabel}
      {score !== undefined && size !== 'sm' && (
        <span className="ml-1 opacity-70">
          {score > 0 ? '+' : ''}{(score * 100).toFixed(0)}%
        </span>
      )}
    </Badge>
  );
};

export default SentimentBadge;
