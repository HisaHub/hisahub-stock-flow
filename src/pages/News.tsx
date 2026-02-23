import React, { useState } from "react";
import { FileText, Newspaper, Settings, Download, Menu, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import BottomNav from "../components/BottomNav";
import { useTheme } from "../components/ThemeProvider";
import { useNavigate } from "react-router-dom";
import { useFinancialData } from "../contexts/FinancialDataContext";

const DUMMY_NEWS = [
  { headline: "Safaricom stocks rally as quarterly results impress", date: "2025-05-18" },
  { headline: "NSE trading volumes hit 2-year high", date: "2025-05-17" },
  { headline: "Equity Bank eyes regional expansion", date: "2025-05-16" },
  { headline: "Kengen dividends announced for 2025", date: "2025-05-15" },
  { headline: "Centum posts improved annual results", date: "2025-05-14" },
];

const DUMMY_ARTICLES = [
  {
    title: "How to Analyze Stocks in Kenya",
    excerpt: "A beginner's guide to stock analysis on the NSE, including key ratios and market trends.",
  },
  {
    title: "Why Long-term Investing Wins",
    excerpt: "Insights into the benefits of holding stocks over longer periods in the Kenyan market.",
  }
];

const News: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { state } = useFinancialData();
  const [activeSection, setActiveSection] = useState("news");

  const liveStocks = state.stocks;

  const downloadCSV = () => {
    const rows = [
      ["Symbol", "Name", "Price", "Change", "Change %"],
      ...liveStocks.map(s => [s.symbol, s.name, String(s.price), String(s.change), s.changePercent])
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nse-market-data.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const menuItems = [
    { id: "news", label: "NSE Stock News", icon: <Newspaper size={18} /> },
    { id: "articles", label: "Articles", icon: <FileText size={18} /> },
    { id: "settings", label: "Settings", icon: <Settings size={18} /> },
    { id: "financials", label: "Live Market Data", icon: <Download size={18} /> },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "news":
        return (
          <div className="space-y-3">
            {DUMMY_NEWS.map((n, idx) => (
              <div key={idx} className="bg-background p-3 rounded-lg shadow border-l-4 border-secondary/80">
                <div className={`text-sm font-bold ${theme === 'light' ? 'text-white' : 'text-off-white'}`}>{n.headline}</div>
                <div className="text-xs text-neutral">{n.date}</div>
              </div>
            ))}
          </div>
        );
      case "articles":
        return (
          <div className="space-y-4">
            {DUMMY_ARTICLES.map((a, idx) => (
              <div key={idx} className="bg-background rounded-lg p-3">
                <div className="font-bold text-secondary">{a.title}</div>
                <div className="text-off-white text-xs mt-1">{a.excerpt}</div>
              </div>
            ))}
          </div>
        );
      case "settings":
        navigate('/settings');
        return null;
      case "financials":
        return (
          <div>
            <div className="mb-3">
              <Button onClick={downloadCSV} className="bg-secondary text-primary font-bold rounded hover:bg-secondary/90">
                <Download size={18} className="mr-2 -ml-1" /> Download NSE Data (.csv)
              </Button>
            </div>
            {liveStocks.length === 0 ? (
              <p className="text-off-white/60 text-sm text-center py-4">No market data available</p>
            ) : (
              <div className="bg-background p-2 rounded-lg overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-secondary">
                      <th className="p-1">Symbol</th>
                      <th className="p-1">Name</th>
                      <th className="p-1 text-right">Price</th>
                      <th className="p-1 text-right">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liveStocks.map((stock) => (
                      <tr key={stock.symbol}>
                        <td className="p-1 font-semibold text-off-white">{stock.symbol}</td>
                        <td className="p-1 text-off-white/80">{stock.name}</td>
                        <td className="p-1 text-right text-off-white">{(stock.currency ?? 'KES')} {stock.price.toFixed(2)}</td>
                        <td className={`p-1 text-right flex items-center justify-end gap-1 ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {stock.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent}%)
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-primary font-sans transition-colors pb-20">
      <main className="flex-1 w-full max-w-2xl mx-auto flex flex-col items-center px-4 md:px-8 py-7">
        <div className="w-full flex items-center justify-between mb-5">
          <h2 className="text-3xl font-bold text-secondary flex items-center gap-2">
            <Newspaper size={30} /> News & Market
          </h2>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="bg-white/10 border-secondary/20 text-off-white hover:bg-white/20">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-primary border-secondary/20">
              <SheetHeader>
                <SheetTitle className="text-secondary">Navigation</SheetTitle>
                <SheetDescription className="text-off-white/60">
                  Choose a section to explore
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
        
        <div className="w-full glass-card mb-4 px-1">
          <div className="p-4">
            {renderContent()}
          </div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default News;
