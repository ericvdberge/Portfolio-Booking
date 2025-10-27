'use client';

import Link from 'next/link';

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function NavLink({ href, children, className = '' }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium text-muted-foreground transition-colors hover:text-foreground ${className}`}
    >
      {children}
    </Link>
  );
}
