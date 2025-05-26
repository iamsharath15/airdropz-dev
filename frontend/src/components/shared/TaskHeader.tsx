'use client';

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, ChevronDown } from "lucide-react";
import { useId } from "react";

interface TaskHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
}) => {
  const categories = ["All", "DeFi", "GameFi", "Social", "Infrastructure"];
  const sortOptions = ["Week", "Progress", "Title"];

  const inputId = useId();

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
      <div className="relative w-full md:max-w-md">
        <Search className="absolute text-white left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          id={inputId}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Task"
          className="pl-10 placeholder:text-white"
        />
      </div>

      <div className="flex gap-4 w-full md:w-auto">
        <Select
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value)}
        >
          <SelectTrigger className="w-full md:w-[160px] text-white">
            <Filter className="mr-2 h-4 w-4 text-white" />
            <SelectValue placeholder="Category"  className=""/>
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category} className="">
                {category === "All" ? "Category" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value)}
        >
          <SelectTrigger className="w-full md:w-[160px] text-white">
            <ChevronDown className="mr-2 h-4 w-4 text-white" />
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option} value={option}>
                Sort By: {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
