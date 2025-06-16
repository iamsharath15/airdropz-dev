'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import {
  Check,
  Calendar as CalendarIcon,
  ChevronDown,
  Trash2,
  FileText,
  CheckSquare,
  Link2,
  Heading1,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableItem from '@/components/shared/SortableItem';
import StepProgress from '@/components/shared/StepProgress';
import { arrayMove } from '@dnd-kit/sortable';

type WeeklyTaskEditorProps = {
  task: any;
  onTaskUpdate: (updates: any) => void;
};

const WeeklyTaskEditor: React.FC<WeeklyTaskEditorProps> = ({
  task,
  onTaskUpdate,
}) => {
  const [step, setStep] = useState(1);
  const [banner, setBanner] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));

  const categories = [
    'Marketing',
    'Community',
    'Development',
    'Design',
    'Other',
  ];

  const addBlock = (type: string) => {
    const newBlocks = [...(task.tasks || []), { type, value: '', link: '' }];
    onTaskUpdate({ tasks: newBlocks });
  };

  const removeBlock = (index: number) => {
    const newBlocks = (task.tasks || []).filter((_, i) => i !== index);
    onTaskUpdate({ tasks: newBlocks });
  };

  const renderBlock = (block: any, index: number) => {
    return (
      <div className="space-y-2">
        {(block.type === 'description' || block.type === 'checklist') && (
          <Textarea
            value={block.value}
            onChange={(e) => {
              const updated = [...task.tasks];
              updated[index].value = e.target.value;
              onTaskUpdate({ tasks: updated });
            }}
            placeholder={
              block.type === 'checklist'
                ? 'Checklist items, one per line'
                : 'Description'
            }
            className="bg-zinc-800 text-white"
          />
        )}
        {block.type === 'link' && (
          <>
            <Input
              placeholder="Link title"
              value={block.value}
              onChange={(e) => {
                const updated = [...task.tasks];
                updated[index].value = e.target.value;
                onTaskUpdate({ tasks: updated });
              }}
              className="bg-zinc-800 text-white"
            />
            <Input
              placeholder="URL"
              value={block.link}
              onChange={(e) => {
                const updated = [...task.tasks];
                updated[index].link = e.target.value;
                onTaskUpdate({ tasks: updated });
              }}
              className="bg-zinc-800 text-white"
            />
          </>
        )}
        {block.type === 'header1' && (
          <>
            <Input
              value={block.value}
              onChange={(e) => {
                const updated = [...task.tasks];
                updated[index].value = e.target.value;
                onTaskUpdate({ tasks: updated });
              }}
              placeholder="header1"
              className="bg-zinc-800 text-white"
            />
          </>
        )}
      </div>
    );
  };

const addChecklist = () => {
  const updatedSubTasks = [...(task.sub_tasks || []), { title: '', description: '', image: null }];
  onTaskUpdate({
    ...task,
    sub_tasks: updatedSubTasks,
  });
};


const removeChecklist = (index: number) => {
  const updatedSubTasks = task.sub_tasks.filter((_, i) => i !== index);
  onTaskUpdate({
    ...task,
    sub_tasks: updatedSubTasks,
  });
};


  return (
    <div className="w-full md:w-1/2 p-6 overflow-auto border-r border-zinc-800 bg-black">
      <div className="mb-6">
        <StepProgress progress={step} />
      </div>

      {/* Step 1: Task Details */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold mb-4">
            Step 1: Weekly Task Details
          </h2>

          {/* Banner Upload */}
          <div>
            <label className="block text-sm text-white mb-4">
              Task Banner Image
            </label>
            <label className="relative flex items-center justify-center w-full h-48 rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-900 cursor-pointer overflow-hidden hover:border-purple-500 transition">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Banner preview"
                  className="absolute inset-0 w-full h-full object-cover"
                  width={1920}
                  height={1080}
                />
              ) : (
                <span className="text-zinc-500">Click to upload banner</span>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const preview = URL.createObjectURL(file);
                    setPreviewUrl(preview);
                    onTaskUpdate({ task_banner_image: file });
                  }
                }}
              />
            </label>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm text-white mb-1">Task Title</label>
            <Input
              placeholder="Title"
              value={task.task_title}
              onChange={(e) => onTaskUpdate({ task_title: e.target.value })}
              className="bg-zinc-800 text-white mb-4"
            />
          </div>

          {/* Dates */}
          <div className="space-y-2">
            <label className="block text-sm text-white mb-1">
              Choose Date:
            </label>
            <div className="flex gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal bg-zinc-800 text-white',
                      !task.start_time && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {task.start_time
                      ? format(new Date(task.start_time), 'PPP')
                      : 'Start Date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      task.start_time ? new Date(task.start_time) : undefined
                    }
                    onSelect={(date) =>
                      onTaskUpdate({ start_time: date?.toISOString() || '' })
                    }
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal bg-zinc-800 text-white',
                      !task.end_time && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {task.end_time
                      ? format(new Date(task.end_time), 'PPP')
                      : 'End Date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      task.end_time ? new Date(task.end_time) : undefined
                    }
                    onSelect={(date) =>
                      onTaskUpdate({ end_time: date?.toISOString() || '' })
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm text-white mb-1">Category</label>
            <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-between bg-zinc-800 text-white',
                    !task.task_category && 'text-muted-foreground'
                  )}
                >
                  {task.task_category || 'Select category'}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0 bg-zinc-900 text-white border-zinc-700">
                <Command>
                  <CommandGroup>
                    {categories.map((cat) => (
                      <CommandItem
                        key={cat}
                        value={cat}
                        onSelect={() => {
                          onTaskUpdate({ task_category: cat });
                          setCategoryOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            task.task_category === cat
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                        {cat}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-white mb-3">
              Task Description
            </label>
            <Textarea
              placeholder="Short description"
              value={task.task_description || ''}
              onChange={(e) =>
                onTaskUpdate({ task_description: e.target.value })
              }
              className="bg-zinc-900 border-zinc-700 text-white mb-4"
            />
          </div>

          <Button
            onClick={() => setStep(2)}
            className="bg-[#8373EE] hover:bg-[#8373EE]/80"
          >
            Next
          </Button>
        </div>
      )}

      {/* Step 2: Add / Reorder Blocks */}
      {step === 2 && (
        <>
          <h2 className="text-lg font-bold mb-4">Step 2: Content & Reorder</h2>
          <p className="text-sm text-zinc-400 mb-4">
            Add content blocks like descriptions, checklists, and links. Drag
            and drop to reorder them.
          </p>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={({ active, over }) => {
              if (active.id !== over?.id) {
                const oldIndex = parseInt(active.id);
                const newIndex = parseInt(over!.id);
                const reordered = arrayMove(task.tasks, oldIndex, newIndex);
                onTaskUpdate({ tasks: reordered });
              }
            }}
          >
            <SortableContext
              items={(task.tasks || []).map((_: any, i: number) =>
                i.toString()
              )}
              strategy={verticalListSortingStrategy}
            >
              {(task.tasks || []).map((block: any, index: number) => (
                <SortableItem key={index} id={index.toString()}>
                  <div className="border border-zinc-700 rounded-lg p-4 mb-4 relative">
                    <button
                      className="absolute top-2 right-2 text-white bg-black hover:bg-red-400 p-1 rounded-md"
                      onClick={() => removeBlock(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="mt-6">{renderBlock(block, index)}</div>
                  </div>
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>

          <div className="flex gap-2">
            {[
              { icon: <FileText />, type: 'description' },
              { icon: <CheckSquare />, type: 'checklist' },
              { icon: <Link2 />, type: 'link' },
              { icon: <Heading1 />, type: 'header1' },
            ].map((tool) => (
              <Tooltip key={tool.type}>
                <TooltipTrigger asChild>
                  <Button
                    className="bg-[#8373EE] hover:bg-[#8373EE]/80"
                    onClick={() => addBlock(tool.type)}
                  >
                    {tool.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add {tool.type}</TooltipContent>
              </Tooltip>
            ))}
          </div>

          <div className="flex gap-2 mt-6">
            <Button
              variant="outline"
              className="text-black cursor-pointer"
              onClick={() => setStep(1)}
            >
              Back
            </Button>
            <Button
              className="bg-[#8373EE] hover:bg-[#8373EE]/80 cursor-pointer"
              onClick={() => setStep(3)}
            >
              Next
            </Button>
          </div>
        </>
      )}
      {step === 3 && (
        <>
          <h2 className="text-lg font-bold mb-4">Step 3: Task Checklist</h2>

          {task.sub_tasks.map((item, index) => (
            <div
              key={index}
              className="space-y-4 border border-zinc-700 p-4 rounded-xl mb-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-semibold text-purple-300">
                  Checklist {index + 1}
                </h3>
                <Button
                  variant="destructive"
                  size="sm"
                  className='cursor-pointer'
                  onClick={() => removeChecklist(index)}
                >
                <Trash2 />
                </Button>
              </div>

              {/* Checklist Title */}
              <div>
                <label className="block text-sm text-white mb-1">
                  Checklist Title
                </label>
                <Input
                  placeholder="Enter checklist title"
                  className="bg-zinc-800 text-white"
                  value={item.title}
                  onChange={(e) => {
                    const updatedSubTasks = [...task.sub_tasks];
                    updatedSubTasks[index].title = e.target.value;
                    onTaskUpdate({
                      ...task,
                      sub_tasks: updatedSubTasks,
                    })
                  }}
                />
              </div>

              {/* Checklist Description */}
              <div>
                <label className="block text-sm text-white mb-1">
                  Checklist Description
                </label>
               <Textarea
  placeholder="Enter checklist description"
  className="bg-zinc-900 border-zinc-700 text-white"
  value={item.description}
  onChange={(e) => {
    const updatedSubTasks = [...task.sub_tasks];
    updatedSubTasks[index].description = e.target.value;
    onTaskUpdate({
      ...task,
      sub_tasks: updatedSubTasks,
    });
  }}
/>

              </div>

              {/* Verify Image Upload */}
              <div>
                <label className="block text-sm text-white mb-1">
                  Submission type
                </label>
              <Input disabled placeholder='Image' />

              </div>
            </div>
          ))}

          {/* Add Checklist Button */}
          <div className="flex justify-start mb-6">
            <Button
              className="bg-[#8373EE] hover:bg-[#8373EE]/80 cursor-pointer"
              onClick={addChecklist}
            >
              + Add Checklist
            </Button>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(2)} className='text-black cursor-pointer'>
              Back
            </Button>
            <Button className="bg-[#8373EE] hover:bg-[#8373EE]/80 cursor-pointer">
              Create
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default WeeklyTaskEditor;
