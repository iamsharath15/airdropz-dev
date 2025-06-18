// 'use client';

// import { useMemo } from 'react';
// import StoryCarousel from './StoryCarousel';
// import { Button } from '@/components/ui/button';
// import { ChevronLeft, ChevronRight, CirclePlay } from 'lucide-react';
// import Image from 'next/image';

// // Define TypeScript interfaces
// interface Task {
//   id: number;
//   image: string;
//   link: string;
// }

// interface Story {
//   cover_id: number;
//   cover_name: string;
//   cover_image: string;
//   stories: Task[];
// }

// const Index = () => {
//   // Memoize stories to avoid recalculating on every render
//   const stories: Story[] = useMemo(
//     () => [
//       {
//         cover_id: 1,
//         cover_name: 'Ethereum',
//         cover_image: 'https://cdn.lootcrate.me/demo/airdropzimage.png',
//         stories: [
//           {
//             id: 1,
//             image: 'https://cdn.lootcrate.me/demo/airdropzimage.png',
//             link: 'Low',
//           },
//           {
//             id: 2,
//             image: 'https://cdn.lootcrate.me/demo/airdropzimage.png',
//             link: 'Low',
//           },
//           {
//             id: 3,
//             image: 'https://cdn.lootcrate.me/demo/airdropzimage.png',
//             link: 'Low',
//           },
//           {
//             id: 4,
//             image: 'https://cdn.lootcrate.me/demo/airdropzimage.png',
//             link: 'Low',
//           },
//         ],
//       },
//     ],
//     []
//   );

//   return (
//     <div className="min-h-screen bg-black text-white flex w-full flex-col">
//       {/* Expert Analysis Section */}
//       <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#8373EE] to-[#5E50C1] p-6 sm:p-8 lg:p-10 text-white mb-10 shadow-lg">
//         {/* Background Image on Right */}
//         <div className="hidden lg:block absolute top-0 right-0 h-full w-5/12">
//           <Image
//             src="https://cdn.lootcrate.me/static-image-v1/referandearn/refer-and-earn-img1.png"
//             alt="Refer & Earn"
//             fill
//             className="object-cover object-right opacity-90"
//           />
//         </div>

//         {/* Text Content */}
//         <div className="relative z-10 w-full lg:w-7/12">
//           <div className="pb-3">
//             <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs sm:text-sm font-medium backdrop-blur-md shadow-sm">
//               🎯 Premium Feature
//             </span>
//           </div>
//           <h2 className="text-2xl md:text-3xl font-extrabold mb-3 tracking-tight">
//             Expert Analysis
//           </h2>
//           <p className="text-base sm:text-lg md:text-xl leading-relaxed font-medium text-white/90 mb-3">
//             Gain insights and make smarter decisions with professional
//             recommendations.
//           </p>

//           <Button className="rounded-full bg-white text-black hover:bg-gray-200 transition duration-300 px-6 py-2 text-sm font-semibold flex items-center gap-2">
//             Join Now <CirclePlay className="w-4 h-4" />
//           </Button>
//         </div>
//       </div>

//       {/* Top Recommendation Stories */}
//       <div>
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-xl font-bold">Top Recommendation</h3>
//           <div className="flex gap-2">
//             <Button
//               variant="ghost"
//               size="sm"
//               className="w-8 h-8 p-0 text-gray-400 hover:text-white"
//             >
//               <ChevronLeft className="w-4 h-4" />
//             </Button>
//             <Button
//               variant="ghost"
//               size="sm"
//               className="w-8 h-8 p-0 text-gray-400 hover:text-white"
//             >
//               <ChevronRight className="w-4 h-4" />
//             </Button>
//           </div>
//         </div>
//         <div className="p-2">
//           <StoryCarousel stories={stories} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Index;
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import StoryCarousel from './StoryCarousel';
import { toast } from 'sonner';
import { uploadImageToS3 } from '@/lib/uploadToS3';
import ExpertSectionHeader from '@/components/shared/dashboard/ExpertSectionHeader';

interface Task {
  id: number;
  image: string;
  link: string;
}

interface Story {
  cover_id: number;
  cover_name: string;
  cover_image: string;
  stories: Task[];
}

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
