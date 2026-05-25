import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
export function HomePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: 'admin',
    password: 'password123'
  });
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock authentication delay
    setTimeout(() => {
      const { username } = formData;
      if (username === 'admin') {
        localStorage.setItem('user_role', 'admin');
        toast.success("Welcome back, Administrator");
        navigate('/admin');
      } else {
        localStorage.setItem('user_role', 'cashier');
        toast.success("Terminal ready for sales");
        navigate('/pos');
      }
      setIsLoading(false);
    }, 800);
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-emerald-600" />
      <ThemeToggle />
      <div className="max-w-md w-full z-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex bg-emerald-100 p-3 rounded-2xl dark:bg-emerald-900/30 mb-4 animate-bounce">
            <Leaf className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            TRIBE OF JUDAH
          </h1>
          <p className="text-emerald-600 font-medium tracking-widest text-xs uppercase">
            Herbal Center Management
          </p>
        </div>
        <Card className="border-slate-200 dark:border-slate-800 shadow-xl shadow-emerald-900/5">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold">Secure Access</CardTitle>
            <CardDescription>Enter your credentials to access the system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    id="username"
                    placeholder="Enter your username" 
                    className="pl-10"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••" 
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 font-bold"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Sign In to Portal
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-center text-slate-400 text-xs">
          Authorized personnel only. All access is logged and monitored.<br />
          v2.4.0 • © {new Date().getFullYear()} Tribe of Judah
        </p>
      </div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}