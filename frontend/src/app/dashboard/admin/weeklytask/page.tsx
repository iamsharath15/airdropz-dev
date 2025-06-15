'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { TaskHeader } from '@/components/shared/dashboard/admin/weeklyTask/TaskHeader';
import { TaskSection } from '@/components/shared/TaskSection';
import { TaskDetail } from '@/components/shared/TaskDetail';

export default function WeeklyTaskPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Week');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [weeklyTasks, setWeeklyTasks] = useState<any[]>([]);

  useEffect(() => {
    const fetchWeeklyTasks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/weeklytask/v1');
        console.log('Weekly Tasks Data:', response.data.data);
        setWeeklyTasks(response.data.data || []);
      } catch (error) {
        console.error('Error fetching weekly tasks:', error);
      }
    };

    fetchWeeklyTasks();
  }, []);
console.log("hi",weeklyTasks);

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
              />
              <TaskSection
                title="Weekly Tasks"
                tasks={filteredAndSortedTasks}
                onTaskClick={handleTaskClick}
              />
     
        </div>
      </main>
    </div>
  );
}
