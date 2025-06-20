'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import type { RootState } from '@/store';

import { Sidebar } from '@/components/shared/Sidebar';
import { Navbar } from '@/components/shared/dashboard/Navbar';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updateUser } from '@/store/authSlice';
import DailyLoginModal from '@/components/shared/DailyLoginModal';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [loginData, setLoginData] = useState<null | {
    streakCount: number;
    totalLogins: number;
    todayPoints: number;
  }>(null);

  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = user ? true : false;
  const role: 'admin' | 'user' = user?.role === 'admin' ? 'admin' : 'user';

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
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
          const {  streakCount,
            todayPoints,
            airdropsEarned,
            // airdropsRemaining,
            totalLogins, } = res.data;

          // ✅ Update Redux state
          dispatch(
            updateUser({
              daily_login_streak_count: streakCount,
              airdrops_earned: airdropsEarned,
              airdrops_remaining: airdropsEarned,
            })
          );

                    localStorage.setItem(localKey, today);
          setLoginData({ streakCount, totalLogins, todayPoints });
          setShowStreakModal(true);

          console.log('[🔥 Daily Streak]', res.data.message);

        })
        .catch((err) => {
          console.error('[❌ Streak Error]', err.response?.data || err.message);
        });
    }
  }, [isAuthenticated, user?.id, dispatch]);
  return (
    <>
    <div className="flex min-h-screen bg-black w-full text-white">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        role={role}
      />

      <div className="flex flex-col w-full overflow-hidden min-w-11/12">
        <Navbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          role={role}
        />
        <main className="w-full p-6">{children}</main>
      </div>
    </div>
    {loginData && (
        <DailyLoginModal
          isOpen={showStreakModal}
          onClose={() => setShowStreakModal(false)}
          loginData={loginData}
        />
      )}
</>
  );
}
