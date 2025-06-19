'use client';

import React, { useEffect, useState } from 'react';
import WelcomeCard from '@/components/shared/dashboard/WelcomeCard';
import LeaderboardSection from '@/components/shared/dashboard/LeaderboardSection';
import Leaderboard from '@/components/shared/dashboard/Leaderboard';
import Calendar from '@/components/shared/Calendar';
import AirdropsSection from '@/components/shared/dashboard/AirdropSection';
import { useSelector } from 'react-redux';
import { useRoleRedirect } from '@/lib/useRoleRedirect';
import { Calendar as CalendarIcon, BarChart2, Clock } from 'lucide-react';
import type { RootState } from '@/store';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import type { Airdrop, WeeklyTask, SubTask } from '@/types';

const WeeklyTaskCard = ({
  task,
  timeLeft,
  showProgress = false,
}: {
  task: WeeklyTask;
  timeLeft: string;
  showProgress?: boolean;
}) => {
  const getSubTaskProgress = (subTasks: SubTask[] = []) => {
    const total = subTasks.length;
    const completed = subTasks.filter((st) => st.completed).length;
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const progress = showProgress ? getSubTaskProgress(task.sub_tasks) : null;

  return (
    <div className="group relative bg-[#1C1C1E] rounded-2xl p-4 w-full h-full text-white shadow-md transition-all hover:shadow-xl hover:-translate-y-1 duration-200">
      {task.task_banner_image ? (
        <div className="relative mb-4 rounded-xl overflow-hidden">
          <Image
            width={1920}
            height={1080}
            src={task.task_banner_image}
            alt={task.task_title}
            className="w-full bg-black h-32 object-cover rounded-xl transition-transform group-hover:scale-105 duration-300"
          />
        </div>
      ) : (
        <div className="bg-black h-32 mb-4 rounded-xl overflow-hidden"></div>
      )}

      <div className="flex flex-col h-full">
        <h3 className="text-lg font-semibold mb-2 ">{task.task_title}</h3>

        <div className=" mb-3 flex items-center justify-start">
          <p className=" bg-[#8373EE]/20 text-[#8373EE] text-xs font-medium px-3 py-1 rounded-full">
            {' '}
            {task.task_category}
          </p>{' '}
        </div>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white">Progress</span>
            <span className="text-sm font-semibold text-[#8373EE]">
              {progress ?? 0}%
            </span>
          </div>
          <div className="relative w-full h-2 bg-gray-700 rounded-full">
            <div
              className="absolute top-0 left-0 h-2 rounded-full"
              style={{
                width: `${progress}%`,
                backgroundColor: '#8373EE',
              }}
            />
            <div
              className="absolute -top-1.5"
              style={{
                left: `calc(${progress}% - 8px)`,
              }}
            >
              <div className="w-4 h-4 rounded-full border-2 border-white bg-[#8373EE]" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-white mb-4">
          <div className="flex items-center gap-2">
            <Clock size={14} />
            <span>{timeLeft}</span>
          </div>
          <span className="text-[#8373EE] font-semibold">Week {task.week}</span>
        </div>
      </div>
    </div>
  );
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
  const [myTasks, setMyTasks] = useState<WeeklyTask[]>([]);
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
    const fetchTopWeeklyTask = async () => {
      try {
        const reponse = await axios.get<{ tasks: WeeklyTask[] }>(
          'http://localhost:8080/api/user-task/v1/all',
          {
            withCredentials: true,
          }
        );
        setMyTasks(reponse.data.tasks);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };
    fetchTopLiked();
    fetchTopWeeklyTask();
  }, []);

  const getTimeLeftString = (endTime?: string): string => {
    if (!endTime) return '';
    const now = new Date();
    const end = new Date(endTime);
    const diffMs = end.getTime() - now.getTime();

    if (diffMs <= 0) return 'Ended';

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;

    return days > 0
      ? `${days} day${days > 1 ? 's' : ''} ${remHours}h left`
      : `${remHours} hour${remHours !== 1 ? 's' : ''} left`;
  };
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
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">My Tasks</h2>
            </div>

            <div className="flex flex-wrap">
              {myTasks.length === 0 ? (
                <div className="bg-[#151313] h-50 w-full flex items-center justify-center rounded-xl">
                  <p className="text-white/80 text-lg font-medium">
                    No tasks started yet.
                  </p>
                </div>
              ) : (
                myTasks.map((task, index) => {
                  const timeLeft = getTimeLeftString(task.end_time);
                  return (
                    <div
                      key={index}
                      className="lg:w-3/12 md:w-4/12 sm:w-6/12 w-full p-[1%]"
                    >
                      <Link href={`/dashboard/user/weeklytask/${task.id}`}>
                        <WeeklyTaskCard
                          task={task}
                          timeLeft={timeLeft}
                          showProgress
                        />
                      </Link>
                    </div>
                  );
                })
              )}
            </div>
          </div>
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
