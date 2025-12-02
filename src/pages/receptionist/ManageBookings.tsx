import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockRooms, mockBookings, mockGuests, formatCurrency, generateAccessCode, calculateTotalPrice } from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Calendar, Key, User, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const ManageBookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewBooking, setShowNewBooking] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [nights, setNights] = useState(1);
  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idNumber: '',
  });

  const filteredBookings = mockBookings.filter((booking) => {
    const guest = mockGuests.find((g) => g.id === booking.guestId);
    const room = mockRooms.find((r) => r.id === booking.roomId);
    const searchLower = searchTerm.toLowerCase();
    return (
      guest?.firstName.toLowerCase().includes(searchLower) ||
      guest?.lastName.toLowerCase().includes(searchLower) ||
      room?.name.toLowerCase().includes(searchLower) ||
      booking.accessCode.includes(searchLower)
    );
  });

  const selectedRoomData = mockRooms.find((r) => r.id === selectedRoom);
  const totalPrice = selectedRoomData
    ? calculateTotalPrice(selectedRoomData.pricePerNight, nights)
    : 0;

  const handleCreateBooking = () => {
    if (!selectedRoom || !guestInfo.firstName || !guestInfo.lastName) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const code = generateAccessCode();
    toast({
      title: 'Booking Created',
      description: `Access code: ${code}. Total: ${formatCurrency(totalPrice)}`,
    });
    setShowNewBooking(false);
    setSelectedRoom('');
    setNights(1);
    setGuestInfo({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      idNumber: '',
    });
  };

  const availableRooms = mockRooms.filter((r) => r.status === 'available');

  return (
    <DashboardLayout
      title="Manage Bookings"
      subtitle="Create and manage guest bookings"
    >
      {/* Actions */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={() => setShowNewBooking(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Booking
        </Button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking, index) => {
          const guest = mockGuests.find((g) => g.id === booking.guestId);
          const room = mockRooms.find((r) => r.id === booking.roomId);
          return (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card variant="dashboard">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <img
                        src={room?.images[0]}
                        alt={room?.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-semibold">{room?.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {guest?.firstName} {guest?.lastName}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {booking.checkIn.toLocaleDateString()} -{' '}
                            {booking.checkOut.toLocaleDateString()}
                          </span>
                          <span className="text-muted-foreground">
                            ({booking.nights} nights)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Key className="h-4 w-4 text-primary" />
                          <span className="font-mono font-bold">
                            {booking.accessCode}
                          </span>
                        </div>
                        <p className="text-lg font-bold text-primary">
                          {formatCurrency(booking.totalAmount)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
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
                        <Badge
                          variant={
                            booking.paymentStatus === 'paid'
                              ? 'success'
                              : 'warning'
                          }
                        >
                          {booking.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2 border-t border-border pt-4">
                    {booking.status === 'confirmed' && (
                      <Button size="sm">Check In</Button>
                    )}
                    {booking.status === 'checked-in' && (
                      <Button size="sm" variant="secondary">
                        Check Out
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      Resend Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* New Booking Modal */}
      <Dialog open={showNewBooking} onOpenChange={setShowNewBooking}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Booking</DialogTitle>
            <DialogDescription>
              Register a new guest and create their booking
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Room Selection */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Select Room</Label>
                <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose available room" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.name} - {formatCurrency(room.pricePerNight)}/night
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Number of Nights</Label>
                <Select
                  value={nights.toString()}
                  onValueChange={(v) => setNights(parseInt(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {n} {n === 1 ? 'Night' : 'Nights'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Guest Info */}
            <div className="space-y-4">
              <h4 className="font-medium">Guest Information</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>First Name</Label>
                  <Input
                    value={guestInfo.firstName}
                    onChange={(e) =>
                      setGuestInfo({ ...guestInfo, firstName: e.target.value })
                    }
                    placeholder="First name"
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    value={guestInfo.lastName}
                    onChange={(e) =>
                      setGuestInfo({ ...guestInfo, lastName: e.target.value })
                    }
                    placeholder="Last name"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={guestInfo.email}
                    onChange={(e) =>
                      setGuestInfo({ ...guestInfo, email: e.target.value })
                    }
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={guestInfo.phone}
                    onChange={(e) =>
                      setGuestInfo({ ...guestInfo, phone: e.target.value })
                    }
                    placeholder="+233 XX XXX XXXX"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label>ID Number</Label>
                  <Input
                    value={guestInfo.idNumber}
                    onChange={(e) =>
                      setGuestInfo({ ...guestInfo, idNumber: e.target.value })
                    }
                    placeholder="Ghana Card / Passport"
                  />
                </div>
              </div>
            </div>

            {/* Price Summary */}
            {selectedRoom && (
              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center justify-between">
                  <span>
                    {selectedRoomData?.name} × {nights}{' '}
                    {nights === 1 ? 'night' : 'nights'}
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowNewBooking(false)}
              >
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleCreateBooking}>
                Create Booking & Generate Code
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ManageBookings;
