
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMarketData = () => {
  const [stocks, setStocks] = useState([]);
  const [marketIndices, setMarketIndices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMarketData();
    
    // Set up real-time subscriptions
    const stocksChannel = supabase
      .channel('stocks-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'stock_prices' },
        () => fetchStockPrices()
      )
      .subscribe();

    const marketChannel = supabase
      .channel('market-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'market_data' },
        () => fetchMarketIndices()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(stocksChannel);
      supabase.removeChannel(marketChannel);
    };
  }, []);

  const fetchMarketData = async () => {
    await Promise.all([fetchStockPrices(), fetchMarketIndices()]);
    setLoading(false);
  };

  const fetchStockPrices = async () => {
    try {
      const { data } = await supabase
        .from('stocks')
        .select(`
          *,
          stock_prices:stock_prices!inner (
            price,
            volume,
            high,
            low,
            timestamp
          )
        `)
        .eq('is_active', true)
        .order('timestamp', { foreignTable: 'stock_prices', ascending: false })
        .limit(1, { foreignTable: 'stock_prices' });

      if (data) {
        const processedStocks = data.map(stock => ({
          ...stock,
          price: stock.stock_prices[0]?.price || 0,
          volume: stock.stock_prices[0]?.volume || 0,
          high: stock.stock_prices[0]?.high || 0,
          low: stock.stock_prices[0]?.low || 0,
          change: Math.random() * 2 - 1, // Simulated change
          changePercent: (Math.random() * 4 - 2).toFixed(2)
        }));
        
        setStocks(processedStocks);
      }
    } catch (error) {
      console.error('Error fetching stock prices:', error);
    }
  };

  const fetchMarketIndices = async () => {
    try {
      const { data } = await supabase
        .from('market_data')
        .select('*')
        .order('timestamp', { ascending: false });

      if (data) {
        setMarketIndices(data);
      }
    } catch (error) {
      console.error('Error fetching market indices:', error);
    }
  };

  const updateMarketData = async () => {
    try {
      await supabase.functions.invoke('market-data');
    } catch (error) {
      console.error('Error updating market data:', error);
    }
  };

  return {
    stocks,
    marketIndices,
    loading,
    updateMarketData,
    refetch: fetchMarketData
  };
};
