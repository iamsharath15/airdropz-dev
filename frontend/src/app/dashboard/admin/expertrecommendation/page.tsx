'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import StoryCarousel from './StoryCarousel';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { DialogTitle } from '@radix-ui/react-dialog';
import { uploadImageToS3 } from '@/lib/uploadToS3';
import Image from 'next/image';
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
      {/* Expert Analysis */}
     
<ExpertSectionHeader />
      {/* Top Recommendation Header */}
      <div className="flex items-center justify-between mb-6 px-4">
        <h3 className="md:text-xl text-lg font-bold">Top Recommendation</h3>
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
      <div className="p-4 flex gap-4 overflow-scroll">
        <div className="">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#8373EE]/40 border-2 cursor-pointer border-[#8373EE] rounded-full w-20 h-20 flex items-center justify-center">
                <Plus size={20} className="text-[#8373EE]" />
              </Button>
            </DialogTrigger>
            <DialogTitle></DialogTitle>
            <DialogContent className="bg-[#151313] border-[#151313] max-w-md text-white">
              <h2 className="text-lg font-bold mb-2">Create New Cover</h2>
              <div className="space-y-3">
                <div>
                  <Label className="mb-3 tetx-sm font-semibold">
                    Cover Name
                  </Label>
                  <Input
                    className="placeholder:text-white/80"
                    value={coverName}
                    onChange={(e) => setCoverName(e.target.value)}
                    placeholder="Top Airdrops June"
                  />
                </div>
                <div>
                  <Label className="mb-3 text-sm font-semibold">
                    Cover Image
                  </Label>
                  <Input
                    type="file"
                    accept="image/*"
                    className="text-white"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setCoverFile(file); // just store file for now
                      }
                    }}
                  />
                </div>
                {coverFile && (
                  <div className="mt-2">
                    <Label className="mb-1 block">Preview</Label>
                    <div className="w-full flex items-center justify-center flex-col p-[2%]">
                      <div className="w-20 h-20 rounded-full overflow-hidden">
                        <Image
                          width={1920}
                          height={1080}
                          src={URL.createObjectURL(coverFile)}
                          alt="Preview"
                          className="w-full rounded-lg"
                        />
                      </div>
                      <p className="pt-2 text-sm capitalize">{coverName}</p>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleCreateCover}
                  className="mt-4 w-full font-semibold text-sm bg-[#8373EE] hover:bg-[#8373EE]/80 cursor-pointer"
                >
                  Create Cover
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <p className="pt-3 text-white">Add cover</p>
        </div>
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
