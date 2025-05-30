'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type LeaderboardUser = {
  id: number;
  username: string;
  points: number;
};

const Leaderboard = () => {
  const {
    data: users,
    isLoading,
    isError,
  } = useQuery<LeaderboardUser[]>({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:8080/api/leaderboard/v1/');
      return res.data.data;
    },
  });

  return (
    <div className="mt-6 bg-[#171717] rounded-xl p-4">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-white">Leaderboard</h2>
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
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </button>
      </div>

      {/* Leaderboard Content */}
      <div>
        <div className="flex text-xs text-gray-400 mb-3 px-2">
          <div className="w-10">Rank</div>
          <div className="flex-1">User name</div>
          <div className="w-24 text-right">Airdrops earned</div>
        </div>

        {isLoading && <div className="text-gray-400 px-2">Loading...</div>}
        {isError && <div className="text-red-500 px-2">Failed to load leaderboard.</div>}
        {!isLoading && users?.length === 0 && (
          <div className="text-gray-400 px-2">Leaderboard will update soon.</div>
        )}

        <div className="space-y-3">
          {users?.map((user, index) => (
            <div key={user.id} className="flex items-center text-sm px-2">
              <div className="w-10 text-white">{index + 1}.</div>
              <div className="flex-1 flex items-center gap-2">
                <div className="w-6 h-6 bg-white rounded-full" />
                <span className="text-white">{user.username}</span>
              </div>
              <div className="w-24 text-right flex justify-end items-center">
                <span className="text-yellow-500 mr-1">+ {user.points}</span>
                <svg
                  className="w-4 h-4 text-yellow-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 bg-[#8373EE] text-white font-medium py-2 rounded-lg hover:bg-purple-600/30 cursor-pointer transition-colors">
          Show More
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
