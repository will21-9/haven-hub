import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockRooms, mockAccessLogs, generateAccessCode } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Shield, Key, Clock, AlertTriangle, Check, Unlock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TemporaryAccess {
  roomId: string;
  reason: string;
  duration: number;
  code: string;
  expiresAt: Date;
}

const AccessControl = () => {
  const [selectedRoom, setSelectedRoom] = useState('');
  const [accessReason, setAccessReason] = useState('');
  const [accessDuration, setAccessDuration] = useState('30');
  const [temporaryAccesses, setTemporaryAccesses] = useState<TemporaryAccess[]>([]);

  const handleGrantAccess = () => {
    if (!selectedRoom || !accessReason) {
      toast({
        title: 'Missing Information',
        description: 'Please select a room and provide a reason.',
        variant: 'destructive',
      });
      return;
    }

    const code = generateAccessCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + parseInt(accessDuration));

    const newAccess: TemporaryAccess = {
      roomId: selectedRoom,
      reason: accessReason,
      duration: parseInt(accessDuration),
      code,
      expiresAt,
    };

    setTemporaryAccesses([newAccess, ...temporaryAccesses]);
    setSelectedRoom('');
    setAccessReason('');

    toast({
      title: 'Access Granted',
      description: `Temporary access code ${code} generated for ${accessDuration} minutes.`,
    });
  };

  const revokeAccess = (code: string) => {
    setTemporaryAccesses(temporaryAccesses.filter((a) => a.code !== code));
    toast({
      title: 'Access Revoked',
      description: 'The temporary access has been revoked.',
    });
  };

  return (
    <DashboardLayout
      title="Access Control"
      subtitle="Grant temporary room access without payment"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Grant Access Form */}
        <Card variant="dashboard">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Unlock className="h-5 w-5 text-primary" />
              Grant Temporary Access
            </CardTitle>
            <CardDescription>
              Allow room access for cleaning, maintenance, or other activities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Select Room</Label>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a room" />
                </SelectTrigger>
                <SelectContent>
                  {mockRooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name} - Floor {room.floor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Reason for Access</Label>
              <Select value={accessReason} onValueChange={setAccessReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cleaning">Room Cleaning</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Access Duration (minutes)</Label>
              <Select value={accessDuration} onValueChange={setAccessDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="240">4 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleGrantAccess}>
              <Key className="mr-2 h-4 w-4" />
              Generate Access Code
            </Button>
          </CardContent>
        </Card>

        {/* Active Temporary Accesses */}
        <Card variant="dashboard">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Active Temporary Accesses
            </CardTitle>
            <CardDescription>
              Currently active temporary access codes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {temporaryAccesses.length > 0 ? (
              <div className="space-y-3">
                {temporaryAccesses.map((access, index) => {
                  const room = mockRooms.find((r) => r.id === access.roomId);
                  const isExpired = new Date() > access.expiresAt;
                  return (
                    <motion.div
                      key={access.code}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`rounded-lg border p-4 ${
                        isExpired ? 'border-muted bg-muted/50' : 'border-border'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{room?.name}</p>
                          <p className="text-sm capitalize text-muted-foreground">
                            {access.reason}
                          </p>
                          <div className="mt-2 flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>
                              Expires: {access.expiresAt.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <Key className="h-4 w-4 text-primary" />
                            <span className="font-mono text-lg font-bold">
                              {access.code}
                            </span>
                          </div>
                          <Badge variant={isExpired ? 'outline' : 'success'}>
                            {isExpired ? 'Expired' : 'Active'}
                          </Badge>
                        </div>
                      </div>
                      {!isExpired && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="mt-3"
                          onClick={() => revokeAccess(access.code)}
                        >
                          Revoke Access
                        </Button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <Shield className="mx-auto mb-3 h-12 w-12 opacity-50" />
                <p>No active temporary accesses</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Access Logs */}
        <Card variant="dashboard" className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Access Logs
            </CardTitle>
            <CardDescription>
              Track all room entries and exits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAccessLogs.map((log, index) => {
                const room = mockRooms.find((r) => r.id === log.roomId);
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between rounded-lg border p-3 ${
                      log.action === 'forced_entry'
                        ? 'border-destructive/50 bg-destructive/5'
                        : 'border-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          log.action === 'entry'
                            ? 'bg-success/10 text-success'
                            : log.action === 'exit'
                            ? 'bg-info/10 text-info'
                            : log.action === 'forced_entry'
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {log.action === 'entry' && <Check className="h-5 w-5" />}
                        {log.action === 'exit' && <Check className="h-5 w-5" />}
                        {log.action === 'forced_entry' && (
                          <AlertTriangle className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {room?.name} - {log.action.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Method: {log.method}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {log.timestamp.toLocaleString()}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AccessControl;
