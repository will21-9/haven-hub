import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string;
  id_number: string | null;
  nationality: string | null;
  created_at: string;
}

export interface CreateGuestData {
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  id_number?: string;
  nationality?: string;
}

export const useCreateGuest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (guest: CreateGuestData) => {
      const { data, error } = await supabase
        .from('guests')
        .insert(guest)
        .select()
        .single();
      
      if (error) throw error;
      return data as Guest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
    },
  });
};
