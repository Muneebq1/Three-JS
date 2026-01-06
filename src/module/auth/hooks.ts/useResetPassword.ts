import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

import { resetPassword } from '../services';
import type { IResetPasswordRequest } from '../types';

export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation<null, Error, IResetPasswordRequest>({
    mutationFn: resetPassword,
    onSuccess: () => {
      navigate(ROUTES.LOGIN);
    },
  });
};
