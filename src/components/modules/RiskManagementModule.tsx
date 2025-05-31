
import React, { useState } from 'react';
import { Shield, TrendingDown, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';
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
      // Enhanced risk calculation based on portfolio value and market conditions
      let baseScore = Math.min(8, Math.max(1, Math.floor(value / 500000) + 2));
      let marketVolatility = Math.random() * 2; // Simulated market conditions
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

  const getRiskIcon = (score: number) => {
    if (score <= 3) return <CheckCircle className="text-green-600" size={16} />;
    if (score <= 6) return <Shield className="text-yellow-600" size={16} />;
    return <AlertTriangle className="text-red-600" size={16} />;
  };

  return (
    <div className="p-3 md:p-6 h-full space-y-4 md:space-y-6">
      <div>
        <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4">Risk Management</h2>
        
        {/* Risk Calculator */}
        <div className="bg-white p-3 md:p-4 rounded-lg border mb-4 md:mb-6">
          <h3 className="font-semibold text-gray-700 mb-3 text-sm md:text-base">Portfolio Risk Calculator</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="portfolio-value" className="text-xs md:text-sm">Portfolio Value (KES)</Label>
              <Input
                id="portfolio-value"
                type="number"
                value={portfolioValue}
                onChange={(e) => setPortfolioValue(e.target.value)}
                placeholder="Enter your portfolio value"
                className="text-xs md:text-sm"
              />
            </div>
            <Button onClick={calculateRisk} className="w-full text-xs md:text-sm">
              Calculate Risk Score
            </Button>
          </div>
        </div>

        {/* Risk Score Display */}
        {riskScore && (
          <div className={`p-3 md:p-4 rounded-lg border mb-4 md:mb-6 ${getRiskLevel(riskScore).bg}`}>
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              {getRiskIcon(riskScore)}
              <div>
                <div className="font-semibold text-sm md:text-base">Risk Score: {riskScore}/10</div>
                <div className={`text-xs md:text-sm ${getRiskLevel(riskScore).color}`}>
                  {getRiskLevel(riskScore).level} Risk
                </div>
              </div>
            </div>
            <div className="mt-3">
              <Progress value={riskScore * 10} className="h-2" />
            </div>
          </div>
        )}

        {/* Market Volatility */}
        <div className="bg-white p-3 md:p-4 rounded-lg border mb-4 md:mb-6">
          <h3 className="font-semibold text-gray-700 mb-3 text-sm md:text-base">Market Indicators</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-xs md:text-sm">
              <span>VIX Index</span>
              <span className="font-semibold text-orange-600">23.5</span>
            </div>
            <div className="flex justify-between text-xs md:text-sm">
              <span>Market Beta</span>
              <span className="font-semibold">1.2</span>
            </div>
            <div className="flex justify-between text-xs md:text-sm">
              <span>Sharpe Ratio</span>
              <span className="font-semibold text-green-600">1.8</span>
            </div>
            <div className="flex justify-between text-xs md:text-sm">
              <span>NSE Volatility</span>
              <span className="font-semibold text-blue-600">15.2%</span>
            </div>
          </div>
        </div>

        {/* Portfolio Allocation */}
        <div className="bg-white p-3 md:p-4 rounded-lg border mb-4 md:mb-6">
          <h3 className="font-semibold text-gray-700 mb-3 text-sm md:text-base">Risk Allocation</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Conservative Assets</span>
                <span>40%</span>
              </div>
              <Progress value={40} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Moderate Risk</span>
                <span>45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>High Risk</span>
                <span>15%</span>
              </div>
              <Progress value={15} className="h-2" />
            </div>
          </div>
        </div>

        {/* Risk Mitigation Tips */}
        <div className="bg-blue-50 p-3 md:p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-700 mb-3 text-sm md:text-base">Risk Mitigation Tips</h3>
          <ul className="text-xs md:text-sm space-y-1 md:space-y-2 text-gray-600">
            <li>• Diversify across different sectors</li>
            <li>• Set stop-loss orders at 8-10%</li>
            <li>• Rebalance portfolio quarterly</li>
            <li>• Maintain emergency fund</li>
            <li>• Review risk tolerance regularly</li>
            <li>• Consider currency hedging for international assets</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RiskManagementModule;
