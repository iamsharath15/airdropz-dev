'use client';

import React, { useEffect, useState } from 'react';
import WelcomeCard from '@/components/shared/dashboard/WelcomeCard';
import LeaderboardSection from '@/components/shared/dashboard/LeaderboardSection';
import Leaderboard from '@/components/shared/dashboard/Leaderboard';
// import WeeklyTask from '@/components/shared/dashboard/WeeklyTask';
import Calendar from '@/components/shared/Calendar';
import AirdropsSection from '@/components/shared/dashboard/AirdropSection';
import { useSelector } from 'react-redux';
import { useRoleRedirect } from '@/lib/useRoleRedirect';
import { Calendar as CalendarIcon, BarChart2 } from 'lucide-react';
import type { RootState } from '@/store';
import axios from 'axios';

type Airdrop = {
  id: string;
  title: string;
  category: string;
  preview_image_url: string;
  type: 'Free' | 'Paid';
  likes: string;
};

const Dashboard: React.FC = () => {
  useRoleRedirect('user');

  const user = useSelector((state: RootState) => state.auth.user);
  const userName = user?.user_name || 'User';
  const checkIn = user?.daily_login_streak_count || 1;
  const airdropsEarned = user?.airdrops_earned || 1;
  const airdropsRemaining = user?.airdrops_remaining || 1;

  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [loading, setLoading] = useState(true);

  const [showMobileCalendar, setShowMobileCalendar] = useState(false);
  const [showMobileLeaderboard, setShowMobileLeaderboard] = useState(false);

  useEffect(() => {
    const fetchTopLiked = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8080/api/userAirdrop/v1/liked',
          { withCredentials: true }
        );
        setAirdrops(response.data || []);
      } catch (error) {
        console.error('Failed to load top liked airdrops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopLiked();
  }, []);

  return (
    <div className="flex flex-col xl:flex-row min-h-screen bg-black text-white relative">
      {/* Left/Main Content */}
      <div className="w-full xl:w-9/12 overflow-y-auto">
        <div className="p-4 md:p-6">
          <WelcomeCard
            name={userName}
            stats={[
              { label: 'Streak', value: checkIn },
              { label: 'Airdrops Earned', value: airdropsEarned },
              { label: 'Airdrops Remaining', value: airdropsRemaining },
            ]}
            color="#8373EE"
          />

          <LeaderboardSection />

          {loading ? (
            <div className="text-white/70">Loading...</div>
          ) : (
            <AirdropsSection
              airdrops={airdrops}
              title="My Airdrops"
              emptyMessage="No airdrops yet. Add one to get started."
            />
          )}
        </div>
      </div>

      {/* Right Sidebar for Desktop */}
      <div className="hidden xl:flex flex-col w-full xl:w-3/12 p-4 space-y-6">
        <Calendar />
        <Leaderboard />
      </div>

      <div className="xl:hidden fixed bottom-4 right-4 z-50 flex flex-col gap-3">
        <button
          className="p-3 bg-[#8373EE] hover:bg-[#8373EE]/80 rounded-full shadow-lg cursor-pointer"
          onClick={() => setShowMobileLeaderboard(true)}
        >
          <BarChart2 className="text-white w-6 h-6" />
        </button>
        <button
          className="p-3 bg-[#8373EE] hover:bg-[#8373EE]/80 rounded-full shadow-lg cursor-pointer "
          onClick={() => setShowMobileCalendar(true)}
        >
          <CalendarIcon className="text-white w-6 h-6" />
        </button>
      </div>

      {showMobileCalendar && (
        <div className="fixed inset-0 z-40 bg-black/90 flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setShowMobileCalendar(false)}
            className="absolute top-4 right-4 text-white text-2xl"
          >
            ✕
          </button>
          <div className="w-full max-w-md">
            <Calendar />
          </div>
        </div>
      )}

      {showMobileLeaderboard && (
        <div className="fixed inset-0 z-40 bg-black/90 flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setShowMobileLeaderboard(false)}
            className="absolute top-4 right-4 text-white text-2xl"
          >
            ✕
          </button>
          <div className="w-full max-w-md">
            <Leaderboard />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
