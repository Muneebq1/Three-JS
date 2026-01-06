import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchNotifications, markNotificationAsRead } from '../services';

export const useAllNotifications = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['all-notifications'],
    queryFn: fetchNotifications,
  });

  const markAsRead = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-notifications'] });
    },
  });

  return {
    ...query,
    markAsRead,
  };
};
