import { WifiOff } from 'lucide-react';
import { useOnlineSync } from '@/hooks/useOnlineSync';

export const OfflineIndicator = () => {
  const { isOnline } = useOnlineSync();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-destructive text-destructive-foreground px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
      <WifiOff className="h-4 w-4" />
      <span className="text-sm font-medium">You're offline</span>
    </div>
  );
};
