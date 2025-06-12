// 'use client';

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import AirdropCard from '@/components/shared/AirdropCard';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Search, LayoutGrid, SlidersHorizontal } from 'lucide-react';
// import AirdropFormModal from '@/components/shared/admin/AirdropFormModal';

// import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { Provider, useSelector, useDispatch } from 'react-redux';

// // Types
// type ContentBlock = {
//   id: string;
//   airdrop_id: string;
//   type: 'checklist' | 'image' | 'description';
//   value: string;
//   link: string | null;
// };

// type Airdrop = {
//   id: string;
//   title: string;
//   category: string | null;
//   type: string | null;
//   created_by: string;
//   created_at: string;
//   updated_at: string;
//   content_blocks: ContentBlock[];
// };

// // Slice
// const airdropSlice = createSlice({
//   name: 'airdrops',
//   initialState: {
//     list: [] as Airdrop[],
//   },
//   reducers: {
//     setAirdrops: (state, action: PayloadAction<Airdrop[]>) => {
//       state.list = action.payload;
//     },
//   },
// });

// const { setAirdrops } = airdropSlice.actions;

// const store = configureStore({
//   reducer: {
//     airdrops: airdropSlice.reducer,
//   },
// });

// type RootState = ReturnType<typeof store.getState>;

// // Main Component
// const AirdropsListingContent = () => {
//   const dispatch = useDispatch();
//   const airdrops = useSelector((state: RootState) => state.airdrops.list);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortBy, setSortBy] = useState('Top');

//   useEffect(() => {
//     const fetchAirdrops = async () => {
//       try {
//         const response = await axios.get('http://localhost:8080/api/airdrop/v1/');
//         dispatch(setAirdrops(response.data));
//       } catch (error) {
//         console.error('Failed to fetch airdrops:', error);
//       }
//     };

//     fetchAirdrops();
//   }, [dispatch]);

//   const filteredAirdrops = airdrops.filter((airdrop) =>
//     airdrop.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="mb-8">
//       <div className="flex justify-between items-center mb-6">
//         <div className="relative w-full max-w-md">
//           <Search
//             className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
//             size={18}
//           />
//           <Input
//             placeholder="Search Airdropz"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10 bg-black border-white text-white py-6 rounded-lg placeholder:text-white"
//           />
//         </div>
//         <div className="flex gap-4">
//           <AirdropFormModal />
//           <Button
//             variant="outline"
//             className="gap-2 text-white border-white bg-black cursor-pointer"
//           >
//             <LayoutGrid size={18} />
//             Category
//           </Button>
//           <Button
//             variant="outline"
//             className="gap-2 text-white border-white bg-black cursor-pointer"
//           >
//             <SlidersHorizontal size={18} />
//             Sort By : {sortBy}
//           </Button>
//         </div>
//       </div>

//       <h2 className="text-2xl font-bold mb-6 px-[2%]">Top Airdropz</h2>

//       <div className="flex items-center justify-start flex-wrap">
//         {filteredAirdrops.map((airdrop) => (
//           <AirdropCard
//             key={airdrop.id}
//             airdrop={{
//               id: airdrop.id,
//               title: airdrop.title,
//               category: airdrop.category ?? 'Unknown',
//               type: airdrop.type ?? 'free',
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// // Provider-wrapped export
// const AirdropsListing = () => (
//   <Provider store={store}>
//     <AirdropsListingContent />
//   </Provider>
// );

// export default AirdropsListing;
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import AirdropCard from '@/components/shared/AirdropCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import AirdropFormModal from '@/components/shared/admin/AirdropFormModal';
import {
  configureStore,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';

// -------------------- Types --------------------
type ContentBlock = {
  id: string;
  airdrop_id: string;
  type: 'checklist' | 'image' | 'description';
  value: string;
  link: string | null;
};

type Airdrop = {
  id: string;
  title: string;
  category: string | null;
  preview_image_url: string | null;
  type: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  content_blocks: ContentBlock[];
};

// -------------------- Redux Slice --------------------
const airdropSlice = createSlice({
  name: 'airdrops',
  initialState: {
    list: [] as Airdrop[],
    selectedCategory: 'All',
  },
  reducers: {
    setAirdrops: (state, action: PayloadAction<Airdrop[]>) => {
      state.list = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
  },
});

const { setAirdrops, setSelectedCategory } = airdropSlice.actions;

const store = configureStore({
  reducer: {
    airdrops: airdropSlice.reducer,
  },
});

type RootState = ReturnType<typeof store.getState>;

// -------------------- Component --------------------
const AirdropsListingContent = () => {
  const dispatch = useDispatch();
  const airdrops = useSelector((state: RootState) => state.airdrops.list);
  const selectedCategory = useSelector((state: RootState) => state.airdrops.selectedCategory);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Top');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  useEffect(() => {
    const fetchAirdrops = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/airdrop/v1/');
        dispatch(setAirdrops(response.data));
      } catch (error) {
        console.error('Failed to fetch airdrops:', error);
      }
    };

    fetchAirdrops();
  }, [dispatch]);

  const categories = ['All', ...new Set(airdrops.map((a) => a.category ?? 'Unknown'))];

  const filteredAirdrops = airdrops.filter((airdrop) => {
    const matchesSearch = airdrop.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || airdrop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="mb-8">
      {/* Search + Filters */}
      <div className="flex justify-between items-center mb-6">
        {/* Search Bar */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" size={18} />
          <Input
            placeholder="Search Airdropz"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-black border-white text-white py-6 rounded-lg placeholder:text-white"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-4 relative">
          <AirdropFormModal />

          {/* Category Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              className="gap-2 text-white border-white bg-black cursor-pointer"
              onClick={() => setShowCategoryDropdown((prev) => !prev)}
            >
              <LayoutGrid size={18} />
              {selectedCategory}
            </Button>

            {showCategoryDropdown && (
              <div className="absolute right-0 mt-2 z-10 bg-black border border-white rounded-md shadow-md p-[2%]">
                {categories.map((category) => (
                  <div
                    key={category}
                    onClick={() => {
                      dispatch(setSelectedCategory(category));
                      setShowCategoryDropdown(false);
                    }}
                    className={`px-4 py-2 text-white cursor-pointer hover:bg-white hover:text-black rounded-lg space-y-2 ${
                      selectedCategory === category ? 'bg-white  rounded-lg text-black' : ''
                    }`}
                  >
                    {category}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sort Button */}
          <Button
            variant="outline"
            className="gap-2 text-white border-white bg-black cursor-pointer"
          >
            <SlidersHorizontal size={18} />
            Sort By : {sortBy}
          </Button>
        </div>
      </div>

      {/* Listing */}
      <h2 className="text-2xl font-bold mb-6 px-[2%]">Top Airdropz</h2>

      <div className="flex  flex-wrap">
        {filteredAirdrops.map((airdrop) => (
          <AirdropCard
            key={airdrop.id}
            airdrop={{
              id: airdrop.id,
              title: airdrop.title,
              category: airdrop.category ?? 'Unknown',
              preview_image_url: airdrop.preview_image_url ?? '',
              type: airdrop.type ?? 'free',
            }}
          />
        ))}
      </div>
    </div>
  );
};

// -------------------- Wrapper with Provider --------------------
const AirdropsListing = () => (
  <Provider store={store}>
    <AirdropsListingContent />
  </Provider>
);

export default AirdropsListing;
