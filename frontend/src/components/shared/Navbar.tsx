// "use client";

// import { Bell } from "lucide-react";
// import { usePathname } from "next/navigation";

// const pageTitles: Record<string, string> = {
//   "/dashboard": "Dashboard",
//   "/dashboard/airdrops": "Airdrops",
//   "/dashboard/weeklytask": "Weekly Task",
//   "/dashboard/expertrecommendation": "Expert Recommendation",
//   "/dashboard/referandearn": "Refer & Earn",
//   "/dashboard/settings": "Settings",
// };

// export function Navbar() {
//   const pathname = usePathname();
//   const pageTitle = pageTitles[pathname] || "Dashboard";

//   return (
//     <header className="h-16 border-b border-gray-800 px-6 flex items-center justify-between bg-black">
//       {/* Page Title */}
//       <h1 className="text-white text-lg font-semibold">{pageTitle}</h1>

//       {/* Right section: Notification & Avatar */}
//       <div className="flex items-center gap-4">
//         <div className="relative">
//           <Bell className="text-white" size={20} />
//           <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500" />
//         </div>
//         <div className="w-8 h-8 rounded-full bg-gray-300" />
//       </div>
//     </header>
//   );
// }

"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu } from "lucide-react";
import { Button } from "../ui/button";

interface NavbarProps {
  toggleSidebar: () => void;
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/airdrops": "Airdrops",
  "/dashboard/weeklytask": "Weekly Task",
  "/dashboard/expertrecommendation": "Expert Recommendation",
  "/dashboard/referandearn": "Refer & Earn",
  "/dashboard/settings": "Settings",
};

export function Navbar({ toggleSidebar }: NavbarProps) {
  const pathname = usePathname();
  const pageTitle = pageTitles[pathname] || "Dashboard";

  return (
    <header className="h-16 border-b border-[#272727] px-6 flex items-center justify-between bg-black">
      <div className="flex items-center gap-4">
         
        {/* Mobile menu button */}
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

      {/* Right section */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell className="text-white" size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500" />
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-300" />
      </div>
    </header>
  );
}
