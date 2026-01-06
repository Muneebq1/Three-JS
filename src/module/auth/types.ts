import { z } from 'zod';

import {
  forgotPasswordFormSchema,
  loginFormSchema,
  registerFormSchema,
  resetPasswordFormSchema,
  verifyOtpFormSchema,
} from './schema';
import type { IUser } from './store';

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type RegisterFormValues = z.infer<typeof registerFormSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;
export type VerifyOtpFormValues = z.infer<typeof verifyOtpFormSchema>;

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  user: IUser;
}

export type IRegisterRequest = Omit<RegisterFormValues, 'confirmPassword'>;

export interface IForgotPasswordRequest {
  email: string;
}

export interface IResetPasswordRequest {
  password: string;
  token: string;
}

export interface IVerifyOtpRequest {
  otp: string;
  email: string;
}
