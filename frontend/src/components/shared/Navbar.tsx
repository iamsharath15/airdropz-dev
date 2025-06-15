'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store'; // update path to your store
import { logout as logoutAction } from '@/store/authSlice'; // your auth slice logout action

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
import { logout } from '@/app/(auth)/logout/page';
import Image from 'next/image';

interface NavbarProps {
  toggleSidebar: () => void;
  role: 'admin' | 'user';
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
    '/dashboard/admin/users': 'Manage User Details',
    '/dashboard/admin/airdrops': 'Manage Airdrops',
      '/dashboard/admin/airdrops/create/*': 'Create Airdrop',
    '/dashboard/admin/weeklytask': 'Manage Weekly Tasks',
    '/dashboard/admin/expertrecommendation': 'Expert Insights',
    '/dashboard/admin/referandearn': 'Referral Analytics',
    '/dashboard/admin/settings': 'Admin Settings',
  },
};

export function Navbar({ toggleSidebar, role }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  // Get user info from redux store
  const user = useSelector((state: RootState) => state.auth.user);

  const pageTitle =
    pageTitles[role]?.[pathname] ||
    (role === 'admin' ? 'Admin Dashboard' : 'Dashboard');

  const handleLogout = async () => {
     if (user?.id) {
    const localKey = `streak-${user.id}-date`;
    localStorage.removeItem(localKey);
  }
    dispatch(logoutAction());
    await logout();
    router.push('/'); 
  };

  const handleAccountSettings = () => {
    router.push('/dashboard/user/settings'); // or admin settings path
  };

  const userName = user?.user_name || 'User';
  const userEmail = user?.email || 'user@example.com';
  const userProfile = user?.profile_image;


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
            
            {userProfile ? (
  <Image
    src={userProfile}
    alt="User Avatar"
    width={32}
    height={32}
    className="rounded-full object-cover w-8 h-8 cursor-pointer"
  />
) : (
  <button
    aria-label="User menu"
    className="w-8 h-8 cursor-pointer rounded-full bg-gray-300 flex items-center justify-center select-none text-black font-semibold"
  >
    {userName.charAt(0).toUpperCase()}
  </button>
)}

          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={5}
            className="text-black"
          >
            <DropdownMenuLabel className="px-4 py-2 ">
              Profile
              <div className="flex">
                <div className="flex items-center justify-center pr-3">
                        {userProfile ? (
  <Image
    src={userProfile}
    alt="User Avatar"
    width={32}
    height={32}
    className="rounded-full object-cover w-8 h-8 cursor-pointer"
  />
) : (
                  <div className="w-8 h-8 cursor-pointer rounded-full bg-gray-300 flex items-center justify-center select-none text-black font-semibold">
                    {userName.charAt(0).toUpperCase()}
                      </div>
                      )}

                </div>
                <div className=" flex flex-col items-start justify-center">
                  <div className="mt-1 text-sm font-medium">{userName}</div>
                  <div className="text-xs text-gray-600 truncate">
                    {userEmail}
                  </div>
                </div>
              </div>
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
