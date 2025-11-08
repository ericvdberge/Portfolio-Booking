'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input, Select, SelectItem } from '@heroui/react';
import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Building2 } from 'lucide-react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormErrors } from '../../types/form-errors';
import { useOrganization } from '@/contexts/OrganizationContext';

// Demo organizations for testing
const DEMO_ORGANIZATIONS = [
  { id: 'org-acme-corp', name: 'Acme Corporation' },
  { id: 'org-global-ventures', name: 'Global Ventures' },
];

// Zod validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, LoginFormErrors.EMAIL_REQUIRED)
    .email(LoginFormErrors.EMAIL_INVALID),
  password: z
    .string()
    .min(1, LoginFormErrors.PASSWORD_REQUIRED)
    .min(6, LoginFormErrors.PASSWORD_TOO_SHORT),
  organizationId: z
    .string()
    .min(1, 'Please select an organization'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { login } = useOrganization();
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
      organizationId: '',
    },
  });

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const onSubmit = async (data: LoginFormData) => {
    try {
      // TODO: Implement actual API login logic here
      console.log('Login attempt:', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find the organization name
      const organization = DEMO_ORGANIZATIONS.find(org => org.id === data.organizationId);
      const organizationName = organization?.name || 'Unknown Organization';

      // Store user and organization in context
      login(data.email, data.organizationId, organizationName);

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
                input: "text-base",
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
                input: "text-base",
                inputWrapper: "border-default-200",
                errorMessage: "text-xs mt-1",
              }}
              data-testid="signin-password-input"
            />
          </div>
        )}
      />

      <Controller
        name="organizationId"
        control={control}
        render={({ field, fieldState }) => (
          <div data-testid="signin-organization-field">
            <Select
              {...field}
              label="Organization"
              placeholder="Select your organization"
              variant="bordered"
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              classNames={{
                trigger: "border-default-200",
                errorMessage: "text-xs mt-1",
              }}
              startContent={
                <Building2 className="text-default-400 pointer-events-none flex-shrink-0" size={18} />
              }
              data-testid="signin-organization-select"
            >
              {DEMO_ORGANIZATIONS.map((org) => (
                <SelectItem key={org.id} value={org.id}>
                  {org.name}
                </SelectItem>
              ))}
            </Select>
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