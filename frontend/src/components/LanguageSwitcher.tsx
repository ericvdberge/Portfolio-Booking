'use client';

import { useLocale } from 'next-intl';
import { useState, useTransition } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { locales, type Locale } from '@/i18n/config';

const languageNames: Record<Locale, string> = {
  en: 'English',
  nl: 'Nederlands',
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = async (newLocale: string) => {
    startTransition(async () => {
      // Store locale preference in localStorage
      localStorage.setItem('locale', newLocale);
      // Trigger a custom event to notify the locale provider
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'locale',
        newValue: newLocale,
        storageArea: localStorage
      }));
    });
  };

  return (
    <Select value={locale} onValueChange={handleLanguageChange} disabled={isPending}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {locales.map((lang) => (
          <SelectItem key={lang} value={lang}>
            {languageNames[lang]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}