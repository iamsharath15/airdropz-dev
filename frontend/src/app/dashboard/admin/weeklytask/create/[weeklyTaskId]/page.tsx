'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import {
  CalendarIcon,
  Trash2,
  FileText,
  CheckSquare,
  Link2,
  ChevronDown,
  Check,
} from 'lucide-react';

import StepProgress from '@/components/shared/StepProgress';
import SortableItem from '@/components/shared/SortableItem';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Calendar } from '@/components/ui/calendar';

// Dummy renderBlock & sensors for example purpose
const renderBlock = (block: any, index: number) => <div>{block.type}</div>;

export default function Page() {
  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [category, setCategory] = useState<string | null>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const [contentBlocks, setContentBlocks] = useState<any[]>([]);
  const sensors = useSensors(useSensor(PointerSensor));

  const addBlock = (type: string) =>
    setContentBlocks([...contentBlocks, { type }]);
  const removeBlock = (index: number) =>
    setContentBlocks((blocks) => blocks.filter((_, i) => i !== index));
  const [checklists, setChecklists] = useState([
    { title: '', description: '', image: null },
  ]);
  const addChecklist = () => {
    setChecklists((prev) => [
      ...prev,
      { title: '', description: '', image: null },
    ]);
  };

  const categories = [
    'Marketing',
    'Community',
    'Development',
    'Design',
    'Other',
  ];
  const renderBlock = (block: (typeof contentBlocks)[number], idx: number) => {
    const commonInputClass = 'bg-zinc-800 text-white';

    switch (block.type) {
      case 'description':
      case 'checklist':
        return (
          <Textarea
            value={block.value}
            placeholder={
              block.type === 'checklist'
                ? 'Checklist items, one per line'
                : 'Description'
            }
            className={commonInputClass}
          />
        );
      case 'link':
        return (
          <div className="space-y-2">
            <Input
              value={block.value}
              placeholder="Link title"
              className={commonInputClass}
            />
            <Input
              value={block.link || ''}
              placeholder="URL"
              className={commonInputClass}
            />
          </div>
        );
      default:
        return null;
    }
  };
  const removeChecklist = (index: number) => {
    setChecklists((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col max:h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4 bg-zinc-900 shadow-sm rounded-2xl">
        <h1 className="text-xl font-semibold">Create Weekly Task</h1>
        <div className="flex gap-3">
          <Button variant="destructive">Delete</Button>
          <Button className="bg-[#8373EE] hover:bg-[#8373EE]/80 text-white">
            Create
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex overflow-hidden">
        <div className="w-full md:w-1/2 p-6 overflow-auto border-r border-zinc-800 bg-black">
          <div className="mb-6">
            <StepProgress progress={step} />
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold mb-4">
                Step 1: Weekly Task Details
              </h2>

              <div>
                <label className="block text-sm text-white mb-4">
                  Task Banner Image
                </label>
                <div className="relative flex items-center justify-center w-full h-48 rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-900 cursor-pointer overflow-hidden hover:border-purple-500 transition">
                  <Image
                    src=""
                    alt="Banner preview"
                    className="absolute inset-0 w-full h-full object-cover"
                    width={1920}
                    height={1080}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white mb-1">
                  Task Title
                </label>
                <Input
                  placeholder="Title"
                  className="bg-zinc-800 text-white mb-4"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-white mb-1">
                  Choose Date:
                </label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal bg-zinc-800 text-white',
                            !startDate && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, 'PPP') : 'Start Date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal bg-zinc-800 text-white',
                            !endDate && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, 'PPP') : 'End Date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block text-sm text-white mb-1">
                  Category
                </label>
                <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-between bg-zinc-800 text-white',
                        !category && 'text-muted-foreground'
                      )}
                    >
                      {category || 'Select category'}
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
                              setCategory(cat);
                              setCategoryOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                category === cat ? 'opacity-100' : 'opacity-0'
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

              <div>
                <label className="block text-sm text-white mb-3">
                  Task Description
                </label>
                <Textarea
                  placeholder="Short description"
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

          {step === 2 && (
            <>
              <h2 className="text-lg font-bold mb-4">
                Step 2: Content & Reorder
              </h2>

              {/* 🔽 ADD YOUR CUSTOM TEXT HERE */}
              <p className="text-sm text-zinc-400 mb-4">
                Add content blocks like descriptions, checklists, and links.
                Drag and drop to reorder them.
              </p>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={({ active, over }) => {
                  if (active.id !== over?.id) {
                    const oldIndex = parseInt(active.id);
                    const newIndex = parseInt(over!.id);
                    setContentBlocks((blocks) =>
                      arrayMove(blocks, oldIndex, newIndex)
                    );
                  }
                }}
              >
                <SortableContext
                  items={contentBlocks.map((_, i) => i.toString())}
                  strategy={verticalListSortingStrategy}
                >
                  {contentBlocks.map((block, index) => (
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
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  className="bg-[#8373EE] hover:bg-[#8373EE]/80"
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

              {checklists.map((item, index) => (
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
                      onClick={() => removeChecklist(index)}
                    >
                      Delete
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
                        const newList = [...checklists];
                        newList[index].title = e.target.value;
                        setChecklists(newList);
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
                        const newList = [...checklists];
                        newList[index].description = e.target.value;
                        setChecklists(newList);
                      }}
                    />
                  </div>

                  {/* Verify Image Upload */}
                  <div>
                    <label className="block text-sm text-white mb-1">
                      Verify Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const newList = [...checklists];
                        newList[index].image = e.target.files?.[0] || null;
                        setChecklists(newList);
                      }}
                      className="text-white"
                    />
                  </div>
                </div>
              ))}

              {/* Add Checklist Button */}
              <div className="flex justify-start mb-6">
                <Button
                  className="bg-[#8373EE] hover:bg-[#8373EE]/80"
                  onClick={addChecklist}
                >
                  + Add Checklist
                </Button>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button className="bg-[#8373EE] hover:bg-[#8373EE]/80">
                  Create
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
