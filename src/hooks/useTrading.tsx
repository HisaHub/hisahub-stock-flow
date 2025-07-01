
import { useFinancialData } from '../contexts/FinancialDataContext';
import { useToast } from '@/hooks/use-toast';

export const useTrading = () => {
  const { state, placeOrder: contextPlaceOrder } = useFinancialData();
  const { toast } = useToast();

  const buyStock = async (symbol: string, quantity: number, orderType: 'market' | 'limit' = 'market') => {
    if (!state.user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to place orders",
        variant: "destructive"
      });
      return false;
    }

    const stock = state.stocks.find(s => s.symbol === symbol);
    if (!stock) {
      toast({
        title: "Error",
        description: "Stock not found",
        variant: "destructive"
      });
      return false;
    }

    const total = quantity * stock.price;
    if (state.accountData.balance < total) {
      toast({
        title: "Insufficient Funds",
        description: `You need KES ${total.toLocaleString()} but only have KES ${state.accountData.balance.toLocaleString()}`,
        variant: "destructive"
      });
      return false;
    }

    return await contextPlaceOrder(symbol, quantity, orderType);
  };

  const sellStock = async (symbol: string, quantity: number, orderType: 'market' | 'limit' = 'market') => {
    if (!state.user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to place orders",
        variant: "destructive"
      });
      return false;
    }

    const holding = state.holdings.find(h => h.stocks?.symbol === symbol);
    if (!holding || holding.quantity < quantity) {
      toast({
        title: "Insufficient Shares",
        description: `You only have ${holding?.quantity || 0} shares of ${symbol}`,
        variant: "destructive"
      });
      return false;
    }

    return await contextPlaceOrder(symbol, -quantity, orderType);
  };

  return {
    buyStock,
    sellStock,
    accountBalance: state.accountData.balance,
    holdings: state.holdings,
    totalValue: state.accountData.totalValue,
    totalPnL: state.accountData.totalPnL
  };
};
