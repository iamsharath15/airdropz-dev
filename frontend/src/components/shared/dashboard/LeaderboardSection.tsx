import React from 'react';

// Leaderboard user type
interface LeaderboardUser {
  id: number;
  name: string;
  tier: string;
  rank: number;
  points: number;
  avatarColor: string;
}

// Mock leaderboard data
const leaderboardData: LeaderboardUser[] = [
  {
    id: 1,
    name: 'User10',
    tier: 'Premium tier',
    rank: 1,
    points: 750,
    avatarColor: 'bg-purple-500',
  },
  {
    id: 2,
    name: 'User 1',
    tier: 'Free tier',
    rank: 8,
    points: 400,
    avatarColor: 'bg-black',
  },
  {
    id: 3,
    name: 'User 2',
    tier: 'Pro tier',
    rank: 4,
    points: 600,
    avatarColor: 'bg-blue-500',
  },
];

// Section Header component
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

// Leaderboard Item component
const LeaderboardItem = ({ user }: { user: LeaderboardUser }) => (
  <div className="bg-[#151313] rounded-xl p-4 flex items-start justify-center gap-4 w-4/12 flex-col">
    <div className="flex flex-row gap-4">
         <div
      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${user.avatarColor}`}
    >
      {user.name.charAt(0)}
    </div>
    <div className="flex-1">
      <h4 className="text-white font-semibold">{user.name}</h4>
      <p className="text-sm text-gray-400">{user.tier}</p>
    </div>
 </div>
    <div className="text-right flex flex-row justify-between items-center w-full">
      <div className="text-white text-sm">Rank #{user.rank}</div>
      <div className="text-gray-400 text-xs">{user.points} pts</div>
    </div>
  </div>
);

// Main Leaderboard Section component
const LeaderboardSection = () => (
  <div className="mb-6 md:mb-8 overflow-hidden">
    <SectionHeader title="Leaderboard" />
    <div className="flex flex-row overflow-hidden gap-4 scroll-auto">
      {leaderboardData.map((user) => (
        <LeaderboardItem key={user.id} user={user} />
      ))}
    </div>
  </div>
);

export default LeaderboardSection;
