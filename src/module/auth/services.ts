import axiosInstance from '@/api/axiosInstance';
import { ENDPOINTS } from '@/api/endpoints';

import type {
  IForgotPasswordRequest,
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
  IResetPasswordRequest,
  IVerifyOtpRequest,
} from './types';

export const login = async (data: ILoginRequest): Promise<ILoginResponse | null> => {
  const response = await axiosInstance.post<{ data: ILoginResponse }>(ENDPOINTS.SIGN_IN, data);
  return response.data.data;
};

export const register = async (data: IRegisterRequest): Promise<null> => {
  await axiosInstance.post(ENDPOINTS.REGISTER, data);
  return null;
};

export const forgotPassword = async (data: IForgotPasswordRequest): Promise<null> => {
  await axiosInstance.post(ENDPOINTS.FORGOT_PASSWORD, data);
  return null;
};

export const resetPassword = async (data: IResetPasswordRequest): Promise<null> => {
  await axiosInstance.post(ENDPOINTS.RESET_PASSWORD, data);
  return null;
};

export const verifyOtp = async (data: IVerifyOtpRequest): Promise<null> => {
  await axiosInstance.post(ENDPOINTS.VERIFY_OTP, data);
  return null;
};
