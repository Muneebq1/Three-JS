import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

import { register } from '../services';
import type { IRegisterRequest } from '../types';

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation<null, Error, IRegisterRequest>({
    mutationFn: register,
    onSuccess: () => {
      navigate(ROUTES.VERIFY_OTP);
    },
  });
};
