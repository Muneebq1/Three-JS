import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

import { verifyOtp } from '../services';
import type { IVerifyOtpRequest } from '../types';

export const useVerifyOtp = () => {
  const navigate = useNavigate();

  return useMutation<null, Error, IVerifyOtpRequest>({
    mutationFn: verifyOtp,
    onSuccess: () => {
      navigate(ROUTES.LOGIN);
    },
  });
};
