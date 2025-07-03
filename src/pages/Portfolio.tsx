
import React from "react";
import { useGlobalUser } from "../contexts/GlobalUserContext";
import ChatFAB from "../components/ChatFAB";
import BottomNav from "../components/BottomNav";
import HisaAIButton from "../components/HisaAIButton";
import PortfolioWidget from "../components/PortfolioWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Portfolio: React.FC = () => {
  const { user, portfolio, holdings, transactions, loading } = useGlobalUser();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-primary font-sans">
        <HisaAIButton />
        <main className="flex-1 flex flex-col px-4 py-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-primary font-sans">
        <HisaAIButton />
        <main className="flex-1 flex items-center justify-center px-4">
          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <p className="text-off-white">Please log in to view your portfolio</p>
            </CardContent>
          </Card>
        </main>
        <BottomNav />
      </div>
    );
  }

  const totalValue = portfolio?.total_value || 0;
  const cashBalance = portfolio?.cash_balance || 0;
  const totalPnL = holdings.reduce((sum, holding) => sum + (holding.unrealized_pnl || 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-primary font-sans">
      <HisaAIButton />
      <main className="flex-1 flex flex-col px-4 py-6">
        <h1 className="text-2xl font-bold text-secondary mb-6">Portfolio Overview</h1>
        
        <div className="space-y-6">
          {/* Portfolio Summary */}
          <PortfolioWidget />
          
          {/* Holdings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-off-white">Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              {holdings.length === 0 ? (
                <p className="text-off-white/60">No holdings yet. Start trading to build your portfolio!</p>
              ) : (
                <div className="space-y-3">
                  {holdings.map((holding) => (
                    <div key={holding.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-semibold text-off-white">{holding.stocks?.symbol}</p>
                        <p className="text-sm text-off-white/60">{holding.quantity} shares</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-off-white">
                          KES {(holding.current_price * holding.quantity).toLocaleString()}
                        </p>
                        <p className={`text-sm ${holding.unrealized_pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {holding.unrealized_pnl >= 0 ? '+' : ''}KES {holding.unrealized_pnl.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-off-white">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <p className="text-off-white/60">No transactions yet.</p>
              ) : (
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-semibold text-off-white">{transaction.stocks?.symbol}</p>
                        <p className="text-sm text-off-white/60">{transaction.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-off-white">
                          KES {Math.abs(transaction.amount).toLocaleString()}
                        </p>
                        <p className="text-sm text-off-white/60">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <ChatFAB />
      <BottomNav />
    </div>
  );
};

export default Portfolio;
