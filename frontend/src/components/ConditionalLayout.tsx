'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { MobileFooter } from './MobileFooter';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideLayout = pathname === '/login' || pathname === '/signup';

  return (
    <>
      {!hideLayout && <Header />}
      <main className={hideLayout ? '' : 'pb-16 md:pb-0'}>
        {children}
      </main>
      {!hideLayout && <MobileFooter />}
    </>
  );
}
