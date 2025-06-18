'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { logout as logoutAction } from '@/store/authSlice';
import {
  Bell,
  Menu,
  Rocket as RocketIcon,
  Star as StarIcon,
  ClipboardList as ClipboardListIcon,
} from 'lucide-react';
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
import axios from 'axios';
import type { NavbarProps } from '@/types';


const pageTitles: Record<string, Record<string, string>> = {
  user: {
    '/dashboard/user': 'Dashboard',
    '/dashboard/user/airdrops': 'Airdrops',
    '/dashboard/user/airdrops/*': 'Airdrops',
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

  const user = useSelector((state: RootState) => state.auth.user);
  const userName = user?.user_name || 'User';
  const userEmail = user?.email || 'user@example.com';
  const userProfile = user?.profile_image;

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const resolvePageTitle = (
    role: 'admin' | 'user',
    pathname: string
  ): string => {
    const routes = pageTitles[role];
    if (routes[pathname]) return routes[pathname];

    if (role === 'user') {
      if (pathname.startsWith('/dashboard/user/airdrops/'))
        return 'View Airdrop';
      if (pathname.startsWith('/dashboard/user/weeklytask/'))
        return 'Weekly Task Details';
    }

    if (role === 'admin') {
      if (pathname.startsWith('/dashboard/admin/airdrops/create/'))
        return 'Create Airdrop';
      if (pathname.startsWith('/dashboard/admin/airdrops/'))
        return 'Edit Airdrop';
      if (pathname.startsWith('/dashboard/admin/users/')) return 'User Details';
      if (pathname.startsWith('/dashboard/admin/weeklytask/create/'))
        return 'Edit Weekly Task';
    }

    return role === 'admin' ? 'Admin Dashboard' : 'Dashboard';
  };

  const pageTitle = resolvePageTitle(role, pathname);

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
    router.push('/dashboard/user/settings');
  };

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoadingNotifications(true);
        const res = await axios.get(
          'http://localhost:8080/api/notification/v1/notifications?page=1&per_page=5',
          { withCredentials: true }
        );
        setNotifications(res.data?.data || []);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (
    notificationId: string,
    targetUrl: string
  ) => {
    try {
      await axios.put(
        `http://localhost:8080/api/notification/v1/read/${notificationId}`,
        {},
        { withCredentials: true }
      );
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
      if (targetUrl) router.push(targetUrl);
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals: [number, string][] = [
      [60, 'second'],
      [60 * 60, 'minute'],
      [60 * 60 * 24, 'hour'],
      [60 * 60 * 24 * 7, 'day'],
      [60 * 60 * 24 * 30, 'week'],
      [60 * 60 * 24 * 365, 'month'],
      [Infinity, 'year'],
    ];

    let unit = 'second';
    let value = seconds;

    for (let i = 0; i < intervals.length; i++) {
      if (seconds < intervals[i][0]) break;
      value = Math.floor(seconds / intervals[i][0]);
      unit = intervals[i][1];
    }

    return `${value} ${unit}${value !== 1 ? 's' : ''} ago`;
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="relative cursor-pointer">
                <Bell className="text-white" size={20} />
                {notifications.some((n) => !n.is_read) && (
                  <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500" />
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 max-h-72 overflow-y-auto bg-[#121212] border border-[#272727] rounded-md shadow-lg text-white"
            >
              <DropdownMenuLabel className="px-4 py-3 text-base font-semibold border-b border-[#272727]">
                Notifications
              </DropdownMenuLabel>

              <div className="flex flex-col space-y-2 px-2 py-2">
                {' '}
                {/* Add this wrapper */}
                {notifications.length === 0 ? (
                  <div className="text-center text-sm text-gray-400 px-4 py-6">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((note) => (
                    <DropdownMenuItem
                      key={note.id}
                      onClick={() => handleMarkAsRead(note.id, note.target_url)}
                      className={`px-4 py-3 gap-3 items-start rounded-md ${
                        note.is_read ? 'bg-neutral-800' : 'bg-[#8373EE]/30'
                      } hover:bg-[#1f1f1f] transition-colors cursor-pointer`}
                    >
                      <div className="flex-shrink-0">
                        {note.type === 'airdrop' && (
                          <RocketIcon className="text-purple-400 w-5 h-5" />
                        )}
                        {note.type === 'points' && (
                          <StarIcon className="text-yellow-400 w-5 h-5" />
                        )}
                        {note.type === 'task' && (
                          <ClipboardListIcon className="text-blue-400 w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{note.title}</p>
                        <p className="text-xs text-gray-400">{note.message}</p>
                      </div>
                      <span className="text-[10px] text-gray-500">
                        {formatTimeAgo(note.created_at)}
                      </span>
                    </DropdownMenuItem>
                  ))
                )}
              </div>

              <DropdownMenuSeparator className="bg-[#272727]" />
              <div className="px-4 py-2 text-sm text-center text-purple-400 hover:underline cursor-pointer">
                View All Notifications
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
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
            <DropdownMenuLabel className="px-4 py-2">
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
                <div className="flex flex-col items-start justify-center">
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
