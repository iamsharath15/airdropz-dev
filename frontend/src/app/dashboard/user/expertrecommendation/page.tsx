'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import StoryCarousel from './StoryCarousel';
import { toast } from 'sonner';
import { uploadImageToS3 } from '@/lib/uploadToS3';
import ExpertSectionHeader from '@/components/shared/dashboard/ExpertSectionHeader';
import type { Story } from '@/types';



const API_BASE = 'http://localhost:8080/api/expertStories/v1';

const Index = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [coverName, setCoverName] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);

  // 1️⃣ Fetch stories on mount
  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          'http://localhost:8080/api/expertStories/v1/top-recommendations-stories'
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

  // 2️⃣ Create new cover
  const handleCreateCover = async () => {
    if (!coverName || !coverFile) {
      toast.error('Please provide both cover name and image.');
      return;
    }

    try {
      const uploadedUrl = await uploadImageToS3(
        coverFile,
        `expert-stories/cover-${Date.now()}`
      );

      const res = await axios.post<Story>(
        `${API_BASE}/top-recommendations-stories`,
        {
          cover_name: coverName,
          cover_image: uploadedUrl, // use uploaded URL
        }
      );
      toast.success('Cover created!');
      setOpen(false);
      setCoverName('');
      setCoverFile(null);

      setCoverImage('');
      setStories((prev) => [...prev, res.data]);
    } catch (error) {
      console.error('Create cover error', error);
      toast.error('Failed to create cover.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex w-full flex-col">
      <ExpertSectionHeader />
      {/* Top Recommendation Header */}
      <div className="flex items-center justify-between mb-6 px-4">
        <h3 className="text-xl font-bold">Top Recommendation</h3>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 text-gray-400 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 text-gray-400 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stories Carousel */}
      <div className="p-4 flex gap-4">
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
