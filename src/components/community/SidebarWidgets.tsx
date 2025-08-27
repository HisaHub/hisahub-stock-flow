import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';

const SidebarWidgets = () => {
  // Mock market data - in real app, this would come from market data API
  const marketMovers = [
    { symbol: 'KCB', name: 'Kenya Commercial Bank', change: 5.2, price: 45.50 },
    { symbol: 'EABL', name: 'East African Breweries', change: -2.1, price: 185.00 },
    { symbol: 'SCOM', name: 'Safaricom', change: 1.8, price: 28.75 },
    { symbol: 'COOP', name: 'Co-operative Bank', change: -0.5, price: 12.85 },
  ];

  const upcomingEvents = [
    { date: 'Dec 15', event: 'KCB Q4 Earnings', type: 'earnings' },
    { date: 'Dec 18', event: 'NSE Market Close', type: 'holiday' },
    { date: 'Dec 20', event: 'EABL Dividend Ex-Date', type: 'dividend' },
    { date: 'Dec 22', event: 'New IPO Listing', type: 'ipo' },
  ];

  return (
    <div className="space-y-6">
      {/* Market Movers */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-secondary" />
            Market Movers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {marketMovers.map((stock) => (
            <div key={stock.symbol} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{stock.symbol}</span>
                  {stock.change > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{stock.name}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">KES {stock.price}</p>
                <Badge 
                  variant={stock.change > 0 ? "default" : "destructive"}
                  className={`text-xs ${stock.change > 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}
                >
                  {stock.change > 0 ? '+' : ''}{stock.change}%
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-secondary" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <div className="text-center">
                <div className="text-sm font-semibold text-secondary">{event.date}</div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{event.event}</p>
                <Badge 
                  variant="outline" 
                  className={`text-xs mt-1 ${
                    event.type === 'earnings' ? 'border-blue-500/30 text-blue-500' :
                    event.type === 'dividend' ? 'border-green-500/30 text-green-500' :
                    event.type === 'ipo' ? 'border-purple-500/30 text-purple-500' :
                    'border-orange-500/30 text-orange-500'
                  }`}
                >
                  {event.type}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-secondary" />
            NSE Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="text-xs text-green-500 font-medium">NSE 20</div>
              <div className="text-sm font-semibold text-foreground">1,952.4</div>
              <div className="text-xs text-green-500">+1.2%</div>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="text-xs text-blue-500 font-medium">Volume</div>
              <div className="text-sm font-semibold text-foreground">2.1M</div>
              <div className="text-xs text-blue-500">shares</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SidebarWidgets;