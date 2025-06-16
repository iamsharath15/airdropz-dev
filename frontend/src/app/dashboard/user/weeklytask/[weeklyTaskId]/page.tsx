'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
} from 'lucide-react';
import WeeklyTaskTemplate from '@/components/shared/dashboard/user/weeklyTaskTemplate';
import Link from 'next/link';

interface TaskData {
  title: string;
  description: string;
  progress: number;
  status: string;
  week: string;
  category: string;
  image: string;
  timeLeft?: string;
  // Add more fields if needed
}

export default function TaskDetail() {
  const { weeklyTaskId } = useParams(); // 👈 dynamic route param
  const [taskData, setTaskData] = useState<TaskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!weeklyTaskId) return;

    const fetchTask = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/weeklytask/v1/${weeklyTaskId}`
        );
        setTaskData(response.data.data);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load task data');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [weeklyTaskId]);

  const handleBack = () => {
    // implement navigation logic
    console.log('Back clicked');
  };

  if (loading) {
    return <div className="text-white px-4 py-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 px-4 py-6">{error}</div>;
  }

  if (!taskData) {
    return <div className="text-white px-4 py-6">No data found.</div>;
  }

  return (
    <div className="w-full px-4">
      <div className="flex items-center mb-6">
           <Link
          href="/dashboard/user/weeklytask"
          className="flex items-center text-white/60 hover:text-white md:text-lg text-sm"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to airdrops
        </Link>
    
        <h1 className="text-2xl font-bold text-white">Weekly Task</h1>
      </div>

      <WeeklyTaskTemplate task={taskData} />
    </div>
  );
}
