import React from 'react';
import { TaskCard } from './TaskCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TaskSectionProps {
  title: string;
  tasks: any[];
    onTaskClick: (task: any) => void;

}

export const TaskSection: React.FC<TaskSectionProps> = ({ title, tasks, onTaskClick }) => {
  
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <div className="flex items-center space-x-2">
          <button className="p-2 cursor-pointer rounded-lg bg-white/80 hover:bg-[#8373EE] hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-2 cursor-pointer rounded-lg bg-white/80 hover:bg-[#8373EE] hover:text-white transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tasks.map((task, index) => (
          <TaskCard key={index} task={task} onClick={() => onTaskClick(task)}
 />
        ))}
      </div>
    </div>
  );
};