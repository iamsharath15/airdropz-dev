'use client';

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import {
  setAirdrops,
  setSelectedCategory,
  setSelectedType,
} from '@/store/airdropsSlice';
import AirdropCard from '@/components/shared/AirdropCard';

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
      .get('http://localhost:8080/api/airdrop/v1/')
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
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        {/* Search */}
        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
            size={18}
          />
          <Input
            placeholder="Search Airdropz"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-black border-white text-white py-6 rounded-lg placeholder:text-white"
          />
        </div>

        <div className="flex gap-4 relative">

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

          <Dropdown
            label={`Sort By: ${selectedType}`}
            icon={<SlidersHorizontal size={18} />}
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
      <div className="absolute right-0 mt-2 z-10 bg-black border border-white rounded-md shadow-md p-2">
        {options.map((option) => (
          <div
            key={option}
            onClick={() => onSelect(option)}
            className={`px-4 py-2 text-white cursor-pointer hover:bg-white hover:text-black rounded-lg ${
              activeOption === option ? 'bg-white text-black' : ''
            }`}
          >
            {option}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default AirdropsListing;
