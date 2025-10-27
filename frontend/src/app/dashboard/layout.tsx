'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard,
  MapPin,
  Calendar,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { Button, Tooltip, Divider } from '@heroui/react';
import { DashboardHeader } from '@/components/header/DashboardHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const t = useTranslations('dashboard');
  const tNav = useTranslations('dashboard.navigation');

  const navigation = [
    { name: tNav('dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: tNav('locations'), href: '/dashboard/locations', icon: MapPin },
    { name: tNav('bookings'), href: '/dashboard/bookings', icon: Calendar },
    { name: tNav('users'), href: '/dashboard/users', icon: Users },
    { name: tNav('settings'), href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Dashboard Header */}
      <DashboardHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            collapsed ? 'w-16' : 'w-64'
          } flex flex-col border-r border-divider bg-background/95 backdrop-blur transition-all duration-300`}
        >
          {/* Sidebar Header */}
          <div className="flex h-14 items-center justify-between px-4 border-b border-divider">
            {!collapsed && (
              <h1 className="text-lg font-semibold">{t('adminPanel')}</h1>
            )}
            <Tooltip content={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={() => setCollapsed(!collapsed)}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {collapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </Tooltip>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              const linkContent = (
                <Link
                  key={item.name}
                  href={item.href}
                  className="w-full"
                >
                  <Button
                    fullWidth={!collapsed}
                    isIconOnly={collapsed}
                    variant={isActive ? 'solid' : 'light'}
                    color={isActive ? 'primary' : 'default'}
                    className={collapsed ? '' : 'justify-start'}
                    startContent={!collapsed ? <Icon className="h-5 w-5 flex-shrink-0" /> : undefined}
                  >
                    {collapsed ? <Icon className="h-5 w-5" /> : item.name}
                  </Button>
                </Link>
              );

              return collapsed ? (
                <Tooltip key={item.name} content={item.name} placement="right">
                  {linkContent}
                </Tooltip>
              ) : (
                linkContent
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-2">
            <Divider className="mb-2" />
            <Link href="/" className="w-full block">
              <Button
                fullWidth={!collapsed}
                isIconOnly={collapsed}
                variant="light"
                color="default"
                className={collapsed ? '' : 'justify-start'}
                startContent={!collapsed ? <ChevronLeft className="h-4 w-4" /> : undefined}
              >
                {collapsed ? <ChevronLeft className="h-4 w-4" /> : t('backToSite')}
              </Button>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto p-6 max-w-[1000px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
