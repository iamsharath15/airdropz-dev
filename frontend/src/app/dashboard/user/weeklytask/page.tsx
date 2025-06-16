'use client';

import { useEffect, useState } from 'react';
import { TaskHeader } from '@/components/shared/dashboard/admin/weeklyTask/TaskHeader';
import { TaskDetail } from '@/components/shared/TaskDetail';

import { mockTasks } from '@/app/data/mockTasks';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function WeeklyTaskPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Week');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [weeklyTasks, setWeeklyTasks] = useState<any[]>([]);

  useEffect(() => {
    const fetchWeeklyTasks = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8080/api/weeklytask/v1'
        );
        console.log('Weekly Tasks Data:', response.data.data);
        setWeeklyTasks(response.data.data || []);
      } catch (error) {
        console.error('Error fetching weekly tasks:', error);
      }
    };

    fetchWeeklyTasks();
  }, []);

  const filterTasks = (tasks: any[]) => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.task_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.task_description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || task.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  };
  // const sortTasks = (tasks: any[]) => {
  //   return [...tasks].sort((a, b) => {
  //     switch (sortBy) {
  //       case 'Week':
  //         return a.week.localeCompare(b.week);
  //       case 'Progress':
  //         return b.progress - a.progress;
  //       case 'Title':
  //         return a.title.localeCompare(b.title);
  //       default:
  //         return 0;
  //     }
  //   });
  // };

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
  };

  const handleBackToTasks = () => {
    setSelectedTask(null);
  };
  //const myTasks = sortTasks(filterTasks(mockTasks.myTasks));
  // const weeklyTasks = sortTasks(filterTasks(mockTasks.weeklyTasks));
  const filteredAndSortedTasks = filterTasks(weeklyTasks);
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
  const timeLeft = getTimeLeftString(filterTasks.end_time);

  return (
    <div className="min-h-screen bg-black text-foreground flex">
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold mb-8 text-white">
            Weekly Tasks
          </h1>

          <TaskHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />


          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Weekly Tasks</h2>
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
              {filteredAndSortedTasks.map((task, index) => (
                <div
                  key={index}
                  className="group relative bg-[#1C1C1E] rounded-2xl p-4 w-full max-w-sm text-white shadow-md transition hover:shadow-lg cursor-pointer"
                >
                  {/* Card Content */}
                  <Link
                    href={`/dashboard/user/weeklytask/${task.id}`}
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

                    <h3 className="text-base font-semibold mb-1">
                      {task.task_title}
                    </h3>
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
                      <span className="text-[#8373EE] font-semibold">
                        Week {task.week}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
