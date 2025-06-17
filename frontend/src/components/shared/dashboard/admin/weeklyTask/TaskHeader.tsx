'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, LayoutGrid, ChevronDownIcon } from 'lucide-react';
import { useId } from 'react';
import WeeklyTaskFormModal from './WeeklyTaskFormModal';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

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
  categories,
  weeks,
  setSelectedWeek,
  selectedWeek,
}) => {
  const inputId = useId();
 const userRole = useSelector((state: RootState) => state.auth.user?.role);
  const isAdmin = userRole === 'admin';

  return (
    <div className="flex flex-row items-start md:items-center justify-between gap-4 mb-8">
      <div className="relative md:w-4/12 w-6/12 ">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
          size={16}
        />{' '}
        <Input
          id={inputId}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Task"
          className="pl-10 bg-black text-sm border-white text-white py-4 rounded-lg placeholder:text-white"
        />
      </div>

      <div className="flex gap-2 w-6/12 items-center justify-end">
                {isAdmin &&  <WeeklyTaskFormModal />}

       

        <Select
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value)}
        >
          <SelectTrigger
            hideIcon
            className="w-auto text-sm  cursor-pointer group bg-transparent text-white hover:bg-white hover:text-black transition-colors"
          >
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-white group-hover:text-black transition-colors" />

              <span className="hidden md:inline">
                <SelectValue placeholder="Category" />
              </span>

              <ChevronDownIcon className="hidden md:inline h-4 w-4 text-white group-hover:text-black transition-colors" />
            </div>
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
          <SelectTrigger
            hideIcon
            className="w-auto cursor-pointer group bg-transparent text-white hover:bg-white hover:text-black transition-colors"
          >
            {/* Icon only on mobile, icon + label on desktop */}
            <div className="flex items-center gap-2">
              {/* Filter Icon: always visible */}
              <Filter className="h-4 w-4 text-white group-hover:text-black transition-colors" />

              {/* Label: hidden on mobile, visible on md+ */}
              <span className="hidden md:inline">
                <SelectValue placeholder="Sort By" />
              </span>

              {/* Chevron: hidden on mobile, visible on md+ */}
              <ChevronDownIcon className="hidden md:inline h-4 w-4 text-white group-hover:text-black transition-colors" />
            </div>
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
