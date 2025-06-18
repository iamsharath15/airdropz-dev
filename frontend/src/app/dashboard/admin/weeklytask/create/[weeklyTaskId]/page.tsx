'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import WeeklyTaskTemplate from '@/components/shared/dashboard/weeklyTaskTemplate';
import WeeklyTaskEditor from '@/components/shared/dashboard/admin/weeklyTask/WeeklyTaskEditor';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { uploadImageToS3 } from '@/lib/uploadToS3';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Save, Trash } from 'lucide-react';

const CreateWeeklyTaskPage = () => {
  const params = useParams();
  const taskId = params?.weeklyTaskId as string;

  const [taskData, setTaskData] = useState({
    task_title: '',
    task_category: '',
    start_time: '',
    end_time: '',
    task_description: '',
    task_banner_image: '',
    week: '',
    tasks: [],
    sub_tasks: [],
    // add other fields as needed (checklists, content blocks, etc.)
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchWeeklyTask() {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/weeklytask/v1/${taskId}`
        );
        if (response.data.success) {
          setTaskData(response.data.data);
        } else {
          console.error('Failed to fetch task');
        }
      } catch (error) {
        console.error('Axios error:', error);
      } finally {
        setLoading(false);
      }
    }

    if (taskId) fetchWeeklyTask();
  }, [taskId]);

  const handleTaskUpdate = (updates: any) => {
    setTaskData((prev: any) => ({ ...prev, ...updates }));
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);

      const payload: any = {
        task_title: taskData.task_title,
        task_category: taskData.task_category,
        start_time: taskData.start_time,
        end_time: taskData.end_time,
        task_description: taskData.task_description,
        week: taskData.week,
        tasks: taskData.tasks,
        sub_tasks: taskData.sub_tasks,
      };

      let bannerImage = taskData.task_banner_image;
      if (bannerImage instanceof File) {
        bannerImage = await uploadImageToS3(
          bannerImage,
          `task/${taskId}/taskBannerImage`
        );
      }

      payload.task_banner_image = bannerImage;

      console.log('Sending payload:', payload);
      // Optional: Include other fields if available
      // if (taskData.content_blocks) {
      //   payload.content_blocks = taskData.content_blocks;
      // }

      // if (taskData.checklists) {
      //   payload.checklists = taskData.checklists;
      // }

      // ✅ Send PUT request
      const response = await axios.put(
        `http://localhost:8080/api/weeklytask/v1/${taskId}`,
        payload
      );

      if (response.data.success) {
        toast.success('Weekly Task updated successfully!');
      } else {
        toast.error('Failed to update Weekly Task');
      }
    } catch (error) {
      console.error('PUT error:', error);
      toast.error('Error while saving changes');
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async () => {
    if (!taskId) return;

    try {
      const res = await axios.delete(
        `http://localhost:8080/api/weeklytask/v1/${taskId}`
      );
      if (res.data.success) {
        toast.success('Weekly Task deleted successfully!');
        window.location.href =
          'http://localhost:3000/dashboard/admin/weeklytask';
      } else {
        toast.error('Failed to delete Weekly Task');
      }
    } catch (error) {
      console.error('DELETE error:', error);
      toast.error('Error deleting Weekly Task');
    }
  };

  return (
    <div className="flex flex-col max:h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4 bg-zinc-900 shadow-sm rounded-2xl">
        <h1 className="text-xl font-semibold">Edit Weekly Task</h1>
        <div className="flex gap-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="text-sm sm:text-base px-3 cursor-pointer bg-red-500 hover:bg-red-500/80"
              >
                <Trash className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#0F0F0F] text-white border border-zinc-800">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. It will permanently delete this
                  Weekly Task.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-[#8373EE] hover:bg-[#8373EE]/80 text-white cursor-pointer border-0 hover:text-white">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-500/80 text-white cursor-pointer"
                >
                  Yes, Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            onClick={handleSaveChanges}
            disabled={saving}
            className="bg-[#8373EE] hover:bg-[#8373EE]/80 text-white cursor-pointer"
          >
            <Save className="w-4 h-4 sm:hidden" />
            <span className="hidden sm:inline">
              {saving ? 'Update' : 'Create'}
            </span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex lg:flex-row flex-col-reverse overflow-hidden ">
        {!loading ? (
          <>
            <div className="flex lg:w-4/12 w-full">
              <WeeklyTaskEditor
                task={taskData}
                onTaskUpdate={handleTaskUpdate}
              />
            </div>
            <div className="flex lg:w-8/12 w-full p-2">
              <WeeklyTaskTemplate task={taskData} />
            </div>
          </>
        ) : (
          <div className="p-6 text-center w-full">Loading...</div>
        )}
      </div>
    </div>
  );
};
export default CreateWeeklyTaskPage;
//  task={taskData}
//         onFileUpload={handleFileUpload}
//         uploadingTaskId={uploadingTaskId}
