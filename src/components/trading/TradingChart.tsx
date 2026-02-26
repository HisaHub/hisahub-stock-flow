
import React, { useState, useEffect } from "react";
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
  ComposedChart
} from "recharts";
import { Moon, Sun, TrendingUp, BarChart3, Activity, Target, Crosshair, TrendingDown, Palette, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TradingChartProps {
  symbol: string;
}

const timeframes = ['1D', '1W', '1M', '3M', '1Y'];

// Technical indicator computation helpers
function computeSMA(closes: number[], period: number): (number | null)[] {
  return closes.map((_, i) => {
    if (i < period - 1) return null;
    const slice = closes.slice(i - period + 1, i + 1);
    return slice.reduce((a, b) => a + b, 0) / period;
  });
}

function computeRSI(closes: number[], period = 14): (number | null)[] {
  const rsi: (number | null)[] = new Array(closes.length).fill(null);
  if (closes.length < period + 1) return rsi;
  let avgGain = 0, avgLoss = 0;
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) avgGain += diff; else avgLoss -= diff;
  }
  avgGain /= period; avgLoss /= period;
  rsi[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    avgGain = (avgGain * (period - 1) + (diff > 0 ? diff : 0)) / period;
    avgLoss = (avgLoss * (period - 1) + (diff < 0 ? -diff : 0)) / period;
    rsi[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  }
  return rsi;
}

function computeEMA(closes: number[], period: number): (number | null)[] {
  const ema: (number | null)[] = new Array(closes.length).fill(null);
  if (closes.length < period) return ema;
  let sum = 0;
  for (let i = 0; i < period; i++) sum += closes[i];
  ema[period - 1] = sum / period;
  const k = 2 / (period + 1);
  for (let i = period; i < closes.length; i++) {
    ema[i] = closes[i] * k + (ema[i - 1] as number) * (1 - k);
  }
  return ema;
}

function computeMACD(closes: number[]): { macdLine: (number | null)[], signalLine: (number | null)[], histogram: (number | null)[] } {
  const ema12 = computeEMA(closes, 12);
  const ema26 = computeEMA(closes, 26);
  const macdLine: (number | null)[] = closes.map((_, i) =>
    ema12[i] !== null && ema26[i] !== null ? (ema12[i] as number) - (ema26[i] as number) : null
  );
  // Signal line = EMA(9) of MACD values
  const macdValues = macdLine.filter(v => v !== null) as number[];
  const signalRaw = computeEMA(macdValues, 9);
  const signalLine: (number | null)[] = new Array(closes.length).fill(null);
  const histogram: (number | null)[] = new Array(closes.length).fill(null);
  let si = 0;
  for (let i = 0; i < closes.length; i++) {
    if (macdLine[i] !== null) {
      signalLine[i] = signalRaw[si] ?? null;
      histogram[i] = signalLine[i] !== null ? (macdLine[i] as number) - (signalLine[i] as number) : null;
      si++;
    }
  }
  return { macdLine, signalLine, histogram };
}

function computeBollinger(closes: number[], period = 20, mult = 2): { upper: (number | null)[], lower: (number | null)[] } {
  const sma = computeSMA(closes, period);
  return {
    upper: closes.map((_, i) => {
      if (sma[i] === null) return null;
      const slice = closes.slice(i - period + 1, i + 1);
      const std = Math.sqrt(slice.reduce((s, v) => s + (v - (sma[i] as number)) ** 2, 0) / period);
      return (sma[i] as number) + mult * std;
    }),
    lower: closes.map((_, i) => {
      if (sma[i] === null) return null;
      const slice = closes.slice(i - period + 1, i + 1);
      const std = Math.sqrt(slice.reduce((s, v) => s + (v - (sma[i] as number)) ** 2, 0) / period);
      return (sma[i] as number) - mult * std;
    })
  };
}


const TradingChart: React.FC<TradingChartProps> = ({ symbol }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [chartType, setChartType] = useState<'line' | 'candlestick'>('line');
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [activeIndicators, setActiveIndicators] = useState<string[]>([]);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [supportLevel, setSupportLevel] = useState<number | null>(null);
  const [resistanceLevel, setResistanceLevel] = useState<number | null>(null);
  const [trendLines, setTrendLines] = useState<Array<{id: string, y: number, label: string}>>([]);

  const indicators = [
    { id: 'rsi', name: 'RSI', icon: Activity },
    { id: 'macd', name: 'MACD', icon: TrendingDown },
    { id: 'bollinger', name: 'Bollinger Bands', icon: BarChart3 },
    { id: 'sma', name: 'Simple Moving Average', icon: TrendingUp }
  ];

  const tools = [
    { id: 'trendline', name: 'Trendline', icon: TrendingUp },
    { id: 'horizontal', name: 'Horizontal Line', icon: Crosshair },
    { id: 'vertical', name: 'Vertical Line', icon: Crosshair },
    { id: 'fibonacci', name: 'Fibonacci', icon: Settings },
    { id: 'rectangle', name: 'Rectangle', icon: Target },
    { id: 'brush', name: 'Free Draw', icon: Palette }
  ];

  useEffect(() => {
    // Fetch historical OHLC/volume data from Supabase for the given symbol
    const fetchHistorical = async () => {
      if (!symbol) return;

      // Determine number of records to fetch based on timeframe
      const limit = selectedTimeframe === '1D' ? 48 :
                    selectedTimeframe === '1W' ? 56 :
                    selectedTimeframe === '1M' ? 120 :
                    selectedTimeframe === '3M' ? 360 : 730;

      try {
        // Find stock id by symbol
        const { data: stock, error: stockErr } = await supabase
          .from('stocks')
          .select('id')
          .eq('symbol', symbol)
          .maybeSingle();

        if (stockErr) throw stockErr;

        let recentData: any[] | null = null;

        if (stock && stock.id) {
          const { data: prices, error: pricesErr } = await supabase
            .from('stock_prices')
            .select('open,high,low,close,price,volume,timestamp')
            .eq('stock_id', stock.id)
            .order('timestamp', { ascending: true })
            .limit(limit);

          if (!pricesErr && prices && prices.length > 0) {
            const closes = prices.map((p: any) => Number(p.close ?? p.price ?? 0));
            const smaValues = computeSMA(closes, 20);
            const rsiValues = computeRSI(closes, 14);
            const macdResult = computeMACD(closes);
            const bollingerResult = computeBollinger(closes, 20, 2);

            recentData = prices.map((p: any, i: number) => ({
              time: p.timestamp ? new Date(p.timestamp).toLocaleString() : '',
              price: closes[i],
              open: Number(p.open ?? p.price ?? 0),
              high: Number(p.high ?? p.price ?? 0),
              low: Number(p.low ?? p.price ?? 0),
              close: closes[i],
              volume: Number(p.volume ?? 0),
              rsi: rsiValues[i] ?? 50,
              macdLine: macdResult.macdLine[i] ?? 0,
              signalLine: macdResult.signalLine[i] ?? 0,
              histogram: macdResult.histogram[i] ?? 0,
              sma: smaValues[i] ?? closes[i],
              upperBand: bollingerResult.upper[i] ?? closes[i] + 2,
              lowerBand: bollingerResult.lower[i] ?? closes[i] - 2,
              fill: closes[i] >= Number(p.open ?? p.price ?? 0) ? '#22C55E' : '#EF4444'
            }));
          }
        }

        const newData = recentData && recentData.length > 0 ? recentData : [];
        setChartData(newData);

        // Calculate support and resistance levels
        const pricesArr = newData.map(d => d.price);
        if (pricesArr.length > 0) {
          setSupportLevel(Math.min(...pricesArr) * 1.02);
          setResistanceLevel(Math.max(...pricesArr) * 0.98);
        } else {
          setSupportLevel(null);
          setResistanceLevel(null);
        }
      } catch (e) {
        console.error('Error fetching historical prices:', e);
        // On error, clear chart data so UI shows no-data state.
        setChartData([]);
        setSupportLevel(null);
        setResistanceLevel(null);
      }
    };

    fetchHistorical();
  }, [selectedTimeframe, symbol]);

  const toggleIndicator = (indicatorId: string) => {
    setActiveIndicators(prev => 
      prev.includes(indicatorId) 
        ? prev.filter(id => id !== indicatorId)
        : [...prev, indicatorId]
    );
  };

  const handleToolSelect = (toolId: string) => {
    setActiveTool(toolId);
    // Simulate adding analysis lines
    if (toolId === 'trendline' || toolId === 'horizontal') {
      const newLine = {
        id: `${toolId}-${Date.now()}`,
        y: chartData[Math.floor(chartData.length / 2)]?.price || 0,
        label: toolId === 'trendline' ? 'Trend' : 'Level'
      };
      setTrendLines(prev => [...prev, newLine]);
    }
  };

  // Custom candlestick component
  const CandlestickBar = (props: any) => {
    const { payload, x, y, width, height } = props;
    if (!payload) return null;
    
    const { open, high, low, close } = payload;
    const isGreen = close >= open;
    const color = isGreen ? "#22C55E" : "#EF4444";
    const bodyHeight = Math.abs(close - open) * (height / (payload.high - payload.low));
    const bodyY = y + (Math.max(open, close) - payload.high) * (height / (payload.high - payload.low));
    
    return (
      <g>
        {/* Wick */}
        <line
          x1={x + width / 2}
          y1={y}
          x2={x + width / 2}
          y2={y + height}
          stroke={color}
          strokeWidth={1}
        />
        {/* Body */}
        <rect
          x={x + width * 0.2}
          y={bodyY}
          width={width * 0.6}
          height={bodyHeight || 1}
          fill={color}
          stroke={color}
        />
      </g>
    );
  };

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
            onClick={() => setChartType(chartType === 'line' ? 'candlestick' : 'line')}
            className="p-2"
          >
            {chartType === 'line' ? <BarChart3 className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
          </Button>
          
          {/* Indicators Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant={activeIndicators.length > 0 ? "secondary" : "outline"}
                className="text-xs px-2"
              >
                <Activity className="h-3 w-3 mr-1" />
                Indicators ({activeIndicators.length})
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 bg-primary border-secondary/20 p-3">
              <div className="space-y-2">
                <h4 className="font-medium text-off-white mb-3">Technical Indicators</h4>
                {indicators.map((indicator) => {
                  const Icon = indicator.icon;
                  return (
                    <div key={indicator.id} className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant={activeIndicators.includes(indicator.id) ? "secondary" : "outline"}
                        onClick={() => toggleIndicator(indicator.id)}
                        className="flex-1 justify-start text-xs"
                      >
                        <Icon className="h-3 w-3 mr-2" />
                        {indicator.name}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Tools Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant={activeTool ? "secondary" : "outline"}
                className="text-xs px-2"
              >
                <Target className="h-3 w-3 mr-1" />
                Tools
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 bg-primary border-secondary/20 p-3">
              <div className="space-y-2">
                <h4 className="font-medium text-off-white mb-3">Chart Analysis Tools</h4>
                <div className="grid grid-cols-2 gap-2">
                  {tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Button
                        key={tool.id}
                        size="sm"
                        variant={activeTool === tool.id ? "secondary" : "outline"}
                        onClick={() => handleToolSelect(tool.id)}
                        className="text-xs p-2 h-auto flex flex-col items-center gap-1"
                      >
                        <Icon className="h-3 w-3" />
                        <span className="text-xs leading-none">{tool.name}</span>
                      </Button>
                    );
                  })}
                </div>
                {activeTool && (
                  <div className="mt-3 p-2 bg-white/5 rounded text-xs text-off-white/80">
                    Selected: {tools.find(t => t.id === activeTool)?.name}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
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

      {/* Main Chart */}
      <div className="h-64 sm:h-80 w-full bg-white/5 rounded-lg p-2 sm:p-4 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <ComposedChart data={chartData}>
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
              
              {/* Main price line */}
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#FFBF00" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 4, fill: '#FFBF00' }}
              />
              
              {/* Conditional indicators overlay */}
              {activeIndicators.includes('sma') && (
                <Line 
                  type="monotone" 
                  dataKey="sma" 
                  stroke="#00D2FF" 
                  strokeWidth={1} 
                  dot={false}
                  strokeDasharray="5 5"
                />
              )}
              
              {activeIndicators.includes('bollinger') && (
                <>
                  <Line 
                    type="monotone" 
                    dataKey="upperBand" 
                    stroke="#8B5CF6" 
                    strokeWidth={1} 
                    dot={false}
                    strokeDasharray="2 2"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="lowerBand" 
                    stroke="#8B5CF6" 
                    strokeWidth={1} 
                    dot={false}
                    strokeDasharray="2 2"
                  />
                </>
              )}
              
              {/* Support/Resistance lines */}
              {supportLevel && (
                <ReferenceLine 
                  y={supportLevel} 
                  stroke="#22C55E" 
                  strokeDasharray="3 3" 
                  label={{ value: "Support", position: "right" }}
                />
              )}
              {resistanceLevel && (
                <ReferenceLine 
                  y={resistanceLevel} 
                  stroke="#EF4444" 
                  strokeDasharray="3 3" 
                  label={{ value: "Resistance", position: "right" }}
                />
              )}
              
              {/* User-drawn trend lines */}
              {trendLines.map((line) => (
                <ReferenceLine 
                  key={line.id}
                  y={line.y} 
                  stroke="#FFBF00" 
                  strokeDasharray="5 5" 
                  label={{ value: line.label, position: "right" }}
                />
              ))}
            </ComposedChart>
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
                formatter={(value, name) => {
                  if (name === 'close') {
                    const data = chartData.find(d => d.close === value);
                    return [
                      `O: ${data?.open} H: ${data?.high} L: ${data?.low} C: ${data?.close}`,
                      'OHLC'
                    ];
                  }
                  return [value, name];
                }}
              />
              <Bar 
                dataKey="close" 
                shape={CandlestickBar}
              />
              
              {/* Support/Resistance lines for candlestick view */}
              {supportLevel && (
                <ReferenceLine 
                  y={supportLevel} 
                  stroke="#22C55E" 
                  strokeDasharray="3 3" 
                  label={{ value: "Support", position: "right" }}
                />
              )}
              {resistanceLevel && (
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

      {/* Secondary Indicator Charts */}
      {activeIndicators.length > 0 && (
        <div className="space-y-3">
          {activeIndicators.includes('rsi') && (
            <div className="h-24 w-full bg-white/5 rounded-lg p-2">
              <div className="text-xs text-off-white/60 mb-1">RSI (14)</div>
              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={chartData}>
                  <XAxis dataKey="time" hide />
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
          )}
          
          {activeIndicators.includes('macd') && (
            <div className="h-24 w-full bg-white/5 rounded-lg p-2">
              <div className="text-xs text-off-white/60 mb-1">MACD (12,26,9)</div>
              <ResponsiveContainer width="100%" height="80%">
                <ComposedChart data={chartData}>
                  <XAxis dataKey="time" hide />
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
                  <Bar dataKey="histogram" fill="#FFBF00" opacity={0.7} />
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
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Chart Controls */}
      <div className="flex justify-between items-center mt-4 text-xs text-off-white/60">
        <div className="flex items-center gap-4 flex-wrap">
          <span>Live Supabase data</span>
          {activeIndicators.length > 0 && (
            <span className="hidden sm:inline">
              Active: {activeIndicators.join(', ').toUpperCase()}
            </span>
          )}
        </div>
        <span className="hidden sm:block">Last updated: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default TradingChart;
