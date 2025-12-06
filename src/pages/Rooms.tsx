import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { RoomCard } from '@/components/rooms/RoomCard';
import { useRooms } from '@/hooks/useRooms';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

type RoomStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';

const Rooms = () => {
  const [filterStatus, setFilterStatus] = useState<RoomStatus | 'all'>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const { data: rooms, isLoading, error } = useRooms();
  const { role } = useAuth();
  const isStaff = role === 'owner' || role === 'receptionist';

  const filteredRooms = rooms?.filter((room) => {
    // Staff can filter by status, guests only see rooms filtered by type
    if (isStaff && filterStatus !== 'all' && room.status !== filterStatus) return false;
    if (filterType !== 'all' && room.type !== filterType) return false;
    return true;
  }) ?? [];

  const roomTypes = ['all', 'single', 'double', 'suite', 'deluxe'];
  const statusFilters: (RoomStatus | 'all')[] = ['all', 'available', 'occupied', 'reserved', 'cleaning'];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-hero-gradient py-12">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="font-display text-4xl font-bold text-primary-foreground md:text-5xl">
                Our Rooms
              </h1>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Find your perfect accommodation
              </p>
            </motion.div>
          </div>
        </div>

        {/* Filters */}
        <div className="border-b border-border bg-card py-4">
          <div className="container px-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Room Type Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Type:</span>
                {roomTypes.map((type) => (
                  <Button
                    key={type}
                    variant={filterType === type ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFilterType(type)}
                    className="capitalize"
                  >
                    {type}
                  </Button>
                ))}
              </div>

              {/* Status Filter - Only visible to staff */}
              {isStaff && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Status:</span>
                  {statusFilters.map((status) => (
                    <Badge
                      key={status}
                      variant={
                        filterStatus === status
                          ? status === 'all'
                            ? 'default'
                            : status
                          : 'outline'
                      }
                      className="cursor-pointer capitalize transition-all hover:scale-105"
                      onClick={() => setFilterStatus(status)}
                    >
                      {status}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="container px-4 py-12">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <p className="text-lg text-destructive">Failed to load rooms</p>
            </div>
          ) : filteredRooms.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRooms.map((room, index) => (
                <RoomCard 
                  key={room.id} 
                  room={{
                    id: room.id,
                    name: room.name,
                    type: room.type,
                    pricePerNight: Number(room.price_per_night),
                    description: room.description || '',
                    amenities: room.amenities,
                    images: room.images,
                    status: room.status,
                    capacity: room.capacity,
                    floor: room.floor,
                  }} 
                  index={index} 
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg text-muted-foreground">
                No rooms match your filters
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setFilterStatus('all');
                  setFilterType('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Rooms;
