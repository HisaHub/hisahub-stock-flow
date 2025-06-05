
import { useFinancialData } from '../contexts/FinancialDataContext';
import { useToast } from '@/hooks/use-toast';

export const useTrading = () => {
  const { state, dispatch } = useFinancialData();
  const { toast } = useToast();

  const buyStock = (symbol: string, quantity: number, orderType: 'market' | 'limit' = 'market') => {
    const stock = state.stocks.find(s => s.symbol === symbol);
    if (!stock) {
      toast({
        title: "Error",
        description: "Stock not found",
        variant: "destructive"
      });
      return false;
    }

    const price = stock.price;
    const total = quantity * price;

    if (state.accountData.balance < total) {
      toast({
        title: "Insufficient Funds",
        description: `You need KES ${total.toLocaleString()} but only have KES ${state.accountData.balance.toLocaleString()}`,
        variant: "destructive"
      });
      return false;
    }

    dispatch({
      type: 'BUY_STOCK',
      payload: { symbol, quantity, price }
    });

    toast({
      title: "Order Executed",
      description: `Successfully bought ${quantity} shares of ${symbol} at KES ${price.toFixed(2)}`,
    });

    return true;
  };

  const sellStock = (symbol: string, quantity: number, orderType: 'market' | 'limit' = 'market') => {
    const holding = state.holdings.find(h => h.symbol === symbol);
    if (!holding || holding.quantity < quantity) {
      toast({
        title: "Insufficient Shares",
        description: `You only have ${holding?.quantity || 0} shares of ${symbol}`,
        variant: "destructive"
      });
      return false;
    }

    const price = holding.currentPrice;

    dispatch({
      type: 'SELL_STOCK',
      payload: { symbol, quantity, price }
    });

    toast({
      title: "Order Executed",
      description: `Successfully sold ${quantity} shares of ${symbol} at KES ${price.toFixed(2)}`,
    });

    return true;
  };

  const addFunds = (amount: number) => {
    dispatch({
      type: 'ADD_FUNDS',
      payload: amount
    });

    toast({
      title: "Funds Added",
      description: `Successfully added KES ${amount.toLocaleString()} to your account`,
    });
  };

  return {
    buyStock,
    sellStock,
    addFunds,
    accountBalance: state.accountData.balance,
    holdings: state.holdings
  };
};
