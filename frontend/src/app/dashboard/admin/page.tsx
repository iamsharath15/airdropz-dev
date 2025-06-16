'use client';

import React, { useEffect, useState } from 'react';
import WelcomeCard from '@/components/shared/dashboard/WelcomeCard';
import AirdropsSection from '@/components/shared/dashboard/AirdropSection';
// import TasksSection from '@/components/shared/dashboard/TaskSection';
import Leaderboard from '@/components/shared/dashboard/Leaderboard';
import type { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { useRoleRedirect } from '@/lib/useRoleRedirect';
import axios from 'axios';

type Airdrop = {
  id: string;
  title: string;
  category: string;
  preview_image_url: string;
  type: string;
  likes: string;
};
const Dashboard: React.FC = () => {
  useRoleRedirect('admin');
  const user = useSelector((state: RootState) => state.auth.user);
  const userName = user?.user_name || 'User';

  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    users: 0,
    airdrops: 0,
    weekly_signups: 0,
  });

  useEffect(() => {
    const fetchTopLiked = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8080/api/userAirdrop/v1/top-liked',
          {
            withCredentials: true,
          }
        );
        setAirdrops(response.data.data || []);
      } catch (error) {
        console.error('Failed to load top liked airdrops:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await axios.get(
          'http://localhost:8080/api/admin/v1/stats',
          { withCredentials: true }
        );
        setStats({
          users: res.data.stats.users || 0,
          airdrops: res.data.stats.airdrops || 0,
          weekly_signups: res.data.stats.tasks || 0,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    };

    fetchTopLiked();
    fetchStats();
  }, []);
  console.log('stat', stats);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-black">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6">
          <WelcomeCard
            name={userName}
            stats={[
              { label: 'Total Users', value: stats.users },
              { label: 'Total Airdrops', value: stats.airdrops },
              { label: 'Total Tasks', value: stats.weekly_signups },
            ]}
            color="#8373EE"
          />
          {loading ? (
            <div className=""></div>
          ) : (
            <AirdropsSection airdrops={airdrops} />
          )}{' '}
          {/* <TasksSection /> */}
          <Leaderboard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
