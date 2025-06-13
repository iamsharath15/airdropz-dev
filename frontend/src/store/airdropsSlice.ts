// store/airdropsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface AirdropState {
  list: Airdrop[];
  selectedCategory: string;
  selectedType: 'All' | 'Free' | 'Paid';
}

const initialState: AirdropState = {
  list: [],
  selectedCategory: 'All',
  selectedType: 'All',
};

const airdropSlice = createSlice({
  name: 'airdrops',
  initialState,
  reducers: {
    setAirdrops: (state, action: PayloadAction<Airdrop[]>) => {
      state.list = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSelectedType: (state, action: PayloadAction<'All' | 'Free' | 'Paid'>) => {
      state.selectedType = action.payload;
    },
  },
});

export const { setAirdrops, setSelectedCategory, setSelectedType } = airdropSlice.actions;
export default airdropSlice.reducer;
