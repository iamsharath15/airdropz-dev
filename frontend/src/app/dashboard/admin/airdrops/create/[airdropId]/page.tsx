'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { v4 as uuidv4 } from 'uuid';

import { uploadImageToS3 } from '@/lib/uploadToS3';
import AirdropPreview from '@/components/shared/dashboard/AirdropPreview';
import AirdropFormEditor from '@/components/shared/dashboard/AirdropFormEditor';
import { Save, Trash2 } from 'lucide-react';

const API_BASE = 'http://localhost:8080/api/airdrop/v1';

const CreateAirdropPage = () => {
  const params = useParams();
  const router = useRouter();

  const rawAirdropId = params?.airdropId;
  const airdropId = Array.isArray(rawAirdropId)
    ? rawAirdropId[0]
    : rawAirdropId;

  const [step, setStep] = useState(1);
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
      type:
        | 'description'
        | 'image'
        | 'checklist'
        | 'link'
        | 'highlight'
        | 'header1';
      value: string;
      link?: string;
      file?: File;
    }[]
  >([]);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (!airdropId) return;

    (async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/${airdropId}`, {
          withCredentials: true,
        });

        setAirdropData({
          title: data.title || 'Airdrop Title',
          airdrops_banner_title:
            data.airdrops_banner_title || 'How to Join the Airdrop',
          airdrops_banner_description:
            data.airdrops_banner_description || 'Airdrop details...',
          airdrops_banner_subtitle: data.airdrops_banner_subtitle || 'Guides',
          airdrops_banner_image: data.airdrops_banner_image || '',
          airdrops_date: new Date(data.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
        });

        setContentBlocks(data.content_blocks || []);
      } catch (error) {
        toast.error(`Failed to load airdrop. ${error}`);
      }
    })();
  }, [airdropId]);

  const updateBlock = useCallback(
    (idx: number, field: 'value' | 'link' | 'file', val: string | File) => {
      setContentBlocks((blocks) =>
        blocks.map((b, i) => (i === idx ? { ...b, [field]: val } : b))
      );
    },
    []
  );

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      updateBlock(idx, 'file', file);
      updateBlock(idx, 'value', URL.createObjectURL(file));
    }
  };

  const removeBlock = useCallback((idx: number) => {
    setContentBlocks((blocks) => blocks.filter((_, i) => i !== idx));
  }, []);

  const addBlock = useCallback(
    (
      type:
        | 'description'
        | 'image'
        | 'checklist'
        | 'link'
        | 'highlight'
        | 'header1'
    ) => {
      setContentBlocks((blocks) => [
        ...blocks,
        { type, value: '', ...(type === 'link' && { link: '' }) },
      ]);
    },
    []
  );

  const handleDelete = async () => {
    if (!airdropId) return toast.error('Airdrop ID not found.');
    try {
      await axios.delete(`${API_BASE}/${airdropId}`, { withCredentials: true });
      toast.success('Airdrop deleted!');
      router.push('/dashboard/admin/airdrops/');
    } catch {
      toast.error('Failed to delete airdrop.');
    }
  };

  const handleSubmit = async () => {
    try {
      let createdId = airdropId;

      if (!createdId) {
        const { data } = await axios.post(
          API_BASE,
          { title: airdropData.title },
          { withCredentials: true }
        );
        createdId = data.id;
      }

      let bannerImage = airdropData.airdrops_banner_image;
      if (bannerImage instanceof File) {
        bannerImage = await uploadImageToS3(
          bannerImage,
          `airdrops/${createdId}/airdropsBannerImage`
        );
      }

      await axios.put(
        `${API_BASE}/${createdId}`,
        {
          ...airdropData,
          airdrops_banner_image: bannerImage,
        },
        { withCredentials: true }
      );

      const uploadedBlocks = await Promise.all(
        contentBlocks.map(async (block) => {
          if (
            block?.type === 'image' &&
            typeof block.file === 'object' &&
            block.file instanceof File
          ) {
            const url = await uploadImageToS3(
              block.file,
              `airdrops/${createdId}/content-blocks/${uuidv4()}`
            );
            return { ...block, value: url, file: undefined };
          }
          return block;
        })
      );

      await axios.post(
        `${API_BASE}/content-blocks/${createdId}`,
        { content_blocks: uploadedBlocks },
        { withCredentials: true }
      );

      toast.success(airdropId ? 'Airdrop updated!' : 'Airdrop created!');
      router.push('/dashboard/admin/airdrops');
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Submit failed.');
    }
  };

  const renderBlock = (block: (typeof contentBlocks)[number], idx: number) => {
    const commonInputClass = 'bg-zinc-800 text-white';

    switch (block.type) {
      case 'description':
      case 'checklist':
        return (
          <Textarea
            value={block.value}
            onChange={(e) => updateBlock(idx, 'value', e.target.value)}
            placeholder={
              block.type === 'checklist'
                ? 'Checklist items, one per line'
                : 'Description'
            }
            className={commonInputClass}
          />
        );
      case 'image':
        return (
          <div className="space-y-2">
            <Input
              value={block.value}
              onChange={(e) => updateBlock(idx, 'value', e.target.value)}
              placeholder="Enter image URL"
              className={commonInputClass}
            />
            <label className="relative w-full h-48 border-dashed border-2 border-zinc-700 rounded-lg bg-zinc-900 flex items-center justify-center overflow-hidden hover:border-purple-500">
              {block.value && (
                <Image
                  src={block.value}
                  alt={`Block image ${idx}`}
                  fill
                  className="object-cover"
                />
              )}
              {!block.value && (
                <span className="z-10 text-white">Upload image</span>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, idx)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>
          </div>
        );
      case 'link':
        return (
          <div className="space-y-2">
            <Input
              value={block.value}
              onChange={(e) => updateBlock(idx, 'value', e.target.value)}
              placeholder="Link title"
              className={commonInputClass}
            />
            <Input
              value={block.link || ''}
              onChange={(e) => updateBlock(idx, 'link', e.target.value)}
              placeholder="URL"
              className={commonInputClass}
            />
          </div>
        );
      case 'highlight':
        return (
          <div className="space-y-2">
            <Input
              value={block.value}
              onChange={(e) => updateBlock(idx, 'value', e.target.value)}
              placeholder="highlight"
              className={commonInputClass}
            />
          </div>
        );
      case 'header1':
        return (
          <div className="space-y-2">
            <Input
              value={block.value}
              onChange={(e) => updateBlock(idx, 'value', e.target.value)}
              placeholder="header1"
              className={commonInputClass}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col max:h-screen bg-black text-white">
      {/* Header */}
      <div className="flex flex-row items-center justify-between border-b border-zinc-800 px-5 sm:px-6 sm:py-4 py-2 bg-zinc-900 shadow-sm rounded-2xl gap-3 sm:gap-0">
        <h1 className="text-lg sm:text-xl font-semibold truncate">
          {airdropData.title}
        </h1>

        <div className="flex items-center gap-2 sm:gap-3">
          {airdropId && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="text-sm sm:text-base px-3"
            >
              <Trash2 className="w-4 h-4 sm:hidden" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          )}

          <Button
            onClick={handleSubmit}
            className="bg-[#8373EE] hover:bg-[#8373EE]/80 text-white text-sm sm:text-base px-3"
          >
            <Save className="w-4 h-4 sm:hidden" />
            <span className="hidden sm:inline">
              {airdropId ? 'Update' : 'Create'}
            </span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex md:flex-row flex-col-reverse overflow-hidden">
        <AirdropFormEditor
          airdropData={airdropData}
          setAirdropData={setAirdropData}
          step={step}
          setStep={setStep}
          contentBlocks={contentBlocks}
          setContentBlocks={setContentBlocks}
          renderBlock={renderBlock}
          removeBlock={removeBlock}
          addBlock={addBlock}
          handleSubmit={handleSubmit}
          sensors={sensors}
          airdropId={airdropId}
        />
        <AirdropPreview
          airdropData={airdropData}
          contentBlocks={contentBlocks}
        />
      </div>
    </div>
  );
};

export default CreateAirdropPage;
