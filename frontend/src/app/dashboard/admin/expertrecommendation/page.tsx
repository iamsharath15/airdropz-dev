'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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
import { useRouter } from 'next/navigation';

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/expertStories/v1`;

const Index = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [coverName, setCoverName] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
const router = useRouter();

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
      setStories((prev) => [...prev, res.data]);
      router.refresh();
    } catch (error) {
      console.error('Create cover error', error);
      toast.error('Failed to create cover.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex w-full flex-col">
     
<ExpertSectionHeader />
      <div className="flex items-center justify-between md:mb-6 mb-3 px-4">
        <h3 className="md:text-xl text-lg font-bold">Top Recommendation</h3>
      </div>

      {/* Stories Carousel */}
      <div className="flex gap-4 w-full overflow-x-scroll p-4 scrollbar-hidden">
        <div className="">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#8373EE]/40 border-4 cursor-pointer border-[#8373EE] rounded-full md:w-20 md:h-20 w-16 h-16 flex items-center justify-center">
                <Plus size={20} className="text-[#8373EE]" />
              </Button>
            </DialogTrigger>
            <DialogTitle></DialogTitle>
            <DialogContent className="bg-[#2a2a2a] border-0 max-w-md text-white">
              <h2 className="text-lg font-bold ">Create New Cover</h2>
              <div className="space-y-3">
                <div>
                  <Label className="mb-3 tetx-sm font-semibold">
                    Cover Name
                  </Label>
                  <Input
                    className="placeholder:text-black border-0 bg-white text-black"
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
                    className="text-black bg-white file:text-black cursor-pointer"
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
                      <div className="w-22 h-22 border-[#8373EE] border-3 rounded-full overflow-hidden ">
                        <Image
                          width={1920}
                          height={1080}
                          src={URL.createObjectURL(coverFile)}
                          alt="Preview"
                          className="w-full rounded-lg "
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

          <p className="pt-3 text-white text-xs">Add cover</p>
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
