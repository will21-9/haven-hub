import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockRooms, formatCurrency } from '@/data/mockData';
import { Room, RoomStatus } from '@/types';
import { motion } from 'framer-motion';
import { Search, Users, BedDouble, Filter } from 'lucide-react';

const ManageRooms = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RoomStatus | 'all'>('all');

  const filteredRooms = mockRooms.filter((room) => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: mockRooms.length,
    available: mockRooms.filter((r) => r.status === 'available').length,
    occupied: mockRooms.filter((r) => r.status === 'occupied').length,
    reserved: mockRooms.filter((r) => r.status === 'reserved').length,
    cleaning: mockRooms.filter((r) => r.status === 'cleaning').length,
  };

  return (
    <DashboardLayout
      title="Manage Rooms"
      subtitle="View and manage all rooms"
    >
      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', 'available', 'occupied', 'reserved', 'cleaning'] as const).map(
            (status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className="capitalize"
              >
                {status} ({statusCounts[status]})
              </Button>
            )
          )}
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRooms.map((room, index) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card variant="dashboard" className="overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={room.images[0]}
                  alt={room.name}
                  className="h-full w-full object-cover"
                />
                <Badge
                  variant={room.status}
                  className="absolute right-2 top-2"
                >
                  {room.status}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display font-semibold">{room.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Floor {room.floor} • {room.type}
                    </p>
                  </div>
                  <p className="font-bold text-primary">
                    {formatCurrency(room.pricePerNight)}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{room.capacity}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BedDouble className="h-4 w-4" />
                    <span className="capitalize">{room.type}</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
                  {room.status === 'available' && (
                    <Button size="sm" className="flex-1">
                      Quick Book
                    </Button>
                  )}
                  {room.status === 'cleaning' && (
                    <Button size="sm" variant="secondary" className="flex-1">
                      Mark Ready
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="py-12 text-center">
          <BedDouble className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
          <p className="text-lg text-muted-foreground">No rooms found</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManageRooms;
