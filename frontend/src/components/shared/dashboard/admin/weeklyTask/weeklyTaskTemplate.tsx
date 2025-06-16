'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Clock, Upload, Users } from 'lucide-react';
import Image from 'next/image';

interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  description?: string;
}

const taskList: TaskItem[] = [
  { id: 'task1', title: 'Task 1: Artela & ART', completed: false },
  {
    id: 'task2',
    title: 'Task 2: Unichain, Abstract, Sonelum',
    completed: false,
    description:
      'Once you complete, please share your screenshot to unlock task 3',
  },
  { id: 'task3', title: 'Task 3: USUAL Token Interaction', completed: false },
  { id: 'task4', title: 'Task 4: Another Token', completed: false },
  { id: 'task5', title: 'Task 5: Wrap Up', completed: false },
];

const WeeklyTaskTemplate = ({ task }: { task: any }) => {
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({
    task1: false,
    task2: true,
    task3: false,
    task4: false,
    task5: false,
  });

  const toggleTask = (taskId: string) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  return (
    <div className="w-full lg:w-7/12 p-[1%]">
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
              {task.task_title || 'Untitled Task'}{' '}
            </h3>
            <div className="flex w-full flex-col items-start gap-4 mb-4">
              <div className="flex gap-4">
                <div className="bg-[#8373EE] px-3 py-1 rounded-full ">
                  <p className="text-white text-sm"> Week 02</p>{' '}
                </div>
                <div className="bg-[#8373EE] px-3 py-1 rounded-full ">
                  <p className="text-white text-sm">
                    {' '}
                    # {task.task_category || 'Uncategorized'}
                  </p>{' '}
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-white text-sm">
                  <Users className="w-4 h-4" />
                  <span>20 Total Uses</span>
                </div>
                <div className="flex items-center gap-2 text-white text-sm">
                  <Clock className="w-4 h-4" />
                  <span>
                    {' '}
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

            {/* Description */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">
                Description
              </h4>
              <p className="text-gray-300 leading-relaxed">
                {task.task_description || 'No description added.'}
              </p>
            </div>

            {/* Example Task */}
              {task.tasks.map((block, i) => {
                        switch (block.type) {
                          case 'description':
                            return (
                              <div
                                className="py-[2%] flex items-center justify-start w-full"
                                key={i}
                              >
                                <p className="text-left font-medium text-white md:text-lg text-sm">
                                  {block.value}
                                </p>
                              </div>
                            );
                          case 'image':
                            return block.value?.trim() ? (
                              <Image
                                key={i}
                                src={block.value}
                                alt={`Content ${i}`}
                                width={1920}
                                height={1080}
                                className="mb-4 rounded-xl object-contain"
                                unoptimized
                              />
                            ) : (
                              <div
                                key={i}
                                className="w-full h-48 bg-zinc-800 rounded-xl mb-4"
                              />
                            );
                          case 'checklist':
                            const items = block.value.split('\n').filter(Boolean);
                            return (
                              <div
                                className="py-[1%] flex itesms-center justify-start w-full"
                                key={i}
                              >
                                <ul className="list-disc list-inside text-white font-medium mb-4 md:text-lg text-sm">
                                  {items.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            );
                          case 'link':
                            return (
                              <div
                                className="py-[1%] flex itesms-center justify-start w-full"
                                key={i}
                              >
                                <p className="text-white md:text-lg text-sm font-medium">
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
                              </div>
                            );
                          case 'highlight':
                            return (
                              <div
                                className="bg-[#111112] my-[2%] py-[2%] px-[10%] rounded-2xl w-full"
                                key={i}
                              >
                                <p className="text-center text-white md:text-2xl text-xl font-medium ">
                                  {block.value}
                                </p>
                              </div>
                            );
                          case 'header1':
                            return (
                              <div
                                className="py-[1%] flex itesms-center justify-start w-full"
                                key={i}
                              >
                                <h1 className="text-white md:text-2xl text-xl font-medium text-left ">
                                  {block.value}
                                </h1>
                              </div>
                            );
                          default:
                            return null;
                        }
                      })}
            <div className="space-y-6 mt-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">
                  Task 1 : Artela & ART
                </h4>
                <p className="text-gray-300 mb-4">
                  Use the Artbridge to transfer ART tokens between Base and
                  Artela chains powered by Hyperlane.
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">1</span>
                    </div>
                    <span className="text-gray-300">
                      Swap ART token on Base:
                    </span>
                    <span className="text-blue-400 cursor-pointer hover:underline">
                      Link
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-gray-300">
                      Bridge ART between Base and Artela:
                    </span>
                    <span className="text-blue-400 cursor-pointer hover:underline">
                      Link
                    </span>
                  </div>
                </div>

                <p className="text-gray-400 text-sm">
                  Swap a minimum of $1 and bridge the full amount. Bridging out
                  of Artela costs ~26 ART (~$0.35).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Task Checklist */}
        <div className="xl:w-1/3 w-full bg-[#1e1e22] p-6 rounded-xl h-fit">
          <h3 className="text-lg font-semibold text-white mb-6">
            Task checklist
          </h3>

          <div className="space-y-3">
            {taskList.map((task) => (
              <div key={task.id} className="border border-gray-700 rounded-lg">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-750 transition-colors rounded-lg cursor-pointer"
                >
                  <span className="text-white text-sm">{task.title}</span>
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

                    {task.id === 'task2' && (
                      <div>
                        <h4 className="text-white text-sm mb-3">
                          File submissions
                        </h4>
                        <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-400 text-sm">
                            Drag or browse from device
                          </p>
                        </div>
                        <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                          Submit
                        </Button>
                      </div>
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
