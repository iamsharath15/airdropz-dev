'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Bell, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { logout } from '@/app/(auth)/logout/page'; // your logout function

interface NavbarProps {
  toggleSidebar: () => void;
  role: 'admin' | 'user';
  user: {
    name: string;
    email: string;
  };
}

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

export function Navbar({ toggleSidebar, role, user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const pageTitle =
    pageTitles[role]?.[pathname] ||
    (role === 'admin' ? 'Admin Dashboard' : 'Dashboard');

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleAccountSettings = () => {
    router.push('/dashboard/user/settings'); // or admin settings path
  };

  return (
    <header className="h-16 border-b border-[#272727] px-6 flex items-center justify-between bg-black">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white cursor-pointer bg-[#242424] hover:bg-[#8373EE] hover:text-white"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu />
        </Button>
        <h1 className="text-white text-lg font-semibold">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell className="text-white" size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="User menu"
              className="w-8 h-8 cursor-pointer rounded-full bg-gray-300 flex items-center justify-center select-none text-black font-semibold"
            >
              {/* {user.name.charAt(0).toUpperCase()} */}
              hi
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={5}
            className="text-black"
          >
            <DropdownMenuLabel className="px-4 py-2 border-b border-gray-200">
              Profile
              {/* <div className="mt-1 text-sm font-medium">{user.name}</div> */}
              <div className="mt-1 text-sm font-medium">hi</div>
              {/* <div className="text-xs text-gray-600 truncate">{user.email}</div> */}
              <div className="text-xs text-gray-600 truncate">hi@gmail.com</div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={handleAccountSettings}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
            >
              Account Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={handleLogout}
              className="cursor-pointer px-4 py-2 text-red-600 font-semibold hover:bg-gray-100"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
