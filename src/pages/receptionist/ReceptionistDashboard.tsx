import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockRooms, mockBookings, mockAlerts, formatCurrency } from '@/data/mockData';
import {
  BedDouble,
  Users,
  CalendarCheck,
  AlertTriangle,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ReceptionistDashboard = () => {
  const availableRooms = mockRooms.filter((r) => r.status === 'available').length;
  const occupiedRooms = mockRooms.filter((r) => r.status === 'occupied').length;
  const todayCheckIns = mockBookings.filter(
    (b) => b.status === 'confirmed'
  ).length;
  const activeAlerts = mockAlerts.filter((a) => !a.acknowledged).length;

  const stats = [
    {
      title: 'Available Rooms',
      value: availableRooms,
      change: `${mockRooms.length} total`,
      icon: BedDouble,
    },
    {
      title: 'Occupied Rooms',
      value: occupiedRooms,
      icon: Users,
    },
    {
      title: "Today's Check-ins",
      value: todayCheckIns,
      icon: CalendarCheck,
    },
    {
      title: 'Active Alerts',
      value: activeAlerts,
      change: activeAlerts > 0 ? 'Requires attention' : 'All clear',
      changeType: activeAlerts > 0 ? 'negative' : 'positive',
      icon: AlertTriangle,
    },
  ];

  return (
    <DashboardLayout
      title="Receptionist Dashboard"
      subtitle="Welcome back! Here's what's happening today."
    >
      {/* Quick Actions */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/receptionist/bookings">
            <Plus className="mr-2 h-4 w-4" />
            New Booking
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/receptionist/rooms">View All Rooms</Link>
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
        {/* Room Status */}
        <Card variant="dashboard">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Room Status</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/receptionist/rooms">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRooms.slice(0, 5).map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={room.images[0]}
                      alt={room.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium">{room.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Floor {room.floor} • {formatCurrency(room.pricePerNight)}/night
                      </p>
                    </div>
                  </div>
                  <Badge variant={room.status}>{room.status}</Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card variant="dashboard">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Bookings</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/receptionist/bookings">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockBookings.map((booking, index) => {
                const room = mockRooms.find((r) => r.id === booking.roomId);
                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div>
                      <p className="font-medium">{room?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.nights} nights • {formatCurrency(booking.totalAmount)}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          booking.status === 'checked-in'
                            ? 'success'
                            : booking.status === 'confirmed'
                            ? 'info'
                            : 'outline'
                        }
                      >
                        {booking.status}
                      </Badge>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Code: {booking.accessCode}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card variant="dashboard" className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Active Alerts
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/receptionist/alerts">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {mockAlerts.length > 0 ? (
              <div className="space-y-3">
                {mockAlerts.map((alert, index) => {
                  const room = mockRooms.find((r) => r.id === alert.roomId);
                  return (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center justify-between rounded-lg border p-4 ${
                        alert.severity === 'critical'
                          ? 'border-destructive/50 bg-destructive/5'
                          : alert.severity === 'high'
                          ? 'border-warning/50 bg-warning/5'
                          : 'border-border'
                      }`}
                    >
                      <div>
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-sm text-muted-foreground">
                          {room?.name} •{' '}
                          {alert.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Acknowledge
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No active alerts
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReceptionistDashboard;
