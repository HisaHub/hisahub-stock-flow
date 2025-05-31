
import React, { useState } from 'react';
import { Shield, TrendingDown, AlertTriangle, PieChart, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

const RiskManagementModule: React.FC = () => {
  const [portfolioValue, setPortfolioValue] = useState('');
  const [riskScore, setRiskScore] = useState<number | null>(null);

  const calculateRisk = () => {
    const value = parseFloat(portfolioValue);
    if (value > 0) {
      let baseScore = Math.min(8, Math.max(1, Math.floor(value / 500000) + 2));
      let marketVolatility = Math.random() * 2;
      let finalScore = Math.min(10, Math.max(1, baseScore + marketVolatility));
      setRiskScore(Math.round(finalScore));
    }
  };

  const getRiskLevel = (score: number) => {
    if (score <= 3) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-50 border-green-200' };
    if (score <= 6) return { level: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' };
    if (score <= 8) return { level: 'High', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' };
    return { level: 'Very High', color: 'text-red-600', bg: 'bg-red-50 border-red-200' };
  };

  return (
    <div className="p-3 md:p-6 h-full space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Shield className="text-blue-600" size={20} />
        <h2 className="text-lg md:text-xl font-bold text-gray-800">Risk Management</h2>
      </div>

      {/* Risk Assessment Card */}
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <h3 className="font-semibold text-gray-700 mb-4">Portfolio Risk Assessment</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="portfolio-value" className="text-sm font-medium">Portfolio Value ($)</Label>
            <Input
              id="portfolio-value"
              type="number"
              value={portfolioValue}
              onChange={(e) => setPortfolioValue(e.target.value)}
              placeholder="Enter portfolio value"
              className="mt-1"
            />
          </div>
          <Button onClick={calculateRisk} className="w-full">
            Analyze Risk
          </Button>
        </div>
      </div>

      {/* Dynamic Risk Score Display */}
      {riskScore && (
        <div className={`p-4 rounded-lg border shadow-sm ${getRiskLevel(riskScore).bg}`}>
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-gray-800 mb-1">{riskScore}/10</div>
            <div className={`text-lg font-semibold ${getRiskLevel(riskScore).color}`}>
              {getRiskLevel(riskScore).level} Risk
            </div>
          </div>
          <Progress value={riskScore * 10} className="h-3" />
        </div>
      )}

      {/* Market Indicators Card */}
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <h3 className="font-semibold text-gray-700 mb-4">Market Indicators</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">VIX Index</span>
            <span className="font-bold text-orange-600">23.5</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Market Beta</span>
            <span className="font-bold text-blue-600">1.2</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Sharpe Ratio</span>
            <span className="font-bold text-green-600">1.8</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">NSE Volatility</span>
            <span className="font-bold text-purple-600">15.2%</span>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-blue-50 p-4 rounded-lg border shadow-sm">
        <h3 className="font-semibold text-gray-700 mb-4">Risk Management Tips</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-yellow-600 mt-0.5" size={16} />
            <div className="text-sm">
              <div className="font-medium">Diversification</div>
              <div className="text-gray-600">Spread investments across different sectors and asset classes</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <PieChart className="text-blue-600 mt-0.5" size={16} />
            <div className="text-sm">
              <div className="font-medium">Portfolio Rebalancing</div>
              <div className="text-gray-600">Review and adjust portfolio allocation quarterly</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TrendingDown className="text-red-600 mt-0.5" size={16} />
            <div className="text-sm">
              <div className="font-medium">Stop-Loss Orders</div>
              <div className="text-gray-600">Set automatic sell orders at 8-10% below purchase price</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskManagementModule;
