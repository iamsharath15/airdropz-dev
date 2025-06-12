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

  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = user ? true : false; 
  const role: 'admin' | 'user' = user?.role === 'admin' ? 'admin' : 'user';

  const router = useRouter();

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
        role={role}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar with role-based dynamic display */}
        <Navbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          role={role} 
        />
        
        {/* Main content area */}
        <main className="w-full p-6">{children}</main>
      </div>
    </div>
  );
}
