
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  BarChart3, 
  Calendar,
  ExternalLink 
} from 'lucide-react';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

interface ResearchPanelProps {
  stock: Stock;
}

const ResearchPanel: React.FC<ResearchPanelProps> = ({ stock }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock research data
  const analystRatings = {
    buy: 8,
    hold: 3,
    sell: 1,
    targetPrice: stock.price * 1.15
  };

  const fundamentals = {
    peRatio: '12.4',
    dividend: '2.8%',
    marketCap: 'KES 450B',
    revenue: 'KES 120B',
    eps: '3.25'
  };

  const recentNews = [
    {
      id: 1,
      title: `${stock.symbol} Reports Strong Q4 Earnings`,
      summary: 'Company exceeds expectations with 15% revenue growth',
      time: '2 hours ago',
      sentiment: 'positive'
    },
    {
      id: 2,
      title: 'NSE Market Update: Banking Sector Shows Resilience',
      summary: 'Financial stocks maintain steady performance amid market volatility',
      time: '4 hours ago',
      sentiment: 'neutral'
    },
    {
      id: 3,
      title: `${stock.symbol} Announces New Partnership`,
      summary: 'Strategic alliance expected to drive future growth',
      time: '1 day ago',
      sentiment: 'positive'
    }
  ];

  return (
    <div className="glass-card animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-4 w-4 text-secondary" />
        <h3 className="text-lg font-bold text-off-white">Research</h3>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/10">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="fundamentals" className="text-xs">Fundamentals</TabsTrigger>
          <TabsTrigger value="news" className="text-xs">News</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          {/* Analyst Ratings */}
          <div>
            <h4 className="font-semibold text-off-white mb-2">Analyst Ratings</h4>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-off-white/60">Consensus</span>
                <Badge className="bg-green-600">BUY</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-green-400 font-semibold">{analystRatings.buy}</div>
                  <div className="text-off-white/60">Buy</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-400 font-semibold">{analystRatings.hold}</div>
                  <div className="text-off-white/60">Hold</div>
                </div>
                <div className="text-center">
                  <div className="text-red-400 font-semibold">{analystRatings.sell}</div>
                  <div className="text-off-white/60">Sell</div>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-off-white/60">Price Target:</span>
                  <span className="text-secondary font-semibold">
                    KES {analystRatings.targetPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div>
            <h4 className="font-semibold text-off-white mb-2">Performance</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/5 rounded-lg p-2">
                <div className="text-xs text-off-white/60">52W High</div>
                <div className="font-semibold text-off-white">KES {(stock.price * 1.25).toFixed(2)}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-2">
                <div className="text-xs text-off-white/60">52W Low</div>
                <div className="font-semibold text-off-white">KES {(stock.price * 0.75).toFixed(2)}</div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="fundamentals" className="mt-4">
          <div className="space-y-3">
            {Object.entries(fundamentals).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0">
                <span className="text-sm text-off-white/60 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="font-semibold text-off-white">{value}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="news" className="mt-4">
          <div className="space-y-3">
            {recentNews.map(news => (
              <div key={news.id} className="bg-white/5 rounded-lg p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h5 className="font-semibold text-off-white text-sm mb-1">{news.title}</h5>
                    <p className="text-xs text-off-white/60 mb-2">{news.summary}</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-off-white/40" />
                      <span className="text-xs text-off-white/40">{news.time}</span>
                      <Badge 
                        variant={news.sentiment === 'positive' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {news.sentiment === 'positive' ? <TrendingUp className="h-2 w-2 mr-1" /> : <BarChart3 className="h-2 w-2 mr-1" />}
                        {news.sentiment}
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="p-1">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResearchPanel;
