'use client';

import { Calendar, MapPin, TrendingUp, Users } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Chip,
  Avatar,
  Divider,
} from '@heroui/react';

const stats = [
  {
    name: 'Total Bookings',
    value: '127',
    change: '+12.5%',
    icon: Calendar,
    trend: 'up',
  },
  {
    name: 'Active Locations',
    value: '18',
    change: '+2',
    icon: MapPin,
    trend: 'up',
  },
  {
    name: 'Total Users',
    value: '1,432',
    change: '+8.2%',
    icon: Users,
    trend: 'up',
  },
  {
    name: 'Revenue',
    value: '$45.2K',
    change: '+15.3%',
    icon: TrendingUp,
    trend: 'up',
  },
];

const recentBookings = [
  { id: 1, location: 'Coastal Villa', user: 'John Doe', date: '2025-11-05', status: 'confirmed' },
  { id: 2, location: 'Mountain Retreat', user: 'Jane Smith', date: '2025-11-08', status: 'pending' },
  { id: 3, location: 'City Apartment', user: 'Mike Johnson', date: '2025-11-12', status: 'confirmed' },
  { id: 4, location: 'Lake House', user: 'Sarah Williams', date: '2025-11-15', status: 'confirmed' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's what's happening with your bookings.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} shadow="sm">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Avatar
                    icon={<Icon className="h-5 w-5" />}
                    classNames={{
                      base: 'bg-primary/10',
                      icon: 'text-primary',
                    }}
                  />
                  <Chip color="success" variant="flat" size="sm">
                    {stat.change}
                  </Chip>
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-default-500 mt-1">{stat.name}</p>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Recent Bookings */}
      <Card shadow="sm">
        <CardHeader className="flex flex-col items-start px-6 py-4">
          <h2 className="text-xl font-semibold">Recent Bookings</h2>
        </CardHeader>
        <Divider />
        <CardBody className="gap-4">
          {recentBookings.map((booking, index) => (
            <div key={booking.id}>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-default-100 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar
                    icon={<Calendar className="h-5 w-5" />}
                    classNames={{
                      base: 'bg-primary/10',
                      icon: 'text-primary',
                    }}
                  />
                  <div>
                    <p className="font-medium">{booking.location}</p>
                    <p className="text-sm text-default-500">{booking.user}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <p className="text-sm font-medium">{booking.date}</p>
                  <Chip
                    color={booking.status === 'confirmed' ? 'success' : 'warning'}
                    variant="flat"
                    size="sm"
                  >
                    {booking.status}
                  </Chip>
                </div>
              </div>
              {index < recentBookings.length - 1 && <Divider className="my-2" />}
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Quick Actions and System Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card shadow="sm">
          <CardHeader className="flex flex-col items-start">
            <h3 className="font-semibold">Quick Actions</h3>
          </CardHeader>
          <Divider />
          <CardBody className="gap-2">
            <Button color="primary" fullWidth>
              Add New Location
            </Button>
            <Button variant="bordered" fullWidth>
              View All Bookings
            </Button>
          </CardBody>
        </Card>

        <Card shadow="sm">
          <CardHeader className="flex flex-col items-start">
            <h3 className="font-semibold">System Status</h3>
          </CardHeader>
          <Divider />
          <CardBody className="gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-default-500">API Status</span>
              <Chip color="success" variant="flat" size="sm">
                Operational
              </Chip>
            </div>
            <Divider />
            <div className="flex items-center justify-between">
              <span className="text-sm text-default-500">Database</span>
              <Chip color="success" variant="flat" size="sm">
                Connected
              </Chip>
            </div>
            <Divider />
            <div className="flex items-center justify-between">
              <span className="text-sm text-default-500">Last Backup</span>
              <span className="text-sm font-medium">2 hours ago</span>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
