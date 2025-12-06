import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Users, UserPlus, Mail, Shield, Trash2, Loader2 } from 'lucide-react';
import { z } from 'zod';

// Validation schema
const staffSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  role: z.enum(['receptionist', 'owner']),
});

interface StaffMember {
  id: string;
  user_id: string;
  role: 'guest' | 'receptionist' | 'owner';
  profile?: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  };
}

const StaffManagement = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<'receptionist' | 'owner'>('receptionist');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch staff members (receptionists and owners)
  const { data: staffMembers, isLoading } = useQuery({
    queryKey: ['staff-members'],
    queryFn: async () => {
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('id, user_id, role')
        .in('role', ['receptionist', 'owner']);
      
      if (rolesError) throw rolesError;

      // Get profiles for these users
      const userIds = roles?.map(r => r.user_id) || [];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Combine the data
      return roles?.map(r => ({
        ...r,
        profile: profiles?.find(p => p.id === r.user_id),
      })) as StaffMember[];
    },
  });

  // Create staff member mutation
  const createStaffMutation = useMutation({
    mutationFn: async (data: z.infer<typeof staffSchema>) => {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // Update the role (the trigger creates 'guest' by default)
      const { error: roleError } = await supabase
        .from('user_roles')
        .update({ role: data.role })
        .eq('user_id', authData.user.id);

      if (roleError) throw roleError;

      return authData.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-members'] });
      toast({
        title: 'Staff Added',
        description: 'New staff member has been created successfully.',
      });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create staff member.',
        variant: 'destructive',
      });
    },
  });

  // Delete staff mutation
  const deleteStaffMutation = useMutation({
    mutationFn: async (userId: string) => {
      // Just remove the staff role (set to guest)
      const { error } = await supabase
        .from('user_roles')
        .update({ role: 'guest' })
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-members'] });
      toast({
        title: 'Staff Removed',
        description: 'Staff member role has been revoked.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove staff member.',
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setRole('receptionist');
    setErrors({});
  };

  const handleSubmit = () => {
    setErrors({});

    const result = staffSchema.safeParse({
      email,
      password,
      firstName,
      lastName,
      role,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    createStaffMutation.mutate(result.data);
  };

  const owners = staffMembers?.filter(s => s.role === 'owner') || [];
  const receptionists = staffMembers?.filter(s => s.role === 'receptionist') || [];

  return (
    <DashboardLayout
      title="Staff Management"
      subtitle="Manage receptionists and staff members"
    >
      <div className="space-y-6">
        {/* Add Staff Button */}
        <div className="flex justify-end">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Staff Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-destructive">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-destructive">{errors.lastName}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="staff@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-destructive">{errors.password}</p>
                  )}
                </div>
                <div>
                  <Label>Role</Label>
                  <Select value={role} onValueChange={(v) => setRole(v as 'receptionist' | 'owner')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receptionist">Receptionist</SelectItem>
                      <SelectItem value="owner">Owner/Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={createStaffMutation.isPending}
                  >
                    {createStaffMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Staff
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Staff Overview */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Owners/Managers */}
          <Card variant="dashboard">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Owners / Managers
              </CardTitle>
              <CardDescription>Users with full system access</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : owners.length > 0 ? (
                <div className="space-y-3">
                  {owners.map((staff, index) => (
                    <motion.div
                      key={staff.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <span className="text-sm font-medium text-primary">
                            {staff.profile?.first_name?.charAt(0) || 'O'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">
                            {staff.profile?.first_name} {staff.profile?.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {staff.profile?.email}
                          </p>
                        </div>
                      </div>
                      <Badge variant="default">Owner</Badge>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <Shield className="mx-auto mb-3 h-12 w-12 opacity-50" />
                  <p>No owners found</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Receptionists */}
          <Card variant="dashboard">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Receptionists
              </CardTitle>
              <CardDescription>Front desk staff members</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : receptionists.length > 0 ? (
                <div className="space-y-3">
                  {receptionists.map((staff, index) => (
                    <motion.div
                      key={staff.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                          <span className="text-sm font-medium">
                            {staff.profile?.first_name?.charAt(0) || 'R'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">
                            {staff.profile?.first_name} {staff.profile?.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {staff.profile?.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Receptionist</Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => deleteStaffMutation.mutate(staff.user_id)}
                          disabled={deleteStaffMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <Users className="mx-auto mb-3 h-12 w-12 opacity-50" />
                  <p>No receptionists found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Login Credentials Info */}
        <Card variant="dashboard">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Staff Login Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                Staff members can log in at <span className="font-mono text-foreground">/login</span> using their email and password.
                After logging in, they will be redirected to their respective dashboard based on their role.
              </p>
              <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li><strong>Receptionists</strong> - Access to room management, bookings, payments (view), and access control</li>
                <li><strong>Owners/Managers</strong> - Full access including revenue reports, staff management, and payment confirmation</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StaffManagement;
