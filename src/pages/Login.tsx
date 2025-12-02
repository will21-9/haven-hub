import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { motion } from 'framer-motion';
import { Building2, User, Shield, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('guest');
  const [isLoading, setIsLoading] = useState(false);

  const roles: { role: UserRole; label: string; icon: typeof User; description: string }[] = [
    {
      role: 'guest',
      label: 'Guest',
      icon: User,
      description: 'Book rooms and manage your stays',
    },
    {
      role: 'receptionist',
      label: 'Receptionist',
      icon: Users,
      description: 'Manage bookings and check-ins',
    },
    {
      role: 'owner',
      label: 'Owner',
      icon: Shield,
      description: 'Full access to all features',
    },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password, selectedRole);
      if (success) {
        toast({
          title: 'Welcome back!',
          description: `Logged in as ${selectedRole}`,
        });
        switch (selectedRole) {
          case 'owner':
            navigate('/owner');
            break;
          case 'receptionist':
            navigate('/receptionist');
            break;
          default:
            navigate('/rooms');
        }
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold">Welcome Back</h1>
            <p className="mt-2 text-muted-foreground">
              Sign in to access your dashboard
            </p>
          </div>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Choose your role and enter your credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Role Selection */}
                <div className="space-y-3">
                  <Label>Select Role</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {roles.map(({ role, label, icon: Icon }) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={`flex flex-col items-center rounded-lg border-2 p-3 transition-all ${
                          selectedRole === role
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Icon
                          className={`h-6 w-6 ${
                            selectedRole === role
                              ? 'text-primary'
                              : 'text-muted-foreground'
                          }`}
                        />
                        <span
                          className={`mt-1 text-sm font-medium ${
                            selectedRole === role
                              ? 'text-primary'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    {roles.find((r) => r.role === selectedRole)?.description}
                  </p>
                </div>

                {/* Credentials */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Demo credentials: Use any email/password
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Login;
