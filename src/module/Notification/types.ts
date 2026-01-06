import type { useAllNotifications } from './hook/useNotification';

export interface INotification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead?: boolean;
}

export interface NotificationItemProps {
  notification: INotification;
  markAsRead: ReturnType<typeof useAllNotifications>['markAsRead'];
}
