'use client';
import { Button } from '@/components/ui/button';
import { Menu, Bitcoin } from 'lucide-react';
import clsx from 'clsx';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Gift,
  ClipboardCheck,
  Star,
  Users,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
  role: 'admin' | 'user';
}

// Navigation items for User
const userNavItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/user' },
  { label: 'Airdrops', icon: Gift, href: '/dashboard/user/airdrops' },
  {
    label: 'Weekly Task',
    icon: ClipboardCheck,
    href: '/dashboard/user/weeklytask',
  },
  {
    label: 'Expert Recommendation',
    icon: Star,
    href: '/dashboard/user/expertrecommendation',
  },
  { label: 'Refer & earn', icon: Users, href: '/dashboard/user/referandearn' },
  { label: 'Settings', icon: Settings, href: '/dashboard/user/settings' },
];

// Navigation items for Admin
const adminNavItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/admin' },
  { label: 'Users', icon: Users, href: '/dashboard/admin/users' },
  { label: 'Airdrops', icon: Gift, href: '/dashboard/admin/airdrops' },
  { label: 'Weekly Stats', icon: ClipboardCheck, href: '/dashboard/admin/weekly' },
  { label: 'Settings', icon: Settings, href: '/dashboard/admin/settings' },
];

export function Sidebar({
  isCollapsed,
  setIsCollapsed,
  sidebarOpen,
  setSidebarOpen,
  role,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = role === 'admin' ? adminNavItems : userNavItems;

  // Close sidebar on mobile when nav item clicked
  const handleNavClick = (href: string) => {
    router.push(href);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Overlay backdrop for mobile when sidebar is open */}
      <div
        className={clsx(
          'fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity',
          sidebarOpen ? 'opacity-50 visible' : 'opacity-0 invisible'
        )}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={clsx(
          'bg-[#0d0d0d] border-r border-[#272727] p-4 flex flex-col justify-between transition-all duration-300 z-50',
          'fixed inset-y-0 left-0 w-64 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0',
          isCollapsed ? 'md:w-20' : 'md:w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div>
          {/* Toggle Button */}
          <div className="flex items-center justify-start mb-6">
            <Button
              variant="ghost"
              size="icon"
              className="text-white cursor-pointer hover:bg-[#8373EE] hover:text-white"
              onClick={() => {
                // Collapse on desktop, close on mobile
                if (window.innerWidth >= 768) {
                  setIsCollapsed(!isCollapsed);
                } else {
                  setSidebarOpen(false);
                }
              }}
            >
              <Menu />
            </Button>

            {!isCollapsed && !sidebarOpen && (
              <div className="ml-2">
                <Image
                  src="https://cdn.lootcrate.me/static-image-v1/plans/airdropz-plan-light.png"
                  alt="Logo"
                  width={80}
                  height={25}
                />
              </div>
            )}
          </div>

          {/* Nav Items */}
          <nav className="space-y-2">
            {navItems.map(({ label, icon: Icon, href }) => {
              const isActive = pathname === href;
              return (
                <Button
                  key={label}
                  onClick={() => handleNavClick(href)}
                  variant="ghost"
                  className={clsx(
                    'w-full justify-start gap-3 hover:bg-[#8373ee52] hover:text-white cursor-pointer text-white',
                    isActive ? 'bg-[#8373EE]' : ''
                  )}
                >
                  <Icon size={18} />
                  {(!isCollapsed || sidebarOpen) && <span>{label}</span>}
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Telegram CTA */}
        {(!isCollapsed || sidebarOpen) && (
          <div className="mt-6 bg-[#1a1a2e] p-4 rounded-xl text-center">
            <div className="flex justify-center mb-2">
              <Bitcoin className="text-orange-400" />
            </div>
            <p className="text-xs text-gray-400 mb-2">
              Join our Telegram community for airdrop updates
            </p>
            <Button className="w-full text-black bg-white text-xs font-medium">
              Join Telegram
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}
