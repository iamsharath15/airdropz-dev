'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import type { RootState } from '@/store';

import { Sidebar } from '@/components/shared/Sidebar';
import { Navbar } from '@/components/shared/Navbar';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updateUser } from '@/store/authSlice';

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
const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/'); // Or any other login page URL
    }
  }, [isAuthenticated, router]);
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const today = new Date().toISOString().split('T')[0];
    const localKey = `streak-${user.id}-date`;

    const lastLoggedDate = localStorage.getItem(localKey);

    if (lastLoggedDate !== today) {
      axios
        .post(
          'http://localhost:8080/api/streak/v1/daily-login',
          {},
          {
            withCredentials: true, // ⬅️ important for httpOnly cookies
          }
        )
        .then((res) => {
        const { streakCount, airdropsEarned, airdropsRemaining } = res.data;

        // ✅ Update Redux state
        dispatch(
          updateUser({
            daily_login_streak_count: streakCount,
            airdrops_earned: airdropsEarned,
            airdrops_remaining: airdropsRemaining,
          })
        );

          console.log('[🔥 Daily Streak]', res.data.message);
          localStorage.setItem(localKey, today);
        })
        .catch((err) => {
          console.error('[❌ Streak Error]', err.response?.data || err.message);
        });
    }
  }, [isAuthenticated, user?.id, dispatch]);
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
