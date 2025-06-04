
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CandlestickChart
} from "recharts";
import { Moon, Sun, TrendingUp, BarChart3 } from "lucide-react";

interface TradingChartProps {
  symbol: string;
}

const timeframes = ['1D', '1W', '1M', '3M', '1Y'];
const chartTypes = ['line', 'candlestick'];

// Mock data generator
const generateMockData = (days: number) => {
  const data = [];
  let basePrice = 22.70;
  
  for (let i = 0; i < days; i++) {
    const change = (Math.random() - 0.5) * 2;
    basePrice += change;
    const high = basePrice + Math.random() * 1;
    const low = basePrice - Math.random() * 1;
    
    data.push({
      time: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      price: Number(basePrice.toFixed(2)),
      open: Number((basePrice - change).toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(basePrice.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000)
    });
  }
  return data;
};

const TradingChart: React.FC<TradingChartProps> = ({ symbol }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [chartType, setChartType] = useState('line');
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [chartData, setChartData] = useState(generateMockData(30));
  const [showIndicators, setShowIndicators] = useState(false);

  useEffect(() => {
    // Simulate data update when timeframe changes
    const days = selectedTimeframe === '1D' ? 24 : 
                 selectedTimeframe === '1W' ? 7 : 
                 selectedTimeframe === '1M' ? 30 : 
                 selectedTimeframe === '3M' ? 90 : 365;
    setChartData(generateMockData(days));
  }, [selectedTimeframe, symbol]);

  return (
    <div className="glass-card animate-fade-in">
      {/* Chart Header */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <h3 className="text-lg font-bold text-off-white">{symbol} Chart</h3>
        
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsDarkTheme(!isDarkTheme)}
            className="p-2"
          >
            {isDarkTheme ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          
          {/* Chart Type Toggle */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setChartType(chartType === 'line' ? 'candlestick' : 'line')}
            className="p-2"
          >
            {chartType === 'line' ? <BarChart3 className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
          </Button>
          
          {/* Indicators Toggle */}
          <Button
            size="sm"
            variant={showIndicators ? "secondary" : "outline"}
            onClick={() => setShowIndicators(!showIndicators)}
            className="text-xs"
          >
            Indicators
          </Button>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex gap-1 mb-4 overflow-x-auto">
        {timeframes.map((tf) => (
          <Button
            key={tf}
            size="sm"
            variant={selectedTimeframe === tf ? "secondary" : "outline"}
            onClick={() => setSelectedTimeframe(tf)}
            className="flex-shrink-0 text-xs"
          >
            {tf}
          </Button>
        ))}
      </div>

      {/* Chart Container */}
      <div className="h-80 w-full bg-white/5 rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              style={{ fontSize: 10, fill: '#8B949E' }} 
            />
            <YAxis 
              hide 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#21262d', 
                border: '1px solid #30363d',
                borderRadius: '6px',
                color: '#f0f6fc'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#FFBF00" 
              strokeWidth={2} 
              dot={false}
              activeDot={{ r: 4, fill: '#FFBF00' }}
            />
            {showIndicators && (
              <Line 
                type="monotone" 
                dataKey="close" 
                stroke="#00D2FF" 
                strokeWidth={1} 
                dot={false}
                strokeDasharray="5 5"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Controls */}
      <div className="flex justify-between items-center mt-4 text-xs text-off-white/60">
        <span>Real-time data simulation</span>
        <span>Last updated: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default TradingChart;
