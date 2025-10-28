import { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, ShieldOff } from 'lucide-react';
import { __ } from '@wordpress/i18n';

export function SystemStatus() {
  const [status, setStatus] = useState<'online' | 'offline' | 'warning'>(
    'online',
  );
  const [apiResponseTime, setApiResponseTime] = useState<number | null>(null);

  // Simulate live status check
  useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.random();
      // if (random < 0.7) setStatus("online");
      // else if (random < 0.9) setStatus("warning");
      // else setStatus("offline");
      setStatus('online');
      setApiResponseTime(Math.floor(Math.random() * 300)); // ms
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const statusConfig = {
    online: {
      label: __('Online', 'storm-clean-admin'),
      bg: 'bg-green-200',
      text: 'text-green-800',
      border: 'border-green-300',
      icon: <ShieldCheck className="w-4 h-4 text-green-600" />,
    },
    warning: {
      label: __('Degraded', 'storm-clean-admin'),
      bg: 'bg-yellow-200',
      text: 'text-yellow-800',
      border: 'border-yellow-300',
      icon: <ShieldAlert className="w-4 h-4 text-yellow-600" />,
    },
    offline: {
      label: __('Offline', 'storm-clean-admin'),
      bg: 'bg-red-200',
      text: 'text-red-800',
      border: 'border-red-300',
      icon: <ShieldOff className="w-4 h-4 text-red-600" />,
    },
  };

  return (
    <div className="flex">
      <span
        className={`
          flex items-center gap-1 p-2 rounded-md text-xs font-medium
          ${
            status === 'online'
              ? 'border-green-300 border-1 bg-green-200 text-green-800 dark:border-green-800 dark:bg-green-900 dark:text-green-200'
              : ''
          }
          ${
            status === 'warning'
              ? 'border-yellow-300 border-1 bg-yellow-200 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : ''
          }
          ${
            status === 'offline'
              ? 'border-red-300 border-1 bg-red-200 text-red-800 dark:border-red-800 dark:bg-red-900 dark:text-red-200'
              : ''
          }
          transition-colors duration-200
        `}
      >
        {statusConfig[status].icon}
        {statusConfig[status].label}
        {apiResponseTime !== null && (
          <span className="text-muted-foreground">({apiResponseTime}ms)</span>
        )}
      </span>
    </div>
  );
}
