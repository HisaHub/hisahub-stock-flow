
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileText, Newspaper, MessageSquare, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

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

// Dummy data for NSE financials
const DUMMY_FINANCIALS = [
  { company: "Safaricom PLC", symbol: "SCOM", revenue: "KSh 310B", profit: "KSh 71B" },
  { company: "Equity Group", symbol: "EQTY", revenue: "KSh 130B", profit: "KSh 45B" },
  { company: "KCB Group", symbol: "KCB", revenue: "KSh 109B", profit: "KSh 37B" },
  { company: "EABL", symbol: "EABL", revenue: "KSh 86B", profit: "KSh 12B" },
  { company: "Nation Media Group", symbol: "NMG", revenue: "KSh 7B", profit: "KSh 0.8B" },
];

const News: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([
    { name: "TraderJoe", content: "Excited for upcoming earning releases!", timestamp: Date.now() - 60000 },
    { name: "NSEQueen", content: "Which stock are you bullish on this week?", timestamp: Date.now() - 360000 },
  ]);
  const [postName, setPostName] = useState("");
  const [postContent, setPostContent] = useState("");

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postName.trim() && postContent.trim()) {
      setPosts([{ name: postName, content: postContent, timestamp: Date.now() }, ...posts]);
      setPostName("");
      setPostContent("");
    }
  };

  // Download CSV for dummy data
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

  return (
    <div className="min-h-screen flex flex-col bg-primary font-sans transition-colors">
      <main className="flex-1 w-full max-w-lg mx-auto flex flex-col items-center px-4 py-7">
        <h2 className="text-3xl font-bold text-secondary mb-5 flex items-center gap-2"><Newspaper size={30} /> News & Community</h2>
        <div className="w-full glass-card mb-4 px-1">
          <Tabs defaultValue="news" className="w-full">
            <TabsList className="bg-charcoal mb-2 gap-2 justify-between">
              <TabsTrigger value="news" className="flex gap-1 items-center"><Newspaper size={18} />NSE Stock News</TabsTrigger>
              <TabsTrigger value="articles" className="flex gap-1 items-center"><FileText size={18} />Articles</TabsTrigger>
              <TabsTrigger value="community" className="flex gap-1 items-center"><MessageSquare size={18} />Community</TabsTrigger>
              <TabsTrigger value="financials" className="flex gap-1 items-center"><Download size={18} />Financials</TabsTrigger>
            </TabsList>
            {/* NSE Stock News Tab */}
            <TabsContent value="news" className="space-y-3">
              {DUMMY_NEWS.map((n, idx) => (
                <div key={idx} className="bg-background p-3 rounded-lg shadow border-l-4 border-secondary/80">
                  <div className="text-sm font-bold text-off-white">{n.headline}</div>
                  <div className="text-xs text-neutral">{n.date}</div>
                </div>
              ))}
            </TabsContent>
            {/* Articles Tab */}
            <TabsContent value="articles" className="space-y-4">
              {DUMMY_ARTICLES.map((a, idx) => (
                <div key={idx} className="bg-background rounded-lg p-3">
                  <div className="font-bold text-secondary">{a.title}</div>
                  <div className="text-off-white text-xs mt-1">{a.excerpt}</div>
                </div>
              ))}
            </TabsContent>
            {/* Community Tab */}
            <TabsContent value="community">
              <form onSubmit={handlePostSubmit} className="flex flex-col gap-2 mb-3">
                <input
                  className="rounded-md p-2 bg-charcoal text-off-white placeholder:text-neutral"
                  placeholder="Your name (optional)"
                  value={postName}
                  maxLength={24}
                  onChange={e => setPostName(e.target.value)}
                />
                <textarea
                  className="rounded-md p-2 bg-charcoal text-off-white placeholder:text-neutral resize-none"
                  placeholder="What do you want to share?"
                  value={postContent}
                  required
                  minLength={2}
                  maxLength={160}
                  rows={2}
                  onChange={e => setPostContent(e.target.value)}
                />
                <Button type="submit" className="bg-secondary text-primary mt-1 hover:bg-secondary/90 rounded font-bold">Post</Button>
              </form>
              <div className="space-y-3">
                {posts.map((p, idx) => (
                  <div key={idx} className="bg-background p-3 rounded-lg shadow border-l-4 border-secondary/60">
                    <div className="text-xs text-secondary font-semibold">{p.name || "Anonymous"}</div>
                    <div className="text-off-white mt-1">{p.content}</div>
                    <div className="text-[10px] text-neutral mt-1">{new Date(p.timestamp).toLocaleTimeString()}</div>
                  </div>
                ))}
              </div>
            </TabsContent>
            {/* Financials Tab */}
            <TabsContent value="financials">
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
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};
export default News;
