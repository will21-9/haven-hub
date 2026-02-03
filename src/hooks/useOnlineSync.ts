import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useOnlineStatus } from './useOnlineStatus';
import { toast } from 'sonner';

export const useOnlineSync = () => {
  const isOnline = useOnlineStatus();
  const queryClient = useQueryClient();
  const wasOffline = useRef(false);

  useEffect(() => {
    if (!isOnline) {
      wasOffline.current = true;
    } else if (wasOffline.current && isOnline) {
      // Just came back online - sync all cached data
      wasOffline.current = false;
      
      toast.loading('Syncing data...', { id: 'sync-toast' });
      
      // Invalidate and refetch all queries
      queryClient.invalidateQueries().then(() => {
        toast.success('Data synced successfully!', { id: 'sync-toast' });
      }).catch(() => {
        toast.error('Failed to sync some data', { id: 'sync-toast' });
      });
    }
  }, [isOnline, queryClient]);

  return { isOnline, isSyncing: false };
};
