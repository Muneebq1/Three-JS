import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';

import { useLogin } from '@/module/auth/hooks.ts/useLogin';
import { loginDefaultValues, loginFormSchema } from '@/module/auth/schema';
import type { LoginFormValues } from '@/module/auth/types';

export default function SignIn() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: loginDefaultValues,
  });

  const { mutate: loginUser, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => loginUser({ ...data });

  return (
    <div className='bg-background flex min-h-screen items-center justify-center px-4'>
      <div className='border-border bg-card w-full max-w-md space-y-8 rounded-lg border p-8 shadow-sm'>
        <div className='text-center'>
          <h1 className='text-foreground text-3xl font-bold'>Sign In</h1>
          <p className='text-muted-foreground mt-2 text-sm'>
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-2'>
            <label htmlFor='email' className='text-foreground text-sm font-medium'>
              Email
            </label>
            <input
              id='email'
              type='email'
              {...register('email')}
              className='border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none'
              placeholder='you@example.com'
            />
            {errors.email && <p className='text-destructive text-sm'>{errors.email.message}</p>}
          </div>

          <div className='space-y-2'>
            <label htmlFor='password' className='text-foreground text-sm font-medium'>
              Password
            </label>
            <input
              id='password'
              type='password'
              {...register('password')}
              className='border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none'
              placeholder='••••••••'
            />
            {errors.password && (
              <p className='text-destructive text-sm'>{errors.password.message}</p>
            )}
          </div>

          <button
            type='submit'
            disabled={isPending}
            className='bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring w-full rounded-md px-4 py-2 text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
          >
            {isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
