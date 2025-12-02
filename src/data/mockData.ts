import { Room, Booking, Guest, AccessLog, Alert, User } from '@/types';

export const mockRooms: Room[] = [
  {
    id: 'room-101',
    name: 'Standard Single',
    type: 'single',
    pricePerNight: 150,
    description: 'A cozy single room perfect for solo travelers. Features a comfortable single bed, work desk, and modern amenities.',
    amenities: ['Wi-Fi', 'Air Conditioning', 'TV', 'Private Bathroom', 'Work Desk'],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
    ],
    status: 'available',
    capacity: 1,
    floor: 1,
  },
  {
    id: 'room-102',
    name: 'Deluxe Double',
    type: 'double',
    pricePerNight: 200,
    description: 'Spacious double room with a queen-size bed, perfect for couples or those wanting extra comfort.',
    amenities: ['Wi-Fi', 'Air Conditioning', 'TV', 'Private Bathroom', 'Mini Fridge', 'Balcony'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
    ],
    status: 'occupied',
    capacity: 2,
    floor: 1,
  },
  {
    id: 'room-201',
    name: 'Executive Suite',
    type: 'suite',
    pricePerNight: 350,
    description: 'Luxurious suite with separate living area, king-size bed, and premium amenities for the discerning guest.',
    amenities: ['Wi-Fi', 'Air Conditioning', 'Smart TV', 'Private Bathroom', 'Mini Bar', 'Living Area', 'City View'],
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800',
    ],
    status: 'available',
    capacity: 2,
    floor: 2,
  },
  {
    id: 'room-202',
    name: 'Premium Deluxe',
    type: 'deluxe',
    pricePerNight: 250,
    description: 'Our premium deluxe room offers the perfect blend of comfort and style with panoramic views.',
    amenities: ['Wi-Fi', 'Air Conditioning', 'Smart TV', 'Private Bathroom', 'Mini Bar', 'Work Desk', 'Room Service'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    ],
    status: 'reserved',
    capacity: 2,
    floor: 2,
  },
  {
    id: 'room-301',
    name: 'Family Room',
    type: 'suite',
    pricePerNight: 400,
    description: 'Spacious family room with two queen beds, perfect for families traveling together.',
    amenities: ['Wi-Fi', 'Air Conditioning', 'TV', 'Private Bathroom', 'Mini Fridge', 'Sofa', 'Children Welcome'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800',
    ],
    status: 'cleaning',
    capacity: 4,
    floor: 3,
  },
  {
    id: 'room-302',
    name: 'Budget Single',
    type: 'single',
    pricePerNight: 100,
    description: 'Affordable single room with all essential amenities for budget-conscious travelers.',
    amenities: ['Wi-Fi', 'Fan', 'Shared Bathroom', 'Locker'],
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    ],
    status: 'available',
    capacity: 1,
    floor: 3,
  },
];

export const mockGuests: Guest[] = [
  {
    id: 'guest-1',
    firstName: 'Kwame',
    lastName: 'Asante',
    email: 'kwame.asante@email.com',
    phone: '+233 24 123 4567',
    idNumber: 'GHA-123456789',
    nationality: 'Ghanaian',
  },
  {
    id: 'guest-2',
    firstName: 'Ama',
    lastName: 'Mensah',
    email: 'ama.mensah@email.com',
    phone: '+233 20 987 6543',
    idNumber: 'GHA-987654321',
    nationality: 'Ghanaian',
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    roomId: 'room-102',
    guestId: 'guest-1',
    checkIn: new Date('2024-12-01'),
    checkOut: new Date('2024-12-03'),
    nights: 2,
    totalAmount: 400,
    status: 'checked-in',
    accessCode: '847291',
    paymentStatus: 'paid',
    createdAt: new Date('2024-11-28'),
  },
  {
    id: 'booking-2',
    roomId: 'room-202',
    guestId: 'guest-2',
    checkIn: new Date('2024-12-05'),
    checkOut: new Date('2024-12-08'),
    nights: 3,
    totalAmount: 750,
    status: 'confirmed',
    accessCode: '563829',
    paymentStatus: 'paid',
    createdAt: new Date('2024-11-30'),
  },
];

export const mockAccessLogs: AccessLog[] = [
  {
    id: 'log-1',
    roomId: 'room-102',
    bookingId: 'booking-1',
    timestamp: new Date('2024-12-01T14:30:00'),
    action: 'entry',
    method: 'code',
  },
  {
    id: 'log-2',
    roomId: 'room-102',
    bookingId: 'booking-1',
    timestamp: new Date('2024-12-01T18:45:00'),
    action: 'exit',
    method: 'code',
  },
  {
    id: 'log-3',
    roomId: 'room-102',
    bookingId: 'booking-1',
    timestamp: new Date('2024-12-01T21:15:00'),
    action: 'entry',
    method: 'qr',
  },
];

export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    type: 'checkout_due',
    roomId: 'room-102',
    message: 'Guest checkout due in 2 hours',
    timestamp: new Date(),
    acknowledged: false,
    severity: 'medium',
  },
  {
    id: 'alert-2',
    type: 'cleaning_needed',
    roomId: 'room-301',
    message: 'Room requires cleaning after checkout',
    timestamp: new Date(),
    acknowledged: false,
    severity: 'low',
  },
];

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'owner@guesthouse.com',
    name: 'Daniel Owusu',
    role: 'owner',
    phone: '+233 24 555 1234',
  },
  {
    id: 'user-2',
    email: 'reception@guesthouse.com',
    name: 'Grace Adjei',
    role: 'receptionist',
    phone: '+233 20 555 5678',
  },
];

export const generateAccessCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const calculateTotalPrice = (pricePerNight: number, nights: number): number => {
  return pricePerNight * nights;
};

export const formatCurrency = (amount: number): string => {
  return `GH₵ ${amount.toLocaleString()}`;
};
