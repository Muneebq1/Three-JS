import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

import { forgotPassword } from '../services';
import type { IForgotPasswordRequest } from '../types';

export const useForgotPassword = () => {
  const navigate = useNavigate();

  return useMutation<null, Error, IForgotPasswordRequest>({
    mutationFn: forgotPassword,
    onSuccess: () => {
      navigate(ROUTES.RESET_PASSWORD);
    },
  });
};
