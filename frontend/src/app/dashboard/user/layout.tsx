// import { Sidebar } from "@/components/shared/Sidebar";
// import { Navbar } from "@/components/shared/Navbar";

// export default function AdminLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex min-h-screen bg-black w-full text-white">
//       <Sidebar />
//       <div className="flex flex-col flex-1">
//         <Navbar />
//         <main className="w-full p-6">{children}</main>
//       </div>
//     </div>
//   );
// }
'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/shared/Sidebar';
import { Navbar } from '@/components/shared/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // controls sidebar on mobile
  const [isCollapsed, setIsCollapsed] = useState(false); // controls desktop collapse
  // const role = session?.user?.role || 'user'

  return (
    <div className="flex min-h-screen bg-black w-full text-white">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        role="user"
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          role="user"
        />
        <main className="w-full p-6">{children}</main>
      </div>
    </div>
  );
}
