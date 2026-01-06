import { Bell } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { useAllNotifications } from '@/module/Notification/hook/useNotification';
import { useNotificationSSE } from '@/module/Notification/hook/useNotificationSSE';
import type { INotification } from '@/module/Notification/types';

import NotificationItem from './NotificationItem';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: notifications, isLoading, markAsRead } = useAllNotifications();
  useNotificationSSE();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='relative cursor-pointer rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800'
        aria-label='Notifications'
      >
        <Bell className='h-6 w-6 text-gray-700 dark:text-gray-300' />
        {unreadCount > 0 && (
          <span className='absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white'>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className='absolute right-0 z-50 mt-2 flex max-h-96 w-80 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg md:w-96 dark:border-gray-700 dark:bg-gray-800'>
          <div className='border-b border-gray-200 p-4 dark:border-gray-700'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
              Notifications
            </h3>
          </div>

          <div className='flex-1 overflow-y-auto'>
            {isLoading ? (
              <div className='p-4 text-center text-gray-500 dark:text-gray-400'>Loading...</div>
            ) : notifications && notifications.length > 0 ? (
              <div className='divide-y divide-gray-200 dark:divide-gray-700'>
                {notifications.map((notification: INotification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    markAsRead={markAsRead}
                  />
                ))}
              </div>
            ) : (
              <div className='p-4 text-center text-gray-500 dark:text-gray-400'>
                No notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
