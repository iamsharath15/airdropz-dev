import React from 'react';

import { Progress } from '@/components/ui/progress';
import WelcomeCard from '@/components/shared/dashboard/WelcomeCard';
import LeaderboardSection from '@/components/shared/dashboard/LeaderboardSection';
import AirdropsSection from '@/components/shared/dashboard/AirdropSection';
import TasksSection from '@/components/shared/dashboard/TaskSection';
import WeeklyTask from '@/components/shared/dashboard/WeeklyTask';
import Leaderboard from '@/components/shared/dashboard/Leaderboard';

// Mock data for tasks
const tasks = [
  {
    id: 1,
    title: 'LayerZero Airdrop 2 – Fresh Strategy to Explore!',
    image: 'layerzero.png',
    progress: 90,
    timeLeft: '1 Hour',
    week: 'Week 04',
  },
  {
    id: 2,
    title: 'Hyperlane Airdrop: Engage with New Chains and Tokens',
    image: 'hyperlane.png',
    progress: 100,
    timeLeft: 'Ended',
    week: 'Week 02',
  },
  {
    id: 3,
    title: 'Eclipse Airdrop: The Last Push Before TGE',
    image: 'eclipse.png',
    progress: 0,
    timeLeft: 'Ended',
    week: 'Week 03',
  },
];

// Mock data for airdrops
const airdrops = [
  {
    id: 1,
    name: 'Shaga',
    image: 'shaga.png',
    tags: ['Gaming', 'Web3'],
  },
  {
    id: 2,
    name: 'Ostium',
    image: 'ostium.png',
    tags: ['DeFi', 'Web3'],
  },
  {
    id: 3,
    name: 'Hemi Network',
    image: 'hemi.png',
    tags: ['Finance', 'Web3'],
  },
];

// Task Item component
const TaskItem = ({ task }: { task: (typeof tasks)[0] }) => (
  <div className="bg-[#171717] rounded-xl p-5 mb-4">
    <div className="mb-4">
      <div className="w-full h-40 bg-gray-800 rounded-lg mb-3 overflow-hidden">
        {/* Add actual image when available */}
        <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-500">
          {task.title.split(':')[0]}
        </div>
      </div>
      <h3 className="text-white font-medium text-lg">{task.title}</h3>
    </div>

    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-400">Progress</span>
        <span className="text-purple-400 font-semibold">{task.progress}%</span>
      </div>
      <Progress value={task.progress} className="h-2 mb-4 bg-gray-700" />

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <svg
            className="w-5 h-5 text-gray-400 mr-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="text-gray-400">{task.timeLeft}</span>
        </div>
        <span className="text-purple-400">{task.week}</span>
      </div>
    </div>
  </div>
);

// Leaderboard Item component
const LeaderboardItem = ({ user }: { user: (typeof leaderboardData)[0] }) => (
  <div className="bg-[#171717] rounded-xl p-5 mb-4">
    <div className="flex items-center gap-3 mb-3">
      <div
        className={`w-12 h-12 rounded-full ${user.avatarColor} flex items-center justify-center`}
      ></div>
      <div>
        <h3 className="text-white font-medium">{user.name}</h3>
        <p className="text-sm text-gray-400">{user.tier}</p>
      </div>
    </div>

    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2 text-gray-400">
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
        <span>{user.rank} Rank</span>
      </div>
      <div className="flex items-center gap-2 text-yellow-400">
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
        <span>{user.points} Airdrops</span>
      </div>
    </div>
  </div>
);

// Airdrop Card component
const AirdropCard = ({ airdrop }: { airdrop: (typeof airdrops)[0] }) => (
  <div className="flex flex-col">
    <div className="aspect-square bg-gray-700 rounded-xl mb-2 flex items-center justify-center">
      {airdrop.name}
    </div>
    <h3 className="text-white">{airdrop.name}</h3>
    <div className="flex gap-2 mt-1">
      {airdrop.tags.map((tag, index) => (
        <span
          key={index}
          className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);

// Calendar component
const Calendar = () => {
  const currentMonth = 'July 2025';
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const dates = [30, 1, 2, 3, 4, 5, 6];

  return (
    <div className="bg-[#151313] rounded-xl p-5">
      <div className="flex justify-between items-center mb-4">
        <button className="text-gray-400">
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h3 className="text-white">{currentMonth}</h3>
        <button className="text-gray-400">
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center mb-2">
        {days.map((day, index) => (
          <div key={index} className="text-gray-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {dates.map((date, index) => (
          <div
            key={index}
            className={`rounded-full w-8 h-8 mx-auto flex items-center justify-center ${
              index === 3 ? 'bg-purple-600 text-white' : 'text-gray-400'
            }`}
          >
            {date}
          </div>
        ))}
      </div>
    </div>
  );
};

// SectionHeader component
const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold text-white">{title}</h2>
    <div className="flex gap-2">
      <button className="text-gray-400">
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button className="text-gray-400">
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-black">
      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6">
          {/* Welcome section */}
          <WelcomeCard />
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
