'use client';

import { usePathname } from 'next/navigation';
import { Bell, Menu } from 'lucide-react';
import { Button } from '../ui/button';

interface NavbarProps {
  toggleSidebar: () => void;
  role: 'admin' | 'user';
}

// Optional: Different titles for admin and user (in case they vary)
const pageTitles: Record<string, Record<string, string>> = {
  user: {
    '/dashboard/user': 'Dashboard',
    '/dashboard/user/airdrops': 'Airdrops',
    '/dashboard/user/weeklytask': 'Weekly Task',
    '/dashboard/user/expertrecommendation': 'Expert Recommendation',
    '/dashboard/user/referandearn': 'Refer & Earn',
    '/dashboard/user/settings': 'Settings',
  },
  admin: {
    '/dashboard/admin': 'Admin Dashboard',
    '/dashboard/admin/airdrops': 'Manage Airdrops',
    '/dashboard/admin/weeklytask': 'Manage Weekly Tasks',
    '/dashboard/admin/expertrecommendation': 'Expert Insights',
    '/dashboard/admin/referandearn': 'Referral Analytics',
    '/dashboard/admin/settings': 'Admin Settings',
  },
};

export function Navbar({ toggleSidebar, role }: NavbarProps) {
  const pathname = usePathname();

  // Get title based on role and path
  const pageTitle =
    pageTitles[role]?.[pathname] || (role === 'admin' ? 'Admin Dashboard' : 'Dashboard');

  return (
    <header className="h-16 border-b border-[#272727] px-6 flex items-center justify-between bg-black">
      <div className="flex items-center gap-4">
        {/* Mobile Sidebar Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white cursor-pointer bg-[#242424] hover:bg-[#8373EE] hover:text-white"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu />
        </Button>

        {/* Page Title */}
        <h1 className="text-white text-lg font-semibold">{pageTitle}</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <Bell className="text-white" size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500" />
        </div>

        {/* User Avatar Placeholder */}
        <div className="w-8 h-8 rounded-full bg-gray-300" />
      </div>
    </header>
  );
}
