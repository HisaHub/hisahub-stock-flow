
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
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
      toast({ title: "Error", description: "Please fill in both email and password.", variant: "destructive" });
      setLoading(false);
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      toast({ title: "Error", description: "Please enter a valid email address.", variant: "destructive" });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Login successful!" });
        onLogin();
        const redirectPath = localStorage.getItem('authRedirectPath');
        localStorage.removeItem('authRedirectPath');
        navigate(redirectPath || '/trade');
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred during login.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, password, confirmPassword } = signupForm;

    if (!name || !email || !password || !confirmPassword) {
      toast({ title: "Error", description: "Please fill in all fields.", variant: "destructive" });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters long.", variant: "destructive" });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (error) {
        if (error.message === "User already registered") {
          toast({ title: "Error", description: "An account with this email already exists. Please try logging in instead.", variant: "destructive" });
        } else {
          toast({ title: "Error", description: error.message, variant: "destructive" });
        }
      } else {
        if (data.user && !data.user.email_confirmed_at) {
          toast({ title: "Success", description: "Account created successfully! You are now logged in." });
          onLogin();
          const redirectPath = localStorage.getItem('authRedirectPath');
          localStorage.removeItem('authRedirectPath');
          navigate(redirectPath || '/trade');
        } else if (data.user) {
          toast({ title: "Success", description: "Account created successfully! You are now logged in." });
          onLogin();
          const redirectPath = localStorage.getItem('authRedirectPath');
          localStorage.removeItem('authRedirectPath');
          navigate(redirectPath || '/trade');
        } else {
          toast({ title: "Success", description: "Account created successfully! Please check your email for verification." });
        }
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred during signup.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <Card className="w-full max-w-md bg-white/10 border-secondary/20">
        <CardHeader className="text-center">
          <div className="rounded-lg border-4 border-secondary p-3 mb-4 flex justify-center items-center mx-auto w-fit">
            <span className="font-extrabold text-secondary text-4xl" style={{ fontFamily: "'Poppins',sans-serif" }}>H</span>
          </div>
          <CardTitle className="text-2xl font-bold text-off-white">Welcome to HisaHub</CardTitle>
          <CardDescription className="text-off-white/80">
            Your gateway to the Nairobi Securities Exchange
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/10">
              <TabsTrigger value="login" className="text-off-white">Login</TabsTrigger>
              <TabsTrigger value="signup" className="text-off-white">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-off-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="bg-white/10 border-secondary/20 text-off-white"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-off-white">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="bg-white/10 border-secondary/20 text-off-white"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-secondary text-primary hover:bg-secondary/90"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-off-white">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                    className="bg-white/10 border-secondary/20 text-off-white"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-off-white">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    className="bg-white/10 border-secondary/20 text-off-white"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-off-white">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    className="bg-white/10 border-secondary/20 text-off-white"
                    placeholder="Create a password"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-off-white">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                    className="bg-white/10 border-secondary/20 text-off-white"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-secondary text-primary hover:bg-secondary/90"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
