import { Bell } from 'lucide-react';
import { __ } from '@wordpress/i18n';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';

type Notification = {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
};

const notifications: Notification[] = [
  {
    id: 1,
    type: 'success',
    message: __('Operation completed successfully!', 'storm-clean-admin'),
  },
  {
    id: 2,
    type: 'error',
    message: __('An error occurred during processing', 'storm-clean-admin'),
  },
  {
    id: 3,
    type: 'warning',
    message: __('Warning: Check your settings', 'storm-clean-admin'),
  },
  {
    id: 4,
    type: 'info',
    message: __('Information: New update available', 'storm-clean-admin'),
  },
];

export function NotificationCenter() {
  const getNotificationStyle = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300';
      case 'error':
        return 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300';
      case 'info':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-white text-black hover:bg-gray-100';
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <button
          className="relative p-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label={__('Open notifications', 'storm-clean-admin')}
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="end"
        className="w-80 p-0 rounded-xl shadow-lg"
      >
        <div className="p-4 border-b text-sm font-semibold">
          {__('Notifications', 'storm-clean-admin')}
        </div>

        <div className="max-h-60 overflow-y-auto divide-y">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-center gap-2 px-4 py-3 text-sm cursor-pointer transition ${getNotificationStyle(
                notif.type,
              )}`}
            >
              <span>{getIcon(notif.type)}</span>
              <span>{notif.message}</span>
            </div>
          ))}
        </div>

        <div className="p-3 border-t text-xs text-center text-muted-foreground cursor-pointer hover:text-primary">
          {__('View all', 'storm-clean-admin')}
        </div>
      </PopoverContent>
    </Popover>
  );
}
