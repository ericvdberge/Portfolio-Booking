'use client';

import Link from 'next/link';
import Image from 'next/image';

type BrandLogoProps = {
  className?: string;
};

export function BrandLogo({ className = '' }: BrandLogoProps) {
  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      <Image
        src="/icons/logo-horizontal.png"
        alt="boop a booking"
        width={120}
        height={40}
        className="h-8 w-auto"
        priority
      />
    </Link>
  );
}
