import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { ENDPOINTS } from '@/api/endpoints';

export const useNotificationSSE = () => {
  const queryClient = useQueryClient();
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const baseURL = import.meta.env['VITE_BACKEND_URL'];
    const userId = import.meta.env['VITE_USER_ID'];

    // Don't establish connection if user is not authenticated
    if (!userId) {
      return;
    }

    const url = `${baseURL}${ENDPOINTS.NOTIFICATION_SSE}/${userId}`;

    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Connection established
        if (data.eventType === 'connection') {
          console.log('Connection established');
          return;
        }

        // If it's a new unread notification, invalidate the query to refetch
        queryClient.invalidateQueries({ queryKey: ['all-notifications'] });
      } catch (error) {
        console.error('Error parsing notification data:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      // Optionally, you can add retry logic here
    };

    // Cleanup function
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [queryClient]);
};
