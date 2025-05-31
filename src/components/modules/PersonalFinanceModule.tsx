
import React, { useState } from 'react';
import { Calculator, DollarSign, Target, TrendingUp, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

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
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="text-blue-600" size={20} />
        <h2 className="text-lg md:text-xl font-bold text-gray-800">Personal Finance Coach</h2>
      </div>

      {/* Budget Planner Form */}
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <h3 className="font-semibold text-gray-700 mb-4">Budget Planner</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="income" className="text-sm font-medium">Monthly Income ($)</Label>
            <Input
              id="income"
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="5000"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="expenses" className="text-sm font-medium">Monthly Expenses ($)</Label>
            <Input
              id="expenses"
              type="number"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
              placeholder="3500"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="goal" className="text-sm font-medium">Savings Goal ($)</Label>
            <Input
              id="goal"
              type="number"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="10000"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="timeline" className="text-sm font-medium">Timeline (months)</Label>
            <Input
              id="timeline"
              type="number"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              placeholder="12"
              className="mt-1"
            />
          </div>
          <Button onClick={calculateBudget} className="w-full">
            Create Budget Plan
          </Button>
        </div>
      </div>

      {/* Analysis Results Card */}
      {budgetAnalysis && (
        <div className={`p-4 rounded-lg border shadow-sm ${
          budgetAnalysis.feasible ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            {budgetAnalysis.feasible ? (
              <CheckCircle className="text-green-600" size={20} />
            ) : (
              <X className="text-red-600" size={20} />
            )}
            <h3 className="font-semibold text-gray-700">Budget Analysis</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Monthly Surplus/Deficit:</span>
              <span className={`font-bold ${budgetAnalysis.surplus > 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${budgetAnalysis.surplus.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Required Monthly Savings:</span>
              <span className="font-bold">${budgetAnalysis.required.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Goal Feasibility:</span>
              <span className={`font-bold ${budgetAnalysis.feasible ? 'text-green-600' : 'text-red-600'}`}>
                {budgetAnalysis.feasible ? 'Achievable' : 'Not Feasible'}
              </span>
            </div>
            <div className="p-3 bg-white rounded-lg border mt-4">
              <div className="text-sm text-gray-600">
                {budgetAnalysis.feasible 
                  ? `Great! You can save $${budgetAnalysis.surplus.toLocaleString()} monthly, which exceeds your target of $${budgetAnalysis.required.toLocaleString()}.`
                  : `You need an additional $${(budgetAnalysis.required - budgetAnalysis.surplus).toLocaleString()} monthly to reach your goal. Consider reducing expenses or extending timeline.`
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Financial Health Score */}
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <h3 className="font-semibold text-gray-700 mb-4">Financial Health Score</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Emergency Fund</span>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Building</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Debt-to-Income</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">Good</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Investment Diversity</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">Moderate</Badge>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-blue-50 p-4 rounded-lg border shadow-sm">
        <h3 className="font-semibold text-gray-700 mb-4">Financial Tips</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <DollarSign className="text-green-600 mt-0.5" size={16} />
            <div className="text-sm">
              <div className="font-medium">50/30/20 Rule</div>
              <div className="text-gray-600">50% needs, 30% wants, 20% savings and debt repayment</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Target className="text-blue-600 mt-0.5" size={16} />
            <div className="text-sm">
              <div className="font-medium">Emergency Fund Priority</div>
              <div className="text-gray-600">Build 3-6 months of expenses before aggressive investing</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TrendingUp className="text-purple-600 mt-0.5" size={16} />
            <div className="text-sm">
              <div className="font-medium">Compound Interest</div>
              <div className="text-gray-600">Start investing early to maximize compound growth potential</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalFinanceModule;
