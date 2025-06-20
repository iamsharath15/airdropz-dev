'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import StoryCarousel from './StoryCarousel';
import { toast } from 'sonner';
import ExpertSectionHeader from '@/components/shared/dashboard/ExpertSectionHeader';
import type { Story } from '@/types';


const Index = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/expertStories/v1/top-recommendations-stories`
        );

        // ✅ Ensure `stories` is always an array
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];

        setStories(data);
      } catch (err) {
        console.error('Error fetching stories', err);
        toast.error('Failed to load stories.');
        setStories([]); // fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex w-full flex-col px-2">
      <ExpertSectionHeader />
      <div className="flex items-center justify-between md:mb-4 mb-2 ">
        <h3 className="md:text-xl text-lg font-bold">Top Recommendation</h3>
      </div>

      <div className="flex gap-4 w-full overflow-x-scroll p-4 scrollbar-hidden">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <StoryCarousel stories={stories} setStories={setStories} />
        )}
      </div>
    </div>
  );
};

export default Index;
