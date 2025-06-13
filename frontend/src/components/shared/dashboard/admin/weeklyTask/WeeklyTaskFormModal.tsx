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
import { Plus } from 'lucide-react';
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

const WeeklyTaskFormModal = () => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [weekOptions, setWeekOptions] = useState(['1', '2', '3', '4', '5']);
  const [week, setWeek] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  // inside WeeklyTaskFormModal

  const [categories, setCategories] = useState(['Game', 'Cricket']);
  const [category, setCategory] = useState('');
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');

  const handleAddWeek = () => {
    const nextWeek = (weekOptions.length + 1).toString();
    setWeekOptions((prev) => [...prev, nextWeek]);
    setWeek(nextWeek);
  };
const handleCreate = async () => {
  if (!title || !week || !startDate || !endDate || !category) {
    alert('Please fill in all fields');
    return;
  }

  try {
    const payload = {
      task_title: title,
      task_category: category,
      week: parseInt(week),
      start_time: startDate.toISOString(),
      end_time: endDate.toISOString(),
    };

    const response = await axios.post('http://localhost:8080/api/weeklytask/v1', payload);

    if ((response.status === 200 || response.status === 201) && response.data?.id) {
      const weeklyTaskId = response.data.id;

      // Reset form
      setOpen(false);
      setTitle('');
      setCategory('');
      setWeek('');
      setStartDate(undefined);
      setEndDate(undefined);

      // Navigate to the created weekly task page
      router.push(`/dashboard/admin/weeklytask/create/${weeklyTaskId}`);
    } else {
      alert('Something went wrong. Please try again.');
    }
  } catch (error: any) {
    console.error('Error creating weekly task:', error);
    alert(`❌ Error: ${error.response?.data?.message || error.message}`);
  }
};



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 text-white border-white bg-black cursor-pointer"
        >
          <Plus size={18} />
          New Weekly Task
        </Button>
      </DialogTrigger>

      <DialogContent className="md:w-[950px] bg-[#0F0F0F] w-11/12 max-h-[90vh] rounded-2xl border border-gray-800 shadow-lg text-white p-6">
        <div className="overflow-y-auto max-h-[80vh] pr-2 scrollable-modal w-full touch-pan-y">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-white">
              🗓️ Create Weekly Task
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-6 mt-6">
            {/* Form */}
            <div className="w-full space-y-5">
              {/* Title */}
              <div className="space-y-2">
                <Label className="text-sm text-gray-300">Task Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter weekly task title"
                  className="bg-[#1A1A1A] text-white border border-gray-700 focus:ring-2 focus:ring-violet-500 placeholder:text-gray-400"
                />
              </div>
              {/* Category */}
              {/* Category */}
              <div className="space-y-2">
                <Label className="text-sm text-gray-300">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-[#1A1A1A] text-white border border-gray-700 focus:ring-2 focus:ring-violet-500">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1F1F1F] text-white border border-gray-700 max-h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                    {categories.map((cat) => (
                      <SelectItem
                        key={cat}
                        value={cat}
                        className="cursor-pointer"
                      >
                        {cat}
                      </SelectItem>
                    ))}

                    <div className="border-t border-gray-600 my-1" />

                    {!showCategoryInput ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCategoryInput(true);
                        }}
                        className="w-full text-left px-2 py-2 text-sm text-violet-400 hover:text-violet-500 hover:bg-[#2A2A2A]"
                      >
                        ➕ Add New Category
                      </button>
                    ) : (
                      <div className="px-3 py-2 space-y-2">
                        <input
                          type="text"
                          value={newCategoryInput}
                          onChange={(e) => setNewCategoryInput(e.target.value)}
                          placeholder="Enter category name"
                          className="w-full px-2 py-1 text-sm bg-[#2A2A2A] border border-gray-600 rounded text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-violet-500"
                        />
                        <div className="flex justify-between gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (
                                newCategoryInput.trim() &&
                                !categories.includes(newCategoryInput.trim())
                              ) {
                                setCategories((prev) => [
                                  ...prev,
                                  newCategoryInput.trim(),
                                ]);
                                setCategory(newCategoryInput.trim());
                              }
                              setNewCategoryInput('');
                              setShowCategoryInput(false);
                            }}
                            className="text-sm text-violet-400 hover:text-violet-500"
                          >
                            ✅ Add
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowCategoryInput(false);
                              setNewCategoryInput('');
                            }}
                            className="text-sm text-gray-400 hover:text-red-400"
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
                <Label className="text-sm text-gray-300">Week</Label>
                <Select value={week} onValueChange={setWeek}>
                  <SelectTrigger className="bg-[#1A1A1A] text-white border border-gray-700 focus:ring-2 focus:ring-violet-500">
                    <SelectValue placeholder="Select week" />
                  </SelectTrigger>
                  <SelectContent
                    className="bg-[#1F1F1F] text-white border border-gray-700 max-h-60 overflow-y-auto"
                    style={{ scrollbarWidth: 'thin' }} // optional
                  >
                    {weekOptions.map((w) => (
                      <SelectItem key={w} value={w} className="cursor-pointer">
                        Week {w}
                      </SelectItem>
                    ))}

                    {/* Divider */}
                    <div className="border-t border-gray-600 my-1"></div>

                    {/* Add new week */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent select close
                        handleAddWeek();
                      }}
                      className="w-full text-left px-2 py-2 text-sm text-violet-400 hover:text-violet-500 hover:bg-[#2A2A2A]"
                    >
                      ➕ Add Week {weekOptions.length + 1}
                    </button>
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label className="text-sm text-gray-300">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-[#1A1A1A] text-white border border-gray-700 hover:bg-[#262626]"
                    >
                      {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white text-black rounded-md shadow-lg">
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
                <Label className="text-sm text-gray-300">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-[#1A1A1A] text-white border border-gray-700 hover:bg-[#262626]"
                    >
                      {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white text-black rounded-md shadow-lg">
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
                onClick={handleCreate}
                className="w-full mt-4 bg-violet-600 hover:bg-violet-700 transition-colors text-white font-semibold cursor-pointer"
              >
                Create Weekly Task
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WeeklyTaskFormModal;
