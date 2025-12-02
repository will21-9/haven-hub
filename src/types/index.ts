export type RoomStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';

export type UserRole = 'guest' | 'receptionist' | 'owner';

export interface Room {
  id: string;
  name: string;
  type: 'single' | 'double' | 'suite' | 'deluxe';
  pricePerNight: number;
  description: string;
  amenities: string[];
  images: string[];
  status: RoomStatus;
  capacity: number;
  floor: number;
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idNumber: string;
  nationality?: string;
}

export interface Booking {
  id: string;
  roomId: string;
  guestId: string;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  accessCode: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: Date;
  specialAccess?: {
    grantedBy: string;
    reason: string;
    expiresAt: Date;
  };
}

export interface AccessLog {
  id: string;
  roomId: string;
  bookingId?: string;
  timestamp: Date;
  action: 'entry' | 'exit' | 'forced_entry' | 'access_granted' | 'access_denied';
  method: 'code' | 'qr' | 'manual' | 'forced';
  notes?: string;
}

export interface Alert {
  id: string;
  type: 'security' | 'checkout_due' | 'payment_pending' | 'cleaning_needed';
  roomId: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface RevenueReport {
  period: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  totalRevenue: number;
  totalBookings: number;
  occupancyRate: number;
  roomBreakdown: {
    roomId: string;
    roomName: string;
    revenue: number;
    bookings: number;
  }[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
}
