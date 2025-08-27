import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, MessageSquare, Eye, Hash } from 'lucide-react';

const TrendingWidget = () => {
  const trendingTopics = [
    {
      tag: '#EarningsSeason',
      posts: 24,
      trend: 'up',
      category: 'Market News'
    },
    {
      tag: '$KCB',
      posts: 18,
      trend: 'up',
      category: 'Stock Discussion'
    },
    {
      tag: '#ForexAnalysis',
      posts: 15,
      trend: 'stable',
      category: 'Analysis'
    },
    {
      tag: '$EABL',
      posts: 12,
      trend: 'down',
      category: 'Stock Discussion'
    },
    {
      tag: '#TechnicalAnalysis',
      posts: 10,
      trend: 'up',
      category: 'Education'
    }
  ];

  const activeDiscussions = [
    {
      title: 'KCB Q4 earnings predictions?',
      replies: 23,
      views: 156,
      lastActive: '5m ago'
    },
    {
      title: 'Best forex pairs for December',
      replies: 18,
      views: 89,
      lastActive: '12m ago'
    },
    {
      title: 'NSE 20 technical breakdown',
      replies: 15,
      views: 134,
      lastActive: '25m ago'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'down':
        return <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />;
      default:
        return <div className="w-3 h-3 rounded-full bg-yellow-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Market News':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Stock Discussion':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Analysis':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Education':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-secondary/20 text-secondary border-secondary/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Trending Topics */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <Hash className="w-5 h-5 text-secondary" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-secondary font-bold">#{index + 1}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{topic.tag}</span>
                    {getTrendIcon(topic.trend)}
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs mt-1 ${getCategoryColor(topic.category)}`}
                  >
                    {topic.category}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-foreground">{topic.posts}</div>
                <div className="text-xs text-muted-foreground">posts</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Active Discussions */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-secondary" />
            Hot Discussions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeDiscussions.map((discussion, index) => (
            <div
              key={index}
              className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <h4 className="font-medium text-foreground mb-2 line-clamp-2">
                {discussion.title}
              </h4>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {discussion.replies}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {discussion.views}
                  </span>
                </div>
                <span>{discussion.lastActive}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Insights Teaser */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
        <CardContent className="p-4 text-center">
          <div className="mb-3">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              🤖
            </div>
            <h3 className="font-semibold text-foreground">Invisa AI Insights</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Get AI-powered market sentiment analysis and trending predictions
          </p>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            Coming Soon
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendingWidget;