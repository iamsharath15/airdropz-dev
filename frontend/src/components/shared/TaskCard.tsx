'use client';

import React, { useState } from 'react';
import { Clock, Pencil } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import EditWeeklyTaskFormModal from './dashboard/admin/weeklyTask/EditWeeklyTaskFormModal';

interface TaskCardProps {
  task: {
    id: string;
    week: number;
    task_category: string;
    task_title: string;
    task_description: string;
    task_banner_image: string;
    start_time: string;
    end_time: string;
    progress: number;
    status: string;
  };
  onClick: () => void;
}

const getTimeLeftString = (endTime: string): string => {
  const now = new Date();
  const end = new Date(endTime);
  const diffMs = end.getTime() - now.getTime();

  if (diffMs <= 0) return 'Expired';

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  const remHours = hours % 24;

  return days > 0
    ? `${days} day${days > 1 ? 's' : ''} ${remHours}h left`
    : `${remHours} hour${remHours !== 1 ? 's' : ''} left`;
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const [openModal, setOpenModal] = useState(false);
  const timeLeft = getTimeLeftString(task.end_time);

  return (
    <div className="group relative bg-[#1C1C1E] rounded-2xl p-4 w-full max-w-sm text-white shadow-md transition hover:shadow-lg cursor-pointer">

   

      {/* Edit Modal */}
        <EditWeeklyTaskFormModal
          task={task}
          open={openModal}
          setOpen={setOpenModal}
        />

      {/* Card Content */}
      <Link
        href={`/dashboard/admin/weeklytask/create/${task.id}`}
        className="w-full block"
      >
        <div className="relative mb-4 rounded-xl overflow-hidden">
          <Image
            width={1920}
            height={1080}
            src={task.task_banner_image}
            alt={task.task_title}
            className="w-full h-32 object-cover rounded-xl"
          />
      
        </div>

        <h3 className="text-base font-semibold mb-1">{task.task_title}</h3>
    <div className=" bg-[#8373EEs] text-black text-xs font-semibold px-3 py-1 rounded-full ">
            {task.task_category}
          </div>
        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Progress</span>
            <span className="text-sm font-semibold text-[#8373EE]">
              {task.progress ?? 0}%
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
            <span>{timeLeft}</span>
          </div>
          <span className="text-[#8373EE] font-semibold">Week {task.week}</span>
        </div>
      </Link>
    </div>
  );
};
