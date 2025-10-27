'use client';

import React, { createContext, useContext } from 'react';

type HeaderContextType = {
  variant?: 'default' | 'dashboard';
};

const HeaderContext = createContext<HeaderContextType>({});

type HeaderProps = {
  children: React.ReactNode;
  variant?: 'default' | 'dashboard';
  className?: string;
};

function HeaderRoot({ children, variant = 'default', className = '' }: HeaderProps) {
  return (
    <HeaderContext.Provider value={{ variant }}>
      <header
        className={`sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-divider ${className}`}
      >
        {children}
      </header>
    </HeaderContext.Provider>
  );
}

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  alignContent?: boolean;
};

function Container({ children, className = '', alignContent = false }: ContainerProps) {
  const baseClasses = alignContent
    ? 'mx-auto px-6' // Aligns with dashboard content
    : 'container mx-auto px-4';

  return (
    <div className={`flex h-14 items-center justify-between ${baseClasses} ${className}`}>
      {children}
    </div>
  );
}

type LogoProps = {
  children: React.ReactNode;
  className?: string;
};

function Logo({ children, className = '' }: LogoProps) {
  return <div className={`flex items-center space-x-2 ${className}`}>{children}</div>;
}

type NavProps = {
  children: React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
};

function Nav({ children, className = '', hideOnMobile = true }: NavProps) {
  const mobileClass = hideOnMobile ? 'hidden md:flex' : 'flex';
  return (
    <nav className={`${mobileClass} items-center space-x-6 ${className}`}>{children}</nav>
  );
}

type ActionsProps = {
  children: React.ReactNode;
  className?: string;
};

function Actions({ children, className = '' }: ActionsProps) {
  return <div className={`flex items-center gap-3 ${className}`}>{children}</div>;
}

type SearchProps = {
  children: React.ReactNode;
  className?: string;
};

function Search({ children, className = '' }: SearchProps) {
  return <div className={`flex-1 max-w-md ${className}`}>{children}</div>;
}

type UserProps = {
  children: React.ReactNode;
  className?: string;
};

function User({ children, className = '' }: UserProps) {
  return <div className={`flex items-center gap-2 ${className}`}>{children}</div>;
}

export const Header = Object.assign(HeaderRoot, {
  Container,
  Logo,
  Nav,
  Actions,
  Search,
  User,
});
