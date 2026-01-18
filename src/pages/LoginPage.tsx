import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Stethoscope, Users, User } from 'lucide-react';

const roleInfo: Record<UserRole, { icon: React.ElementType; label: string; email: string }> = {
  admin: { icon: Shield, label: 'Administrator', email: 'admin@mwn.health' },
  doctor: { icon: Stethoscope, label: 'Doctor', email: 'doctor@mwn.health' },
  staff: { icon: Users, label: 'Staff', email: 'staff@mwn.health' },
  patient: { icon: User, label: 'Patient', email: 'patient@example.com' }
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('staff');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email || roleInfo[selectedRole].email, password, selectedRole);
    setLoading(false);
    if (success) navigate('/dashboard');
  };

  const handleQuickLogin = async (role: UserRole) => {
    setLoading(true);
    const success = await login(roleInfo[role].email, 'demo', role);
    setLoading(false);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-8">
              <span className="text-3xl font-bold">M</span>
            </div>
            <h1 className="text-4xl font-display font-bold mb-4">
              MediCare Wellness Network
            </h1>
            <p className="text-lg text-white/80 max-w-md">
              Modern patient and appointment management system for wellness clinics across multiple branches.
            </p>
            <div className="mt-12 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-white/80" />
                <span>Multi-branch appointment scheduling</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-white/80" />
                <span>Secure patient health profiles</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-white/80" />
                <span>Wellness package and billing management</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8 text-center">
            <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">MediCare Wellness</h1>
          </div>

          <h2 className="text-2xl font-display font-semibold text-foreground mb-2">Welcome back</h2>
          <p className="text-muted-foreground mb-8">Sign in to access your dashboard</p>

          <Tabs defaultValue="quick" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="quick">Quick Login</TabsTrigger>
              <TabsTrigger value="manual">Manual Login</TabsTrigger>
            </TabsList>

            <TabsContent value="quick">
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(roleInfo) as UserRole[]).map((role) => {
                  const { icon: Icon, label } = roleInfo[role];
                  return (
                    <Button
                      key={role}
                      variant="outline"
                      className="h-auto py-4 flex flex-col gap-2"
                      onClick={() => handleQuickLogin(role)}
                      disabled={loading}
                    >
                      <Icon className="w-6 h-6 text-primary" />
                      <span className="text-sm font-medium">{label}</span>
                    </Button>
                  );
                })}
              </div>
              <p className="text-xs text-center text-muted-foreground mt-4">
                Click any role for instant demo access
              </p>
            </TabsContent>

            <TabsContent value="manual">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    {(Object.keys(roleInfo) as UserRole[]).map((role) => (
                      <Button
                        key={role}
                        type="button"
                        variant={selectedRole === role ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedRole(role)}
                      >
                        {roleInfo[role].label}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
