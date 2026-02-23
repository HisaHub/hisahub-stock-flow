
import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useFinancialData } from '@/contexts/FinancialDataContext';

const OpenPositionsCard: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const { state } = useFinancialData();

  const positions = state.holdings;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current.offsetLeft || 0);
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const x = e.touches[0].pageX - (scrollRef.current.offsetLeft || 0);
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => setIsDragging(false);

  if (positions.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-off-white">Open Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-off-white/60 text-sm text-center py-4">No open positions yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-off-white">Open Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {positions.map((position) => {
            const gainLoss = position.profitLoss;
            const gainLossPercent = position.profitLossPercent;
            return (
              <div key={position.id} className="min-w-[250px] bg-white/5 border border-white/10 rounded-lg p-4 flex-shrink-0 select-none">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-off-white font-semibold">{position.symbol}</h3>
                    <p className="text-off-white/60 text-sm">{position.quantity} shares</p>
                  </div>
                  <div className="text-right">
                    <p className="text-off-white font-semibold">{position.currency ?? 'KES'} {position.value.toLocaleString()}</p>
                    <div className={`flex items-center text-sm ${gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {gainLoss >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {gainLoss >= 0 ? '+' : ''}{position.currency ?? 'KES'} {gainLoss.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-off-white/60">Avg Price:</span>
                    <span className="text-off-white">{position.currency ?? 'KES'} {position.avgPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-off-white/60">Current:</span>
                    <span className="text-off-white">{position.currency ?? 'KES'} {position.currentPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-off-white/60">Return:</span>
                    <span className={gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default OpenPositionsCard;
