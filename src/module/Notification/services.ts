import axiosInstance from '@/api/axiosInstance';
import { ENDPOINTS } from '@/api/endpoints';

import type { INotification } from './types';

const USER_ID = import.meta.env['VITE_USER_ID'];

export const fetchNotifications = async (): Promise<INotification[] | null> => {
  const response = await axiosInstance.get<{ data: INotification[] }>(
    `${ENDPOINTS.ALL_NOTIFICATIONS}/${USER_ID}`,
  );
  return response.data.data;
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  await axiosInstance.patch(`${ENDPOINTS.ALL_NOTIFICATIONS}/${notificationId}/read`);
};
