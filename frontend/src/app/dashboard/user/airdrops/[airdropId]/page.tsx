'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { notFound } from 'next/navigation';
import AirdropPreview from '@/components/shared/dashboard/AirdropPreview';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function AirdropDetailPage() {
  const { airdropId } = useParams();
  const [liked, setLiked] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(true);

  const [airdropData, setAirdropData] = useState<{
    title: string;
    airdrops_banner_title: string;
    airdrops_banner_description: string;
    airdrops_banner_subtitle: string;
    airdrops_date: string;
    airdrops_banner_image: string;
    preview_image_url: string;
    category: string;
    type: string;
  }>({
    title: '',
    airdrops_banner_title: '',
    airdrops_banner_description: '',
    airdrops_banner_subtitle: '',
    airdrops_date: '',
    airdrops_banner_image: '',
    preview_image_url: '',
    category: '',
    type: '',
  });

  const [contentBlocks, setContentBlocks] = useState<
    {
      type: string;
      value: string;
      link?: string;
    }[]
  >([]);

  useEffect(() => {
    if (!airdropId) return;

    const fetchAirdrop = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/airdrop/v1/${airdropId}`,
          { withCredentials: true }
        );

        const data = res.data;

        setAirdropData({
          title: data.title || '',
          airdrops_banner_title: data.airdrops_banner_title || '',
          airdrops_banner_description: data.airdrops_banner_description || '',
          airdrops_banner_subtitle: data.airdrops_banner_subtitle || '',
         airdrops_date: new Date(data.updated_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }),

          airdrops_banner_image: data.airdrops_banner_image || '',
          preview_image_url: data.preview_image_url || '',
          category: data.category || '',
          type: data.type || '',
        });

        const formattedBlocks = (data.content_blocks || []).map((block: any) => ({
          type: block.type,
          value: block.value,
          link: block.link || undefined,
        }));

        setContentBlocks(formattedBlocks);
      } catch (error) {
        toast.error('Failed to load airdrop.');
        setAirdropData(null as any);
        setContentBlocks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAirdrop();
  }, [airdropId]);

  const handleLikeClick = () => {
    setLiked((prev) => !prev);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
  };

  if (loading) return <div className="text-white p-4">Loading...</div>;
  if (!airdropId) return notFound();

  return (
    <div className="mb-4">
      <div className="flex flex-row items-center justify-between border-b border-[#111112] px-5 sm:px-6 sm:py-4 py-2 bg-[#111112] shadow-sm rounded-2xl gap-3 sm:gap-0">
        <Link
          href="/dashboard/user/airdrops"
          className="flex items-center text-white/60 hover:text-white md:text-lg text-sm"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to airdrops
        </Link>

        <motion.div
          whileTap={{ scale: 1.3 }}
          animate={animating ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={handleLikeClick}
            className={`cursor-pointer md:p-2 p-1 rounded-full transition-all hover:bg-[#8373EE]/40 ${
              liked ? 'bg-[#8373EE]/40' : 'bg-white/30'
            }`}
          >
            <Heart
              className="w-5 h-5"
              fill={liked ? '#8373EE' : 'none'}
              color={liked ? '#8373EE' : 'white'}
            />
          </Button>
        </motion.div>
      </div>

      <AirdropPreview airdropData={airdropData} contentBlocks={contentBlocks} />
    </div>
  );
}
