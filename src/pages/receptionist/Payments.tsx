import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePaymentNotifications, useConfirmPayment } from '@/hooks/usePaymentSettings';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, Clock, Phone, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

const formatCurrency = (amount: number): string => {
  return `GH₵ ${amount.toLocaleString()}`;
};

const Payments = () => {
  const { user } = useAuth();
  const { data: notifications, isLoading } = usePaymentNotifications();
  const confirmPayment = useConfirmPayment();
  const queryClient = useQueryClient();

  // Real-time subscription for new payment notifications
  useEffect(() => {
    const channel = supabase
      .channel('payment-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_notifications',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['payment-notifications'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleConfirm = async (notificationId: string, bookingId: string) => {
    if (!user) return;

    try {
      await confirmPayment.mutateAsync({
        notificationId,
        bookingId,
        userId: user.id,
      });

      toast({
        title: 'Payment Confirmed',
        description: 'The booking has been confirmed and the guest can now access their room.',
      });
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast({
        title: 'Error',
        description: 'Failed to confirm payment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const pendingPayments = notifications?.filter((n) => !n.is_confirmed) ?? [];
  const confirmedPayments = notifications?.filter((n) => n.is_confirmed) ?? [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Payment Notifications</h1>
          <p className="text-muted-foreground">
            Confirm payments and grant room access to guests
          </p>
        </div>

        {/* Pending Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-warning" />
              Pending Payments ({pendingPayments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : pendingPayments.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                No pending payments
              </p>
            ) : (
              <div className="space-y-4">
                {pendingPayments.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex flex-col gap-4 rounded-lg border border-warning/50 bg-warning/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{notification.guest_name}</span>
                        <Badge variant="outline" className="border-warning text-warning">
                          Pending
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {notification.phone_number}
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="h-3 w-3" />
                          {formatCurrency(Number(notification.amount))}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Submitted: {format(new Date(notification.created_at), 'PPp')}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleConfirm(notification.id, notification.booking_id)}
                      disabled={confirmPayment.isPending}
                      className="shrink-0"
                    >
                      {confirmPayment.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      )}
                      Confirm Payment
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recently Confirmed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              Recently Confirmed ({confirmedPayments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {confirmedPayments.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                No confirmed payments yet
              </p>
            ) : (
              <div className="space-y-3">
                {confirmedPayments.slice(0, 10).map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between rounded-lg border bg-card p-3"
                  >
                    <div>
                      <span className="font-medium">{notification.guest_name}</span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        {formatCurrency(Number(notification.amount))}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="available">Confirmed</Badge>
                      <span className="text-xs text-muted-foreground">
                        {notification.confirmed_at && format(new Date(notification.confirmed_at), 'PPp')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Payments;
