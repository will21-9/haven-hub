import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockRooms, mockBookings, formatCurrency } from '@/data/mockData';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  Mail,
  BedDouble,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Revenue = () => {
  const totalRevenue = mockBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const thisWeekRevenue = totalRevenue * 0.35; // Mock data
  const thisMonthRevenue = totalRevenue;
  const occupancyRate = Math.round(
    (mockBookings.filter((b) => b.status === 'checked-in').length / mockRooms.length) * 100
  );

  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      change: 'All time',
      icon: DollarSign,
    },
    {
      title: 'This Week',
      value: formatCurrency(thisWeekRevenue),
      change: '+18% from last week',
      changeType: 'positive',
      icon: TrendingUp,
    },
    {
      title: 'This Month',
      value: formatCurrency(thisMonthRevenue),
      change: '+12% from last month',
      changeType: 'positive',
      icon: Calendar,
    },
    {
      title: 'Avg. Occupancy',
      value: `${occupancyRate}%`,
      change: 'Current month',
      icon: BedDouble,
    },
  ];

  const roomRevenue = mockRooms.map((room) => {
    const bookings = mockBookings.filter((b) => b.roomId === room.id);
    const revenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
    return {
      ...room,
      revenue,
      bookings: bookings.length,
    };
  }).sort((a, b) => b.revenue - a.revenue);

  const weeklyData = [
    { week: 'Week 1', revenue: 4200, bookings: 12 },
    { week: 'Week 2', revenue: 5800, bookings: 18 },
    { week: 'Week 3', revenue: 4900, bookings: 15 },
    { week: 'Week 4', revenue: 6200, bookings: 20 },
  ];

  const handleSendReport = () => {
    toast({
      title: 'Report Sent',
      description: 'Weekly revenue report has been sent to your email.',
    });
  };

  const handleDownloadReport = () => {
    toast({
      title: 'Download Started',
      description: 'Your revenue report is being downloaded.',
    });
  };

  return (
    <DashboardLayout
      title="Revenue Report"
      subtitle="Financial overview and analytics"
    >
      {/* Actions */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Button onClick={handleSendReport}>
          <Mail className="mr-2 h-4 w-4" />
          Send Weekly Report
        </Button>
        <Button variant="outline" onClick={handleDownloadReport}>
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Stats */}
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
        {/* Weekly Performance */}
        <Card variant="dashboard" className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
            <CardDescription>Revenue breakdown by week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyData.map((week, index) => (
                <motion.div
                  key={week.week}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-20 text-sm font-medium">{week.week}</div>
                  <div className="flex-1">
                    <div className="h-8 overflow-hidden rounded-lg bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(week.revenue / 7000) * 100}%`,
                        }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                  <div className="w-32 text-right">
                    <p className="font-semibold">{formatCurrency(week.revenue)}</p>
                    <p className="text-xs text-muted-foreground">
                      {week.bookings} bookings
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <span className="font-medium text-muted-foreground">
                Monthly Total
              </span>
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(weeklyData.reduce((sum, w) => sum + w.revenue, 0))}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Room Revenue Breakdown */}
        <Card variant="dashboard">
          <CardHeader>
            <CardTitle>Revenue by Room</CardTitle>
            <CardDescription>Top performing rooms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roomRevenue.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{room.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {room.bookings} bookings
                    </p>
                  </div>
                  <span className="font-semibold text-primary">
                    {formatCurrency(room.revenue)}
                  </span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Status */}
        <Card variant="dashboard">
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
            <CardDescription>Overview of booking payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-success/10 p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Paid</p>
                  <p className="text-2xl font-bold text-success">
                    {mockBookings.filter((b) => b.paymentStatus === 'paid').length}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    {formatCurrency(
                      mockBookings
                        .filter((b) => b.paymentStatus === 'paid')
                        .reduce((sum, b) => sum + b.totalAmount, 0)
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-warning/10 p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-warning">
                    {mockBookings.filter((b) => b.paymentStatus === 'pending').length}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    {formatCurrency(
                      mockBookings
                        .filter((b) => b.paymentStatus === 'pending')
                        .reduce((sum, b) => sum + b.totalAmount, 0)
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Refunded</p>
                  <p className="text-2xl font-bold">
                    {mockBookings.filter((b) => b.paymentStatus === 'refunded').length}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    {formatCurrency(0)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Revenue;
