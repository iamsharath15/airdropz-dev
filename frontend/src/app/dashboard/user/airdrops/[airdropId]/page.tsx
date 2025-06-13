'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { notFound } from 'next/navigation';
import AirdropPreview from '@/components/shared/dashboard/AirdropPreview';

interface Airdrop {
  id: string;
  name: string;
  description: string;
  steps?: string[];
  twitterEmbed?: string;
  date?: string;
}

export default function AirdropDetailPage() {
  const { airdropId } = useParams();
  const [loading, setLoading] = useState(true);
const [airdropData, setAirdropData] = useState<{
  title: string;
  airdrops_banner_title: string;
  airdrops_banner_description: string;
  airdrops_banner_subtitle: string;
  airdrops_date: string;
  airdrops_banner_image: string | File;
}>({
  title: '',
  airdrops_banner_title: '',
  airdrops_banner_description: '',
  airdrops_banner_subtitle: '',
  airdrops_date: new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }),
  airdrops_banner_image: '',
});

const [contentBlocks, setContentBlocks] = useState<
  {
    type: 'description' | 'image' | 'checklist' | 'link';
    value: string;
    link?: string;
    file?: File;
  }[]
>([]);

useEffect(() => {
  if (!airdropId) return;

  const fetchAirdrop = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/airdrop/v1/${airdropId}`, {
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Airdrop not found');

      const data = await res.json();

      // ✅ Update airdropData state
      setAirdropData({
        title: data.title || '',
        airdrops_banner_title: data.airdrops_banner_title || '',
        airdrops_banner_description: data.airdrops_banner_description || '',
        airdrops_banner_subtitle: data.airdrops_banner_subtitle || '',
        airdrops_date: new Date(data.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        airdrops_banner_image: data.airdrops_banner_image || '',
      });

      // ✅ Update contentBlocks state
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

  if (loading) return <div className="text-white p-4">Loading...</div>;
  if (!airdropId) return notFound();

  return (
    <div className="mb-4">
      <Link
        href="/dashboard/user/airdrops"
        className="flex items-center text-gray-400 hover:text-white mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to airdrops
      </Link>

      <AirdropPreview airdropData={airdropData} contentBlocks={contentBlocks} />
    </div>
  );
}
