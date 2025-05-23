// "use client";

// import { useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import {
//   Home,
//   Gift,
//   ClipboardCheck,
//   Star,
//   Users,
//   Settings,
//   Menu,
//   Bitcoin,
// } from "lucide-react";
// import clsx from "clsx";
// import Image from "next/image"; // assuming you're using next/image

// const navItems = [
//   { label: "Dashboard", icon: Home, href: "/dashboard" },
//   { label: "Airdrops", icon: Gift, href: "/dashboard/airdrops" },
//   { label: "Weekly Task", icon: ClipboardCheck, href: "/dashboard/weeklytask" },
//   { label: "Expert Recommendation", icon: Star, href: "/dashboard/expertrecommendation" },
//   { label: "Refer & earn", icon: Users, href: "/dashboard/referandearn" },
//   { label: "Settings", icon: Settings, href: "/dashboard/settings" },
// ];

// export function Sidebar() {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const pathname = usePathname();
//   const router = useRouter();

//   return (
//     <aside
//       className={clsx(
//         "bg-[#0d0d0d] border-r border-gray-800 p-4 flex flex-col justify-between transition-all duration-300",
//         isCollapsed ? "w-20" : "w-64"
//       )}
//     >
//       <div>
//         {/* Toggle Button */}
//         <div className="flex items-center justify-start mb-6">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="text-white cursor-pointer hover:bg-[#8373EE] hover:text-white"
//             onClick={() => setIsCollapsed(!isCollapsed)}
//           >
//             <Menu />
//           </Button>

//           {/* Logo (Only show when expanded) */}
//           {!isCollapsed && (
//             <div className="ml-2">
//               <Image
//                 src="https://airdropzofficial-static-v1.s3.ap-south-1.amazonaws.com/static-image-v1/plans/airdropz-plan-light.png" // your logo path
//                 alt="Logo"
//                 width={80}
//                 height={25}
//               />
//             </div>
//           )}
//         </div>

//         {/* Nav Items */}
//         <nav className="space-y-2">
//           {navItems.map(({ label, icon: Icon, href }) => {
//             const isActive = pathname === href;
//             return (
//               <Button
//                 key={label}
//                 onClick={() => router.push(href)}
//                 variant="ghost"
//                 className={clsx(
//                   "w-full justify-start gap-3 hover:bg-[#8373ee52] hover:text-white cursor-pointer text-white",
//                   isActive ? "bg-[#8373EE]" : ""
//                 )}
//               >
//                 <Icon size={18} />
//                 {!isCollapsed && <span>{label}</span>}
//               </Button>
//             );
//           })}
//         </nav>
//       </div>

//       {/* Telegram CTA */}
//       {!isCollapsed && (
//         <div className="mt-6 bg-[#1a1a2e] p-4 rounded-xl text-center">
//           <div className="flex justify-center mb-2">
//             <Bitcoin className="text-orange-400" />
//           </div>
//           <p className="text-xs text-gray-400 mb-2">
//             Join our Telegram community for airdrop updates
//           </p>
//           <Button className="w-full text-black bg-white text-xs font-medium">
//             Join Telegram
//           </Button>
//         </div>
//       )}
//     </aside>
//   );
// }
import { Button } from '@/components/ui/button';
import { Menu, Bitcoin } from 'lucide-react';
import clsx from 'clsx';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
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
}
const navItems = [
  { label: 'Dashboard', icon: Home, href: '/dashboard' },
  { label: 'Airdrops', icon: Gift, href: '/dashboard/airdrops' },
  { label: 'Weekly Task', icon: ClipboardCheck, href: '/dashboard/weeklytask' },
  {
    label: 'Expert Recommendation',
    icon: Star,
    href: '/dashboard/expertrecommendation',
  },
  { label: 'Refer & earn', icon: Users, href: '/dashboard/referandearn' },
  { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
];
export function Sidebar({
  isCollapsed,
  setIsCollapsed,
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

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
                  src="https://airdropzofficial-static-v1.s3.ap-south-1.amazonaws.com/static-image-v1/plans/airdropz-plan-light.png"
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
