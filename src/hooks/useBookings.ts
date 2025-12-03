import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Booking {
  id: string;
  room_id: string;
  guest_id: string | null;
  user_id: string | null;
  check_in: string;
  check_out: string;
  nights: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  payment_status: 'pending' | 'confirmed' | 'refunded';
  access_code: string;
  created_at: string;
}

export interface CreateBookingData {
  room_id: string;
  guest_id?: string;
  user_id?: string;
  check_in: string;
  check_out: string;
  nights: number;
  total_amount: number;
  access_code: string;
}

export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Booking[];
    },
  });
};

export const useRoomBookings = (roomId: string) => {
  return useQuery({
    queryKey: ['bookings', 'room', roomId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('room_id', roomId)
        .in('status', ['pending', 'confirmed', 'checked_in'])
        .gte('check_out', new Date().toISOString());
      
      if (error) throw error;
      return data as Booking[];
    },
    enabled: !!roomId,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (booking: CreateBookingData) => {
      const { data, error } = await supabase
        .from('bookings')
        .insert(booking)
        .select()
        .single();
      
      if (error) throw error;
      return data as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...booking }: Partial<Booking> & { id: string }) => {
      const { data, error } = await supabase
        .from('bookings')
        .update(booking)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};
