'use client';

import { useTranslations } from 'next-intl';
import { Calendar, MapPin, TrendingUp, Users } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Chip,
  Avatar,
  Divider,
} from '@heroui/react';


const recentBookings = [
  { id: 1, location: 'Coastal Villa', user: 'John Doe', date: '2025-11-05', status: 'confirmed' },
  { id: 2, location: 'Mountain Retreat', user: 'Jane Smith', date: '2025-11-08', status: 'pending' },
  { id: 3, location: 'City Apartment', user: 'Mike Johnson', date: '2025-11-12', status: 'confirmed' },
  { id: 4, location: 'Lake House', user: 'Sarah Williams', date: '2025-11-15', status: 'confirmed' },
];

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const tStats = useTranslations('dashboard.stats');
  const tBookings = useTranslations('dashboard.recentBookings');
  const tActions = useTranslations('dashboard.quickActions');
  const tStatus = useTranslations('dashboard.systemStatus');

  const stats = [
    {
      name: tStats('totalBookings'),
      value: '127',
      change: '+12.5%',
      icon: Calendar,
      trend: 'up',
    },
    {
      name: tStats('activeLocations'),
      value: '18',
      change: '+2',
      icon: MapPin,
      trend: 'up',
    },
    {
      name: tStats('totalUsers'),
      value: '1,432',
      change: '+8.2%',
      icon: Users,
      trend: 'up',
    },
    {
      name: tStats('revenue'),
      value: '$45.2K',
      change: '+15.3%',
      icon: TrendingUp,
      trend: 'up',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          {t('welcome')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} shadow="sm">
              <CardBody className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <Avatar
                    icon={<Icon className="h-4 w-4 sm:h-5 sm:w-5" />}
                    size="sm"
                    classNames={{
                      base: 'bg-primary/10',
                      icon: 'text-primary',
                    }}
                  />
                  <Chip color="success" variant="flat" size="sm" classNames={{ content: 'text-xs' }}>
                    {stat.change}
                  </Chip>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-default-500 mt-1">{stat.name}</p>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Recent Bookings */}
      <Card shadow="sm">
        <CardHeader className="flex flex-col items-start px-4 sm:px-6 py-4">
          <h2 className="text-lg sm:text-xl font-semibold">{tBookings('title')}</h2>
        </CardHeader>
        <Divider />
        <CardBody className="gap-3 sm:gap-4 p-2 sm:p-4">
          {recentBookings.map((booking, index) => (
            <div key={booking.id}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-lg hover:bg-default-100 transition-colors">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <Avatar
                    icon={<Calendar className="h-4 w-4 sm:h-5 sm:w-5" />}
                    size="sm"
                    classNames={{
                      base: 'bg-primary/10 flex-shrink-0',
                      icon: 'text-primary',
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">{booking.location}</p>
                    <p className="text-xs sm:text-sm text-default-500 truncate">{booking.user}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2 sm:flex-col sm:items-end sm:gap-1 pl-9 sm:pl-0">
                  <p className="text-xs sm:text-sm font-medium text-default-600">{booking.date}</p>
                  <Chip
                    color={booking.status === 'confirmed' ? 'success' : 'warning'}
                    variant="flat"
                    size="sm"
                    classNames={{
                      base: 'h-6',
                      content: 'text-xs px-2'
                    }}
                  >
                    {tBookings(booking.status as 'confirmed' | 'pending')}
                  </Chip>
                </div>
              </div>
              {index < recentBookings.length - 1 && <Divider className="my-2" />}
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Quick Actions and System Status */}
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        <Card shadow="sm">
          <CardHeader className="flex flex-col items-start px-4 sm:px-6 py-3 sm:py-4">
            <h3 className="text-sm sm:text-base font-semibold">{tActions('title')}</h3>
          </CardHeader>
          <Divider />
          <CardBody className="gap-2 p-4 sm:p-6">
            <Button color="primary" fullWidth size="sm" className="h-10">
              {tActions('addLocation')}
            </Button>
            <Button variant="bordered" fullWidth size="sm" className="h-10">
              {tActions('viewBookings')}
            </Button>
          </CardBody>
        </Card>

        <Card shadow="sm">
          <CardHeader className="flex flex-col items-start px-4 sm:px-6 py-3 sm:py-4">
            <h3 className="text-sm sm:text-base font-semibold">{tStatus('title')}</h3>
          </CardHeader>
          <Divider />
          <CardBody className="gap-3 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-default-500">{tStatus('apiStatus')}</span>
              <Chip color="success" variant="flat" size="sm" classNames={{ content: 'text-xs' }}>
                {tStatus('operational')}
              </Chip>
            </div>
            <Divider />
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-default-500">{tStatus('database')}</span>
              <Chip color="success" variant="flat" size="sm" classNames={{ content: 'text-xs' }}>
                {tStatus('connected')}
              </Chip>
            </div>
            <Divider />
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-default-500">{tStatus('lastBackup')}</span>
              <span className="text-xs sm:text-sm font-medium">2 hours ago</span>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
