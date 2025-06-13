'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import WeeklyTaskTemplate from '@/components/shared/dashboard/admin/weeklyTask/weeklyTaskTemplate';
import WeeklyTaskEditor from '@/components/shared/dashboard/admin/weeklyTask/WeeklyTaskEditor';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { uploadImageToS3 } from '@/lib/uploadToS3';


const CreateWeeklyTaskPage = () => {
  const params = useParams();
  const taskId = params?.weeklyTaskId as string;


const [taskData, setTaskData] = useState({
    task_title: '',
    task_category: '',
    start_time: '',
    end_time: '',
  task_description: '',
  task_banner_image: "",
    week:""
    // add other fields as needed (checklists, content blocks, etc.)
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchWeeklyTask() {
      try {
        const response = await axios.get(`http://localhost:8080/api/weeklytask/v1/${taskId}`);
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
      week:taskData.week
    };

    // ✅ Handle and upload image if it's a File
    let bannerImage = taskData.task_banner_image;
    if (bannerImage instanceof File) {
      bannerImage = await uploadImageToS3(
        bannerImage,
        `task/${taskId}/taskBannerImage`
      );
    }

    payload.task_banner_image = bannerImage; // ✅ Now it's a string URL

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
      toast.success('✅ Weekly Task updated successfully!');
    } else {
      toast.error('❌ Failed to update Weekly Task');
    }
  } catch (error) {
    console.error('PUT error:', error);
    toast.error('❌ Error while saving changes');
  } finally {
    setSaving(false);
  }
};





  return (
    <div className="flex flex-col max:h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4 bg-zinc-900 shadow-sm rounded-2xl">
        <h1 className="text-xl font-semibold">Edit Weekly Task</h1>
        <div className="flex gap-3">
          <Button variant="destructive">Delete</Button>
                   <Button
            onClick={handleSaveChanges}
            disabled={saving}
            className="bg-[#8373EE] hover:bg-[#8373EE]/80 text-white"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>

        </div>
      </div>

      {/* Content */}
      <div className="flex lg:flex-row flex-col overflow-hidden">
        {!loading ? (
          <>
            <WeeklyTaskEditor task={taskData} onTaskUpdate={handleTaskUpdate} />
            <WeeklyTaskTemplate task={taskData} />
          </>
        ) : (
          <div className="p-6 text-center w-full">Loading...</div>
        )}
      </div>
    </div>
  );
}
export default CreateWeeklyTaskPage;
