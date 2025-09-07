'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export function Header() {
  const t = useTranslations('navigation');
  const common = useTranslations('common');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">{common('portfolioBooking')}</span>
          </Link>
          
          <nav className="flex items-center space-x-6">
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
            <Button variant="ghost" size="sm">
              {t('signIn')}
            </Button>
            <Button size="sm">
              {t('bookNow')}
            </Button>
            <LanguageSwitcher />
          </nav>
        </div>
      </div>
    </header>
  );
}