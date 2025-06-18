'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { toast } from 'sonner';

import { TaskHeader } from '@/components/shared/dashboard/admin/weeklyTask/TaskHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface TaskBlock {
  id: string;
  link: string | null;
  type: string;
  value: string;
}

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  description: string | null;
  sub_task_image: string | null;
}

interface WeeklyTask {
  id: string;
  task_title: string;
  task_category: string;
  week: number;
  task_banner_image?: string;
  end_time?: string;
  progress?: number;
  tasks?: TaskBlock[];
  sub_tasks?: SubTask[];
}

const WeeklyTaskCard = ({
  task,
  timeLeft,
  showProgress = false,
}: {
  task: WeeklyTask;
  timeLeft: string;
  showProgress?: boolean;
}) => {
  const handleStartTask = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/user-task/v1/add/${task.id}`,
        {},
        { withCredentials: true }
      );

      const message = response?.data?.message;
      if (message === 'Task already added') {
        toast.info('You already started this task');
      } else {
        toast.success('Added to My Tasks');
      }

      setTimeout(() => {
        window.location.href = `/dashboard/user/weeklytask/${task.id}`;
      }, 1000);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  const getSubTaskProgress = (subTasks: SubTask[] = []) => {
    const total = subTasks.length;
    const completed = subTasks.filter((st) => st.completed).length;
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const progress = showProgress ? getSubTaskProgress(task.sub_tasks) : null;

  return (
    <div className="group relative bg-[#1C1C1E] rounded-2xl p-4 w-full h-full text-white shadow-md transition-all hover:shadow-xl hover:-translate-y-1 duration-200">
      {task.task_banner_image ? (
        <div className="relative mb-4 rounded-xl overflow-hidden">
          <Image
            width={1920}
            height={1080}
            src={task.task_banner_image}
            alt={task.task_title}
            className="w-full bg-black h-32 object-cover rounded-xl transition-transform group-hover:scale-105 duration-300"
          />
        </div>
      ) : (
        <div className="bg-black h-32 mb-4 rounded-xl overflow-hidden"></div>
      )}

      <div className="flex flex-col h-full">
        <h3 className="text-lg font-semibold mb-2 ">{task.task_title}</h3>

        <div className=" mb-3 flex items-center justify-start">
          <p className=" bg-[#8373EE]/20 text-[#8373EE] text-xs font-medium px-3 py-1 rounded-full">
            {' '}
            {task.task_category}
          </p>{' '}
        </div>
        {showProgress && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-white">Progress</span>
              <span className="text-sm font-semibold text-[#8373EE]">
                {progress ?? 0}%
              </span>
            </div>
            <div className="relative w-full h-2 bg-gray-700 rounded-full">
              <div
                className="absolute top-0 left-0 h-2 rounded-full"
                style={{
                  width: `${progress}%`,
                  backgroundColor: '#8373EE',
                }}
              />
              <div
                className="absolute -top-1.5"
                style={{
                  left: `calc(${progress}% - 8px)`,
                }}
              >
                <div className="w-4 h-4 rounded-full border-2 border-white bg-[#8373EE]" />
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between text-sm text-white mb-4">
          <div className="flex items-center gap-2">
            <Clock size={14} />
            <span>{timeLeft}</span>
          </div>
          <span className="text-[#8373EE] font-semibold">Week {task.week}</span>
        </div>

        {!showProgress && (
          <Button
            onClick={handleStartTask}
            className="w-full cursor-pointer bg-[#8373EE] hover:bg-[#8373EE]/80"
          >
            Start Task
          </Button>
        )}
      </div>
    </div>
  );
};

export default function WeeklyTaskPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Week');
  const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTask[]>([]);
  const [myTasks, setMyTasks] = useState<WeeklyTask[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [weeks, setWeeks] = useState<number[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<number>(0);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const [allTasksRes, myTasksRes] = await Promise.all([
          axios.get<{ data: WeeklyTask[] }>(
            'http://localhost:8080/api/weeklytask/v1'
          ),
          axios.get<{ tasks: WeeklyTask[] }>(
            'http://localhost:8080/api/user-task/v1/all',
            {
              withCredentials: true,
            }
          ),
        ]);

        const allTasks = allTasksRes.data.data || [];
        const myTaskList = myTasksRes.data.tasks || [];

        setWeeklyTasks(allTasks);
        setMyTasks(myTaskList);

        const uniqueCategories = Array.from(
          new Set(allTasks.map((task) => task.task_category).filter(Boolean))
        );
        setCategories(['All', ...uniqueCategories]);

        const uniqueWeeks = Array.from(
          new Set(allTasks.map((task) => task.week))
        ).sort((a, b) => a - b);
        setWeeks([0, ...uniqueWeeks]);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };

    fetchTasks();
  }, []);

  const filterTasks = (tasks: WeeklyTask[]) => {
    return tasks.filter((task) => {
      const matchesSearch = task.task_title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || task.task_category === selectedCategory;
      const matchesWeek = selectedWeek === 0 || task.week === selectedWeek;

      return matchesSearch && matchesCategory && matchesWeek;
    });
  };

  const getTimeLeftString = (endTime?: string): string => {
    if (!endTime) return '';
    const now = new Date();
    const end = new Date(endTime);
    const diffMs = end.getTime() - now.getTime();

    if (diffMs <= 0) return 'Ended';

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;

    return days > 0
      ? `${days} day${days > 1 ? 's' : ''} ${remHours}h left`
      : `${remHours} hour${remHours !== 1 ? 's' : ''} left`;
  };

  const filteredMyTasks = filterTasks(myTasks);
  const filteredAllTasks = filterTasks(weeklyTasks);

  return (
    <div className="min-h-screen bg-black text-foreground flex">
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <TaskHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            categories={categories}
            weeks={weeks}
            selectedWeek={selectedWeek}
            setSelectedWeek={setSelectedWeek}
          />

          {/* My Tasks */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">My Tasks</h2>
            </div>

            <div className="flex flex-wrap">
              {filteredMyTasks.length === 0 ? (
                <p className="text-gray-400">No tasks started yet.</p>
              ) : (
                filteredMyTasks.map((task, index) => {
                  const timeLeft = getTimeLeftString(task.end_time);
                  console.log('hi',task);
                  
                  return (
                    <div
                      key={index}
                      className="lg:w-3/12 md:w-4/12 sm:w-6/12 w-full p-[1%]"
                    >
                      <Link href={`/dashboard/user/weeklytask/${task.id}`}>
                        <WeeklyTaskCard
                          task={task}
                          timeLeft={timeLeft}
                          showProgress
                        />
                      </Link>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* All Weekly Tasks */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                All Weekly Tasks
              </h2>
            </div>

            <div className="flex flex-wrap">
              {filteredAllTasks.map((task, index) => {
                const timeLeft = getTimeLeftString(task.end_time);
                return (
                  <div
                    key={index}
                    className="lg:w-3/12 md:w-4/12 sm:w-6/12 w-full p-[1%]"
                  >
                    <WeeklyTaskCard task={task} timeLeft={timeLeft} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
