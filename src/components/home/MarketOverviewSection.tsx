
import React, { useRef, useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useFinancialData } from '@/contexts/FinancialDataContext';

const MarketOverviewSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const { state } = useFinancialData();
  const marketData = state.stocks ?? [];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

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

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
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
      {marketData.map((stock) => (
        <Card key={stock.symbol || stock.id} className="min-w-[280px] bg-white/5 border-white/10 flex-shrink-0 select-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center justify-between">
              <div>
                <div className="font-bold">{stock.symbol}</div>
                <div className="text-sm font-normal text-gray-300">{stock.name}</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">{(stock.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className={`flex items-center text-sm ${Number(stock.change) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {Number(stock.change) >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {Number(stock.change) >= 0 ? '+' : ''}{Number(stock.change || 0).toFixed(2)} ({Number(stock.changePercent || 0) >= 0 ? '+' : ''}{Number(stock.changePercent || 0).toFixed(2)}%)
                </div>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default MarketOverviewSection;
