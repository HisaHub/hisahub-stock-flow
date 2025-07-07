import React, { useState } from "react";
import ChatFAB from "../components/ChatFAB";
import BottomNav from "../components/BottomNav";
import HisaAIButton from "../components/HisaAIButton";
import FloatingJoystick from "../components/FloatingJoystick";
import { useTheme } from "../components/ThemeProvider";
import { useUserProfile } from "../hooks/useUserProfile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  Bell, 
  Globe, 
  Briefcase, 
  FileText, 
  HelpCircle,
  ChevronRight,
  Eye,
  EyeOff,
  Smartphone,
  Check,
  CreditCard,
  User, 
  TrendingUp, 
  Bot,
  LogOut,
  Save
} from "lucide-react";

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { profile, loading, updating, updateProfile } = useUserProfile();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [signingOut, setSigningOut] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    date_of_birth: "",
    national_id: ""
  });
  const navigate = useNavigate();

  React.useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone_number: profile.phone_number || "",
        date_of_birth: profile.date_of_birth || "",
        national_id: profile.national_id || ""
      });
    }
  }, [profile]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Failed to sign out: " + error.message);
      } else {
        toast.success("Signed out successfully");
        navigate("/auth");
      }
    } catch (error) {
      toast.error("An error occurred while signing out");
    } finally {
      setSigningOut(false);
    }
  };

  const handleSaveProfile = async () => {
    const success = await updateProfile(formData);
    if (success) {
      setEditMode(false);
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone_number: profile.phone_number || "",
        date_of_birth: profile.date_of_birth || "",
        national_id: profile.national_id || ""
      });
    }
    setEditMode(false);
  };

  const PersonalInfoSection = () => {
    if (loading) {
      return <div className="text-center py-8">Loading profile...</div>;
    }

    const getDisplayEmail = () => {
      // Get email from Supabase auth user
      return supabase.auth.getUser().then(({ data }) => data.user?.email || "Not available");
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <div className="flex gap-2">
            {editMode ? (
              <>
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  size="sm"
                  disabled={updating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  size="sm"
                  disabled={updating}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {updating ? "Saving..." : "Save"}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setEditMode(true)}
                variant="outline"
                size="sm"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.first_name}
              onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
              disabled={!editMode}
              className="mt-1"
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.last_name}
              onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
              disabled={!editMode}
              className="mt-1"
              placeholder="Enter your last name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              defaultValue=""
              disabled
              className="mt-1 bg-gray-50"
              placeholder="Loading email..."
            />
            <script dangerouslySetInnerHTML={{
              __html: `
                supabase.auth.getUser().then(({data}) => {
                  const emailInput = document.getElementById('email');
                  if (emailInput && data.user?.email) {
                    emailInput.value = data.user.email;
                  }
                });
              `
            }} />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone_number}
              onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
              disabled={!editMode}
              className="mt-1"
              placeholder="Enter your phone number"
            />
          </div>
          <div>
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
              disabled={!editMode}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="nationalId">National ID</Label>
            <Input
              id="nationalId"
              value={formData.national_id}
              onChange={(e) => setFormData(prev => ({ ...prev, national_id: e.target.value }))}
              disabled={!editMode}
              className="mt-1"
              placeholder="Enter your national ID"
            />
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Account Status</h3>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium">Account Verification</p>
                <p className="text-sm text-muted-foreground">
                  {profile?.account_status === 'active' ? 'Verified' : 'Pending Verification'}
                </p>
              </div>
            </div>
            <Badge 
              variant="secondary" 
              className={profile?.account_status === 'active' ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
            >
              {profile?.account_status === 'active' ? (
                <>
                  <Check className="w-3 h-3 mr-1" />
                  Verified
                </>
              ) : (
                "Pending"
              )}
            </Badge>
          </div>
        </div>

        {/* Sign Out Section */}
        <Separator />
        <div>
          <h3 className="text-lg font-semibold mb-4 text-red-500">Account Actions</h3>
          <Button 
            onClick={handleSignOut}
            disabled={signingOut}
            variant="destructive"
            className="w-full flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            {signingOut ? "Signing Out..." : "Sign Out"}
          </Button>
        </div>
      </div>
    );
  };

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
            <Switch checked={profile?.biometric_enabled || false} />
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
                <p className="font-medium">Current Device</p>
                <p className="text-sm text-muted-foreground">Active session • Location unavailable</p>
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

  const getSectionTitle = () => {
    switch(activeTab) {
      case "personal": return "Personal Information";
      case "banking": return "Banking & Payments";
      case "trading": return "Trading Preferences";
      case "security": return "Security & Privacy";
      case "notifications": return "Notifications & Alerts";
      case "ai": return "AI Assistant";
      default: return "Personal Information";
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
                <span className="text-off-white/60 text-sm">Theme</span>
                <button
                  onClick={toggleTheme}
                  className={`transition duration-200 px-3 py-1 rounded text-sm border border-secondary 
                    ${theme === 'dark' ? "bg-secondary text-primary" : "bg-white/10 text-secondary" }
                  `}
                >
                  {theme === 'dark' ? "Dark" : "Light"}
                </button>
              </div>
            </div>
          </div>

          {/* Section Title */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-secondary mb-2">
              {getSectionTitle()}
            </h3>
            <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded"></div>
          </div>

          <div className="glass-card">
            <div className="min-h-[500px] p-6">
              {renderTabContent()}
            </div>
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
        
        {/* Floating Joystick Menu */}
        <FloatingJoystick activeTab={activeTab} onTabChange={setActiveTab} />
        
        <ChatFAB />
      </main>
      <BottomNav />
    </div>
  );
};

export default Settings;
