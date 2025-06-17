'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock,Users } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

const WeeklyTaskTemplate = ({
  task,
  onFileUpload,
  uploadingTaskId,
}: {
  task: any;
  onFileUpload: (file: File, subTaskId: string) => void;
  uploadingTaskId: string | null;
}) => {
  const taskList = task?.sub_tasks || [];

  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>(
    () => {
      const initialState: Record<string, boolean> = {};
      if (task?.sub_tasks?.length > 0) {
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
  };

  const handleSubmit = (subTaskId: string) => {
    const file = selectedFiles[subTaskId];
    if (!file) {
      toast.error('Please select a file before submitting.');
      return;
    }
    onFileUpload(file, subTaskId);
  };

  return (
    <div className="w-full p-[1%]">
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left Panel */}
        <div className="xl:w-2/3 w-full space-y-6 bg-[#151313]">
          {/* Banner */}
          <div className="relative rounded-xl overflow-hidden">
            {task.task_banner_image ? (
              <Image
                src={
                  typeof task.task_banner_image === 'string'
                    ? task.task_banner_image
                    : URL.createObjectURL(task.task_banner_image)
                }
                alt="Task Banner"
                className="w-full h-64 lg:h-80 object-cover rounded-lg"
                width={1920}
                height={1080}
              />
            ) : (
              <div className="w-full h-64 lg:h-80 bg-gray-400 rounded-lg relative" />
            )}
          </div>

          {/* Task Info Section */}
          <div className="p-4">
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-4">
              {task.task_title || 'Untitled Task'}
            </h3>
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex gap-4">
                <div className="bg-[#8373EE] px-3 py-1 rounded-full">
                  <p className="text-white text-sm">Week 02</p>
                </div>
                <div className="bg-[#8373EE] px-3 py-1 rounded-full">
                  <p className="text-white text-sm">
                    #{task.task_category || 'Uncategorized'}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-white text-sm">
                  <Users className="w-4 h-4" />
                  <span>20 Total Users</span>
                </div>
                <div className="flex items-center gap-2 text-white text-sm">
                  <Clock className="w-4 h-4" />
                  <span>
                    Dates:{' '}
                    {task.start_time
                      ? new Date(task.start_time).toDateString()
                      : 'Start'}{' '}
                    -{' '}
                    {task.end_time
                      ? new Date(task.end_time).toDateString()
                      : 'End'}
                  </span>
                </div>
              </div>
            </div>

            {/* Task Content Blocks */}
            {Array.isArray(task.tasks) &&
              task.tasks.map((block: any, i: number) => {
                switch (block.type) {
                  case 'description':
                    return (
                      <p
                        key={i}
                        className="text-white/80 text-sm font-medium py-2"
                      >
                        {block.value}
                      </p>
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
                      <p key={i} className="text-white text-sm">
                        {block.value}{' '}
                        <a
                          href={block.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 underline"
                        >
                          Link
                        </a>
                      </p>
                    );
                  case 'header1':
                    return (
                      <h1
                        key={i}
                        className="text-white text-xl md:text-2xl font-semibold py-4"
                      >
                        {block.value}
                      </h1>
                    );
                  default:
                    return null;
                }
              })}
          </div>
        </div>

        {/* Right Panel */}
        <div className="xl:w-1/3 w-full bg-[#151313] p-6 rounded-xl h-fit">
          <h3 className="text-lg font-semibold text-white mb-6">
            Task Checklist
          </h3>
          <div className="space-y-3">
            {taskList.map((task: any, index: number) => (
              <div key={index} className="bg-black rounded-lg">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="w-full p-4 flex justify-between items-start text-left hover:bg-gray-750 rounded-lg space-x-4"
                >
                  <span className="text-white text-sm">
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
                      <p className="text-gray-400 text-sm mb-4">
                        {task.description}
                      </p>
                    )}

                    <h4 className="text-white text-sm mb-3">File submission</h4>
                    {task.completed && task.sub_task_image ? (
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
                          className="w-full border border-dashed border-gray-500 rounded-md p-4 mb-2 text-center text-white"
                        >
                          Drag & Drop file here or use the file picker below
                        </div>

                        {/* File picker */}
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full text-sm text-white mb-2"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            handleFileChange(task.id, file);
                          }}
                        />

                        <button
                          onClick={() => handleSubmit(task.id)}
                          className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded"
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
