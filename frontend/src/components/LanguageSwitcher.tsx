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
import Image from 'next/image';

const languageNames: Record<Locale, string> = {
  en: 'English',
  nl: 'Nederlands',
};

const FlagIcon = ({ locale }: { locale: Locale }) => (
  <Image
    src={`/languages/${locale === 'en' ? 'us' : locale}.svg`}
    alt={`${languageNames[locale]} flag`}
    width={16}
    height={12}
    className="inline"
  />
);

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
      <SelectTrigger className="w-36">
        <SelectValue>
          <div className="flex items-center gap-2">
            <FlagIcon locale={locale} />
            {languageNames[locale]}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {locales.map((lang) => (
          <SelectItem key={lang} value={lang}>
            <div className="flex items-center gap-2">
              <FlagIcon locale={lang} />
              {languageNames[lang]}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}