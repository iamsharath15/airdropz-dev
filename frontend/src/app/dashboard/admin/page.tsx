'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WelcomeCard from '@/components/shared/dashboard/WelcomeCard';
import AirdropsSection from '@/components/shared/dashboard/AirdropSection';
import TasksSection from '@/components/shared/dashboard/TaskSection';
import Leaderboard from '@/components/shared/dashboard/Leaderboard';
import type { RootState } from '@/store';
import { useSelector } from 'react-redux';

const Dashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const userName = user?.user_name || 'User';
  const role = user?.role;
  const router = useRouter();

  // Redirect non-admin users to homepage
  useEffect(() => {
    if (role !== 'admin') {
      router.replace('/');
    }
  }, [role, router]);

  // Optionally avoid rendering until user role is validated
  if (role !== 'admin') return null;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-black">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6">
          <WelcomeCard
            name={userName}
            stats={[
              { label: 'Total Users', value: 1240 },
              { label: 'Total Airdrops', value: 75 },
              { label: 'Weekly Signups', value: 124 },
            ]}
            color="#8373EE"
          />
          <AirdropsSection />
          <TasksSection />
          <Leaderboard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
