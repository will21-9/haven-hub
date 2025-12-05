import { Room } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/data/mockData';
import { Users, Wifi, Wind, Tv, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RoomCardProps {
  room: Room;
  index?: number;
  showStatus?: boolean;
}

export const RoomCard = ({ room, index = 0, showStatus = false }: RoomCardProps) => {
  const { role } = useAuth();
  const isStaff = role === 'owner' || role === 'receptionist';
  const getStatusBadge = () => {
    switch (room.status) {
      case 'available':
        return <Badge variant="available">Available</Badge>;
      case 'occupied':
        return <Badge variant="occupied">Occupied</Badge>;
      case 'reserved':
        return <Badge variant="reserved">Reserved</Badge>;
      case 'cleaning':
        return <Badge variant="cleaning">Cleaning</Badge>;
    }
  };

  const getAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase();
    if (lowerAmenity.includes('wi-fi')) return <Wifi className="h-3.5 w-3.5" />;
    if (lowerAmenity.includes('air')) return <Wind className="h-3.5 w-3.5" />;
    if (lowerAmenity.includes('tv')) return <Tv className="h-3.5 w-3.5" />;
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card variant="room" className="group">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={room.images[0]}
            alt={room.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          {(showStatus || isStaff) && <div className="absolute right-3 top-3">{getStatusBadge()}</div>}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="font-display text-xl font-semibold text-primary-foreground">
              {room.name}
            </h3>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Floor {room.floor}
            </p>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-sm">
                {room.capacity} {room.capacity === 1 ? 'Guest' : 'Guests'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {room.amenities.slice(0, 3).map((amenity) => {
                const icon = getAmenityIcon(amenity);
                return icon ? (
                  <span
                    key={amenity}
                    className="text-muted-foreground"
                    title={amenity}
                  >
                    {icon}
                  </span>
                ) : null;
              })}
            </div>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(room.pricePerNight)}
              </p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Moon className="h-3 w-3" />
                <span>per night</span>
              </div>
            </div>
            <Button
              size="sm"
              variant={room.status === 'available' ? 'default' : 'outline'}
              disabled={room.status !== 'available'}
              asChild={room.status === 'available'}
            >
              {room.status === 'available' ? (
                <Link to={`/book/${room.id}`}>Book Now</Link>
              ) : (
                <span>Unavailable</span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
