'use client';

import { Button } from '@heroui/react';
import { useTranslations } from 'next-intl';

type SignInButtonProps = {
  variant?: 'light' | 'solid' | 'bordered' | 'flat' | 'faded' | 'shadow' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
};

export function SignInButton({
  variant = 'light',
  size = 'sm',
  className = '',
  onClick
}: SignInButtonProps) {
  const t = useTranslations('navigation');

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onPress={onClick}
    >
      {t('signIn')}
    </Button>
  );
}
