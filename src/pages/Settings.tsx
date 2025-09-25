
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import InvisaAI from "../components/InvisaAI";
import { toast } from 'sonner';
import { useUserProfile } from '@/hooks/useUserProfile';
import FloatingJoystick from '@/components/FloatingJoystick';
import BottomNav from '@/components/BottomNav';

const Settings: React.FC = () => {
  const { profile, loading, updating, updateProfile } = useUserProfile();
  const [activeTab, setActiveTab] = useState('personal');

  const handleUpdateProfile = async (field: string, value: any) => {
    const success = await updateProfile({ [field]: value });
    if (!success) {
      toast.error('Failed to update profile');
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Failed to log out');
    } else {
      toast.success('Logged out successfully');
    }
  };

  const renderPersonalSettings = () => (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Personal Information</CardTitle>
          <CardDescription className="text-gray-400">
            Update your personal details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white">First Name</Label>
              <Input
                value={profile?.first_name || ''}
                onChange={(e) => handleUpdateProfile('first_name', e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Enter first name"
              />
            </div>
            <div>
              <Label className="text-white">Last Name</Label>
              <Input
                value={profile?.last_name || ''}
                onChange={(e) => handleUpdateProfile('last_name', e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Enter last name"
              />
            </div>
          </div>
          <div>
            <Label className="text-white">Phone Number</Label>
            <Input
              value={profile?.phone_number || ''}
              onChange={(e) => handleUpdateProfile('phone_number', e.target.value)}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <Label className="text-white">National ID</Label>
            <Input
              value={profile?.national_id || ''}
              onChange={(e) => handleUpdateProfile('national_id', e.target.value)}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Enter national ID"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Security Settings</CardTitle>
          <CardDescription className="text-gray-400">
            Manage your account security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Biometric Authentication</Label>
              <p className="text-sm text-gray-400">Use fingerprint or face recognition</p>
            </div>
            <Switch
              checked={profile?.biometric_enabled || false}
              onCheckedChange={(checked) => handleUpdateProfile('biometric_enabled', checked)}
            />
          </div>
          <Button onClick={handleLogout} variant="destructive" className="w-full">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderTradingSettings = () => (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Trading Preferences</CardTitle>
          <CardDescription className="text-gray-400">
            Configure your trading settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-white mb-4 block">Risk Tolerance: {profile?.risk_tolerance || 50}%</Label>
            <Slider
              value={[profile?.risk_tolerance || 50]}
              onValueChange={(value) => handleUpdateProfile('risk_tolerance', value[0])}
              max={100}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>Conservative</span>
              <span>Moderate</span>
              <span>Aggressive</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBankingSettings = () => (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Banking Information</CardTitle>
          <CardDescription className="text-gray-400">
            Manage your banking details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-white">Bank Account</Label>
            <Select>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select your bank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kcb">KCB Bank</SelectItem>
                <SelectItem value="equity">Equity Bank</SelectItem>
                <SelectItem value="coop">Co-operative Bank</SelectItem>
                <SelectItem value="absa">Absa Bank</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Notification Preferences</CardTitle>
          <CardDescription className="text-gray-400">
            Choose what notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Price Alerts</Label>
              <p className="text-sm text-gray-400">Get notified when stocks hit target prices</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Market News</Label>
              <p className="text-sm text-gray-400">Receive important market updates</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Order Updates</Label>
              <p className="text-sm text-gray-400">Get notified about order executions</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAISettings = () => (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">AI Assistant</CardTitle>
          <CardDescription className="text-gray-400">
            Configure your AI trading assistant
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">AI Recommendations</Label>
              <p className="text-sm text-gray-400">Get AI-powered investment suggestions</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Auto-Analysis</Label>
              <p className="text-sm text-gray-400">Enable automatic portfolio analysis</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderActiveContent = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalSettings();
      case 'security':
        return renderSecuritySettings();
      case 'trading':
        return renderTradingSettings();
      case 'banking':
        return renderBankingSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'ai':
        return renderAISettings();
      default:
        return renderPersonalSettings();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center pb-20">
        <div className="text-white text-lg">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary pb-20">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account preferences and settings</p>
        </div>

        {renderActiveContent()}
      </div>

      <FloatingJoystick activeTab={activeTab} onTabChange={setActiveTab} />
      <InvisaAI />
      <BottomNav />
    </div>
  );
};

export default Settings;
