
import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MarketOverviewSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const marketData = [
    { symbol: 'SCOM', name: 'Safaricom', price: 42.50, change: 2.1, changePercent: 5.2 },
    { symbol: 'EQTY', name: 'Equity Group', price: 58.75, change: -1.25, changePercent: -2.1 },
    { symbol: 'KCB', name: 'KCB Group', price: 45.00, change: 0.75, changePercent: 1.7 },
    { symbol: 'COOP', name: 'Co-operative Bank', price: 14.80, change: -0.20, changePercent: -1.3 },
    { symbol: 'ABSA', name: 'Absa Bank Kenya', price: 12.45, change: 0.15, changePercent: 1.2 },
    { symbol: 'DTBK', name: 'Diamond Trust Bank', price: 7.50, change: 0.25, changePercent: 3.4 },
  ];

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
        <Card key={stock.symbol} className="min-w-[280px] bg-white/5 border-white/10 flex-shrink-0 select-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center justify-between">
              <div>
                <div className="font-bold">{stock.symbol}</div>
                <div className="text-sm font-normal text-gray-300">{stock.name}</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">KES {stock.price.toFixed(2)}</div>
                <div className={`flex items-center text-sm ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stock.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(1)}%)
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
