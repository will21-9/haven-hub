import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockRooms, mockBookings, mockAlerts, formatCurrency } from '@/data/mockData';
import {
  BedDouble,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Shield,
  Calendar,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const OwnerDashboard = () => {
  const availableRooms = mockRooms.filter((r) => r.status === 'available').length;
  const totalRevenue = mockBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const occupancyRate = Math.round(
    ((mockRooms.length - availableRooms) / mockRooms.length) * 100
  );
  const activeAlerts = mockAlerts.filter((a) => !a.acknowledged).length;

  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      change: '+12% from last week',
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      title: 'Occupancy Rate',
      value: `${occupancyRate}%`,
      change: '+5% from yesterday',
      changeType: 'positive',
      icon: TrendingUp,
    },
    {
      title: 'Available Rooms',
      value: availableRooms,
      change: `${mockRooms.length} total`,
      icon: BedDouble,
    },
    {
      title: 'Active Alerts',
      value: activeAlerts,
      change: activeAlerts > 0 ? 'Requires attention' : 'All clear',
      changeType: activeAlerts > 0 ? 'negative' : 'positive',
      icon: AlertTriangle,
    },
  ];

  const weeklyRevenue = [
    { day: 'Mon', amount: 1200 },
    { day: 'Tue', amount: 1800 },
    { day: 'Wed', amount: 1400 },
    { day: 'Thu', amount: 2200 },
    { day: 'Fri', amount: 2800 },
    { day: 'Sat', amount: 3200 },
    { day: 'Sun', amount: 2600 },
  ];

  const maxRevenue = Math.max(...weeklyRevenue.map((d) => d.amount));

  return (
    <DashboardLayout
      title="Owner Dashboard"
      subtitle="Full overview of your guest house operations"
    >
      {/* Quick Actions */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/owner/revenue">
            <BarChart3 className="mr-2 h-4 w-4" />
            Revenue Report
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/owner/access-control">
            <Shield className="mr-2 h-4 w-4" />
            Access Control
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/owner/bookings">
            <Calendar className="mr-2 h-4 w-4" />
            Manage Bookings
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard
            key={stat.title}
            {...stat}
            index={index}
            changeType={stat.changeType as 'positive' | 'negative' | 'neutral'}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Revenue Chart */}
        <Card variant="dashboard" className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Weekly Revenue Overview
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/owner/revenue">
                Full Report
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-end gap-4">
              {weeklyRevenue.map((day, index) => (
                <motion.div
                  key={day.day}
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.amount / maxRevenue) * 100}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-1 flex-col items-center"
                >
                  <div className="w-full flex-1 rounded-t-lg bg-primary/20 hover:bg-primary/30 transition-colors relative group">
                    <div
                      className="absolute bottom-0 left-0 right-0 rounded-t-lg bg-primary transition-all"
                      style={{ height: `${(day.amount / maxRevenue) * 100}%` }}
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap">
                      {formatCurrency(day.amount)}
                    </div>
                  </div>
                  <span className="mt-2 text-sm text-muted-foreground">
                    {day.day}
                  </span>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">
                Total this week
              </span>
              <span className="text-xl font-bold text-primary">
                {formatCurrency(weeklyRevenue.reduce((sum, d) => sum + d.amount, 0))}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Room Performance */}
        <Card variant="dashboard">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Room Performance</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/owner/rooms">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRooms.slice(0, 4).map((room, index) => {
                const roomBookings = mockBookings.filter(
                  (b) => b.roomId === room.id
                );
                const roomRevenue = roomBookings.reduce(
                  (sum, b) => sum + b.totalAmount,
                  0
                );
                return (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={room.images[0]}
                        alt={room.name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium">{room.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {roomBookings.length} bookings
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-primary">
                      {formatCurrency(roomRevenue)}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Security Alerts */}
        <Card variant="dashboard">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Security Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-success/10 p-4 text-center">
                  <p className="text-2xl font-bold text-success">24</p>
                  <p className="text-sm text-muted-foreground">
                    Normal Access Today
                  </p>
                </div>
                <div className="rounded-lg bg-warning/10 p-4 text-center">
                  <p className="text-2xl font-bold text-warning">
                    {activeAlerts}
                  </p>
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                </div>
              </div>
              <div className="space-y-2">
                {mockAlerts.slice(0, 2).map((alert) => {
                  const room = mockRooms.find((r) => r.id === alert.roomId);
                  return (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {room?.name}
                        </p>
                      </div>
                      <Badge
                        variant={
                          alert.severity === 'critical'
                            ? 'destructive'
                            : alert.severity === 'high'
                            ? 'warning'
                            : 'outline'
                        }
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                  );
                })}
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/owner/alerts">View All Alerts</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default OwnerDashboard;
