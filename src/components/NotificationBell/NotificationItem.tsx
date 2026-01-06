import { cn, formatDate } from '@/lib/utils';
import type { NotificationItemProps } from '@/module/Notification/types';

const NotificationItem = ({ notification, markAsRead }: NotificationItemProps) => {
  const handleMarkAsRead = async () => {
    if (!notification.isRead) {
      await markAsRead.mutateAsync(notification.id);
    }
  };

  return (
    <div
      className={cn(
        'cursor-pointer p-4 transition-colors hover:bg-blue-50 dark:hover:bg-gray-700',
        !notification.isRead && 'bg-blue-50 dark:bg-blue-900/20',
      )}
      onClick={handleMarkAsRead}
    >
      <div className='flex items-start justify-between gap-2'>
        <div className='min-w-0 flex-1'>
          <h4 className='text-sm font-medium text-gray-900 dark:text-gray-100'>
            {notification.title}
          </h4>
          <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>{notification.message}</p>
          <p className='mt-2 text-xs text-gray-500 dark:text-gray-500'>
            {formatDate(notification.createdAt)}
          </p>
        </div>
        <div className='flex items-center gap-1'>
          {!notification.isRead && <div className='h-2 w-2 shrink-0 rounded-full bg-blue-500' />}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
