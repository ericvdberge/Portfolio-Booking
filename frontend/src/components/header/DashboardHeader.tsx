'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Search, Bell, User as UserIcon, LogOut } from 'lucide-react';
import {
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Badge,
  Avatar,
} from '@heroui/react';
import { Header } from './Header';
import { BrandLogo } from './BrandLogo';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export function DashboardHeader() {
  const t = useTranslations('dashboard.header');
  const nav = useTranslations('navigation');
  const router = useRouter();

  const handleLogout = () => {
    // Navigate to login page
    router.push('/sign-in');
  };

  return (
    <Header variant="dashboard">
      <Header.Container alignContent>
        {/* Logo */}
        <Header.Logo className="mr-4">
          <BrandLogo />
        </Header.Logo>

        {/* Search Bar */}
        <Header.Search className="hidden md:block">
          <Input
            placeholder={t('search')}
            startContent={<Search className="h-4 w-4 text-default-400" />}
            size="sm"
            classNames={{
              inputWrapper: 'bg-default-100',
            }}
          />
        </Header.Search>

        {/* Actions */}
        <Header.Actions>
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Notifications */}
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly variant="light" size="sm">
                <Badge content="3" color="danger" size="sm">
                  <Bell className="h-5 w-5" />
                </Badge>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label={t('notifications')}>
              <DropdownItem key="notification-1" className="py-3">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold">New booking received</p>
                  <p className="text-xs text-default-500">2 minutes ago</p>
                </div>
              </DropdownItem>
              <DropdownItem key="notification-2" className="py-3">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold">Location approved</p>
                  <p className="text-xs text-default-500">1 hour ago</p>
                </div>
              </DropdownItem>
              <DropdownItem key="notification-3" className="py-3">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold">New user registered</p>
                  <p className="text-xs text-default-500">3 hours ago</p>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          {/* User Menu */}
          <Header.User>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  variant="light"
                  className="pl-1"
                  startContent={
                    <Avatar
                      size="sm"
                      classNames={{
                        base: 'bg-primary/10',
                        icon: 'text-primary',
                      }}
                      icon={<UserIcon className="h-4 w-4" />}
                    />
                  }
                >
                  <span className="hidden md:inline">Admin User</span>
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label={t('profile')}>
                <DropdownItem key="profile" startContent={<UserIcon className="h-4 w-4" />}>
                  {t('profile')}
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  className="text-danger"
                  startContent={<LogOut className="h-4 w-4" />}
                  onPress={handleLogout}
                >
                  {t('logout')}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Header.User>
        </Header.Actions>
      </Header.Container>
    </Header>
  );
}
