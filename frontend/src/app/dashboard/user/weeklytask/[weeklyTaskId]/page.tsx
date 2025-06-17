'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import WeeklyTaskTemplate from '@/components/shared/dashboard/user/weeklyTaskTemplate';
import Link from 'next/link';
import { uploadImageToS3 } from '@/lib/uploadToS3';
import { toast } from 'sonner';

interface TaskData {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: string;
  week: string;
  category: string;
  image: string;
  timeLeft?: string;
  // Include other fields if needed
}

export default function TaskDetail() {
  const { weeklyTaskId } = useParams();
  const [taskData, setTaskData] = useState<TaskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingTaskId, setUploadingTaskId] = useState<string | null>(null);

  const fetchTask = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/weeklytask/v1/${weeklyTaskId}/with-user-progress`,
        {
          withCredentials: true,
        }
      );
      setTaskData(response.data.data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to load task data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (weeklyTaskId) {
      fetchTask();
    }
  }, [weeklyTaskId]);

  const handleFileUpload = async (file: File, subTaskId: string) => {
    try {
      setUploadingTaskId(subTaskId);

      // Upload to S3
      const image_url = await uploadImageToS3(file, `sub_tasks/${subTaskId}`);
console.log(image_url);

      // Send to backend
      const response = await axios.post(
        `http://localhost:8080/api/weeklytask/v1/upload-subtask-image/${taskData?.id}`,
        {
          sub_task_id: subTaskId,
          image_url,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success('✅ Task marked as completed!');
        await fetchTask(); // Re-fetch to update UI
      } else {
        toast.error('❌ Failed to complete task.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('❌ Upload failed');
    } finally {
      setUploadingTaskId(null);
    }
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
        <h1 className="text-2xl font-bold text-white ml-4">Weekly Task</h1>
      </div>

      <WeeklyTaskTemplate
        task={taskData}
        onFileUpload={handleFileUpload}
        uploadingTaskId={uploadingTaskId}
      />
    </div>
  );
}
