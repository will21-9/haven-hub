import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { RoomCard } from '@/components/rooms/RoomCard';
import { mockRooms } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Smartphone,
  CreditCard,
  Clock,
  Star,
  ArrowRight,
  Building2,
} from 'lucide-react';

const Index = () => {
  const featuredRooms = mockRooms.filter((r) => r.status === 'available').slice(0, 3);

  const features = [
    {
      icon: Smartphone,
      title: 'Digital Access',
      description: 'Get your unique access code or QR instantly after booking',
    },
    {
      icon: Shield,
      title: 'Secure Entry',
      description: 'Smart lock system with real-time access monitoring',
    },
    {
      icon: CreditCard,
      title: 'Easy Payments',
      description: 'Fixed nightly rates with secure online payment',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock assistance for all your needs',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-95" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="container relative z-10 px-4 py-24 md:py-32 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm text-primary-foreground backdrop-blur-sm">
                <Star className="h-4 w-4 text-secondary" />
                <span>Premium Guest House Experience</span>
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
                Your Comfort,
                <span className="block text-secondary">Our Priority</span>
              </h1>
              <p className="mt-6 text-lg text-primary-foreground/80 md:text-xl">
                Experience modern hospitality with smart room access, instant
                booking, and seamless digital payments. Book your perfect stay
                today.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button variant="gold" size="xl" asChild>
                  <Link to="/rooms">
                    Browse Rooms
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  asChild
                >
                  <Link to="/login">Staff Login</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Why Choose StayEase?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Modern amenities and smart technology for a hassle-free stay
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-semibold">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="bg-muted/30 py-20">
        <div className="container px-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                Featured Rooms
              </h2>
              <p className="mt-2 text-muted-foreground">
                Discover our most popular accommodations
              </p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link to="/rooms">
                View All Rooms
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredRooms.map((room, index) => (
              <RoomCard key={room.id} room={room} index={index} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Button asChild>
              <Link to="/rooms">View All Rooms</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="overflow-hidden rounded-2xl bg-hero-gradient p-8 md:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <Building2 className="mx-auto h-12 w-12 text-secondary" />
              <h2 className="mt-4 font-display text-3xl font-bold text-primary-foreground md:text-4xl">
                Ready to Book Your Stay?
              </h2>
              <p className="mt-4 text-primary-foreground/80">
                Experience comfort like never before. Browse our rooms, book
                instantly, and get your digital access code immediately.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button variant="gold" size="lg" asChild>
                  <Link to="/rooms">Book Now</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  asChild
                >
                  <Link to="/login">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Building2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold">StayEase</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 StayEase Guest House. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </Layout>
  );
};

export default Index;
