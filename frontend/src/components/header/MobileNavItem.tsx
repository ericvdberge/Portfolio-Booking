'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type MobileNavItemProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
  className?: string;
};

export function MobileNavItem({ href, label, icon, className = '' }: MobileNavItemProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const active = isActive(href);

  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
        active
          ? 'text-foreground'
          : 'text-muted-foreground hover:text-foreground'
      } ${className}`}
    >
      <div className={active ? 'text-primary' : ''}>
        {icon}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
}
