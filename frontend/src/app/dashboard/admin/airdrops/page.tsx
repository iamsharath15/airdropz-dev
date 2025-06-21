'use client';

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import AirdropCard from '@/components/shared/AirdropCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, LayoutGrid, Filter, ChevronDownIcon } from 'lucide-react';
import AirdropFormModal from '@/components/shared/admin/AirdropFormModal';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import {
  setAirdrops,
  setSelectedCategory,
  setSelectedType,
} from '@/store/airdropsSlice';
import SectionCard from '@/components/shared/SectionCard';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';

const AirdropsListing = () => {
  const dispatch = useDispatch();
  const airdrops = useSelector((state: RootState) => state.airdrops.list);
  const selectedCategory = useSelector(
    (state: RootState) => state.airdrops.selectedCategory
  );
  const selectedType = useSelector(
    (state: RootState) => state.airdrops.selectedType
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/airdrop/v1/`)
      .then((res) => dispatch(setAirdrops(res.data.data)))
      .catch((err) => console.error('Failed to fetch airdrops:', err));
  }, [dispatch]);

  const categories = useMemo(
    () => [
      'All',
      ...Array.from(new Set(airdrops.map((a) => a.category ?? 'Unknown'))),
    ],
    [airdrops]
  );

  const filteredAirdrops = useMemo(() => {
    return airdrops.filter((airdrop) => {
      const matchesSearch = airdrop.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || airdrop.category === selectedCategory;
      const normalizedType = airdrop.type === 'Paid' ? 'Paid' : 'Free';
      const matchesType =
        selectedType === 'All' || normalizedType === selectedType;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [airdrops, searchTerm, selectedCategory, selectedType]);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6 flex-row gap-4">
        <div className="relative md:w-4/12 w-6/12 ">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
            size={16}
          />{' '}
          <Input
            placeholder="Search Airdropz"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-black text-sm border-white text-white py-4 rounded-lg placeholder:text-white"
          />
        </div>

        {/* Right Filters */}
        <div className="flex gap-2 w-6/12 items-center justify-end">
          <AirdropFormModal />

          {/* Category Filter */}

          <Select
            value={selectedCategory}
            onValueChange={(category) => {
              dispatch(setSelectedCategory(category));
              setShowCategoryDropdown(false);
            }}
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
          {/* Type Filter */}

          <Select
            value={selectedType}
            onValueChange={(type) => {
              dispatch(setSelectedType(type as 'All' | 'Free' | 'Paid'));
              setShowSortDropdown(false);
            }}
          >
            <SelectTrigger
              hideIcon
              className="w-auto text-sm  cursor-pointer group bg-transparent text-white hover:bg-white hover:text-black transition-colors"
            >
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-white group-hover:text-black transition-colors" />

                <span className="hidden md:inline">
                  <SelectValue placeholder="Type" />
                </span>

                <ChevronDownIcon className="hidden md:inline h-4 w-4 text-white group-hover:text-black transition-colors" />
              </div>
            </SelectTrigger>

            <SelectContent>
              {['All', 'Free', 'Paid'].map((category) => (
                <SelectItem key={category} value={category}>
                  {category === 'All' ? 'Category' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

        {filteredAirdrops.length === 0 ? (
          <SectionCard title="New Airdrops" message="No airdrops found." />
        ) : (
            <div className="mb-6 md:mb-8 ">
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="md:text-xl tetx-lg font-bold text-white">
          Top Weekly Task
        </h2>
 
      </div>
      <div className="flex flex-wrap  w-full">
                {filteredAirdrops.map((airdrop) => (
                  <AirdropCard
                    key={airdrop.id}
                    airdrop={{
                      id: airdrop.id,
                      title: airdrop.title,
                      category: airdrop.category ?? 'Unknown',
                      preview_image_url: airdrop.preview_image_url ?? '',
                      type: airdrop.type === 'Paid' ? 'Paid' : 'Free',
                    }}
                  />
                ))}
                   </div>
    </div>
        )}
    </div>
  );
};

export default AirdropsListing;
