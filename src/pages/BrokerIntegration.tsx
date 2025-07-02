import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Plus, Lightbulb, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import HisaAIButton from "../components/HisaAIButton";

const brokers = [
  {
    id: "genghis",
    name: "Genghis Capital",
    logo: "/placeholder.svg",
    license: "CMA/S/001",
    fee: "0.25%",
    hasApi: true
  },
  {
    id: "abc",
    name: "ABC Capital",
    logo: "/placeholder.svg",
    license: "CMA/S/002",
    fee: "0.30%",
    hasApi: false
  },
  {
    id: "sterling",
    name: "Sterling Capital",
    logo: "/placeholder.svg",
    license: "CMA/S/003",
    fee: "0.28%",
    hasApi: true
  },
  {
    id: "dyer",
    name: "Dyer & Blair",
    logo: "/placeholder.svg",
    license: "CMA/S/004",
    fee: "0.35%",
    hasApi: false
  }
];

const BrokerIntegration: React.FC = () => {
  const navigate = useNavigate();
  const [selectedBroker, setSelectedBroker] = useState<string>("");
  const [hasAccount, setHasAccount] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [linkedBrokers, setLinkedBrokers] = useState<string[]>([]);

  // Login form state
  const [loginData, setLoginData] = useState({
    cdsNumber: "",
    password: "",
    otp: ""
  });

  // KYC form state
  const [kycData, setKycData] = useState({
    fullName: "",
    idNumber: "",
    kraPin: "",
    phoneNumber: "",
    email: "",
    bankAccount: ""
  });

  const selectedBrokerData = brokers.find(b => b.id === selectedBroker);

  const handleBrokerLogin = async () => {
    if (!selectedBroker || !loginData.cdsNumber) {
      toast.error("Please select a broker and enter your CDS number");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLinkedBrokers(prev => [...prev, selectedBroker]);
      toast.success(`Successfully linked ${selectedBrokerData?.name}`);
      setIsLoading(false);
      setSelectedBroker("");
      setHasAccount(null);
      setLoginData({ cdsNumber: "", password: "", otp: "" });
    }, 2000);
  };

  const handleKycSubmit = async () => {
    if (!selectedBroker || !kycData.fullName || !kycData.idNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    // Simulate KYC submission and account creation
    setTimeout(() => {
      setLinkedBrokers(prev => [...prev, selectedBroker]);
      toast.success(`Account created and linked with ${selectedBrokerData?.name}`);
      setIsLoading(false);
      setSelectedBroker("");
      setHasAccount(null);
      setKycData({
        fullName: "",
        idNumber: "",
        kraPin: "",
        phoneNumber: "",
        email: "",
        bankAccount: ""
      });
    }, 3000);
  };

  const handleDemoAccount = async () => {
    setIsLoading(true);
    
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast.error("Please log in to activate demo mode");
        setIsLoading(false);
        return;
      }

      // Create demo portfolio through the portfolio management function
      const { data, error } = await supabase.functions.invoke('portfolio-management', {
        body: {
          action: 'create_portfolio',
          user_id: user.id
        }
      });

      if (error) {
        console.error('Demo portfolio creation error:', error);
        toast.error("Failed to create demo portfolio");
      } else {
        toast.success("Demo account activated! You now have KES 10,000 to practice trading.");
        navigate("/trade");
      }
    } catch (error) {
      console.error('Error activating demo account:', error);
      toast.error("An error occurred while activating demo account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary font-sans">
      <HisaAIButton />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/trade")}
            className="text-off-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-off-white">Broker Integration</h1>
            <p className="text-off-white/60">Connect your trading accounts securely</p>
          </div>
        </div>

        {/* Linked Brokers */}
        {linkedBrokers.length > 0 && (
          <Card className="mb-6 bg-white/10 border-secondary/20">
            <CardHeader>
              <CardTitle className="text-off-white">Linked Brokers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {linkedBrokers.map(brokerId => {
                  const broker = brokers.find(b => b.id === brokerId);
                  return (
                    <div key={brokerId} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img src={broker?.logo} alt={broker?.name} className="w-8 h-8 rounded" />
                        <div>
                          <span className="text-off-white font-medium">{broker?.name}</span>
                          <Badge variant="secondary" className="ml-2 text-xs">Connected</Badge>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        <Shield className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Integration Flow */}
        <Card className="bg-white/10 border-secondary/20">
          <CardHeader>
            <CardTitle className="text-off-white flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Broker Selection
            </CardTitle>
            <CardDescription className="text-off-white/60">
              Choose a CMA-regulated broker to link your trading account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Broker Selection */}
            <div className="space-y-2">
              <Label className="text-off-white">Select Broker</Label>
              <Select value={selectedBroker} onValueChange={setSelectedBroker}>
                <SelectTrigger className="bg-white/10 border-secondary/20 text-off-white">
                  <SelectValue placeholder="Choose your broker" />
                </SelectTrigger>
                <SelectContent className="bg-primary border-secondary/20">
                  {brokers.map((broker) => (
                    <SelectItem key={broker.id} value={broker.id} className="text-off-white focus:bg-white/10">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <img src={broker.logo} alt={broker.name} className="w-6 h-6 rounded" />
                          <div>
                            <span className="font-medium">{broker.name}</span>
                            <div className="text-xs text-off-white/60">
                              License: {broker.license} • Fee: {broker.fee}
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          CMA Regulated ✅
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Account Type Selection */}
            {selectedBroker && (
              <div className="space-y-4 pt-4 border-t border-white/10">
                <Label className="text-off-white">Account Status</Label>
                <div className="grid gap-3">
                  <Card 
                    className={`cursor-pointer transition-all border-2 ${
                      hasAccount === true 
                        ? 'border-secondary bg-secondary/10' 
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                    onClick={() => setHasAccount(true)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          checked={hasAccount === true}
                          onChange={() => setHasAccount(true)}
                          className="text-secondary"
                        />
                        <div>
                          <h3 className="text-off-white font-medium">I already have a CDS & Broker Account</h3>
                          <p className="text-off-white/60 text-sm">Login with your existing credentials</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer transition-all border-2 ${
                      hasAccount === false 
                        ? 'border-secondary bg-secondary/10' 
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                    onClick={() => setHasAccount(false)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          checked={hasAccount === false}
                          onChange={() => setHasAccount(false)}
                          className="text-secondary"
                        />
                        <div>
                          <h3 className="text-off-white font-medium">I'm new - Create CDS & Broker Account</h3>
                          <p className="text-off-white/60 text-sm">Complete KYC process to open new accounts</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Login or KYC Forms */}
            {hasAccount !== null && selectedBroker && (
              <div className="pt-4 border-t border-white/10">
                {hasAccount ? (
                  // Login Form
                  <div className="space-y-4">
                    <h3 className="text-off-white font-medium">Login to {selectedBrokerData?.name}</h3>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label className="text-off-white">CDS Number</Label>
                        <Input
                          type="text"
                          placeholder="Enter your CDS number"
                          value={loginData.cdsNumber}
                          onChange={(e) => setLoginData(prev => ({ ...prev, cdsNumber: e.target.value }))}
                          className="bg-white/10 border-secondary/20 text-off-white placeholder:text-off-white/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-off-white">Password</Label>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          value={loginData.password}
                          onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                          className="bg-white/10 border-secondary/20 text-off-white placeholder:text-off-white/50"
                        />
                      </div>
                      {selectedBrokerData?.hasApi && (
                        <div className="space-y-2">
                          <Label className="text-off-white">OTP (if required)</Label>
                          <Input
                            type="text"
                            placeholder="Enter OTP"
                            value={loginData.otp}
                            onChange={(e) => setLoginData(prev => ({ ...prev, otp: e.target.value }))}
                            className="bg-white/10 border-secondary/20 text-off-white placeholder:text-off-white/50"
                          />
                        </div>
                      )}
                      <Button 
                        onClick={handleBrokerLogin}
                        disabled={isLoading}
                        className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold"
                      >
                        {isLoading ? "Connecting..." : "Connect Account"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  // KYC Form
                  <div className="space-y-4">
                    <h3 className="text-off-white font-medium">KYC Information for {selectedBrokerData?.name}</h3>
                    <div className="grid gap-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-off-white">Full Name *</Label>
                          <Input
                            type="text"
                            placeholder="As per ID"
                            value={kycData.fullName}
                            onChange={(e) => setKycData(prev => ({ ...prev, fullName: e.target.value }))}
                            className="bg-white/10 border-secondary/20 text-off-white placeholder:text-off-white/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-off-white">ID Number *</Label>
                          <Input
                            type="text"
                            placeholder="National ID"
                            value={kycData.idNumber}
                            onChange={(e) => setKycData(prev => ({ ...prev, idNumber: e.target.value }))}
                            className="bg-white/10 border-secondary/20 text-off-white placeholder:text-off-white/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-off-white">KRA PIN</Label>
                          <Input
                            type="text"
                            placeholder="Tax PIN"
                            value={kycData.kraPin}
                            onChange={(e) => setKycData(prev => ({ ...prev, kraPin: e.target.value }))}
                            className="bg-white/10 border-secondary/20 text-off-white placeholder:text-off-white/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-off-white">Phone Number</Label>
                          <Input
                            type="tel"
                            placeholder="+254..."
                            value={kycData.phoneNumber}
                            onChange={(e) => setKycData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                            className="bg-white/10 border-secondary/20 text-off-white placeholder:text-off-white/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-off-white">Email</Label>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            value={kycData.email}
                            onChange={(e) => setKycData(prev => ({ ...prev, email: e.target.value }))}
                            className="bg-white/10 border-secondary/20 text-off-white placeholder:text-off-white/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-off-white">Bank Account</Label>
                          <Input
                            type="text"
                            placeholder="Account number"
                            value={kycData.bankAccount}
                            onChange={(e) => setKycData(prev => ({ ...prev, bankAccount: e.target.value }))}
                            className="bg-white/10 border-secondary/20 text-off-white placeholder:text-off-white/50"
                          />
                        </div>
                      </div>
                      <Button 
                        onClick={handleKycSubmit}
                        disabled={isLoading}
                        className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold"
                      >
                        {isLoading ? "Creating Account..." : "Submit KYC & Create Account"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedBroker("");
              setHasAccount(null);
            }}
            className="flex items-center gap-2 bg-white/10 border-secondary/20 text-off-white hover:bg-white/20"
          >
            <Plus className="w-4 h-4" />
            Link Another Broker
          </Button>
          <Button
            variant="outline"
            onClick={handleDemoAccount}
            disabled={isLoading}
            className="flex items-center gap-2 bg-white/10 border-secondary/20 text-off-white hover:bg-white/20"
          >
            <Lightbulb className="w-4 h-4" />
            {isLoading ? "Activating Demo..." : "Use Demo Account"}
          </Button>
        </div>

        {/* Compliance Footer */}
        <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center justify-center gap-2 text-off-white/60 text-sm">
            <Lock className="w-4 h-4" />
            <span>🔐 Secure | 📃 CMA/CDSC Compliant</span>
          </div>
          <p className="text-center text-xs text-off-white/40 mt-2">
            All data is encrypted and stored securely. HisaHub is compliant with CMA regulations.
          </p>
        </div>
      </main>
    </div>
  );
};

export default BrokerIntegration;
