-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('guest', 'receptionist', 'owner');

-- Create enum for room status
CREATE TYPE public.room_status AS ENUM ('available', 'occupied', 'reserved', 'cleaning');

-- Create enum for room type
CREATE TYPE public.room_type AS ENUM ('single', 'double', 'suite', 'deluxe');

-- Create enum for booking status
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled');

-- Create enum for payment status
CREATE TYPE public.payment_status AS ENUM ('pending', 'confirmed', 'refunded');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'guest',
  UNIQUE (user_id, role)
);

-- Create rooms table
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type room_type NOT NULL DEFAULT 'single',
  price_per_night DECIMAL(10,2) NOT NULL,
  description TEXT,
  amenities TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  status room_status NOT NULL DEFAULT 'available',
  capacity INTEGER NOT NULL DEFAULT 2,
  floor INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create guests table (for walk-in guests without accounts)
CREATE TABLE public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  id_number TEXT,
  nationality TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES public.guests(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  check_in TIMESTAMPTZ NOT NULL,
  check_out TIMESTAMPTZ NOT NULL,
  nights INTEGER NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  access_code TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payment_notifications table (for staff to see pending payments)
CREATE TABLE public.payment_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  phone_number TEXT NOT NULL,
  transaction_reference TEXT,
  is_confirmed BOOLEAN NOT NULL DEFAULT false,
  confirmed_by UUID REFERENCES auth.users(id),
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create guest_house_settings table
CREATE TABLE public.guest_house_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_account_number TEXT NOT NULL,
  payment_account_name TEXT NOT NULL DEFAULT 'StayEase Guest House',
  payment_provider TEXT NOT NULL DEFAULT 'MTN MoMo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create access_logs table
CREATE TABLE public.access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  method TEXT NOT NULL DEFAULT 'code',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium',
  acknowledged BOOLEAN NOT NULL DEFAULT false,
  acknowledged_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default settings with the MoMo number
INSERT INTO public.guest_house_settings (payment_account_number, payment_account_name, payment_provider)
VALUES ('0552841262', 'StayEase Guest House', 'MTN MoMo');

-- Insert some default rooms
INSERT INTO public.rooms (name, type, price_per_night, description, amenities, images, status, capacity, floor) VALUES
('Room 101', 'single', 200, 'Cozy single room with city view', ARRAY['WiFi', 'AC', 'TV'], ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'], 'available', 1, 1),
('Room 102', 'double', 350, 'Spacious double room with balcony', ARRAY['WiFi', 'AC', 'TV', 'Mini Bar'], ARRAY['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'], 'available', 2, 1),
('Room 201', 'suite', 500, 'Luxury suite with living area', ARRAY['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], ARRAY['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'], 'available', 3, 2),
('Room 202', 'deluxe', 450, 'Deluxe room with premium amenities', ARRAY['WiFi', 'AC', 'TV', 'Mini Bar', 'Safe'], ARRAY['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'], 'available', 2, 2);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_house_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Owners can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'owner'));

-- Rooms policies (public read, staff can update)
CREATE POLICY "Anyone can view rooms" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Owners can manage rooms" ON public.rooms FOR ALL USING (public.has_role(auth.uid(), 'owner'));
CREATE POLICY "Receptionists can update rooms" ON public.rooms FOR UPDATE USING (public.has_role(auth.uid(), 'receptionist'));

-- Guests policies
CREATE POLICY "Staff can view guests" ON public.guests FOR SELECT USING (
  public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'receptionist')
);
CREATE POLICY "Staff can manage guests" ON public.guests FOR ALL USING (
  public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'receptionist')
);
CREATE POLICY "Anyone can create guest record" ON public.guests FOR INSERT WITH CHECK (true);

-- Bookings policies
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (
  user_id = auth.uid() OR public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'receptionist')
);
CREATE POLICY "Anyone can create booking" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff can update bookings" ON public.bookings FOR UPDATE USING (
  public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'receptionist')
);

-- Payment notifications policies
CREATE POLICY "Staff can view payment notifications" ON public.payment_notifications FOR SELECT USING (
  public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'receptionist')
);
CREATE POLICY "Anyone can create payment notification" ON public.payment_notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff can update payment notifications" ON public.payment_notifications FOR UPDATE USING (
  public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'receptionist')
);

-- Guest house settings policies (public read, owner can update)
CREATE POLICY "Anyone can view settings" ON public.guest_house_settings FOR SELECT USING (true);
CREATE POLICY "Owners can update settings" ON public.guest_house_settings FOR UPDATE USING (public.has_role(auth.uid(), 'owner'));

-- Access logs policies
CREATE POLICY "Staff can view access logs" ON public.access_logs FOR SELECT USING (
  public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'receptionist')
);
CREATE POLICY "Anyone can create access log" ON public.access_logs FOR INSERT WITH CHECK (true);

-- Alerts policies
CREATE POLICY "Staff can view alerts" ON public.alerts FOR SELECT USING (
  public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'receptionist')
);
CREATE POLICY "Anyone can create alert" ON public.alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff can update alerts" ON public.alerts FOR UPDATE USING (
  public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'receptionist')
);

-- Create trigger for new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.email
  );
  -- Default role is guest
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'guest');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for bookings and payment_notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payment_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;