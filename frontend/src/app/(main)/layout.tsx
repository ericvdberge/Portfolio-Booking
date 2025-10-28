import { DesktopHeader } from '@/components/header/DesktopHeader';
import { MobileFooter } from '@/components/MobileFooter';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DesktopHeader />
      <main className="pb-16 md:pb-0">
        {children}
      </main>
      <MobileFooter />
    </>
  );
}
