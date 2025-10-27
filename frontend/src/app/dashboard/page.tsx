'use client';

import { Calendar, MapPin, TrendingUp, Users } from 'lucide-react';

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
            <div
              key={stat.name}
              className="rounded-lg border border-divider bg-background p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center rounded-lg bg-primary/10 p-2">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-success">{stat.change}</span>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.name}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Bookings */}
      <div className="rounded-lg border border-divider bg-background shadow-sm">
        <div className="border-b border-divider p-6">
          <h2 className="text-xl font-semibold">Recent Bookings</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between rounded-lg border border-divider p-4 hover:bg-default-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{booking.location}</p>
                    <p className="text-sm text-muted-foreground">{booking.user}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{booking.date}</p>
                  <span
                    className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                      booking.status === 'confirmed'
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-divider bg-background p-6 shadow-sm">
          <h3 className="font-semibold mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              Add New Location
            </button>
            <button className="w-full rounded-lg border border-divider px-4 py-2 text-sm font-medium hover:bg-default-100 transition-colors">
              View All Bookings
            </button>
          </div>
        </div>
        <div className="rounded-lg border border-divider bg-background p-6 shadow-sm">
          <h3 className="font-semibold mb-2">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">API Status</span>
              <span className="text-sm font-medium text-success">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Database</span>
              <span className="text-sm font-medium text-success">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Backup</span>
              <span className="text-sm font-medium">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
