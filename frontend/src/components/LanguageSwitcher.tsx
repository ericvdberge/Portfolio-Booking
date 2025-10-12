'use client';

import { useLocale } from 'next-intl';
import { useState, useTransition } from 'react';
import { Select, SelectItem } from '@heroui/react';
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
    <Select
      selectedKeys={[locale]}
      onSelectionChange={(keys) => {
        const selected = Array.from(keys)[0] as string;
        if (selected) handleLanguageChange(selected);
      }}
      isDisabled={isPending}
      className="w-36"
      size="sm"
      aria-label="Select language"
      renderValue={(items) => {
        const selected = items[0];
        return selected ? (
          <div className="flex items-center gap-2">
            <FlagIcon locale={selected.key as Locale} />
            {languageNames[selected.key as Locale]}
          </div>
        ) : null;
      }}
    >
      {locales.map((lang) => (
        <SelectItem key={lang} textValue={languageNames[lang]}>
          <div className="flex items-center gap-2">
            <FlagIcon locale={lang} />
            {languageNames[lang]}
          </div>
        </SelectItem>
      ))}
    </Select>
  );
}