'use client';

import React, { useState } from 'react';
import { ArrowLeft, Users, Clock, ChevronDown, ChevronUp, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TaskDetailProps {
  task: {
    title: string;
    description: string;
    progress: number;
    status: string;
    week: string;
    category: string;
    image: string;
    timeLeft?: string;
  };
  onBack: () => void;
}

export const TaskDetail: React.FC<TaskDetailProps> = ({ task, onBack }) => {
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({
    task1: false,
    task2: true,
    task3: false,
    task4: false,
    task5: false,
  });

  const toggleTask = (taskId: string) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  return (
    <div className="w-full px-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="cursor-pointer flex items-center space-x-2 text-gray-300 hover:text-white transition-colors mr-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Tasks</span>
        </button>
        <h1 className="text-2xl font-bold text-white">Weekly Task</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel */}
        <div className="lg:col-span-2 space-y-6 bg-[#1e1e22]">
          {/* Banner */}
          <div className="relative rounded-xl overflow-hidden">
            <div className="w-full h-64 lg:h-80 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 relative">
              <div className="absolute inset-0  bg-opacity-20"></div>
              <div className="absolute bottom-6 left-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">{task.title}</h2>
              </div>
              <div className="absolute right-6 bottom-6">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {task.title.charAt(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4">
               {/* Task Info */}
          <div>
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-4">{task.description}</h3>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="text-blue-400 text-sm">{task.week}</span>
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                #{task.category}
              </span>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Users className="w-4 h-4" />
                <span>20 Total Uses</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Clock className="w-4 h-4" />
                <span>{task.status}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Description</h4>
            <p className="text-gray-300 leading-relaxed">
              Explore the new blockchain network Artela and its native token ART. Learn how the chain works,
              the purpose of the ART token, and how to get started. Follow the steps in the tutorial and dive
              into this new ecosystem with confidence and creativity.
            </p>
          </div>

          {/* Example Steps */}
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Task 1 : Artela & ART</h4>
              <p className="text-gray-300 mb-4">
                Use the Artbridge to transfer ART tokens between Base and Artela chains powered by Hyperlane.
              </p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">1</span>
                  </div>
                  <span className="text-gray-300">Swap ART token on Base:</span>
                  <span className="text-blue-400 cursor-pointer hover:underline">Link</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-300">Bridge ART between Base and Artela:</span>
                  <span className="text-blue-400 cursor-pointer hover:underline">Link</span>
                </div>
              </div>

              <p className="text-gray-400 text-sm">
                Swap a minimum of $1 and bridge the full amount. Bridging out of Artela costs ~26 ART (~$0.35).
              </p>
            </div>
          </div>
       </div>
        </div>

        {/* Right Panel - Task Checklist */}
        <div className="bg-[#1e1e22] p-6 rounded-xl h-fit">
          <h3 className="text-lg font-semibold text-white mb-6">Task checklist</h3>

          <div className="space-y-3">
            {[
              { id: 'task1', title: 'Task 1: Artela & ART', completed: false },
              {
                id: 'task2',
                title: 'Task 2: Unichain, Abstract, Sonelum',
                completed: false,
                description: 'Once you complete, please share your screenshot to unlock task 3',
              },
              { id: 'task3', title: 'Task 3: USUAL Token Interaction', completed: false },
              { id: 'task4', title: 'Task 4: Another Token', completed: false },
              { id: 'task5', title: 'Task 5: Wrap Up', completed: false },
            ].map(taskItem => (
              <div key={taskItem.id} className="border border-gray-700 rounded-lg ">
                <button
                  onClick={() => toggleTask(taskItem.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-750 transition-colors rounded-lg cursor-pointer"
                >
                  <span className="text-white text-sm">{taskItem.title}</span>
                  {expandedTasks[taskItem.id] ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {expandedTasks[taskItem.id] && (
                  <div className="px-4 pb-4">
                    {taskItem.description && (
                      <p className="text-gray-400 text-sm mb-4">{taskItem.description}</p>
                    )}

                    {taskItem.id === 'task2' && (
                      <div>
                        <h4 className="text-white text-sm mb-3">File submissions</h4>
                        <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-400 text-sm">Drag or browse from device</p>
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
