import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';
import { useMarketData } from '@/hooks/useMarketData';

const SidebarWidgets = () => {
  const { stocks, marketIndices, loading } = useMarketData();

  // Determine top movers by absolute change percent
  const marketMovers = (stocks || [])
    .slice()
    .sort((a: any, b: any) => {
      const aPct = Number(a.changePercent) || 0;
      const bPct = Number(b.changePercent) || 0;
      return Math.abs(bPct) - Math.abs(aPct);
    })
    .slice(0, 4);

  const nseSummary = marketIndices && marketIndices.length ? marketIndices[0] : null;

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
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : marketMovers.length === 0 ? (
            <div className="text-sm text-muted-foreground">No market data available</div>
          ) : (
            marketMovers.map((stock: any) => (
              <div key={stock.symbol} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{stock.symbol}</span>
                    {Number(stock.change) > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{stock.name || ''}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">KES {Number(stock.price || 0).toFixed(2)}</p>
                  <Badge 
                    variant={Number(stock.change) > 0 ? "default" : "destructive"}
                    className={`text-xs ${Number(stock.change) > 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}
                  >
                    {Number(stock.change) > 0 ? '+' : ''}{Number(stock.changePercent || 0).toFixed(2)}%
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Upcoming Events - keep lightweight static list if no events source available */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-secondary" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
            <div className="text-center">
              <div className="text-sm font-semibold text-secondary">—</div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">No upcoming events</p>
              <Badge variant="outline" className="text-xs mt-1">—</Badge>
            </div>
          </div>
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
            <div className={`p-3 rounded-lg border ${nseSummary && nseSummary.change > 0 ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
              <div className="text-xs text-green-500 font-medium">NSE 20</div>
              <div className="text-sm font-semibold text-foreground">{nseSummary ? Number(nseSummary.index_value).toLocaleString() : '—'}</div>
              <div className="text-xs text-green-500">{nseSummary ? `${nseSummary.change}%` : '—'}</div>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="text-xs text-blue-500 font-medium">Volume</div>
              <div className="text-sm font-semibold text-foreground">{nseSummary ? (nseSummary.volume || '—') : '—'}</div>
              <div className="text-xs text-blue-500">shares</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SidebarWidgets;