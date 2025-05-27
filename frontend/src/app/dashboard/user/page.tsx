import React from 'react';
import WelcomeCard from '@/components/shared/dashboard/WelcomeCard';
import LeaderboardSection from '@/components/shared/dashboard/LeaderboardSection';
import AirdropsSection from '@/components/shared/dashboard/AirdropSection';
import TasksSection from '@/components/shared/dashboard/TaskSection';
import WeeklyTask from '@/components/shared/dashboard/WeeklyTask';
import Leaderboard from '@/components/shared/dashboard/Leaderboard';

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

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-black">
      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6">
          <WelcomeCard
            name="User 1"
            stats={[
              { label: 'Check Ins', value: 4 },
              {
                label: 'Airdrops Earned',
                value: 400,
              },
              {
                label: 'Airdrops Remaining',
                value: 400,
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
