
import React, { useState } from 'react';
import { Shield, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const RiskManagementModule: React.FC = () => {
  const [portfolioValue, setPortfolioValue] = useState('');
  const [riskScore, setRiskScore] = useState<number | null>(null);

  const calculateRisk = () => {
    const value = parseFloat(portfolioValue);
    if (value > 0) {
      // Simple risk calculation based on portfolio value
      let score = Math.min(10, Math.max(1, Math.floor(value / 100000) + Math.random() * 3));
      setRiskScore(score);
    }
  };

  const getRiskLevel = (score: number) => {
    if (score <= 3) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100' };
    if (score <= 6) return { level: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (score <= 8) return { level: 'High', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { level: 'Very High', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getRiskIcon = (score: number) => {
    if (score <= 3) return <CheckCircle className="text-green-600" size={20} />;
    if (score <= 6) return <Shield className="text-yellow-600" size={20} />;
    return <AlertTriangle className="text-red-600" size={20} />;
  };

  return (
    <div className="p-6 h-full space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Risk Management</h2>
        
        {/* Risk Calculator */}
        <div className="bg-white p-4 rounded-lg border mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Portfolio Risk Calculator</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="portfolio-value">Portfolio Value (KES)</Label>
              <Input
                id="portfolio-value"
                type="number"
                value={portfolioValue}
                onChange={(e) => setPortfolioValue(e.target.value)}
                placeholder="Enter your portfolio value"
              />
            </div>
            <Button onClick={calculateRisk} className="w-full">
              Calculate Risk Score
            </Button>
          </div>
        </div>

        {/* Risk Score Display */}
        {riskScore && (
          <div className={`p-4 rounded-lg border mb-6 ${getRiskLevel(riskScore).bg}`}>
            <div className="flex items-center gap-3 mb-2">
              {getRiskIcon(riskScore)}
              <div>
                <div className="font-semibold">Risk Score: {riskScore}/10</div>
                <div className={`text-sm ${getRiskLevel(riskScore).color}`}>
                  {getRiskLevel(riskScore).level} Risk
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Market Volatility */}
        <div className="bg-white p-4 rounded-lg border mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Market Volatility</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">VIX Index</span>
              <span className="font-semibold text-orange-600">23.5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Market Beta</span>
              <span className="font-semibold">1.2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Sharpe Ratio</span>
              <span className="font-semibold text-green-600">1.8</span>
            </div>
          </div>
        </div>

        {/* Risk Mitigation Tips */}
        <div className="bg-blue-50 p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-700 mb-3">Risk Mitigation Tips</h3>
          <ul className="text-sm space-y-2 text-gray-600">
            <li>• Diversify across different sectors</li>
            <li>• Set stop-loss orders at 8-10%</li>
            <li>• Rebalance portfolio quarterly</li>
            <li>• Maintain emergency fund</li>
            <li>• Review risk tolerance regularly</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RiskManagementModule;
