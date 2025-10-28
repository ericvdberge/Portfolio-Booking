'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@heroui/react';
import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { z } from 'zod';

// Zod validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type ValidationErrors = Partial<Record<keyof LoginFormData, string>>;

export default function LoginPage() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Validate form data
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      console.log('Validation result:', result);
      // Extract and set validation errors
      const validationErrors: ValidationErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginFormData;
        validationErrors[field] = issue.message;
      });
      setErrors(validationErrors);
      return;
    }

    // Form is valid, proceed with login
    setIsLoading(true);

    try {
      // TODO: Implement actual API login logic here
      console.log('Login attempt:', result.data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Navigate to dashboard on successful login
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({ email: 'Invalid credentials. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form Section */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Logo */}
          <div className="flex justify-center mb-12">
            <Link href="/">
              <Image
                src="/icons/logo-horizontal.png"
                alt="Portfolio Booking"
                width={150}
                height={50}
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onValueChange={setEmail}
              startContent={
                <Mail className="text-default-400 pointer-events-none flex-shrink-0" size={18} />
              }
              variant="bordered"
              isRequired
              isInvalid={!!errors.email}
              errorMessage={errors.email}
              classNames={{
                input: "text-sm",
                inputWrapper: "border-default-200",
              }}
            />

            <Input
              type={isPasswordVisible ? "text" : "password"}
              label="Password"
              placeholder="Enter your password"
              value={password}
              onValueChange={setPassword}
              startContent={
                <Lock className="text-default-400 pointer-events-none flex-shrink-0" size={18} />
              }
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={togglePasswordVisibility}
                >
                  {isPasswordVisible ? (
                    <EyeOff className="text-default-400 pointer-events-none" size={18} />
                  ) : (
                    <Eye className="text-default-400 pointer-events-none" size={18} />
                  )}
                </button>
              }
              variant="bordered"
              isRequired
              isInvalid={!!errors.password}
              errorMessage={errors.password}
              classNames={{
                input: "text-sm",
                inputWrapper: "border-default-200",
              }}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-default-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-default-600">Remember me</span>
              </label>

              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:text-primary-600"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              color="primary"
              size="lg"
              className="w-full font-semibold"
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-default-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-default-500">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              variant="bordered"
              className="w-full"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="ml-2">Google</span>
            </Button>

            <Button
              variant="bordered"
              className="w-full"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span className="ml-2">GitHub</span>
            </Button>
          </div>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-sm text-default-500">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="font-medium text-primary hover:text-primary-600"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image Section (Hidden on mobile) */}
      <div className="hidden lg:block relative w-0 flex-1">
        <Image
          src="/greece1.jpg"
          alt="Login background"
          fill
          className="absolute inset-0 h-full w-full object-cover"
          priority
        />
      </div>
    </div>
  );
}
