'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import type { RootState } from '@/store';

import { Sidebar } from '@/components/shared/Sidebar';
import { Navbar } from '@/components/shared/dashboard/Navbar';
import axios from 'axios';
import DailyLoginModal from '@/components/shared/DailyLoginModal';
import { setProfile } from '@/store/profileSlice';

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
    
  const profile = useSelector((state: RootState) => state.profile.data);
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = !!user;
  const role: 'admin' | 'user' = user?.role === 'admin' ? 'admin' : 'user';

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated || role !== 'user' || !user?.id) return;

    const today = new Date().toISOString().split('T')[0];
      const lastLoginDate = profile?.last_login?.split('T')[0]; // get date part only


    if (lastLoginDate !== today) {
      axios
        .post(
          'http://localhost:8080/api/streak/v1/daily-login',
          {},
          {
            withCredentials: true, 
          }
        )
        .then((res) => {
          const {
            streakCount,
            todayPoints,
            airdropsEarned,
            // airdropsRemaining,
            totalLogins,
          } = res.data;

          // ✅ Update Redux state
          dispatch(
            setProfile({
              daily_login_streak_count: streakCount,
              airdrops_earned: airdropsEarned,
              airdrops_remaining: airdropsEarned,
            })
          );

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
      { role === 'user' && loginData && (
        <DailyLoginModal
          isOpen={showStreakModal}
          onClose={() => setShowStreakModal(false)}
          loginData={loginData}
        />
      )} 
    </>
  );
}
