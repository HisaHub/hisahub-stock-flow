
import React, { useState } from 'react';
import { Users, MessageSquare, BarChart3, Target, TrendingUp, Plus, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const CRMModule: React.FC = () => {
  const [activeMode, setActiveMode] = useState('overview');

  return (
    <div className="p-3 md:p-6 h-full space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-blue-600" size={20} />
        <h2 className="text-lg md:text-xl font-bold text-gray-800">CRM Dashboard</h2>
      </div>

      {/* Navigation Grid - 2x2 */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        <Button
          variant={activeMode === 'overview' ? 'default' : 'outline'}
          onClick={() => setActiveMode('overview')}
          className="flex flex-col items-center gap-1 h-auto py-3 text-xs"
        >
          <Users size={16} />
          <span>Customer Overview</span>
        </Button>
        <Button
          variant={activeMode === 'communication' ? 'default' : 'outline'}
          onClick={() => setActiveMode('communication')}
          className="flex flex-col items-center gap-1 h-auto py-3 text-xs"
        >
          <MessageSquare size={16} />
          <span>Communication</span>
        </Button>
        <Button
          variant={activeMode === 'analytics' ? 'default' : 'outline'}
          onClick={() => setActiveMode('analytics')}
          className="flex flex-col items-center gap-1 h-auto py-3 text-xs"
        >
          <BarChart3 size={16} />
          <span>Analytics</span>
        </Button>
        <Button
          variant={activeMode === 'goals' ? 'default' : 'outline'}
          onClick={() => setActiveMode('goals')}
          className="flex flex-col items-center gap-1 h-auto py-3 text-xs"
        >
          <Target size={16} />
          <span>Sales Goals</span>
        </Button>
      </div>

      {/* Content Cards */}
      {activeMode === 'overview' && (
        <div className="space-y-4">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-lg border shadow-sm text-center">
              <div className="text-2xl font-bold text-blue-600">1,247</div>
              <div className="text-sm text-gray-600">Total Customers</div>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm text-center">
              <div className="text-2xl font-bold text-green-600">89</div>
              <div className="text-sm text-gray-600">Active Leads</div>
            </div>
          </div>

          {/* Action Buttons Stack */}
          <div className="bg-white p-4 rounded-lg border shadow-sm space-y-2">
            <h3 className="font-semibold text-gray-700 mb-3">Quick Actions</h3>
            <Button variant="outline" className="w-full justify-start text-sm">
              <Plus size={16} className="mr-2" />
              Add New Customer
            </Button>
            <Button variant="outline" className="w-full justify-start text-sm">
              <Calendar size={16} className="mr-2" />
              Schedule Follow-up
            </Button>
            <Button variant="outline" className="w-full justify-start text-sm">
              <FileText size={16} className="mr-2" />
              Generate Report
            </Button>
          </div>
        </div>
      )}

      {activeMode === 'communication' && (
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4">Message Hub</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="font-medium text-sm">Unread Messages</div>
                <div className="text-xs text-gray-600">12 new customer inquiries</div>
              </div>
              <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">12</div>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div>
                <div className="font-medium text-sm">Email Campaign</div>
                <div className="text-xs text-gray-600">Q4 Newsletter - Active</div>
              </div>
              <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">Active</div>
            </div>
          </div>
        </div>
      )}

      {activeMode === 'analytics' && (
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4">Key Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Conversion Rate</span>
              <span className="font-bold text-green-600">23.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Customer Satisfaction</span>
              <span className="font-bold text-blue-600">94.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Avg Response Time</span>
              <span className="font-bold text-orange-600">2.3h</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Monthly Revenue</span>
              <span className="font-bold text-purple-600">KES 850K</span>
            </div>
          </div>
        </div>
      )}

      {activeMode === 'goals' && (
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4">Monthly Target Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Monthly Target</span>
                <span className="font-bold">68%</span>
              </div>
              <Progress value={68} className="h-3" />
              <div className="text-xs text-gray-600 mt-1">KES 680K of KES 1M target</div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">24</div>
                <div className="text-xs text-gray-600">Deals Closed</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">156</div>
                <div className="text-xs text-gray-600">Active Pipeline</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMModule;
