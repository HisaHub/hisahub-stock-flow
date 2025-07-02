import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { email, password } = loginForm;

    if (!email || !password) {
      toast.error("Please fill in both email and password.");
      setLoading(false);
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Login successful!");
        onLogin();
      }
    } catch (error) {
      toast.error("An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, password, confirmPassword } = signupForm;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: name,
          }
        }
      });

      if (error) {
        if (error.message === "User already registered") {
          toast.error("An account with this email already exists. Please try logging in instead.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Account created successfully! Please check your email for verification.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const demoEmail = `demo_${Date.now()}@hisahub.demo`;
      const demoPassword = "demo123456";
      
      const { error: signUpError } = await supabase.auth.signUp({
        email: demoEmail,
        password: demoPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: "Demo User",
          }
        }
      });

      if (signUpError) {
        toast.error("Failed to create demo account");
        setLoading(false);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });

      if (signInError) {
        toast.error("Failed to sign in to demo account");
      } else {
        toast.success("Demo account activated! You now have KES 10,000 to practice trading.");
        onLogin();
      }
    } catch (error) {
      toast.error("An error occurred while creating demo account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center">
          <div className="rounded-lg border-4 border-secondary p-3 mb-4 flex justify-center items-center mx-auto w-fit">
            <span className="font-extrabold text-secondary text-4xl" style={{ fontFamily: "'Poppins',sans-serif" }}>H</span>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Welcome to HisaHub</CardTitle>
          <CardDescription className="text-muted-foreground">
            Your gateway to the Nairobi Securities Exchange
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted">
              <TabsTrigger value="login" className="text-foreground">Login</TabsTrigger>
              <TabsTrigger value="signup" className="text-foreground">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="bg-background border-border text-foreground"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="bg-background border-border text-foreground"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                    className="bg-background border-border text-foreground"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-foreground">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    className="bg-background border-border text-foreground"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-foreground">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    className="bg-background border-border text-foreground"
                    placeholder="Create a password"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-foreground">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                    className="bg-background border-border text-foreground"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 pt-6 border-t border-border">
            <Button 
              onClick={handleDemoLogin} 
              variant="outline" 
              className="w-full border-border text-foreground hover:bg-accent hover:text-accent-foreground"
              disabled={loading}
            >
              {loading ? "Creating Demo Account..." : "Login as Demo User"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
