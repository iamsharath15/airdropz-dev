'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { TaskHeader } from '@/components/shared/dashboard/admin/weeklyTask/TaskHeader';
import { TaskSection } from '@/components/shared/TaskSection';
import { WeeklyTask } from '@/types';
import { History } from 'lucide-react';

export default function WeeklyTaskPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Week');
  const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTask[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [weeks, setWeeks] = useState<number[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<number>(0); // 0 = All

  useEffect(() => {
    const fetchWeeklyTasks = async () => {
      try {
        const response = await axios.get<{ data: WeeklyTask[] }>(
          'http://localhost:8080/api/weeklytask/v1'
        );
        const tasks = response.data.data || [];
        setWeeklyTasks(tasks);
        const uniqueCategories = Array.from(
          new Set(tasks.map((task) => task.task_category).filter(Boolean))
        );
        setCategories(['All', ...uniqueCategories]);
        const uniqueWeeks = Array.from(
          new Set(tasks.map((task) => task.week))
        ).sort((a, b) => a - b);

        setWeeks([0, ...uniqueWeeks]);
      } catch (error) {
        console.error('Error fetching weekly tasks:', error);
      }
    };

    fetchWeeklyTasks();
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

  const filteredAndSortedTasks = filterTasks(weeklyTasks);

  return (
    <div className="min-h-screen bg-black flex">
      <main className="flex w-full">
        <div className="flex flex-col w-full">
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
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Weekly Task</h2>
            </div>
            {filteredAndSortedTasks.length === 0 ? (
              <div className="bg-[#151313] h-50 w-full flex items-center flex-col justify-center rounded-xl px-4">
                <History  size={30}/>
                <p className="text-white/80 text-lg font-medium text-center pt-4">
                  No tasks found. Start by creating a new task.{' '}
                </p>
              </div>
            ) : (
              <TaskSection
                title="Weekly Tasks"
                tasks={filteredAndSortedTasks}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
