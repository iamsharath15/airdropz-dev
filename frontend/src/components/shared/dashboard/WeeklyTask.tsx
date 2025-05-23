import { Progress } from '@/components/ui/progress';
import React from 'react';

const WeeklyTask = () => {
  return (
    <div className="bg-[#151313] p-4 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-white">Weekly Task</h2>
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

      <div className="mb-4">
        <div className="w-full h-32 bg-blue-600 rounded-lg mb-3 flex items-center justify-center">
          Hyperlane
        </div>
        <h3 className="text-white text-sm mb-2">
          Hyperlane Airdrop: Engage with New Chains and Tokens
        </h3>

        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-white text-xs">Progress</span>
            <span className="text-[#8373EE] text-xs">90%</span>
          </div>
          <Progress value={90} className="h-1.5 bg-[#8373EE]" />
        </div>

        <div className="flex items-center text-xs text-white">
          <svg
            className="w-4 h-4 mr-1"
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
          <span >1 Hour</span>
        </div>
      </div>

      <div className="border-t border-[#242424] pt-4 my-4"></div>

      <div className="mb-4">
        <h2 className="text-lg font-medium text-white mb-4">Detail Task</h2>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-xs">
              1
            </div>
            <span className="text-sm text-white">Task 1: Artela & ART</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-xs">
              2
            </div>
            <span className="text-sm text-white">
              Task 2: Unichaln, Abstract, and Sonaium.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-xs">
              3
            </div>
            <span className="text-sm text-white">
              Task 3: New Interaction: USUAL Token
            </span>
          </div>
        </div>
      </div>

      <button className="w-full bg-[#8373EE] text-white font-medium py-3 rounded-lg hover:bg-purple-700 transition-colors">
        Go To Task
      </button>
    </div>
  );
};

export default WeeklyTask;
