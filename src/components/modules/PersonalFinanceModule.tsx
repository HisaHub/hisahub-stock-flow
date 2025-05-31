
import React, { useState } from 'react';
import { DollarSign, PiggyBank, TrendingUp, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PersonalFinanceModule: React.FC = () => {
  const [budgetData, setBudgetData] = useState({
    income: '',
    expenses: '',
    goal: '',
    timeline: ''
  });
  const [analysis, setAnalysis] = useState<any>(null);

  const analyzeBudget = () => {
    const income = parseFloat(budgetData.income);
    const expenses = parseFloat(budgetData.expenses);
    const goal = parseFloat(budgetData.goal);
    const timeline = parseFloat(budgetData.timeline);

    if (income > 0 && expenses > 0 && goal > 0 && timeline > 0) {
      const surplus = income - expenses;
      const monthlyGoal = goal / timeline;
      const feasible = surplus >= monthlyGoal;
      const savingsRate = (surplus / income) * 100;

      setAnalysis({
        surplus,
        monthlyGoal,
        feasible,
        savingsRate
      });
    }
  };

  return (
    <div className="p-6 h-full space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Finance</h2>
        
        {/* Budget Planner */}
        <div className="bg-white p-4 rounded-lg border mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Budget Planner</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="income">Monthly Income (KES)</Label>
              <Input
                id="income"
                type="number"
                value={budgetData.income}
                onChange={(e) => setBudgetData({...budgetData, income: e.target.value})}
                placeholder="Enter monthly income"
              />
            </div>
            <div>
              <Label htmlFor="expenses">Monthly Expenses (KES)</Label>
              <Input
                id="expenses"
                type="number"
                value={budgetData.expenses}
                onChange={(e) => setBudgetData({...budgetData, expenses: e.target.value})}
                placeholder="Enter monthly expenses"
              />
            </div>
            <div>
              <Label htmlFor="goal">Financial Goal (KES)</Label>
              <Input
                id="goal"
                type="number"
                value={budgetData.goal}
                onChange={(e) => setBudgetData({...budgetData, goal: e.target.value})}
                placeholder="Enter your goal amount"
              />
            </div>
            <div>
              <Label htmlFor="timeline">Timeline (months)</Label>
              <Input
                id="timeline"
                type="number"
                value={budgetData.timeline}
                onChange={(e) => setBudgetData({...budgetData, timeline: e.target.value})}
                placeholder="Enter timeline in months"
              />
            </div>
            <Button onClick={analyzeBudget} className="w-full">
              <Calculator size={16} className="mr-2" />
              Analyze Budget
            </Button>
          </div>
        </div>

        {/* Budget Analysis */}
        {analysis && (
          <div className="bg-white p-4 rounded-lg border mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">Budget Analysis</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Monthly Surplus</span>
                <span className={`font-semibold ${analysis.surplus >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  KES {analysis.surplus.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Required Monthly Savings</span>
                <span className="font-semibold">KES {analysis.monthlyGoal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Goal Feasibility</span>
                <span className={`font-semibold ${analysis.feasible ? 'text-green-600' : 'text-red-600'}`}>
                  {analysis.feasible ? 'Achievable' : 'Too Ambitious'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Savings Rate</span>
                <span className="font-semibold text-blue-600">{analysis.savingsRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Financial Health Score */}
        <div className="bg-white p-4 rounded-lg border mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Financial Health Score</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Emergency Fund</span>
              <span className="font-semibold text-green-600">Good</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Debt-to-Income</span>
              <span className="font-semibold text-yellow-600">Moderate</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Investment Diversity</span>
              <span className="font-semibold text-blue-600">Excellent</span>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-green-50 p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-700 mb-3">Quick Tips</h3>
          <ul className="text-sm space-y-2 text-gray-600">
            <li>• Follow the 50/30/20 rule</li>
            <li>• Build 6-month emergency fund</li>
            <li>• Automate your savings</li>
            <li>• Start investing early</li>
            <li>• Review budget monthly</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PersonalFinanceModule;
