'use client';

import { useTranslations } from 'next-intl';
import { Header } from './Header';
import { BrandLogo } from './BrandLogo';
import { NavLink } from './NavLink';
import { SignInButton } from './SignInButton';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useRouter } from 'next/navigation';

export function DesktopHeader() {
  const t = useTranslations('navigation');
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/sign-in');
  }

  return (
    <Header>
      <Header.Container>
        <Header.Logo>
          <BrandLogo />
        </Header.Logo>

        <Header.Nav hideOnMobile>
          <NavLink href="/">
            {t('home')}
          </NavLink>
          <NavLink href="/locations">
            {t('locations')}
          </NavLink>
          <LanguageSwitcher />
          <SignInButton onClick={handleSignIn} />
        </Header.Nav>
      </Header.Container>
    </Header>
  );
}
