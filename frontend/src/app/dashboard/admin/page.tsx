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
import { BarChart2, ChevronLeft, ChevronRight } from 'lucide-react';
import { TaskSection } from '@/components/shared/TaskSection';

type Airdrop = {
  id: string;
  title: string;
  category: string;
  preview_image_url: string;
  type: 'Free' | 'Paid';
  likes: string;
};
const Dashboard: React.FC = () => {
  useRoleRedirect('admin');
  const user = useSelector((state: RootState) => state.auth.user);
  const userName = user?.user_name || 'User';

  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeklyTasks, setWeeklyTasks] = useState([]);

  const [stats, setStats] = useState({
    users: 0,
    airdrops: 0,
    weekly_signups: 0,
  });

  const [showMobileLeaderboard, setShowMobileLeaderboard] = useState(false);

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
    const fetchWeeklyTasks = async () => {
      try {
        const res = await axios.get(
          'http://localhost:8080/api/weeklytask/v1/top-weekly-tasks',
          { withCredentials: true }
        );
        setWeeklyTasks(res.data.data || []);
      } catch (error) {
        console.error('Failed to fetch weekly tasks:', error);
      }
    };

    fetchTopLiked();
    fetchStats();
    fetchWeeklyTasks();
  }, []);

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
            <AirdropsSection
              airdrops={airdrops}
              title="Top Liked Airdrops"
              emptyMessage="No airdrops found."
            />
          )}{' '}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Top Weekly Task</h2>
              <div className="flex gap-2">
                <button
                  className="text-white/80 hover:text-[#8373EE] cursor-pointer "
                  aria-label="Scroll Left"
                >
                  <ChevronLeft />
                </button>
                <button
                  className="text-white/80 hover:text-[#8373EE] cursor-pointer"
                  aria-label="Scroll Right"
                >
                  <ChevronRight />
                </button>
              </div>
            </div>

            <TaskSection tasks={weeklyTasks} />
          </div>
          {/* <TasksSection /> */}
        </div>
      </div>
      <div className=" fixed bottom-4 right-4 z-50 flex flex-col gap-3">
        <button
          className="p-3 bg-[#8373EE] hover:bg-[#8373EE]/80 rounded-full shadow-lg cursor-pointer"
          onClick={() => setShowMobileLeaderboard(true)}
        >
          <BarChart2 className="text-white w-6 h-6" />
        </button>
      </div>

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
