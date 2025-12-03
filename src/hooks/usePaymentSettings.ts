import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PaymentSettings {
  id: string;
  payment_account_number: string;
  payment_account_name: string;
  payment_provider: string;
}

export const usePaymentSettings = () => {
  return useQuery({
    queryKey: ['payment-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guest_house_settings')
        .select('*')
        .maybeSingle();
      
      if (error) throw error;
      return data as PaymentSettings | null;
    },
  });
};

export interface PaymentNotification {
  id: string;
  booking_id: string;
  guest_name: string;
  amount: number;
  phone_number: string;
  transaction_reference: string | null;
  is_confirmed: boolean;
  confirmed_by: string | null;
  confirmed_at: string | null;
  created_at: string;
}

export const usePaymentNotifications = () => {
  return useQuery({
    queryKey: ['payment-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_notifications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PaymentNotification[];
    },
  });
};

export const useCreatePaymentNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notification: Omit<PaymentNotification, 'id' | 'is_confirmed' | 'confirmed_by' | 'confirmed_at' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('payment_notifications')
        .insert(notification)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-notifications'] });
    },
  });
};

export const useConfirmPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ notificationId, bookingId, userId }: { notificationId: string; bookingId: string; userId: string }) => {
      // Update payment notification
      const { error: notifError } = await supabase
        .from('payment_notifications')
        .update({
          is_confirmed: true,
          confirmed_by: userId,
          confirmed_at: new Date().toISOString(),
        })
        .eq('id', notificationId);
      
      if (notifError) throw notifError;

      // Update booking status
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({
          payment_status: 'confirmed',
          status: 'confirmed',
        })
        .eq('id', bookingId);
      
      if (bookingError) throw bookingError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};
