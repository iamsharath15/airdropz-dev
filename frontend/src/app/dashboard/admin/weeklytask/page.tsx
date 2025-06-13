'use client';

import { useState } from 'react';
import { TaskHeader } from '@/components/shared/dashboard/admin/weeklyTask/TaskHeader';
import { TaskSection } from '@/components/shared/TaskSection';
import { TaskDetail } from '@/components/shared/TaskDetail';

import { mockTasks } from '@/app/data/mockTasks';

export default function WeeklyTaskPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Week');
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const filterTasks = (tasks: any[]) => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || task.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  };

  const sortTasks = (tasks: any[]) => {
    return [...tasks].sort((a, b) => {
      switch (sortBy) {
        case 'Week':
          return a.week.localeCompare(b.week);
        case 'Progress':
          return b.progress - a.progress;
        case 'Title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
  };

  const handleBackToTasks = () => {
    setSelectedTask(null);
  };
  const weeklyTasks = sortTasks(filterTasks(mockTasks.weeklyTasks));

  return (
    <div className="min-h-screen bg-black text-foreground flex">
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {!selectedTask ? (
            <>

              <TaskHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />

              <TaskSection title="Weekly Tasks" tasks={weeklyTasks}  onTaskClick={handleTaskClick}/>
            </>
          ) : (
            <TaskDetail task={selectedTask} onBack={handleBackToTasks} />
          )}
        </div>
      </main>
    </div>
  );
}
