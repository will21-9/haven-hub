import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Building2,
  LayoutDashboard,
  BedDouble,
  Users,
  CalendarCheck,
  Bell,
  Settings,
  LogOut,
  BarChart3,
  Shield,
  Clock,
  CreditCard,
  PlusCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  ownerOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '', icon: LayoutDashboard },
  { label: 'Rooms', href: '/rooms', icon: BedDouble },
  { label: 'Bookings', href: '/bookings', icon: CalendarCheck },
  { label: 'Payments', href: '/payments', icon: CreditCard },
  { label: 'Alerts', href: '/alerts', icon: Bell },
  { label: 'Access Control', href: '/access-control', icon: Shield },
  { label: 'Revenue', href: '/revenue', icon: BarChart3, ownerOnly: true },
  { label: 'Staff', href: '/staff', icon: Users, ownerOnly: true },
  { label: 'Add Room', href: '/add-room', icon: PlusCircle, ownerOnly: true },
];

export const DashboardSidebar = () => {
  const { user, role, signOut } = useAuth();
  const location = useLocation();
  const basePath = role === 'owner' ? '/owner' : '/receptionist';

  const filteredNavItems = navItems.filter(
    (item) => !item.ownerOnly || role === 'owner'
  );

  const displayName = user?.email?.split('@')[0] || 'User';

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <Building2 className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        <span className="font-display text-lg font-bold">StayEase</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {filteredNavItems.map((item) => {
          const isActive =
            location.pathname === `${basePath}${item.href}` ||
            (item.href === '' && location.pathname === basePath);
          return (
            <Link
              key={item.href}
              to={`${basePath}${item.href}`}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="border-t border-sidebar-border p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent">
            <span className="text-sm font-medium">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">{displayName}</p>
            <p className="truncate text-xs capitalize text-sidebar-foreground/60">
              {role}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            to={`${basePath}/settings`}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-sidebar-accent/50 px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <button
            onClick={async () => {
              await signOut();
              window.location.href = '/';
            }}
            className="flex items-center justify-center rounded-lg bg-destructive/20 px-3 py-2 text-destructive transition-colors hover:bg-destructive/30"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
