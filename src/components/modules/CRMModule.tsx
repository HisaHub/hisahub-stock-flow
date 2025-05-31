
import React, { useState } from 'react';
import { Users, MessageSquare, BarChart3, Target, Plus, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const CRMModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="p-3 md:p-6 h-full space-y-4 md:space-y-6">
      <div>
        <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4">Customer Relationship Management</h2>
        
        {/* Dashboard Overview */}
        <div className="grid grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-6">
          <div className="bg-white p-3 md:p-4 rounded-lg border text-center">
            <div className="text-xl md:text-2xl font-bold text-blue-600">1,247</div>
            <div className="text-xs md:text-sm text-gray-600">Total Customers</div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-lg border text-center">
            <div className="text-xl md:text-2xl font-bold text-green-600">89</div>
            <div className="text-xs md:text-sm text-gray-600">Active Leads</div>
          </div>
        </div>

        {/* CRM Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-1 mb-4">
            <TabsTrigger value="overview" className="text-xs px-2 py-1">Overview</TabsTrigger>
            <TabsTrigger value="communication" className="text-xs px-2 py-1">Comm</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs px-2 py-1">Analytics</TabsTrigger>
            <TabsTrigger value="goals" className="text-xs px-2 py-1">Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-3 md:space-y-4">
            <div className="bg-white p-3 md:p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-700 mb-3 text-sm md:text-base">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" size="sm" className="justify-start text-xs">
                  <Plus size={14} className="mr-2" />
                  Add Customer
                </Button>
                <Button variant="outline" size="sm" className="justify-start text-xs">
                  <Calendar size={14} className="mr-2" />
                  Schedule Follow-up
                </Button>
                <Button variant="outline" size="sm" className="justify-start text-xs">
                  <FileText size={14} className="mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="communication" className="space-y-3 md:space-y-4">
            <div className="bg-white p-3 md:p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-700 mb-3 text-sm md:text-base">Recent Communications</h3>
              <div className="space-y-2">
                <div className="text-xs text-gray-600 border-b pb-2">
                  <strong>John Doe</strong> - Called about investment options
                  <div className="text-xs text-gray-500">2 hours ago</div>
                </div>
                <div className="text-xs text-gray-600 border-b pb-2">
                  <strong>Sarah Smith</strong> - Email about portfolio review
                  <div className="text-xs text-gray-500">5 hours ago</div>
                </div>
                <div className="text-xs text-gray-600">
                  <strong>Mike Johnson</strong> - Meeting scheduled for tomorrow
                  <div className="text-xs text-gray-500">1 day ago</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-3 md:space-y-4">
            <div className="bg-white p-3 md:p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-700 mb-3 text-sm md:text-base">Key Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-xs md:text-sm">
                  <span>Conversion Rate</span>
                  <span className="font-semibold text-green-600">23.5%</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span>Customer Satisfaction</span>
                  <span className="font-semibold text-blue-600">94.2%</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span>Avg Response Time</span>
                  <span className="font-semibold text-orange-600">2.3h</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span>Monthly Revenue</span>
                  <span className="font-semibold text-purple-600">KES 850K</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-3 md:space-y-4">
            <div className="bg-white p-3 md:p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-700 mb-3 text-sm md:text-base">Sales Goals</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Monthly Target</span>
                    <span>68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>New Customers</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Customer Retention</span>
                    <span>89%</span>
                  </div>
                  <Progress value={89} className="h-2" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CRMModule;
