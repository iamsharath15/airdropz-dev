'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { TaskHeader } from '@/components/shared/dashboard/admin/weeklyTask/TaskHeader';
import { TaskSection } from '@/components/shared/TaskSection';

export default function WeeklyTaskPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Week');
  const [weeklyTasks, setWeeklyTasks] = useState<any[]>([]);
const [categories, setCategories] = useState<string[]>([]);
const [weeks, setWeeks] = useState<number[]>([]);
const [selectedWeek, setSelectedWeek] = useState<number>(0); // 0 = All

  useEffect(() => {
    const fetchWeeklyTasks = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8080/api/weeklytask/v1'
        );
        const tasks = response.data.data || [];
        setWeeklyTasks(tasks);
         const uniqueCategories = Array.from(
        new Set(tasks.map((task: any) => task.task_category).filter(Boolean))
      );
        setCategories(['All', ...uniqueCategories]);
        const uniqueWeeks = Array.from(
  new Set(tasks.map((task: any) => task.week))
).sort((a, b) => a - b);

setWeeks([0, ...uniqueWeeks]); 
      } catch (error) {
        console.error('Error fetching weekly tasks:', error);
      }
    };

    fetchWeeklyTasks();
  }, []);

  const filterTasks = (tasks: any[]) => {
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

  // const filteredAndSortedTasks = sortTasks(filterTasks(weeklyTasks));
  const filteredAndSortedTasks = filterTasks(weeklyTasks);

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
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Weekly Task</h2>
            </div>
            <TaskSection title="Weekly Tasks" tasks={filteredAndSortedTasks} />
          </div>
        </div>
      </main>
    </div>
  );
}
