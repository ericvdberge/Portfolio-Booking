'use client';

import { useTranslations } from 'next-intl';
import { Home, MapPin, Calendar, User } from 'lucide-react';
import { MobileNavItem } from './MobileNavItem';

export function MobileFooter() {
  const t = useTranslations('navigation');

  const navItems = [
    {
      href: '/',
      label: t('home'),
      icon: <Home className="w-6 h-6" />,
    },
    {
      href: '/locations',
      label: t('locations'),
      icon: <MapPin className="w-6 h-6" />,
    },
    {
      href: '/bookings',
      label: t('bookings'),
      icon: <Calendar className="w-6 h-6" />,
    },
    {
      href: '/sign-in',
      label: t('signIn'),
      icon: <User className="w-6 h-6" />,
    },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => (
            <MobileNavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </div>
      </nav>
    </footer>
  );
}
