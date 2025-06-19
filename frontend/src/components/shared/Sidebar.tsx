'use client';

import {
  ClipboardCheck,
  Gift,
  LayoutDashboard,
  Menu,
  Settings,
  Star,
  UserRoundCog,
  Users,
} from 'lucide-react';
import clsx from 'clsx';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import TelegramJoinCard from './dashboard/TelegramJoinCard';
import { Button } from '@/components/ui/button';
import { SidebarProps } from '@/types';



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

const adminNavItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/admin' },
  { label: 'Users', icon: UserRoundCog, href: '/dashboard/admin/users' },
  { label: 'Airdrops', icon: Gift, href: '/dashboard/admin/airdrops' },
  {
    label: 'Expert Recommendation',
    icon: Star,
    href: '/dashboard/admin/expertrecommendation',
  },
  {
    label: 'Weekly Task',
    icon: ClipboardCheck,
    href: '/dashboard/admin/weeklytask',
  },
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

  const handleNavClick = (href: string) => {
    router.push(href);
    setSidebarOpen(false);
  };

  return (
    <>
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
          <div className="flex items-center justify-start mb-6">
            <Button
              variant="ghost"
              size="icon"
              className="text-white cursor-pointer hover:bg-[#8373EE] hover:text-white"
              onClick={() => {
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
                  className='w-auto h-10'
                />
              </div>
            )}
          </div>

          <nav className="space-y-2">
            {navItems.map(({ label, icon: Icon, href }) => {
  const isDashboard = href === '/dashboard/admin' || href === '/dashboard/user';
  const isActive = isDashboard
    ? pathname === href
    : pathname.startsWith(href);              return (
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

        {(!isCollapsed || sidebarOpen) && <TelegramJoinCard />}
      </aside>
    </>
  );
}
