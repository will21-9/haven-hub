import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockAlerts, mockRooms } from '@/data/mockData';
import { Alert } from '@/types';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Bell,
  Check,
  Clock,
  Shield,
  Sparkles,
  CreditCard,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

  const handleAcknowledge = (alertId: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
    toast({
      title: 'Alert Acknowledged',
      description: 'The alert has been marked as acknowledged.',
    });
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'security':
        return Shield;
      case 'checkout_due':
        return Clock;
      case 'payment_pending':
        return CreditCard;
      case 'cleaning_needed':
        return Sparkles;
      default:
        return Bell;
    }
  };

  const activeAlerts = alerts.filter((a) => !a.acknowledged);
  const acknowledgedAlerts = alerts.filter((a) => a.acknowledged);

  return (
    <DashboardLayout
      title="Alerts"
      subtitle="Monitor and respond to system alerts"
    >
      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {[
          { type: 'security', label: 'Security', count: alerts.filter((a) => a.type === 'security').length },
          { type: 'checkout_due', label: 'Checkout Due', count: alerts.filter((a) => a.type === 'checkout_due').length },
          { type: 'payment_pending', label: 'Pending Payment', count: alerts.filter((a) => a.type === 'payment_pending').length },
          { type: 'cleaning_needed', label: 'Cleaning', count: alerts.filter((a) => a.type === 'cleaning_needed').length },
        ].map((item) => {
          const Icon = getAlertIcon(item.type as Alert['type']);
          return (
            <Card key={item.type} variant="stat">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-2xl font-bold">{item.count}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active Alerts */}
      <Card variant="dashboard" className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Active Alerts ({activeAlerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeAlerts.length > 0 ? (
            <div className="space-y-3">
              {activeAlerts.map((alert, index) => {
                const room = mockRooms.find((r) => r.id === alert.roomId);
                const Icon = getAlertIcon(alert.type);
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between rounded-lg border p-4 ${
                      alert.severity === 'critical'
                        ? 'border-destructive/50 bg-destructive/5'
                        : alert.severity === 'high'
                        ? 'border-warning/50 bg-warning/5'
                        : 'border-border'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          alert.severity === 'critical'
                            ? 'bg-destructive/10 text-destructive'
                            : alert.severity === 'high'
                            ? 'bg-warning/10 text-warning'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-sm text-muted-foreground">
                          {room?.name} • {alert.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          alert.severity === 'critical'
                            ? 'destructive'
                            : alert.severity === 'high'
                            ? 'warning'
                            : 'outline'
                        }
                      >
                        {alert.severity}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAcknowledge(alert.id)}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Acknowledge
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Check className="mx-auto mb-3 h-12 w-12 text-success opacity-50" />
              <p className="text-muted-foreground">No active alerts</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Acknowledged Alerts */}
      {acknowledgedAlerts.length > 0 && (
        <Card variant="dashboard">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-muted-foreground">
              <Check className="h-5 w-5" />
              Acknowledged ({acknowledgedAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 opacity-60">
              {acknowledgedAlerts.map((alert) => {
                const room = mockRooms.find((r) => r.id === alert.roomId);
                const Icon = getAlertIcon(alert.type);
                return (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium line-through">{alert.message}</p>
                        <p className="text-sm text-muted-foreground">
                          {room?.name} • {alert.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">Acknowledged</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default Alerts;
