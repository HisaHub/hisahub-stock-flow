
import React, { useState } from "react";
import ChatFAB from "../components/ChatFAB";
import BottomNav from "../components/BottomNav";
import HisaAIButton from "../components/HisaAIButton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  CreditCard, 
  TrendingUp, 
  Shield, 
  Bell, 
  Bot, 
  Globe, 
  Briefcase, 
  FileText, 
  HelpCircle,
  ChevronRight,
  Eye,
  EyeOff,
  Smartphone,
  Check,
  X
} from "lucide-react";

const Settings: React.FC = () => {
  const [dark, setDark] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const PersonalInfoSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" defaultValue="John Doe" className="mt-1" />
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" defaultValue="john.doe@email.com" className="mt-1" />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" defaultValue="+254 712 345 678" className="mt-1" />
        </div>
        <div>
          <Label htmlFor="dob">Date of Birth</Label>
          <Input id="dob" type="date" defaultValue="1990-01-01" className="mt-1" />
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Identity Verification</h3>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-medium">ID Verification</p>
              <p className="text-sm text-muted-foreground">Verified</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Check className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Tax Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="taxId">Tax ID (KRA PIN)</Label>
            <Input id="taxId" defaultValue="A123456789Z" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="taxStatus">Tax Status</Label>
            <Input id="taxStatus" defaultValue="Individual" className="mt-1" />
          </div>
        </div>
      </div>
    </div>
  );

  const BankingSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Linked Accounts</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium">Equity Bank</p>
                <p className="text-sm text-muted-foreground">****1234</p>
              </div>
            </div>
            <Badge variant="secondary">Primary</Badge>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium">M-Pesa</p>
                <p className="text-sm text-muted-foreground">254712345678</p>
              </div>
            </div>
            <Badge variant="outline">Connected</Badge>
          </div>
        </div>
        
        <Button variant="outline" className="w-full mt-4">
          + Add Bank Account
        </Button>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Transaction Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Daily Withdrawal Limit</p>
              <p className="text-sm text-muted-foreground">KES 500,000</p>
            </div>
            <Button variant="ghost" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto-invest Savings</p>
              <p className="text-sm text-muted-foreground">Enabled</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );

  const TradingSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Default Broker</h3>
        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Nairobi Securities Exchange</p>
              <p className="text-sm text-muted-foreground">Connected</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Risk Profile</h3>
        <div className="grid grid-cols-3 gap-3">
          <Button variant="outline" className="h-auto p-4 flex flex-col">
            <div className="text-green-500 font-medium">Conservative</div>
            <div className="text-xs text-muted-foreground">Low Risk</div>
          </Button>
          <Button variant="default" className="h-auto p-4 flex flex-col">
            <div className="font-medium">Moderate</div>
            <div className="text-xs">Medium Risk</div>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col">
            <div className="text-orange-500 font-medium">Aggressive</div>
            <div className="text-xs text-muted-foreground">High Risk</div>
          </Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Trading PIN</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="currentPin">Current PIN</Label>
            <div className="relative mt-1">
              <Input 
                id="currentPin" 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter current PIN"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="newPin">New PIN</Label>
            <Input id="newPin" type="password" placeholder="Enter new PIN" className="mt-1" />
          </div>
          <Button className="w-full">Update Trading PIN</Button>
        </div>
      </div>
    </div>
  );

  const SecuritySection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Password & Authentication</h3>
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <Shield className="w-4 h-4 mr-2" />
            Change Password
          </Button>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Biometric Login</p>
              <p className="text-sm text-muted-foreground">Use fingerprint or face ID</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Active Sessions</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5" />
              <div>
                <p className="font-medium">iPhone 13 Pro</p>
                <p className="text-sm text-muted-foreground">Current session • Nairobi, Kenya</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
          </div>
        </div>
        
        <Button variant="destructive" className="w-full mt-4">
          Sign Out All Devices
        </Button>
      </div>
    </div>
  );

  const NotificationsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Alert Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-muted-foreground">Receive alerts on your device</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Alerts</p>
              <p className="text-sm text-muted-foreground">Market updates and trade confirmations</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">SMS Notifications</p>
              <p className="text-sm text-muted-foreground">Critical alerts only</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Trading Alerts</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Price movement alerts</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span>Order execution updates</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span>Market news</span>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <span>Portfolio performance</span>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );

  const AISection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">AI Assistant Preferences</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="aiLanguage">Language</Label>
            <select className="w-full mt-1 p-2 border rounded-md" id="aiLanguage">
              <option value="en">English</option>
              <option value="sw">Swahili</option>
              <option value="fr">French</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="aiTone">Communication Style</Label>
            <select className="w-full mt-1 p-2 border rounded-md" id="aiTone">
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="detailed">Detailed</option>
            </select>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Data & Privacy</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Share trading data for insights</p>
              <p className="text-sm text-muted-foreground">Help improve AI recommendations</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Personalized suggestions</p>
              <p className="text-sm text-muted-foreground">AI learns from your preferences</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch(activeTab) {
      case "personal": return <PersonalInfoSection />;
      case "banking": return <BankingSection />;
      case "trading": return <TradingSection />;
      case "security": return <SecuritySection />;
      case "notifications": return <NotificationsSection />;
      case "ai": return <AISection />;
      default: return <PersonalInfoSection />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-primary font-sans transition-colors">
      <HisaAIButton />
      <main className="flex-1 flex flex-col px-4 py-6">
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-secondary" style={{ fontFamily: "'Poppins',sans-serif" }}>
              Settings
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-sm">Theme</span>
                <button
                  onClick={() => setDark((v) => !v)}
                  className={`transition duration-200 px-3 py-1 rounded text-sm border border-secondary 
                    ${dark ? "bg-secondary text-primary" : "bg-white/10 text-secondary" }
                  `}
                >
                  {dark ? "Dark" : "Light"}
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-6">
                <TabsTrigger value="personal" className="flex items-center gap-2 text-xs">
                  <User className="w-4 h-4" />
                  Personal
                </TabsTrigger>
                <TabsTrigger value="banking" className="flex items-center gap-2 text-xs">
                  <CreditCard className="w-4 h-4" />
                  Banking
                </TabsTrigger>
                <TabsTrigger value="trading" className="flex items-center gap-2 text-xs">
                  <TrendingUp className="w-4 h-4" />
                  Trading
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2 text-xs">
                  <Shield className="w-4 h-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2 text-xs">
                  <Bell className="w-4 h-4" />
                  Alerts
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex items-center gap-2 text-xs">
                  <Bot className="w-4 h-4" />
                  AI
                </TabsTrigger>
              </TabsList>

              <div className="min-h-[500px]">
                {renderTabContent()}
              </div>
            </Tabs>
          </div>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <Globe className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                <p className="text-sm text-white/80">Localization</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <Briefcase className="w-6 h-6 mx-auto mb-2 text-green-400" />
                <p className="text-sm text-white/80">Account</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <FileText className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                <p className="text-sm text-white/80">Legal</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <HelpCircle className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                <p className="text-sm text-white/80">Help</p>
              </CardContent>
            </Card>
          </div>
        </div>
        <ChatFAB />
      </main>
      <BottomNav />
    </div>
  );
};

export default Settings;
