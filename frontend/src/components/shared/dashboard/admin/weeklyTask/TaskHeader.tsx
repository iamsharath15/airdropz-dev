'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectScrollDownButton,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  ChevronDown,
  LayoutGrid,
  ChevronDownIcon,
} from 'lucide-react';
import { useId } from 'react';
import WeeklyTaskFormModal from './WeeklyTaskFormModal';

interface TaskHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  categories: string[];
  weeks: number[];
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categories,
  weeks,
  setSelectedWeek,
  selectedWeek,
}) => {
  const sortOptions = ['Week', 'Progress', 'Title'];

  const inputId = useId();

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
      <div className="relative w-full md:max-w-md">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
          size={18}
        />{' '}
        <Input
          id={inputId}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Task"
          className="pl-10 bg-black border-white text-white py-6 rounded-lg placeholder:text-white"
        />
      </div>

      <div className="flex gap-4 w-full md:w-auto">
        <WeeklyTaskFormModal />

        <Select
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value)}
        >
          <SelectTrigger
            hideIcon
            className="w-full md:w-[160px] cursor-pointer group bg-transparent text-white hover:bg-white hover:text-black transition-colors "
          >
            <div className="flex items-center">
              <LayoutGrid className="mr-2 h-4 w-4 text-white group-hover:text-black transition-colors" />
              <SelectValue placeholder="Category" />
            </div>

            <ChevronDownIcon className="h-4 w-4 text-white group-hover:text-black transition-colors" />
          </SelectTrigger>

          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === 'All' ? 'Category' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedWeek.toString()}
          onValueChange={(val) => setSelectedWeek(Number(val))}
        >
          <SelectTrigger hideIcon             className="w-full md:w-[160px] cursor-pointer group bg-transparent text-white hover:bg-white hover:text-black transition-colors "
>
            <Filter className="mr-2 h-4 w-4 text-white group-hover:text-black transition-colors" />


            <SelectValue placeholder="Sort By" />
                        <ChevronDownIcon className="h-4 w-4 text-white group-hover:text-black transition-colors" />

          </SelectTrigger>
          <SelectContent>
            {weeks.map((week) => (
              <SelectItem key={week} value={week.toString()}>
                Sort by {week === 0 ? 'Week' : `Week ${week}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
