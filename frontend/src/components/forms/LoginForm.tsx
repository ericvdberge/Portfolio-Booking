'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@heroui/react';
import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Zod validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur', // Validate on blur
    reValidateMode: 'onChange', // Re-validate on change after first submit
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const onSubmit = async (data: LoginFormData) => {
    try {
      // TODO: Implement actual API login logic here
      console.log('Login attempt:', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Navigate to dashboard on successful login
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setError('email', {
        type: 'manual',
        message: 'Invalid credentials. Please try again.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate data-testid="signin-form">
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <div data-testid="signin-email-field">
            <Input
              {...field}
              type="email"
              label="Email"
              placeholder="Enter your email"
              startContent={
                <Mail className="text-default-400 pointer-events-none flex-shrink-0" size={18} />
              }
              variant="bordered"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              validationBehavior="aria"
              classNames={{
                input: "text-sm",
                inputWrapper: "border-default-200",
                errorMessage: "text-xs mt-1",
              }}
              data-testid="signin-email-input"
            />
          </div>
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <div data-testid="signin-password-field">
            <Input
              {...field}
              type={isPasswordVisible ? "text" : "password"}
              label="Password"
              placeholder="Enter your password"
              startContent={
                <Lock className="text-default-400 pointer-events-none flex-shrink-0" size={18} />
              }
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={togglePasswordVisibility}
                  data-testid="signin-password-toggle"
                >
                  {isPasswordVisible ? (
                    <EyeOff className="text-default-400 pointer-events-none" size={18} />
                  ) : (
                    <Eye className="text-default-400 pointer-events-none" size={18} />
                  )}
                </button>
              }
              variant="bordered"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              validationBehavior="aria"
              classNames={{
                input: "text-sm",
                inputWrapper: "border-default-200",
                errorMessage: "text-xs mt-1",
              }}
              data-testid="signin-password-input"
            />
          </div>
        )}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="rounded border-default-300 text-primary focus:ring-primary"
            data-testid="signin-remember-me"
          />
          <span className="text-sm text-default-600">Remember me</span>
        </label>

        <Link
          href="/forgot-password"
          className="text-sm font-medium text-primary hover:text-primary-600"
          data-testid="signin-forgot-password-link"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        color="primary"
        size="lg"
        className="w-full font-semibold"
        isLoading={isSubmitting}
        isDisabled={isSubmitting}
        data-testid="signin-submit-button"
      >
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
}