import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

import { login } from '../services';
import { useAuthStore } from '../store';
import type { ILoginRequest, ILoginResponse } from '../types';

export const useLogin = () => {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();

  return useMutation<ILoginResponse | null, Error, ILoginRequest>({
    mutationFn: login,
    onSuccess: (data) => {
      if (data?.token && data?.user) {
        setToken(data.token);
        setUser(data.user);
        navigate(ROUTES.DASHBOARD);
      }
    },
  });
};
