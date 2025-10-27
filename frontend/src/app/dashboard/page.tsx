'use client';

import { useTranslations } from 'next-intl';
import { Card, CardBody, CardHeader } from '@heroui/react';
import { BarChart3, Calendar, MapPin, Users } from 'lucide-react';

export default function DashboardPage() {
  const t = useTranslations('common');

  const stats = [
    {
      title: 'Total Bookings',
      value: '24',
      icon: Calendar,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Active Locations',
      value: '12',
      icon: MapPin,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Total Users',
      value: '156',
      icon: Users,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Revenue',
      value: '$12,345',
      icon: BarChart3,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-default-500">Here&apos;s what&apos;s happening with your bookings today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-none shadow-sm">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-default-500 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`${stat.color}`} size={24} />
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <h2 className="text-xl font-semibold">Recent Bookings</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-3 rounded-lg bg-default-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Calendar className="text-primary" size={20} />
                    </div>
                    <div>
                      <p className="font-medium">Conference Room {item}</p>
                      <p className="text-sm text-default-500">Today, 2:00 PM</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-success">Confirmed</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <h2 className="text-xl font-semibold">Quick Actions</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <button className="w-full p-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
                Create New Booking
              </button>
              <button className="w-full p-4 rounded-lg border border-default-200 font-medium hover:bg-default-50 transition-colors">
                View All Locations
              </button>
              <button className="w-full p-4 rounded-lg border border-default-200 font-medium hover:bg-default-50 transition-colors">
                Manage Calendar
              </button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
