'use client';

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import AirdropCard from '@/components/shared/AirdropCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, LayoutGrid, Filter } from 'lucide-react';
import AirdropFormModal from '@/components/shared/admin/AirdropFormModal';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import {
  setAirdrops,
  setSelectedCategory,
  setSelectedType,
} from '@/store/airdropsSlice';

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
          
          <Dropdown
            label={selectedCategory}
            icon={<LayoutGrid size={18} />}
            options={categories}
            activeOption={selectedCategory}
            show={showCategoryDropdown}
            toggleShow={() => setShowCategoryDropdown((prev) => !prev)}
            onSelect={(category) => {
              dispatch(setSelectedCategory(category));
              setShowCategoryDropdown(false);
            }}
          />

          {/* Type Filter */}
          <Dropdown
            label={`Sort By: ${selectedType}`}
            icon={<Filter size={18} />}
            options={['All', 'Free', 'Paid']}
            activeOption={selectedType}
            show={showSortDropdown}
            toggleShow={() => setShowSortDropdown((prev) => !prev)}
            onSelect={(type) => {
              dispatch(setSelectedType(type as 'All' | 'Free' | 'Paid'));
              setShowSortDropdown(false);
            }}
          />
        </div>
      </div>

      {/* Listing */}
      <h2 className="text-2xl font-bold mb-6 px-[2%]">Top Airdropz</h2>
      <div className="flex flex-wrap">
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
  );
};

// -------------------- Dropdown Component --------------------
const Dropdown = ({
  label,
  icon,
  options,
  activeOption,
  show,
  toggleShow,
  onSelect,
}: {
  label: string;
  icon: React.ReactNode;
  options: string[];
  activeOption: string;
  show: boolean;
  toggleShow: () => void;
  onSelect: (option: string) => void;
}) => (
  <div className="relative">
    <Button
      variant="outline"
      className="gap-2 text-white border-white bg-black cursor-pointer"
      onClick={toggleShow}
    >
      {icon}
      {label}
    </Button>

    {show && (
      <div className="absolute space-y-2 right-0 mt-2 z-10 bg-black border border-white rounded-md shadow-md p-2 min-w-[120px]">
        {options.map((option) => {
          const isActive = activeOption === option;
          return (
            <div
              key={option}
              onClick={() => onSelect(option)}
              className={`px-4 py-2 cursor-pointer rounded-lg transition-colors duration-150 ${
                isActive
                  ? 'bg-[#8373EE] text-white font-semibold'
                  : 'text-white hover:bg-white hover:text-black'
              }`}
            >
              {option}
            </div>
          );
        })}
      </div>
    )}
  </div>
);

export default AirdropsListing;
