import { z } from 'zod';

// Login Form
export const loginFormSchema = z.object({
  email: z.string().nonempty('Email is required').email('Please enter a valid email address'),
  password: z
    .string()
    .nonempty('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export const loginDefaultValues = {
  email: '',
  password: '',
};

// Register Form
export const registerFormSchema = z.object({
  name: z.string().nonempty('Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().nonempty('Email is required').email('Please enter a valid email address'),
  password: z
    .string()
    .nonempty('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export const registerDefaultValues = {
  name: '',
  email: '',
  password: '',
};

// Forgot Password Form
export const forgotPasswordFormSchema = z.object({
  email: z.string().nonempty('Email is required').email('Please enter a valid email address'),
});

export const forgotPasswordDefaultValues = {
  email: '',
};

// Reset Password Form
export const resetPasswordFormSchema = z
  .object({
    password: z
      .string()
      .nonempty('Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().nonempty('Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const resetPasswordDefaultValues = {
  password: '',
  confirmPassword: '',
};

// Verify OTP Form
export const verifyOtpFormSchema = z.object({
  otp: z
    .string()
    .nonempty('Verification code is required')
    .length(6, 'Verification code must be 6 digits'),
});

export const verifyOtpDefaultValues = {
  otp: '',
};
