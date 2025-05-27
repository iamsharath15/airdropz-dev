'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/shared/Sidebar';
import { Navbar } from '@/components/shared/Navbar';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // controls sidebar on mobile
  const [isCollapsed, setIsCollapsed] = useState(false); // controls desktop collapse

  return (
    <div className="flex min-h-screen bg-black w-full text-white">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        role="admin"
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          role="admin"
        />
        <main className="w-full p-6">{children}</main>
      </div>
    </div>
  );
}
