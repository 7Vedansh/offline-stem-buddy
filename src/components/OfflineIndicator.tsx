import { Wifi, WifiOff, Cloud, CloudOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { cn } from '@/lib/utils';

export function OfflineIndicator() {
  const { isOnline, connectionStrength } = useOnlineStatus();

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
        isOnline
          ? connectionStrength === 'strong'
            ? "bg-secondary-light text-secondary"
            : "bg-accent-light text-accent"
          : "bg-muted text-muted-foreground offline-pulse"
      )}
    >
      {isOnline ? (
        <>
          {connectionStrength === 'strong' ? (
            <Cloud className="w-4 h-4" />
          ) : (
            <Wifi className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">
            {connectionStrength === 'strong' ? 'Cloud AI' : 'Weak Signal'}
          </span>
        </>
      ) : (
        <>
          <CloudOff className="w-4 h-4" />
          <span>Offline Mode</span>
        </>
      )}
    </div>
  );
}

export function SyncIndicator({ pendingChanges }: { pendingChanges: boolean }) {
  const { isOnline } = useOnlineStatus();

  if (!pendingChanges) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
        isOnline
          ? "bg-secondary-light text-secondary"
          : "bg-accent-light text-accent"
      )}
    >
      {isOnline ? (
        <>
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
          <span>Syncing...</span>
        </>
      ) : (
        <>
          <div className="w-2 h-2 bg-accent rounded-full" />
          <span>Will sync when online</span>
        </>
      )}
    </div>
  );
}
