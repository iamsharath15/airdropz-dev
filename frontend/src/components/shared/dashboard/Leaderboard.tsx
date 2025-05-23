import React from 'react';

const mockUsers = [
  { id: 1, name: 'User 1', points: 50 },
  { id: 2, name: 'User 2', points: 40 },
  { id: 3, name: 'User 3', points: 30 },
  { id: 4, name: 'User 4', points: 20 },
];

const Leaderboard = () => (
  <div className="mt-6 bg-[#171717] rounded-xl p-4">
    {/* Section Header */}
    <div className="flex justify-between items-center mb-4 ">
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
    <div className="">
      {/* Table Header */}
      <div className="flex text-xs text-gray-400 mb-3 px-2">
        <div className="w-10">Rank</div>
        <div className="flex-1">User name</div>
        <div className="w-24 text-right">Airdrops earned</div>
      </div>

      {/* User Rows */}
      <div className="space-y-3">
        {mockUsers.map((user, index) => (
          <div key={user.id} className="flex items-center text-sm px-2">
            <div className="w-10 text-white">{index + 1}.</div>
            <div className="flex-1 flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded-full" />
              <span className="text-white">{user.name}</span>
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

      {/* Show More */}
      <button className="w-full mt-4 bg-[#8373EE] text-white font-medium py-2 rounded-lg hover:bg-purple-600/30 cursor-pointer transition-colors">
        Show More
      </button>
    </div>
  </div>
);

export default Leaderboard;
