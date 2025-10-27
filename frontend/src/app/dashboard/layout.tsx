'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Locations', href: '/dashboard/locations', icon: MapPin },
  { name: 'Bookings', href: '/dashboard/bookings', icon: Calendar },
  { name: 'Users', href: '/dashboard/users', icon: Users },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? 'w-16' : 'w-64'
        } flex flex-col border-r border-divider bg-background/95 backdrop-blur transition-all duration-300`}
      >
        {/* Sidebar Header */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-divider">
          {!collapsed && (
            <h1 className="text-lg font-semibold">Admin Panel</h1>
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
                  fullWidth
                  variant={isActive ? 'solid' : 'light'}
                  color={isActive ? 'primary' : 'default'}
                  className={`justify-start ${collapsed ? 'px-0' : ''}`}
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
              fullWidth
              variant="light"
              color="default"
              className={`justify-start ${collapsed ? 'px-0' : ''}`}
              startContent={!collapsed ? <ChevronLeft className="h-4 w-4" /> : undefined}
            >
              {collapsed ? <ChevronLeft className="h-4 w-4" /> : 'Back to site'}
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
