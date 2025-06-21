'use client';

import React, { useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  CloudUpload,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { SubTask, TaskBlock, WeeklyTask } from '@/types';

type WeeklyTaskTemplateProps = {
  task: Partial<WeeklyTask> & { task_banner_image?: string | File };
  isAdmin?: boolean;
  onFileUpload?: (file: File, subTaskId: string) => void;
  uploadingTaskId?: string | null;
};

const WeeklyTaskTemplate = ({
  task,
  onFileUpload,
  uploadingTaskId,
}: WeeklyTaskTemplateProps) => {
  const taskList = task?.sub_tasks || [];
  const [previewImages, setPreviewImages] = useState<
    Record<string, string | null>
  >({});

  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>(
    () => {
      const initialState: Record<string, boolean> = {};
      if (Array.isArray(task.sub_tasks) && task.sub_tasks.length > 0) {
        initialState[task.sub_tasks[0].id] = true;
      }
      return initialState;
    }
  );

  const [selectedFiles, setSelectedFiles] = useState<
    Record<string, File | null>
  >({});

  const toggleTask = (taskId: string) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const handleFileChange = (subTaskId: string, file: File | null) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [subTaskId]: file,
    }));

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImages((prev) => ({
        ...prev,
        [subTaskId]: url,
      }));
    }
  };

  const handleSubmit = (subTaskId: string) => {
    const file = selectedFiles[subTaskId];
    if (!file) {
      toast.error('Please select a file before submitting.');
      return;
    }
    if (onFileUpload) {
      onFileUpload(file, subTaskId);
    } else {
      toast.error('Upload function is not available.');
    }
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
  const timeLeft = getTimeLeftString(task.end_time);

  return (
    <div className="w-full pt-[2%]">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3 w-full space-y-6 bg-[#151313] rounded-xl ">
          <div className="rounded-xl overflow-hidden">
            {task.task_banner_image ? (
              <Image
                src={
                  typeof task.task_banner_image === 'string'
                    ? task.task_banner_image
                    : URL.createObjectURL(task.task_banner_image)
                }
                alt="Task Banner Image"
                className="w-full object-cover rounded-lg bg-gray-400"
                width={1920}
                height={1080}
              />
            ) : (
              <div className="w-full h-64 lg:h-80 bg-gray-400 rounded-lg" />
            )}
          </div>
          <div className="p-4">
            <h3 className="text-xl lg:text-2xl font-semibold text-white mb-4">
              {task.task_title || 'Untitled Task'}
            </h3>
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex gap-4">
                <div className="bg-[#8373EE] px-3 py-1 rounded-full">
                  <p className="text-white text-sm">Week 02</p>
                </div>
                <div className="bg-[#8373EE] px-3 py-1 rounded-full">
                  <p className="text-white text-sm">
                    # {task.task_category || 'Uncategorized'}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-white text-sm">
                  <Users className="w-4 h-4" />
                  {task.total_users_started ? (
                    <span>{task.total_users_started}</span>
                  ) : (
                    <span>0</span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-white text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{timeLeft}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Description
                </h4>
                <p className="text-white/80 text-sm ">
                  {task.task_description || 'No description added.'}
                </p>
              </div>
            </div>

            {Array.isArray(task.tasks) &&
              task.tasks.map((block: TaskBlock, i: number) => {
                switch (block.type) {
                  case 'description':
                    return (
                      <div className="flex flex-col" key={i}>
                        <p className="text-white/80 text-sm font-medium py-1">
                          {block.value}
                        </p>
                      </div>
                    );
                  case 'checklist':
                    return (
                      <ul
                        key={i}
                        className="list-disc list-inside text-white text-sm mb-4"
                      >
                        {block.value
                          .split('\n')
                          .filter(Boolean)
                          .map((item: string, idx: number) => (
                            <li key={idx}>{item}</li>
                          ))}
                      </ul>
                    );
                  case 'link':
                    return (
                      <div
                        className="flex gap-2 py-2 items-center justify-start"
                        key={i}
                      >
                        <div className=" bg-[#8373EE] rounded-full flex items-center justify-center p-1">
                          <Check size={15} />
                        </div>
                        <p className="text-white text-sm">
                          {block.value} :{' '}
                          <a
                            href={block.link || ''}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 underline"
                          >
                            Link
                          </a>
                        </p>
                      </div>
                    );
                  case 'header1':
                    return (
                      <div className="flex flex-col" key={i}>
                        <h1 className="text-xl md:text-2xl font-semibold py-2">
                          {block.value}
                        </h1>
                      </div>
                    );
                  default:
                    return null;
                }
              })}
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:w-1/3 w-full bg-[#151313] p-6 rounded-xl h-fit">
          <h3 className="md:text-lg text-sm font-semibold text-white mb-4">
            Task Checklist
          </h3>
          <div className="space-y-3">
            {taskList.map((task: SubTask, index: number) => (
              <div key={index} className="bg-black rounded-lg">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="w-full p-4 flex justify-between items-start text-left hover:bg-black rounded-lg space-x-4 cursor-pointer"
                >
                  <span className="text-white text-sm font-semibold">
                    Task {index + 1}: {task.title}
                  </span>
                  {expandedTasks[task.id] ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {expandedTasks[task.id] && (
                  <div className="px-4 pb-4">
                    {task.description && (
                      <p className="text-white/80 font-semibold text-sm mb-2">
                        {task.description}
                      </p>
                    )}

                    <h4 className="text-white text-sm mb-3">File submission</h4>
                    {task.completed ? (
                      <div className="relative mb-4 w-full items-center overflow-hidden h-40 bg-[#8373EE]/60 p-4 rounded-lg text-white flex flex-col gap-2 justify-center text-center">
                        <p className="text-lg font-bold">
                          {' '}
                          Task {index + 1} Completed
                        </p>
                        <p className="text-sm opacity-80">
                          Your submission was received successfully.
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Drag and drop area */}
                        <div
                          onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files?.[0];
                            if (file) handleFileChange(task.id, file);
                          }}
                          onDragOver={(e) => e.preventDefault()}
                          className="w-full  flex items-center justify-center border border-dashed border-[#8373EE] rounded-md p-4 mb-2 text-center text-white cursor-pointer"
                          onClick={() =>
                            document
                              .getElementById(`file-input-${task.id}`)
                              ?.click()
                          }
                        >
                          <CloudUpload
                            size={30}
                            className="text-[#8373EE]/60 py-[15%]"
                          />

                          {/* Hidden file input, triggers when div is clicked */}
                          <input
                            id={`file-input-${task.id}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              handleFileChange(task.id, file);
                            }}
                          />
                          {previewImages[task.id] && (
                            <Image
                              width={1920}
                              height={1080}
                              src={previewImages[task.id]!}
                              alt="Selected Preview"
                              className="w-full  rounded-lg "
                            />
                          )}
                        </div>
                        <p className="mb-2 text-white/80 text-sm">
                          * Drag or browser from device
                        </p>
                        <button
                          onClick={() => handleSubmit(task.id)}
                          className="w-full mt-2 bg-[#8373EE] hover:bg-[#8373EE]/80 cursor-pointer text-white py-2 rounded-lg"
                          disabled={uploadingTaskId === task.id}
                        >
                          {uploadingTaskId === task.id
                            ? 'Uploading...'
                            : 'Submit'}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyTaskTemplate;
