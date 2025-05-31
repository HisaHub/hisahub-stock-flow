
import React, { useState } from 'react';
import { DollarSign, PiggyBank, TrendingUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

const PersonalFinanceModule: React.FC = () => {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [goal, setGoal] = useState('');
  const [timeline, setTimeline] = useState('');
  const [budgetAnalysis, setBudgetAnalysis] = useState<any>(null);

  const calculateBudget = () => {
    const monthlyIncome = parseFloat(income);
    const monthlyExpenses = parseFloat(expenses);
    const savingsGoal = parseFloat(goal);
    const timelineMonths = parseInt(timeline);

    if (monthlyIncome > 0 && monthlyExpenses > 0 && savingsGoal > 0 && timelineMonths > 0) {
      const monthlySurplus = monthlyIncome - monthlyExpenses;
      const requiredMonthlySavings = savingsGoal / timelineMonths;
      const isFeasible = monthlySurplus >= requiredMonthlySavings;
      const savingsRate = (monthlySurplus / monthlyIncome) * 100;

      setBudgetAnalysis({
        surplus: monthlySurplus,
        required: requiredMonthlySavings,
        feasible: isFeasible,
        savingsRate: savingsRate,
        timeline: timelineMonths
      });
    }
  };

  return (
    <div className="p-3 md:p-6 h-full space-y-4 md:space-y-6">
      <div>
        <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4">Personal Finance</h2>
        
        {/* Budget Planner */}
        <div className="bg-white p-3 md:p-4 rounded-lg border mb-4 md:mb-6">
          <h3 className="font-semibold text-gray-700 mb-3 text-sm md:text-base">Budget Planner</h3>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label htmlFor="income" className="text-xs md:text-sm">Monthly Income (KES)</Label>
              <Input
                id="income"
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="50000"
                className="text-xs md:text-sm"
              />
            </div>
            <div>
              <Label htmlFor="expenses" className="text-xs md:text-sm">Monthly Expenses (KES)</Label>
              <Input
                id="expenses"
                type="number"
                value={expenses}
                onChange={(e) => setExpenses(e.target.value)}
                placeholder="35000"
                className="text-xs md:text-sm"
              />
            </div>
            <div>
              <Label htmlFor="goal" className="text-xs md:text-sm">Savings Goal (KES)</Label>
              <Input
                id="goal"
                type="number"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="100000"
                className="text-xs md:text-sm"
              />
            </div>
            <div>
              <Label htmlFor="timeline" className="text-xs md:text-sm">Timeline (months)</Label>
              <Input
                id="timeline"
                type="number"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                placeholder="12"
                className="text-xs md:text-sm"
              />
            </div>
            <Button onClick={calculateBudget} className="w-full text-xs md:text-sm">
              Analyze Budget
            </Button>
          </div>
        </div>

        {/* Budget Analysis */}
        {budgetAnalysis && (
          <div className={`p-3 md:p-4 rounded-lg border mb-4 md:mb-6 ${
            budgetAnalysis.feasible ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <h3 className="font-semibold text-gray-700 mb-3 text-sm md:text-base">Budget Analysis</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs md:text-sm">
                <span>Monthly Surplus:</span>
                <span className={`font-semibold ${budgetAnalysis.surplus > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  KES {budgetAnalysis.surplus.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span>Required Savings:</span>
                <span className="font-semibold">KES {budgetAnalysis.required.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span>Goal Achievable:</span>
                <span className={`font-semibold ${budgetAnalysis.feasible ? 'text-green-600' : 'text-red-600'}`}>
                  {budgetAnalysis.feasible ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span>Savings Rate:</span>
                <span className="font-semibold">{budgetAnalysis.savingsRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Financial Health Score */}
        <div className="bg-white p-3 md:p-4 rounded-lg border mb-4 md:mb-6">
          <h3 className="font-semibold text-gray-700 mb-3 text-sm md:text-base">Financial Health Score</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Emergency Fund</span>
                <span>75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Debt-to-Income</span>
                <span>65%</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Investment Diversity</span>
                <span>82%</span>
              </div>
              <Progress value={82} className="h-2" />
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-blue-50 p-3 md:p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-700 mb-3 text-sm md:text-base">Financial Tips</h3>
          <ul className="text-xs md:text-sm space-y-1 md:space-y-2 text-gray-600">
            <li>• Follow the 50/30/20 rule for budgeting</li>
            <li>• Build emergency fund (3-6 months expenses)</li>
            <li>• Start investing early for compound growth</li>
            <li>• Review and adjust budget monthly</li>
            <li>• Consider tax-advantaged accounts</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PersonalFinanceModule;
