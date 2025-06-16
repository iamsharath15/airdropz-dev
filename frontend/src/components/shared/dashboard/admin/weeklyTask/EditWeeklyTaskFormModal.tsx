'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type WeeklyTask = {
  id: string;
  task_title: string;
  task_category: string;
  week: number;
  start_time: string;
  end_time: string;
  task_description: string;
  task_banner_image: string;
};

type EditWeeklyTaskFormModalProps = {
  task: WeeklyTask;
};

const EditWeeklyTaskFormModal = ({ task }: EditWeeklyTaskFormModalProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState(task.task_title);
  const [categories, setCategories] = useState(['Game', 'Cricket']);
  const [category, setCategory] = useState(task.task_category);
  const [weekOptions, setWeekOptions] = useState(['1', '2', '3', '4', '5']);
  const [week, setWeek] = useState(task.week.toString());
  const [startDate, setStartDate] = useState(new Date(task.start_time));
  const [endDate, setEndDate] = useState(new Date(task.end_time));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');

  const handleAddWeek = () => {
    const nextWeek = (weekOptions.length + 1).toString();
    setWeekOptions((prev) => [...prev, nextWeek]);
    setWeek(nextWeek);
  };

  const handleUpdate = async () => {
    if (!title || !week || !startDate || !endDate || !category) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        task_title: title,
        task_category: category,
        week: parseInt(week),
        task_banner_image: task.task_banner_image,
        task_description: task.task_description,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
      };

      await axios.put(
        `http://localhost:8080/api/weeklytask/v1/${task.id}`,
        payload
      );
      toast.success('✅ Weekly task updated!');
      setOpen(false);
      router.refresh();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(`❌ ${err.response?.data?.message || err.message}`);
      } else {
        toast.error('❌ An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="absolute top-4 right-5 bg-[#8373EE] hover:bg-[#8373EE]/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 cursor-pointer">
          <Pencil className="w-5 h-5 text-white" />
        </button>
      </DialogTrigger>

      <DialogContent className="md:w-[950px] bg-[#0F0F0F] w-11/12 max-h-[90vh] rounded-2xl border border-gray-800 shadow-lg text-white p-6">
        <div className="overflow-y-auto max-h-[80vh] pr-2 scrollable-modal w-full touch-pan-y">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-white">
              ✏️ Edit Weekly Task
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-6 mt-6">
            <div className="space-y-5">
              {/* Title */}
              <div className="space-y-2">
                <Label>Task Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter task title"
                  className="bg-[#1A1A1A] text-white border border-gray-700"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-[#1A1A1A] text-white border border-gray-700">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1F1F1F] text-white">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}

                    <div className="border-t border-gray-600 my-1" />

                    {!showCategoryInput ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCategoryInput(true);
                        }}
                        className="w-full px-2 py-2 text-sm text-violet-400 text-left hover:bg-[#2A2A2A]"
                      >
                        ➕ Add New Category
                      </button>
                    ) : (
                      <div className="px-3 py-2 space-y-2">
                        <input
                          value={newCategoryInput}
                          onChange={(e) => setNewCategoryInput(e.target.value)}
                          placeholder="New category"
                          className="w-full px-2 py-1 text-sm bg-[#2A2A2A] border border-gray-600 rounded text-white"
                        />
                        <div className="flex justify-between gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const trimmed = newCategoryInput.trim();
                              if (trimmed && !categories.includes(trimmed)) {
                                setCategories((prev) => [...prev, trimmed]);
                                setCategory(trimmed);
                              }
                              setShowCategoryInput(false);
                              setNewCategoryInput('');
                            }}
                            className="text-sm text-violet-400 hover:underline"
                          >
                            ✅ Add
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowCategoryInput(false);
                              setNewCategoryInput('');
                            }}
                            className="text-sm text-gray-400 hover:underline"
                          >
                            ❌ Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Week */}
              <div className="space-y-2">
                <Label>Week</Label>
                <Select value={week} onValueChange={setWeek}>
                  <SelectTrigger className="bg-[#1A1A1A] text-white border border-gray-700">
                    <SelectValue placeholder="Select week" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1F1F1F]">
                    {weekOptions.map((w) => (
                      <SelectItem key={w} value={w}>
                        Week {w}
                      </SelectItem>
                    ))}
                    <div className="border-t border-gray-600 my-1"></div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddWeek();
                      }}
                      className="w-full text-left px-2 py-2 text-sm text-violet-400 hover:bg-[#2A2A2A]"
                    >
                      ➕ Add Week {weekOptions.length + 1}
                    </button>
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full text-white bg-[#1A1A1A] border border-gray-700"
                    >
                      {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="bg-white text-black p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full text-white bg-[#1A1A1A] border border-gray-700"
                    >
                      {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="bg-white text-black p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Submit */}
              <Button
                onClick={handleUpdate}
                disabled={isSubmitting}
                className="w-full bg-[#8373EE] hover:bg-[#8373EE]/80 text-white font-semibold"
              >
                {isSubmitting ? 'Updating...' : 'Update Weekly Task'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditWeeklyTaskFormModal;
