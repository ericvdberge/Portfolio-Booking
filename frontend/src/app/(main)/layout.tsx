import { Header } from '@/components/Header';
import { MobileFooter } from '@/components/MobileFooter';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="pb-16 md:pb-0">
        {children}
      </main>
      <MobileFooter />
    </>
  );
}
