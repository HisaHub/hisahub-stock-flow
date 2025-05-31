
import React, { useState } from 'react';
import { Users, Phone, BarChart3, Target, Plus, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const CRMModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="p-6 h-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Customer Relationship Management</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users size={20} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Total Customers</span>
            </div>
            <div className="text-2xl font-bold text-blue-800">1,247</div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target size={20} className="text-green-600" />
              <span className="text-sm font-medium text-green-600">Active Leads</span>
            </div>
            <div className="text-2xl font-bold text-green-800">89</div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="communication">Comm</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Quick Actions</h3>
            <Button className="w-full justify-start" variant="outline">
              <Plus size={16} className="mr-2" />
              Add New Customer
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar size={16} className="mr-2" />
              Schedule Follow-up
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText size={16} className="mr-2" />
              Generate Report
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="communication" className="space-y-4">
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Recent Communications</h3>
            <div className="space-y-2">
              <div className="p-3 bg-white rounded border">
                <div className="font-medium text-sm">John Doe</div>
                <div className="text-xs text-gray-500">Called 2 hours ago</div>
              </div>
              <div className="p-3 bg-white rounded border">
                <div className="font-medium text-sm">Jane Smith</div>
                <div className="text-xs text-gray-500">Email sent yesterday</div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Performance Metrics</h3>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded border">
                <div className="flex justify-between text-sm mb-1">
                  <span>Conversion Rate</span>
                  <span className="font-bold text-green-600">23.5%</span>
                </div>
              </div>
              <div className="p-3 bg-white rounded border">
                <div className="flex justify-between text-sm mb-1">
                  <span>Customer Satisfaction</span>
                  <span className="font-bold text-blue-600">94.2%</span>
                </div>
              </div>
              <div className="p-3 bg-white rounded border">
                <div className="flex justify-between text-sm mb-1">
                  <span>Avg Response Time</span>
                  <span className="font-bold text-orange-600">2.3h</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Sales Goals</h3>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded border">
                <div className="flex justify-between text-sm mb-2">
                  <span>Monthly Target</span>
                  <span>68%</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>
              <div className="p-3 bg-white rounded border">
                <div className="flex justify-between text-sm mb-2">
                  <span>Quarterly Goal</span>
                  <span>45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRMModule;
