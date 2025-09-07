'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode, useEffect, useState } from 'react';
import { defaultLocale, locales, type Locale } from '@/i18n/config';

interface LocaleProviderProps {
  children: ReactNode;
  initialMessages: any;
}

export function LocaleProvider({ children, initialMessages }: LocaleProviderProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get stored locale from localStorage
    const storedLocale = localStorage.getItem('locale') as Locale;
    if (storedLocale && locales.includes(storedLocale)) {
      setLocale(storedLocale);
      // Load messages for the stored locale if different from initial
      if (storedLocale !== defaultLocale) {
        loadMessages(storedLocale);
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }

    // Listen for locale changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'locale' && e.newValue) {
        const newLocale = e.newValue as Locale;
        if (locales.includes(newLocale)) {
          setLocale(newLocale);
          loadMessages(newLocale);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadMessages = async (newLocale: Locale) => {
    try {
      setIsLoading(true);
      const newMessages = (await import(`../i18n/messages/${newLocale}.json`)).default;
      setMessages(newMessages);
      setLocale(newLocale);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {children}
    </NextIntlClientProvider>
  );
}