import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Filter } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface SearchFilters {
  tickers: string[];
  timeRange: '24h' | '7d' | '30d' | 'all';
  hasMedia: boolean;
}

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  trendingTickers: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, trendingTickers }) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    tickers: [],
    timeRange: 'all',
    hasMedia: false
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (query.length >= 2 || filters.tickers.length > 0) {
        onSearch(query, filters);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, filters]);

  const handleTickerToggle = (ticker: string) => {
    setFilters(prev => ({
      ...prev,
      tickers: prev.tickers.includes(ticker)
        ? prev.tickers.filter(t => t !== ticker)
        : [...prev.tickers, ticker]
    }));
  };

  const clearFilters = () => {
    setFilters({
      tickers: [],
      timeRange: 'all',
      hasMedia: false
    });
    setQuery('');
  };

  const hasActiveFilters = query || filters.tickers.length > 0 || filters.hasMedia || filters.timeRange !== 'all';

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-off-white/60" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts, tickers, hashtags..."
            className="pl-10 pr-10 bg-primary/50 border-secondary/30 text-off-white"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-off-white/60 hover:text-off-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={`border-secondary/30 ${hasActiveFilters ? 'bg-secondary text-primary' : 'text-off-white'}`}
            >
              <Filter className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-primary border-secondary/30">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-off-white mb-3">Filter Posts</h4>
              </div>

              {/* Trending Tickers */}
              {trendingTickers.length > 0 && (
                <div>
                  <Label className="text-sm text-off-white/70 mb-2 block">Tickers</Label>
                  <div className="flex flex-wrap gap-2">
                    {trendingTickers.map(ticker => (
                      <Badge
                        key={ticker}
                        variant={filters.tickers.includes(ticker) ? 'default' : 'outline'}
                        className={`cursor-pointer ${
                          filters.tickers.includes(ticker)
                            ? 'bg-secondary text-primary'
                            : 'border-secondary/30 text-off-white hover:bg-white/5'
                        }`}
                        onClick={() => handleTickerToggle(ticker)}
                      >
                        ${ticker}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Time Range */}
              <div>
                <Label className="text-sm text-off-white/70 mb-2 block">Time Range</Label>
                <div className="flex gap-2">
                  {[
                    { value: '24h', label: '24h' },
                    { value: '7d', label: '7d' },
                    { value: '30d', label: '30d' },
                    { value: 'all', label: 'All' }
                  ].map(({ value, label }) => (
                    <Badge
                      key={value}
                      variant={filters.timeRange === value ? 'default' : 'outline'}
                      className={`cursor-pointer flex-1 justify-center ${
                        filters.timeRange === value
                          ? 'bg-secondary text-primary'
                          : 'border-secondary/30 text-off-white hover:bg-white/5'
                      }`}
                      onClick={() => setFilters(prev => ({ ...prev, timeRange: value as any }))}
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Media Filter */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="media"
                  checked={filters.hasMedia}
                  onCheckedChange={(checked) => 
                    setFilters(prev => ({ ...prev, hasMedia: checked as boolean }))
                  }
                />
                <Label htmlFor="media" className="text-sm text-off-white cursor-pointer">
                  Posts with media only
                </Label>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="w-full border-secondary/30 text-off-white"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active filters display */}
      {filters.tickers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.tickers.map(ticker => (
            <Badge
              key={ticker}
              variant="secondary"
              className="bg-secondary/20 text-off-white"
            >
              ${ticker}
              <button
                onClick={() => handleTickerToggle(ticker)}
                className="ml-1 hover:text-red-400"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
