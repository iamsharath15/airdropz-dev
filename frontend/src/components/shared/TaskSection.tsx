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
  user_count: number;
  user_images: {
    user_id: string;
    user_name: string;
    profile_image: string | null;
  };
}

interface TaskSectionProps {
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
    <div className="flex flex-wrap ">
      {tasks.map((task) => {
        const timeLeft = getTimeLeftString(task.end_time);
        const imageUrl =
          task.task_banner_image && task.task_banner_image.trim() !== ''
            ? task.task_banner_image
            : null;

        return (
          <div className="w-full md:w-4/12 p-2" key={task.id}>
            <div
              key={task.id}
              className="group relative bg-[#1C1C1E]  rounded-2xl p-4 w-full h-full text-white shadow-md transition hover:shadow-lg cursor-pointer"
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
                    <div className="w-full h-40 bg-gray-700 rounded-xl flex items-center justify-center text-sm text-white/60">
                      No Image
                    </div>
                  )}
                </div>

                <h3 className="text-base font-semibold mb-1 truncate">
                  {task.task_title}
                </h3>

                <div className="bg-[#8373EE] text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-2">
                  {task.task_category}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm py-2">
                  <div className="flex items-center space-x-2 text-white">
                    <Clock size={14} />
                    <span>{timeLeft}</span>
                  </div>
                  <span className="text-[#8373EE] font-semibold">
                    Week {task.week}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-white mb-1 font-semibold">
                    User count - {task.user_count}
                  </p>
                  <div className="flex -space-x-2">
                    {task.user_images && task.user_images.length > 0 ? (
                      task.user_images.slice(0, 5).map((user, index) =>
                        user.profile_image ? (
                          <Image
                            key={index}
                            src={user.profile_image}
                            alt={user.user_name}
                            width={24}
                            height={24}
                            className="w-6 h-6 rounded-full border-2 border-white object-cover"
                          />
                        ) : (
                          <div
                            key={index}
                            className="w-6 h-6 rounded-full border-1 border-white bg-[#8373EE] text-white flex items-center justify-center text-xs font-medium"
                          >
                            {user.user_name?.charAt(0).toUpperCase()}
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-sm text-gray-400">No users found</p>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};
