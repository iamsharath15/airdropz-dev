'use client';
import React from 'react';
import WelcomeCard from '@/components/shared/dashboard/WelcomeCard';
import LeaderboardSection from '@/components/shared/dashboard/LeaderboardSection';
import AirdropsSection from '@/components/shared/dashboard/AirdropSection';
import TasksSection from '@/components/shared/dashboard/TaskSection';
import WeeklyTask from '@/components/shared/dashboard/WeeklyTask';
import Leaderboard from '@/components/shared/dashboard/Leaderboard';
import type { RootState } from '@/store';
import { useSelector } from 'react-redux';
import Calendar from '@/components/shared/Calendar';

const Dashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const userName = user?.user_name || 'User';
  const checkIn = user?.daily_login_streak_count || 1;
  const airdropsEarned = user?.airdrops_earned || 1;
  const airdropsRemaining = user?.airdrops_remaining || 1;

  console.log(user);
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-black">
      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6">
          <WelcomeCard
            name={userName}
            stats={[
              { label: 'Check Ins', value: checkIn },
              {
                label: 'Airdrops Earned',
                value: airdropsEarned,
              },
              {
                label: 'Airdrops Remaining',
                value: airdropsRemaining,
              },
            ]}
            color="#8373EE"
          />

          {/* Leaderboard section */}
          <LeaderboardSection />
          {/* My Airdrops section */}
          <AirdropsSection />

          {/* My Task section */}
          <TasksSection />
        </div>
      </div>

      {/* Right sidebar - Calendar and Tasks */}
      <div className="w-full md:w-80  p-4 flex flex-col md:block">
        {/* <Calendar /> */}
        <Calendar />
        <div className="mt-6">
          <WeeklyTask />

          {/* Leaderboard widget */}
          <Leaderboard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
