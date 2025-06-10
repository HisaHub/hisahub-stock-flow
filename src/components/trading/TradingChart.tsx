
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine
} from "recharts";
import { Moon, Sun, TrendingUp, BarChart3, Activity, Target, Crosshair, TrendingDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TradingChartProps {
  symbol: string;
}

const timeframes = ['1D', '1W', '1M', '3M', '1Y'];

// Enhanced mock data generator with RSI and MACD
const generateMockData = (days: number) => {
  const data = [];
  let basePrice = 22.70;
  let rsi = 50;
  let macdLine = 0;
  let signalLine = 0;
  
  for (let i = 0; i < days; i++) {
    const change = (Math.random() - 0.5) * 2;
    basePrice += change;
    const high = basePrice + Math.random() * 1;
    const low = basePrice - Math.random() * 1;
    
    // Calculate RSI (simplified)
    rsi = Math.max(0, Math.min(100, rsi + (Math.random() - 0.5) * 10));
    
    // Calculate MACD (simplified)
    macdLine += (Math.random() - 0.5) * 0.5;
    signalLine = signalLine * 0.9 + macdLine * 0.1;
    
    data.push({
      time: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      price: Number(basePrice.toFixed(2)),
      open: Number((basePrice - change).toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(basePrice.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000),
      rsi: Number(rsi.toFixed(2)),
      macdLine: Number(macdLine.toFixed(3)),
      signalLine: Number(signalLine.toFixed(3)),
      histogram: Number((macdLine - signalLine).toFixed(3))
    });
  }
  return data;
};

const TradingChart: React.FC<TradingChartProps> = ({ symbol }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [chartData, setChartData] = useState(generateMockData(30));
  const [showIndicators, setShowIndicators] = useState(false);
  const [showRSI, setShowRSI] = useState(false);
  const [showMACD, setShowMACD] = useState(false);
  const [showAnalysisTools, setShowAnalysisTools] = useState(false);
  const [supportLevel, setSupportLevel] = useState<number | null>(null);
  const [resistanceLevel, setResistanceLevel] = useState<number | null>(null);

  useEffect(() => {
    // Simulate data update when timeframe changes
    const days = selectedTimeframe === '1D' ? 24 : 
                 selectedTimeframe === '1W' ? 7 : 
                 selectedTimeframe === '1M' ? 30 : 
                 selectedTimeframe === '3M' ? 90 : 365;
    const newData = generateMockData(days);
    setChartData(newData);
    
    // Calculate support and resistance levels
    const prices = newData.map(d => d.price);
    setSupportLevel(Math.min(...prices) * 1.02);
    setResistanceLevel(Math.max(...prices) * 0.98);
  }, [selectedTimeframe, symbol]);

  return (
    <div className="glass-card animate-fade-in">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <h3 className="text-lg font-bold text-off-white">{symbol} Chart</h3>
        
        <div className="flex items-center gap-2 flex-wrap">
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
            onClick={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
            className="p-2"
          >
            {chartType === 'line' ? <BarChart3 className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
          </Button>
          
          {/* Analysis Tools Toggle */}
          <Button
            size="sm"
            variant={showAnalysisTools ? "secondary" : "outline"}
            onClick={() => setShowAnalysisTools(!showAnalysisTools)}
            className="text-xs px-2"
          >
            <Target className="h-3 w-3 mr-1" />
            Tools
          </Button>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-2">
        {timeframes.map((tf) => (
          <Button
            key={tf}
            size="sm"
            variant={selectedTimeframe === tf ? "secondary" : "outline"}
            onClick={() => setSelectedTimeframe(tf)}
            className="flex-shrink-0 text-xs px-3"
          >
            {tf}
          </Button>
        ))}
      </div>

      {/* Indicators Controls */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <Button
          size="sm"
          variant={showRSI ? "secondary" : "outline"}
          onClick={() => setShowRSI(!showRSI)}
          className="text-xs px-2"
        >
          <Activity className="h-3 w-3 mr-1" />
          RSI
        </Button>
        <Button
          size="sm"
          variant={showMACD ? "secondary" : "outline"}
          onClick={() => setShowMACD(!showMACD)}
          className="text-xs px-2"
        >
          <TrendingDown className="h-3 w-3 mr-1" />
          MACD
        </Button>
        <Button
          size="sm"
          variant={showIndicators ? "secondary" : "outline"}
          onClick={() => setShowIndicators(!showIndicators)}
          className="text-xs px-2"
        >
          Moving Avg
        </Button>
      </div>

      {/* Chart Tabs */}
      <Tabs defaultValue="main" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/10 mb-4">
          <TabsTrigger value="main" className="text-xs">Price</TabsTrigger>
          <TabsTrigger value="rsi" className="text-xs" disabled={!showRSI}>RSI</TabsTrigger>
          <TabsTrigger value="macd" className="text-xs" disabled={!showMACD}>MACD</TabsTrigger>
        </TabsList>

        {/* Main Price Chart */}
        <TabsContent value="main">
          <div className="h-64 sm:h-80 w-full bg-white/5 rounded-lg p-2 sm:p-4">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={chartData}>
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    style={{ fontSize: 10, fill: '#8B949E' }} 
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#21262d', 
                      border: '1px solid #30363d',
                      borderRadius: '6px',
                      color: '#f0f6fc',
                      fontSize: '12px'
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
                  {showAnalysisTools && supportLevel && (
                    <ReferenceLine 
                      y={supportLevel} 
                      stroke="#22C55E" 
                      strokeDasharray="3 3" 
                      label={{ value: "Support", position: "right" }}
                    />
                  )}
                  {showAnalysisTools && resistanceLevel && (
                    <ReferenceLine 
                      y={resistanceLevel} 
                      stroke="#EF4444" 
                      strokeDasharray="3 3" 
                      label={{ value: "Resistance", position: "right" }}
                    />
                  )}
                </LineChart>
              ) : (
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    style={{ fontSize: 10, fill: '#8B949E' }} 
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#21262d', 
                      border: '1px solid #30363d',
                      borderRadius: '6px',
                      color: '#f0f6fc',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="volume" fill="#FFBF00" opacity={0.7} />
                  {showAnalysisTools && supportLevel && (
                    <ReferenceLine 
                      y={supportLevel} 
                      stroke="#22C55E" 
                      strokeDasharray="3 3" 
                      label={{ value: "Support", position: "right" }}
                    />
                  )}
                  {showAnalysisTools && resistanceLevel && (
                    <ReferenceLine 
                      y={resistanceLevel} 
                      stroke="#EF4444" 
                      strokeDasharray="3 3" 
                      label={{ value: "Resistance", position: "right" }}
                    />
                  )}
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </TabsContent>

        {/* RSI Chart */}
        <TabsContent value="rsi">
          <div className="h-32 w-full bg-white/5 rounded-lg p-2 sm:p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  style={{ fontSize: 10, fill: '#8B949E' }} 
                  tick={{ fontSize: 10 }}
                />
                <YAxis domain={[0, 100]} hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#21262d', 
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    color: '#f0f6fc',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="rsi" 
                  stroke="#8B5CF6" 
                  strokeWidth={2} 
                  dot={false}
                />
                <ReferenceLine y={70} stroke="#EF4444" strokeDasharray="2 2" />
                <ReferenceLine y={30} stroke="#22C55E" strokeDasharray="2 2" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        {/* MACD Chart */}
        <TabsContent value="macd">
          <div className="h-32 w-full bg-white/5 rounded-lg p-2 sm:p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  style={{ fontSize: 10, fill: '#8B949E' }} 
                  tick={{ fontSize: 10 }}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#21262d', 
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    color: '#f0f6fc',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="histogram" fill="#FFBF00" />
                <Line 
                  type="monotone" 
                  dataKey="macdLine" 
                  stroke="#00D2FF" 
                  strokeWidth={1} 
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="signalLine" 
                  stroke="#EF4444" 
                  strokeWidth={1} 
                  dot={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>

      {/* Chart Controls */}
      <div className="flex justify-between items-center mt-4 text-xs text-off-white/60">
        <div className="flex items-center gap-4">
          <span>Real-time data simulation</span>
          {showAnalysisTools && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-0.5 bg-green-500"></div>
                <span>Support</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-0.5 bg-red-500"></div>
                <span>Resistance</span>
              </div>
            </div>
          )}
        </div>
        <span className="hidden sm:block">Last updated: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default TradingChart;
