'use client';

import { useState } from 'react';
import { airdrops } from '@/app/data/airdrops';
import AirdropCard from '@/components/shared/AirdropCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, LayoutGrid, SlidersHorizontal, Plus } from 'lucide-react';
import AirdropFormModal from '@/components/shared/admin/AirdropFormModal';

const AirdropsListing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Top');

  const filteredAirdrops = airdrops.filter((airdrop) =>
    airdrop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
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
        <div className="flex gap-4">
           <AirdropFormModal />


          <Button
            variant="outline"
            className="gap-2 text-white border-white bg-black cursor-pointer"
          >
            <LayoutGrid size={18} />
            Category
          </Button>
          <Button
            variant="outline"
            className="gap-2 text-white border-white bg-black cursor-pointer"
          >
            <SlidersHorizontal size={18} />
            Sort By : {sortBy}
          </Button>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Top Airdropz</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {filteredAirdrops.map((airdrop) => (
          <AirdropCard key={airdrop.id} airdrop={airdrop} />
        ))}
      </div>
    </div>
  );
};

export default AirdropsListing;
