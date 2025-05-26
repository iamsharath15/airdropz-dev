import React from 'react';
import { Clock } from 'lucide-react';

interface TaskCardProps {
  task: {
    title: string;
    description: string;
    progress: number;
    status: string;
    week: string;
    category: string;
    image: string;
    timeLeft?: string;
  };
   onClick: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  return (
    <div className="bg-[#1C1C1E] rounded-2xl p-4 w-full max-w-sm text-white shadow-md transition hover:shadow-lg cursor-pointer"       onClick={onClick}
>
      <div className="relative mb-4 rounded-xl overflow-hidden">
        <img
          src={task.image}
          alt={task.title}
          className="w-full h-32 object-cover rounded-xl"
        />
        <div className="absolute top-2 left-2 bg-white text-black text-xs font-semibold px-3 py-1 rounded-full">
          {task.category}
        </div>
      </div>

      <h3 className="text-base font-semibold mb-1">{task.title}</h3>
      <p className="text-sm text-gray-400 mb-4">{task.description}</p>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm font-semibold text-[#8373EE]">
            {task.progress}%
          </span>
        </div>
        <div className="relative w-full h-2 bg-gray-700 rounded-full">
          <div
            className="absolute top-0 left-0 h-2 rounded-full"
            style={{
              width: `${task.progress}%`,
              backgroundColor: '#8373EE',
            }}
          />
          <div
            className="absolute -top-1.5"
            style={{
              left: `calc(${task.progress}% - 8px)`,
            }}
          >
            <div className="w-4 h-4 rounded-full border-2 border-white bg-[#8373EE]" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2 text-gray-400">
          <Clock size={14} />
          <span>{task.timeLeft || task.status}</span>
        </div>
        <span className="text-[#8373EE] font-semibold">{task.week}</span>
      </div>
    </div>
  );
};
