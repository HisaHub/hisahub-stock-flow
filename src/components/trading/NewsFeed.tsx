
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, MessageCircle, ThumbsUp, Clock, Brain, Sparkles, Loader2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

interface NewsFeedProps {
  stock: Stock;
}

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  sentiment: "positive" | "negative" | "neutral";
  likes: number;
  comments: number;
  category: "earnings" | "analyst" | "market" | "company";
}

interface CommunityPost {
  id: number;
  user: string;
  content: string;
  timestamp: string;
  likes: number;
  sentiment: "bullish" | "bearish" | "neutral";
  verified: boolean;
}

const mockNews: NewsItem[] = [
  {
    id: 1,
    title: "Safaricom Reports Strong Q3 Results",
    summary: "M-Pesa revenue up 15% YoY, subscriber growth continues at 8.2%",
    source: "Business Daily",
    timestamp: "2 hours ago",
    sentiment: "positive",
    likes: 42,
    comments: 18,
    category: "earnings"
  },
  {
    id: 2,
    title: "Analyst Upgrades SCOM to Buy",
    summary: "Standard Investment Bank raises target price to KES 28.00",
    source: "Capital Markets",
    timestamp: "4 hours ago", 
    sentiment: "positive",
    likes: 28,
    comments: 12,
    category: "analyst"
  },
  {
    id: 3,
    title: "NSE Trading Update",
    summary: "Mixed trading session with telecommunications leading gains",
    source: "NSE News",
    timestamp: "6 hours ago",
    sentiment: "neutral",
    likes: 15,
    comments: 7,
    category: "market"
  }
];

const mockCommunity: CommunityPost[] = [
  {
    id: 1,
    user: "KenyanInvestor",
    content: "SCOM looking strong above 22.50 support. Could see 25+ if M-Pesa numbers keep growing 📈",
    timestamp: "1 hour ago",
    likes: 23,
    sentiment: "bullish",
    verified: true
  },
  {
    id: 2,
    user: "TraderJoe254",
    content: "Taking profits at current levels. Waiting for pullback to 21.80 to re-enter",
    timestamp: "3 hours ago",
    likes: 12,
    sentiment: "bearish",
    verified: false
  },
  {
    id: 3,
    user: "FinanceGuru",
    content: "Strong fundamentals but market conditions uncertain. Holding long-term position.",
    timestamp: "5 hours ago",
    likes: 31,
    sentiment: "neutral",
    verified: true
  }
];

const NewsFeed: React.FC<NewsFeedProps> = ({ stock }) => {
  const [activeTab, setActiveTab] = useState<"news" | "community" | "ai">("news");
  const [sentimentFilter, setSentimentFilter] = useState<string>("all");
  const [aiSummary, setAiSummary] = useState<string>('');
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const { toast } = useToast();

  const [newsItems, setNewsItems] = React.useState<NewsItem[]>(mockNews);
  const [communityPosts, setCommunityPosts] = React.useState<CommunityPost[]>(mockCommunity);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: newsData } = await supabase.from('news').select('*').order('published_at', { ascending: false }).limit(10);
        if (newsData) setNewsItems(newsData as any);
      } catch (err) {
        console.debug('Could not load news from DB', err);
      }

      try {
        const { data: posts } = await supabase.from('community_posts').select('*').order('created_at', { ascending: false }).limit(10);
        if (posts) setCommunityPosts(posts as any);
      } catch (err) {
        console.debug('Could not load community posts', err);
      }
    };

    load();
  }, []);

  const generateAISummary = async () => {
    setGeneratingSummary(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-news-summarizer', {
        body: { 
          stock_symbol: stock.symbol,
          news_items: newsItems,
          community_posts: communityPosts
        }
      });

      if (error) throw error;
      setAiSummary(data.summary);
      setActiveTab('ai');
      toast({
        title: "AI Summary Generated",
        description: "News & sentiment summarized"
      });
    } catch (error) {
      console.error('AI summary error:', error);
      toast({
        title: "Summary Failed",
        description: "Could not generate AI summary",
        variant: "destructive"
      });
    } finally {
      setGeneratingSummary(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
      case "bullish":
        return "text-green-400";
      case "negative":
      case "bearish":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
      case "bullish":
        return <TrendingUp className="h-3 w-3" />;
      case "negative":
      case "bearish":
        return <TrendingDown className="h-3 w-3" />;
      default:
        return <MessageCircle className="h-3 w-3" />;
    }
  };

  const filteredNews = sentimentFilter === "all" ? newsItems : newsItems.filter(item => item.sentiment === sentimentFilter);

  const filteredCommunity = sentimentFilter === "all" ? communityPosts : communityPosts.filter(post => post.sentiment === sentimentFilter);

  return (
    <div className="glass-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-off-white">News & Sentiment</h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={activeTab === "news" ? "secondary" : "outline"}
            onClick={() => setActiveTab("news")}
            className="text-xs"
          >
            News
          </Button>
          <Button
            size="sm"
            variant={activeTab === "community" ? "secondary" : "outline"}
            onClick={() => setActiveTab("community")}
            className="text-xs"
          >
            Community
          </Button>
          <Button
            size="sm"
            variant={activeTab === "ai" ? "secondary" : "outline"}
            onClick={generateAISummary}
            disabled={generatingSummary}
            className="text-xs"
          >
            {generatingSummary ? (
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            ) : (
              <Brain className="w-3 h-3 mr-1" />
            )}
            AI Summary
          </Button>
        </div>
      </div>

      {/* Sentiment Filter */}
      <div className="flex gap-1 mb-4 overflow-x-auto">
        {["all", "positive", "negative", "neutral"].map((filter) => (
          <Button
            key={filter}
            size="sm"
            variant={sentimentFilter === filter ? "secondary" : "outline"}
            onClick={() => setSentimentFilter(filter)}
            className="flex-shrink-0 text-xs capitalize"
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* News Tab */}
      {activeTab === "news" && (
        <div className="space-y-3">
          {filteredNews.map((item) => (
            <div key={item.id} className="bg-white/5 rounded-lg p-3">
              <div className="flex items-start gap-3">
                <div className={`mt-1 ${getSentimentColor(item.sentiment)}`}>
                  {getSentimentIcon(item.sentiment)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                    <span className="text-xs text-off-white/60">{item.source}</span>
                  </div>
                  
                  <h4 className="text-sm font-semibold text-off-white mb-1 leading-tight">
                    {item.title}
                  </h4>
                  
                  <p className="text-xs text-off-white/80 mb-2 leading-relaxed">
                    {item.summary}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-off-white/60">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{item.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>{item.comments}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-off-white/60">
                      <Clock className="h-3 w-3" />
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Summary Tab */}
      {activeTab === "ai" && (
        <div className="space-y-4">
          {aiSummary ? (
            <>
              <div className="bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-lg p-4 border border-secondary/30">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-5 h-5 text-secondary" />
                  <h4 className="font-semibold text-off-white">AI-Powered Summary</h4>
                </div>
                <p className="text-sm text-off-white/90 leading-relaxed whitespace-pre-line">
                  {aiSummary}
                </p>
              </div>
              <div className="text-xs text-off-white/40 text-center">
                AI-generated summary • Always verify information independently
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-secondary opacity-50" />
              <p className="text-sm text-off-white/60">
                Click "AI Summary" to generate insights
              </p>
            </div>
          )}
        </div>
      )}

      {/* Community Tab */}
      {activeTab === "community" && (
        <div className="space-y-3">
          {filteredCommunity.map((post) => (
            <div key={post.id} className="bg-white/5 rounded-lg p-3">
              <div className="flex items-start gap-3">
                <div className={`mt-1 ${getSentimentColor(post.sentiment)}`}>
                  {getSentimentIcon(post.sentiment)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-off-white">
                      {post.user}
                    </span>
                    {post.verified && (
                      <Badge variant="secondary" className="text-xs">
                        ✓ Verified
                      </Badge>
                    )}
                    <Badge 
                      variant={
                        post.sentiment === "bullish" ? "default" :
                        post.sentiment === "bearish" ? "destructive" : "outline"
                      }
                      className="text-xs"
                    >
                      {post.sentiment}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-off-white/90 mb-2 leading-relaxed">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-off-white/60">
                      <ThumbsUp className="h-3 w-3" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-off-white/60">
                      <Clock className="h-3 w-3" />
                      <span>{post.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sentiment Summary */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-green-500/20 rounded-lg p-2">
            <div className="text-green-400 font-semibold text-sm">65%</div>
            <div className="text-xs text-off-white/60">Bullish</div>
          </div>
          <div className="bg-gray-500/20 rounded-lg p-2">
            <div className="text-gray-400 font-semibold text-sm">20%</div>
            <div className="text-xs text-off-white/60">Neutral</div>
          </div>
          <div className="bg-red-500/20 rounded-lg p-2">
            <div className="text-red-400 font-semibold text-sm">15%</div>
            <div className="text-xs text-off-white/60">Bearish</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;
