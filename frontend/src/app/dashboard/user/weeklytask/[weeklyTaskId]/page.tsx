'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { ArrowLeft, CalendarOff } from 'lucide-react';
import WeeklyTaskTemplate from '@/components/shared/dashboard/weeklyTaskTemplate';
import Link from 'next/link';
import { uploadImageToS3 } from '@/lib/uploadToS3';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

import type { TaskData } from '@/types';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { useDispatch } from 'react-redux';
import { updateUser } from '@/store/authSlice';

export default function TaskDetail() {
  const { weeklyTaskId } = useParams();
  const [taskData, setTaskData] = useState<TaskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingTaskId, setUploadingTaskId] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);
  const dispatch = useDispatch();

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
        toast.success('Task marked as completed!');
          const updated = response.data.data; // assuming { airdrops_earned, points, ... }

      if (updated?.airdrops_earned !== undefined) {
        dispatch(
          updateUser({
            airdrops_earned: updated.airdrops_earned,
            airdrops_remaining: updated.airdrops_earned, // if same logic
          })
        );
      }
        await fetchTask();
      } else {
        toast.error('Failed to complete task.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(' Upload failed');
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
  const handleRemoveTask = async () => {
    if (!weeklyTaskId) return;

    try {
      const response = await axios.delete(
        `http://localhost:8080/api/user-task/v1/remove/${weeklyTaskId}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success('Task removed from My Tasks');
      } else {
        toast.error(response.data.message || 'Failed to remove task.');
      }
    } catch (error) {
      console.error('Error removing task:', error);
      toast.error('Something went wrong while removing the task.');
    }
  };

  return (
    <div className="w-full px-4">
      <div className="flex flex-row items-center justify-between border-b border-[#111112] px-5 sm:px-6 sm:py-4 py-2 bg-[#111112] shadow-sm rounded-2xl gap-3 sm:gap-0">
        <Link
          href="/dashboard/user/weeklytask"
          className="flex items-center text-white/60 hover:text-white md:text-lg text-sm"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Weekly Task
        </Link>

        <motion.div
          whileTap={{ scale: 1.3 }}
          animate={animating ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <ConfirmDialog
            title="Remove this task ?"
            description="This will remove the task from My Tasks."
            onConfirm={handleRemoveTask}
            confirmText="Yes, Remove"
            cancelText="Cancel"
            trigger={
              <Button
                className={`cursor-pointer md:p-2 p-1 rounded-full transition-all hover:bg-[#8373EE]/40
              bg-white/30
            `}
              >
                <CalendarOff className="w-5 h-5" />
              </Button>
            }
          />
        </motion.div>
      </div>
      <WeeklyTaskTemplate
        task={taskData}
        onFileUpload={handleFileUpload}
        uploadingTaskId={uploadingTaskId}
      />
    </div>
  );
}
