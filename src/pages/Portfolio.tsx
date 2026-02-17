import React, { useState } from "react";
import BottomNav from "../components/BottomNav";
import { Menu, TrendingUp, TrendingDown, Download, RefreshCw, Plus, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useFinancialData } from "../contexts/FinancialDataContext";

const Portfolio: React.FC = () => {
  const { state } = useFinancialData();
  const [activeSection, setActiveSection] = useState("overview");
  const [sortBy, setSortBy] = useState("value");
  const [filterType, setFilterType] = useState("all");

  // Use real data from context
  const portfolioData = state.portfolioData;
  const holdings = state.holdings;
  const transactions = state.transactions;

  console.log("Portfolio page holdings:", holdings);
  console.log("Portfolio data:", portfolioData);

  // Compute allocation from holdings grouped by sector when available
  const allocationMap: Record<string, { value: number; color?: string }> = {};
  holdings.forEach(h => {
    const sector = (h.stocks && h.stocks.sector) || (h.sector) || 'Others';
    if (!allocationMap[sector]) allocationMap[sector] = { value: 0, color: undefined };
    allocationMap[sector].value += Number(h.value || 0);
  });

  const allocationData = Object.entries(allocationMap).map(([name, info], idx) => ({
    name,
    value: info.value,
    color: ['#FFBF00', '#00C851', '#FF4444', '#33B5E5'][idx % 4]
  }));

  // Derive dividends from transactions of type DIVIDEND when available
  const dividends = transactions.filter(tx => tx.type && tx.type.toUpperCase() === 'DIVIDEND').map(tx => ({
    symbol: tx.symbol,
    amount: Number(tx.total || tx.amount || 0),
    exDate: tx.ex_date || tx.date || '',
    payDate: tx.pay_date || '',
    status: tx.status || 'Unknown'
  }));

  const performanceData = [
    { date: "Jan", value: 95000 },
    { date: "Feb", value: 98000 },
    { date: "Mar", value: 105000 },
    { date: "Apr", value: 112000 },
    { date: "May", value: portfolioData.totalValue },
  ];

  const menuItems = [
    { id: "overview", label: "Portfolio Overview", icon: <BarChart3 size={18} /> },
    { id: "holdings", label: "Holdings", icon: <TrendingUp size={18} /> },
    { id: "allocation", label: "Allocation", icon: <BarChart3 size={18} /> },
    { id: "transactions", label: "Transactions", icon: <RefreshCw size={18} /> },
    { id: "dividends", label: "Dividends", icon: <Download size={18} /> },
    { id: "performance", label: "Performance", icon: <TrendingUp size={18} /> },
  ];

  const renderOverview = () => (
    <div className="space-y-4">
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-off-white/60 text-sm">Total Portfolio Value</span>
          <RefreshCw size={16} className="text-secondary animate-spin" />
        </div>
        <div className="text-3xl font-bold text-off-white mb-2">
          KES {portfolioData.totalValue.toLocaleString()}
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-1 ${portfolioData.dailyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {portfolioData.dailyChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="font-semibold">
              {portfolioData.dailyChange >= 0 ? '+' : ''}KES {Math.abs(portfolioData.dailyChange).toLocaleString()}
            </span>
            <span>({portfolioData.dailyChangePercent >= 0 ? '+' : ''}{portfolioData.dailyChangePercent}%)</span>
          </div>
        </div>
        <div className="flex gap-4 mt-3 text-xs">
          <span className="text-off-white/60">Week: <span className="text-green-400">+{portfolioData.weeklyChangePercent}%</span></span>
          <span className="text-off-white/60">Month: <span className="text-green-400">+{portfolioData.monthlyChangePercent}%</span></span>
        </div>
      </div>
      
      <div className="glass-card p-4">
        <h3 className="font-semibold text-off-white mb-3">Portfolio Trend</h3>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <XAxis dataKey="date" axisLine={false} tickLine={false} style={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#FFBF00" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex gap-2">
        <Button className="flex-1 bg-secondary text-primary hover:bg-secondary/90">
          <Plus size={16} className="mr-2" />
          Add Funds
        </Button>
        <Button variant="outline" className="flex-1 border-secondary/20 text-off-white hover:bg-white/10">
          Rebalance
        </Button>
      </div>
    </div>
  );

  const renderHoldings = () => (
    <div className="space-y-3">
      <div className="flex gap-2 mb-4">
        <select 
          className="bg-charcoal text-off-white rounded px-3 py-1 text-sm border border-secondary/20"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="value">Sort by Value</option>
          <option value="profitLoss">Sort by P&L</option>
          <option value="symbol">Sort by Symbol</option>
        </select>
      </div>
      
      {holdings.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <p className="text-off-white/60 mb-4">No holdings found</p>
          <Button className="bg-secondary text-primary hover:bg-secondary/90">
            Start Trading
          </Button>
        </div>
      ) : (
        holdings
          .sort((a, b) => {
            if (sortBy === "value") return b.value - a.value;
            if (sortBy === "profitLoss") return b.profitLoss - a.profitLoss;
            return a.symbol.localeCompare(b.symbol);
          })
          .map((holding) => (
          <div key={holding.id} className="glass-card p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-semibold text-off-white text-lg">{holding.symbol}</div>
                <div className="text-xs text-neutral">{holding.name}</div>
                <div className="text-xs text-off-white/60 mt-1">
                  {holding.quantity} shares @ KES {holding.avgPrice}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-off-white">
                  KES {holding.value.toLocaleString()}
                </div>
                <div className="text-sm text-off-white/60">
                  KES {holding.currentPrice.toFixed(2)}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className={`flex items-center gap-1 ${holding.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {holding.profitLoss >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span className="font-semibold text-sm">
                  {holding.profitLoss >= 0 ? '+' : ''}KES {Math.abs(holding.profitLoss).toFixed(2)}
                </span>
                <span className="text-xs">
                  ({holding.profitLossPercent >= 0 ? '+' : ''}{holding.profitLossPercent.toFixed(2)}%)
                </span>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-xs border-secondary/20 text-secondary hover:bg-secondary/10">
                  Buy
                </Button>
                <Button size="sm" variant="outline" className="text-xs border-red-500/20 text-red-400 hover:bg-red-500/10">
                  Sell
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderAllocation = () => (
    <div className="space-y-4">
      <div className="glass-card p-4">
        <h3 className="font-semibold text-off-white mb-4">Asset Allocation</h3>
        <div className="h-48 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
              >
                {allocationData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-2">
          {allocationData.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-off-white text-sm">{item.name}</span>
              </div>
              <div className="text-off-white font-semibold text-sm">
                KES {item.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-3">
      <div className="flex gap-2 mb-4">
        <select 
          className="bg-charcoal text-off-white rounded px-3 py-1 text-sm border border-secondary/20"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Transactions</option>
          <option value="BUY">Buy Orders</option>
          <option value="SELL">Sell Orders</option>
          <option value="DIVIDEND">Dividends</option>
        </select>
      </div>
      
      {transactions
        .filter(tx => filterType === "all" || tx.type === filterType)
        .map((tx, index) => (
        <div key={index} className="glass-card p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  tx.type === 'BUY' ? 'bg-green-500/20 text-green-400' :
                  tx.type === 'SELL' ? 'bg-red-500/20 text-red-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {tx.type}
                </span>
                <span className="font-semibold text-off-white">{tx.symbol}</span>
              </div>
              <div className="text-xs text-off-white/60">
                {tx.quantity} shares @ KES {tx.price}
              </div>
              <div className="text-xs text-neutral">{tx.date}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-off-white">
                KES {tx.total.toLocaleString()}
              </div>
              <div className={`text-xs ${tx.status === 'Completed' || tx.status === 'Paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                {tx.status}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDividends = () => (
    <div className="space-y-4">
      <div className="glass-card p-4">
        <h3 className="font-semibold text-off-white mb-2">Total Dividend Income</h3>
        <div className="text-2xl font-bold text-green-400 mb-2">KES 530.00</div>
        <div className="text-xs text-off-white/60">This year</div>
      </div>
      
      <div className="space-y-3">
        {dividends.map((dividend, index) => (
          <div key={index} className="glass-card p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-off-white">{dividend.symbol}</div>
                <div className="text-xs text-off-white/60">Ex-Date: {dividend.exDate}</div>
                <div className="text-xs text-off-white/60">Pay Date: {dividend.payDate}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-off-white">
                  KES {dividend.amount.toFixed(2)}
                </div>
                <div className={`text-xs ${
                  dividend.status === 'Paid' ? 'text-green-400' :
                  dividend.status === 'Upcoming' ? 'text-yellow-400' :
                  'text-blue-400'
                }`}>
                  {dividend.status}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-4">
      <div className="glass-card p-4">
        <h3 className="font-semibold text-off-white mb-4">Performance Metrics</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-off-white/60">Total Return</div>
            <div className="text-lg font-semibold text-green-400">+30.8%</div>
          </div>
          <div>
            <div className="text-xs text-off-white/60">Annualized Return</div>
            <div className="text-lg font-semibold text-green-400">+18.2%</div>
          </div>
          <div>
            <div className="text-xs text-off-white/60">vs NSE20 Index</div>
            <div className="text-lg font-semibold text-green-400">+5.4%</div>
          </div>
          <div>
            <div className="text-xs text-off-white/60">Sharpe Ratio</div>
            <div className="text-lg font-semibold text-off-white">1.34</div>
          </div>
        </div>
        
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <XAxis dataKey="date" axisLine={false} tickLine={false} style={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#FFBF00" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <Button className="w-full bg-secondary text-primary hover:bg-secondary/90">
        <Download size={16} className="mr-2" />
        Download Performance Report
      </Button>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "overview": return renderOverview();
      case "holdings": return renderHoldings();
      case "allocation": return renderAllocation();
      case "transactions": return renderTransactions();
      case "dividends": return renderDividends();
      case "performance": return renderPerformance();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-primary font-sans transition-colors pb-20">
      <main className="flex-1 flex flex-col items-center px-4 py-7 w-full max-w-2xl mx-auto">
        <div className="w-full flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-secondary">Portfolio</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="bg-white/10 border-secondary/20 text-off-white hover:bg-white/20">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-primary border-secondary/20">
              <SheetHeader>
                <SheetTitle className="text-secondary">Portfolio Menu</SheetTitle>
                <SheetDescription className="text-off-white/60">
                  Navigate through your portfolio sections
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-2">
                {menuItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2 text-off-white hover:bg-white/10"
                    onClick={() => setActiveSection(item.id)}
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="w-full">
          {renderContent()}
        </div>
        
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Portfolio;
