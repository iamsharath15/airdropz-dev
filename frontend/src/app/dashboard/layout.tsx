'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import type { RootState } from '@/store';

import { Sidebar } from '@/components/shared/Sidebar';
import { Navbar } from '@/components/shared/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 🔥 Get user role from Redux store
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = user ? true : false; // Check if user is authenticated
  const role: 'admin' | 'user' = user?.role === 'admin' ? 'admin' : 'user';

  const router = useRouter();

  // Redirect to login if the user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/'); // Or any other login page URL
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex min-h-screen bg-black w-full text-white">
      {/* Sidebar with role-based dynamic display */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        role={role} // ✅ Dynamic role passed to Sidebar
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar with role-based dynamic display */}
        <Navbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          role={role} // ✅ Dynamic role passed to Navbar
        />
        
        {/* Main content area */}
        <main className="w-full p-6">{children}</main>
      </div>
    </div>
  );
}
