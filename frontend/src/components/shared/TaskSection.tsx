import React, { useState } from 'react';
import EditWeeklyTaskFormModal from './dashboard/admin/weeklyTask/EditWeeklyTaskFormModal';
import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';

interface Task {
  id: string;
  task_title: string;
  task_banner_image: string | null;
  task_category: string;
  week: number;
  progress: number;
  end_time: string;
}

interface TaskSectionProps {
  title: string;
  tasks: Task[];
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

export const TaskSection: React.FC<TaskSectionProps> = ({ tasks }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tasks.map((task) => {
        const timeLeft = getTimeLeftString(task.end_time);
        const imageUrl =
          task.task_banner_image && task.task_banner_image.trim() !== ''
            ? task.task_banner_image
            : null;

        return (
          <div
            key={task.id}
            className="group relative bg-[#1C1C1E] rounded-2xl p-4 w-full max-w-sm text-white shadow-md transition hover:shadow-lg cursor-pointer"
          >
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
                {imageUrl ? (
                  <Image
                    width={1920}
                    height={1080}
                    src={imageUrl}
                    alt={task.task_title}
                    className="w-full h-40 object-cover rounded-xl bg-gray-700"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-700 rounded-xl flex items-center justify-center text-sm text-white/60">
                    No Image
                  </div>
                )}
              </div>

              <h3 className="text-base font-semibold mb-1">
                {task.task_title}
              </h3>
              <div className="bg-[#8373EE] text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-2">
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
                <span className="text-[#8373EE] font-semibold">
                  Week {task.week}
                </span>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};
