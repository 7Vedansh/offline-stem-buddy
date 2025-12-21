import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionStrength, setConnectionStrength] = useState<'strong' | 'weak' | 'offline'>('offline');

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      checkConnectionStrength();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setConnectionStrength('offline');
    };

    const checkConnectionStrength = () => {
      if (!navigator.onLine) {
        setConnectionStrength('offline');
        return;
      }

      // Use Network Information API if available
      const connection = (navigator as any).connection;
      if (connection) {
        const effectiveType = connection.effectiveType;
        if (effectiveType === '4g' || effectiveType === '3g') {
          setConnectionStrength('strong');
        } else {
          setConnectionStrength('weak');
        }
      } else {
        // Fallback: assume strong if online
        setConnectionStrength('strong');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection on mount
    if (navigator.onLine) {
      checkConnectionStrength();
    }

    // Listen for connection changes
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', checkConnectionStrength);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', checkConnectionStrength);
      }
    };
  }, []);

  return { isOnline, connectionStrength };
}
