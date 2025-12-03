import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateRoom } from '@/hooks/useRooms';
import { toast } from '@/hooks/use-toast';
import { Loader2, Plus, X } from 'lucide-react';

const AddRoom = () => {
  const navigate = useNavigate();
  const createRoom = useCreateRoom();
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'single' as 'single' | 'double' | 'suite' | 'deluxe',
    price_per_night: '',
    description: '',
    capacity: '2',
    floor: '1',
  });
  const [amenities, setAmenities] = useState<string[]>(['WiFi', 'AC']);
  const [newAmenity, setNewAmenity] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createRoom.mutateAsync({
        name: formData.name,
        type: formData.type,
        price_per_night: Number(formData.price_per_night),
        description: formData.description || null,
        amenities,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],
        status: 'available',
        capacity: Number(formData.capacity),
        floor: Number(formData.floor),
      });
      
      toast({
        title: 'Room Created',
        description: `${formData.name} has been added successfully.`,
      });
      
      navigate('/owner/rooms');
    } catch (error) {
      console.error('Error creating room:', error);
      toast({
        title: 'Error',
        description: 'Failed to create room. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setAmenities(amenities.filter((a) => a !== amenity));
  };

  const addImage = () => {
    if (imageUrl.trim() && !images.includes(imageUrl.trim())) {
      setImages([...images, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const removeImage = (url: string) => {
    setImages(images.filter((i) => i !== url));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Add New Room</h1>
          <p className="text-muted-foreground">Create a new room for your guest house</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Room Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Room Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Room 301"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Room Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'single' | 'double' | 'suite' | 'deluxe') =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="double">Double</SelectItem>
                      <SelectItem value="suite">Suite</SelectItem>
                      <SelectItem value="deluxe">Deluxe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="price">Price per Night (GH₵)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price_per_night}
                    onChange={(e) => setFormData({ ...formData, price_per_night: e.target.value })}
                    placeholder="200"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="2"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="floor">Floor</Label>
                  <Input
                    id="floor"
                    type="number"
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    placeholder="1"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the room features and atmosphere..."
                  rows={3}
                />
              </div>

              {/* Amenities */}
              <div>
                <Label>Amenities</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeAmenity(amenity)}
                        className="ml-1 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <Input
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="Add amenity..."
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                  />
                  <Button type="button" variant="outline" onClick={addAmenity}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Images */}
              <div>
                <Label>Images (URLs)</Label>
                <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
                  {images.map((url) => (
                    <div key={url} className="relative">
                      <img src={url} alt="Room" className="h-24 w-full rounded-lg object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(url)}
                        className="absolute -right-1 -top-1 rounded-full bg-destructive p-1 text-destructive-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Image URL..."
                  />
                  <Button type="button" variant="outline" onClick={addImage}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/owner/rooms')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createRoom.isPending}>
                  {createRoom.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Room'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AddRoom;
