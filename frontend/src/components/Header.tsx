'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export function Header() {
  const t = useTranslations('navigation');
  const common = useTranslations('common');

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo - Always visible */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/icons/logo-horizontal.png"
              alt="boop a booking"
              width={120}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t('home')}
            </Link>
            <Link
              href="/locations"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t('locations')}
            </Link>
            <LanguageSwitcher />
            <Button
              as={Link}
              href="/login"
              variant="light"
              size="sm"
            >
              {t('signIn')}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}