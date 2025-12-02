import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AccessCodeDisplay } from '@/components/booking/AccessCodeDisplay';
import { mockRooms, formatCurrency, generateAccessCode, calculateTotalPrice } from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Users,
  Moon,
  Wifi,
  Wind,
  Tv,
  Check,
  ChevronRight,
  CreditCard,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const BookRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const room = mockRooms.find((r) => r.id === roomId);

  const [step, setStep] = useState(1);
  const [nights, setNights] = useState(1);
  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idNumber: '',
  });
  const [bookingComplete, setBookingComplete] = useState(false);
  const [accessCode, setAccessCode] = useState('');

  const totalPrice = useMemo(
    () => (room ? calculateTotalPrice(room.pricePerNight, nights) : 0),
    [room, nights]
  );

  const nightOptions = [1, 2, 3, 4, 5, 6, 7];

  if (!room) {
    return (
      <Layout>
        <div className="container flex min-h-[60vh] items-center justify-center px-4">
          <Card className="max-w-md text-center">
            <CardContent className="p-8">
              <h2 className="font-display text-2xl font-bold">Room Not Found</h2>
              <p className="mt-2 text-muted-foreground">
                The room you're looking for doesn't exist.
              </p>
              <Button className="mt-4" onClick={() => navigate('/rooms')}>
                Browse Rooms
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const handleBooking = () => {
    const code = generateAccessCode();
    setAccessCode(code);
    setBookingComplete(true);
    toast({
      title: 'Booking Confirmed!',
      description: `Your access code is ${code}. Check your email for the receipt.`,
    });
  };

  const checkInDate = new Date();
  const checkOutDate = new Date();
  checkOutDate.setDate(checkOutDate.getDate() + nights);

  if (bookingComplete) {
    return (
      <Layout>
        <div className="min-h-screen bg-background py-12">
          <div className="container max-w-lg px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <Check className="h-8 w-8 text-success" />
                </div>
                <h1 className="font-display text-3xl font-bold">
                  Booking Confirmed!
                </h1>
                <p className="mt-2 text-muted-foreground">
                  A digital receipt has been sent to {guestInfo.email}
                </p>
              </div>

              <AccessCodeDisplay
                code={accessCode}
                roomName={room.name}
                checkIn={checkInDate}
                checkOut={checkOutDate}
              />

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Paid</span>
                    <span className="text-xl font-bold text-success">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full" onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card py-4">
          <div className="container px-4">
            <button
              onClick={() => navigate('/rooms')}
              className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Rooms
            </button>
          </div>
        </div>

        <div className="container px-4 py-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Room Preview */}
              <Card variant="room" className="mb-6 overflow-hidden">
                <div className="relative aspect-[16/9]">
                  <img
                    src={room.images[0]}
                    alt={room.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge variant="available" className="mb-2">
                      Available
                    </Badge>
                    <h1 className="font-display text-3xl font-bold text-primary-foreground">
                      {room.name}
                    </h1>
                    <p className="mt-1 text-primary-foreground/80">
                      {room.description}
                    </p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity) => (
                      <Badge key={amenity} variant="outline">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Booking Steps */}
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Moon className="h-5 w-5 text-primary" />
                          Select Number of Nights
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4 text-sm text-muted-foreground">
                          Payment is strictly per night. Select the exact number
                          of nights for your stay.
                        </p>
                        <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
                          {nightOptions.map((n) => (
                            <button
                              key={n}
                              onClick={() => setNights(n)}
                              className={`flex flex-col items-center rounded-lg border-2 p-3 transition-all ${
                                nights === n
                                  ? 'border-primary bg-primary/10'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <span className="text-2xl font-bold">{n}</span>
                              <span className="text-xs text-muted-foreground">
                                {n === 1 ? 'Night' : 'Nights'}
                              </span>
                            </button>
                          ))}
                        </div>
                        <div className="mt-6 rounded-lg bg-muted p-4">
                          <div className="flex items-center justify-between">
                            <span>
                              {nights} {nights === 1 ? 'Night' : 'Nights'} ×{' '}
                              {formatCurrency(room.pricePerNight)}
                            </span>
                            <span className="text-xl font-bold">
                              {formatCurrency(totalPrice)}
                            </span>
                          </div>
                        </div>
                        <Button
                          className="mt-6 w-full"
                          size="lg"
                          onClick={() => setStep(2)}
                        >
                          Continue
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          Guest Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={guestInfo.firstName}
                              onChange={(e) =>
                                setGuestInfo({
                                  ...guestInfo,
                                  firstName: e.target.value,
                                })
                              }
                              placeholder="Enter first name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={guestInfo.lastName}
                              onChange={(e) =>
                                setGuestInfo({
                                  ...guestInfo,
                                  lastName: e.target.value,
                                })
                              }
                              placeholder="Enter last name"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={guestInfo.email}
                            onChange={(e) =>
                              setGuestInfo({
                                ...guestInfo,
                                email: e.target.value,
                              })
                            }
                            placeholder="email@example.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={guestInfo.phone}
                            onChange={(e) =>
                              setGuestInfo({
                                ...guestInfo,
                                phone: e.target.value,
                              })
                            }
                            placeholder="+233 XX XXX XXXX"
                          />
                        </div>
                        <div>
                          <Label htmlFor="idNumber">ID Number</Label>
                          <Input
                            id="idNumber"
                            value={guestInfo.idNumber}
                            onChange={(e) =>
                              setGuestInfo({
                                ...guestInfo,
                                idNumber: e.target.value,
                              })
                            }
                            placeholder="Ghana Card / Passport Number"
                          />
                        </div>
                        <div className="flex gap-3 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => setStep(1)}
                          >
                            Back
                          </Button>
                          <Button
                            className="flex-1"
                            onClick={() => setStep(3)}
                            disabled={
                              !guestInfo.firstName ||
                              !guestInfo.lastName ||
                              !guestInfo.email ||
                              !guestInfo.phone
                            }
                          >
                            Continue to Payment
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-primary" />
                          Payment
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="rounded-lg border border-border p-4">
                          <h3 className="font-semibold">Booking Summary</h3>
                          <div className="mt-3 space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Room</span>
                              <span>{room.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Guest</span>
                              <span>
                                {guestInfo.firstName} {guestInfo.lastName}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Duration
                              </span>
                              <span>
                                {nights} {nights === 1 ? 'Night' : 'Nights'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Check-in
                              </span>
                              <span>{checkInDate.toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Check-out
                              </span>
                              <span>{checkOutDate.toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="mt-4 border-t border-border pt-4">
                            <div className="flex justify-between text-lg font-bold">
                              <span>Total</span>
                              <span className="text-primary">
                                {formatCurrency(totalPrice)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-lg bg-muted/50 p-4">
                          <p className="text-sm text-muted-foreground">
                            By clicking "Pay Now", you agree to our terms and
                            conditions. A digital receipt and access code will be
                            sent to your email.
                          </p>
                        </div>

                        <div className="flex gap-3">
                          <Button variant="outline" onClick={() => setStep(2)}>
                            Back
                          </Button>
                          <Button
                            variant="gold"
                            className="flex-1"
                            size="lg"
                            onClick={handleBooking}
                          >
                            Pay {formatCurrency(totalPrice)}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar - Price Summary */}
            <div className="lg:col-span-1">
              <Card variant="elevated" className="sticky top-24">
                <CardHeader>
                  <CardTitle>Price Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={room.images[0]}
                      alt={room.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-semibold">{room.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Floor {room.floor}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {formatCurrency(room.pricePerNight)} × {nights}{' '}
                        {nights === 1 ? 'night' : 'nights'}
                      </span>
                      <span>{formatCurrency(totalPrice)}</span>
                    </div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">
                        {formatCurrency(totalPrice)}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-success/10 p-3">
                    <p className="text-center text-sm font-medium text-success">
                      Fixed nightly rate - No hidden fees
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookRoom;
