import React, { useState } from "react";
import { FileText, Newspaper, MessageSquare, Download, Menu } from "lucide-react";
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
import InvisaAI from "../components/InvisaAI";
import { useTheme } from "../components/ThemeProvider";
import AdvancedCommunity from "../components/AdvancedCommunity";

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

type CommunityPost = { name: string; content: string; timestamp: number; };

const DUMMY_FINANCIALS = [
  { company: "Safaricom PLC", symbol: "SCOM", revenue: "KSh 310B", profit: "KSh 71B" },
  { company: "Equity Group", symbol: "EQTY", revenue: "KSh 130B", profit: "KSh 45B" },
  { company: "KCB Group", symbol: "KCB", revenue: "KSh 109B", profit: "KSh 37B" },
  { company: "EABL", symbol: "EABL", revenue: "KSh 86B", profit: "KSh 12B" },
  { company: "Nation Media Group", symbol: "NMG", revenue: "KSh 7B", profit: "KSh 0.8B" },
];

const News: React.FC = () => {
  const { theme } = useTheme();
  const [posts, setPosts] = useState<CommunityPost[]>([
    { name: "TraderJoe", content: "Excited for upcoming earning releases!", timestamp: Date.now() - 60000 },
    { name: "NSEQueen", content: "Which stock are you bullish on this week?", timestamp: Date.now() - 360000 },
  ]);
  const [postName, setPostName] = useState("");
  const [postContent, setPostContent] = useState("");
  const [activeSection, setActiveSection] = useState("news");

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postName.trim() && postContent.trim()) {
      setPosts([{ name: postName, content: postContent, timestamp: Date.now() }, ...posts]);
      setPostName("");
      setPostContent("");
    }
  };

  const downloadCSV = () => {
    const rows = [["Company", "Symbol", "Revenue", "Profit"], ...DUMMY_FINANCIALS.map(d => [d.company, d.symbol, d.revenue, d.profit])];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nse-financials.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const menuItems = [
    { id: "news", label: "NSE Stock News", icon: <Newspaper size={18} /> },
    { id: "articles", label: "Articles", icon: <FileText size={18} /> },
    { id: "community", label: "Community", icon: <MessageSquare size={18} /> },
    { id: "financials", label: "Financials", icon: <Download size={18} /> },
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
      case "community":
        return (
          <AdvancedCommunity />
        );
      case "financials":
        return (
          <div>
            <div className="mb-3">
              <Button onClick={downloadCSV} className="bg-secondary text-primary font-bold rounded hover:bg-secondary/90">
                <Download size={18} className="mr-2 -ml-1" /> Download NSE Data (.csv)
              </Button>
            </div>
            <div className="bg-background p-2 rounded-lg overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-secondary">
                    <th className="p-1">Company</th>
                    <th className="p-1">Symbol</th>
                    <th className="p-1">Revenue</th>
                    <th className="p-1">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {DUMMY_FINANCIALS.map((row, i) => (
                    <tr key={i}>
                      <td className="p-1">{row.company}</td>
                      <td className="p-1">{row.symbol}</td>
                      <td className="p-1">{row.revenue}</td>
                      <td className="p-1">{row.profit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
            <Newspaper size={30} /> News & Community
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
      
      <InvisaAI />
      <BottomNav />
    </div>
  );
};

export default News;
