'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import StepProgress from '@/components/shared/StepProgress';

import {
  FileText,
  Image as ImageIcon,
  CheckSquare,
  Link2,
  Trash2,
} from 'lucide-react';

const CreateAirdropPage = () => {
  const { airdropId } = useParams();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const totalSteps = 2;

  const [airdropData, setAirdropData] = useState({
    airdrop_title: 'How to Join the 3DOS Airdrop',
    airdrop_description:
      '3DOS Network is building a more efficient, accessible, and globally distributed system...',
    airdrop_category: 'Guides',
    airdrop_date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    airdrop_banner_image: '',
    type: 'Free',
  });

  const [contentBlocks, setContentBlocks] = useState<
    { type: 'description' | 'image' | 'checklist' | 'link'; value: string; link?: string }[]
  >([]);

  const handleDelete = async () => {
    if (!airdropId) return toast.error('Airdrop ID not found in URL.');
    try {
      await axios.delete(`http://localhost:8080/api/airdrop/v1/${airdropId}`, {
        withCredentials: true,
      });
      toast.success('Airdrop deleted successfully!');
      router.push('/dashboard/admin/airdrops/');
    } catch (err) {
      toast.error('Failed to delete airdrop. Please try again.');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setAirdropData((prev) => ({ ...prev, [field]: value }));
  };

  const readFile = (file: File, callback: (result: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result as string);
    reader.readAsDataURL(file);
  };

  const addBlock = useCallback((type: 'description' | 'image' | 'checklist' | 'link') => {
    const newBlock = { type, value: '', ...(type === 'link' && { link: '' }) };
    setContentBlocks((prev) => [...prev, newBlock]);
  }, []);

  const updateBlock = useCallback((index: number, field: 'value' | 'link', newValue: string) => {
    setContentBlocks((prev) => {
      const updated = [...prev];
      updated[index][field] = newValue;
      return updated;
    });
  }, []);

  const removeBlock = useCallback((index: number) => {
    setContentBlocks((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const renderContentBlock = (block: typeof contentBlocks[number], index: number) => {
    switch (block.type) {
      case 'description':
        return (
          <Textarea
            placeholder="Enter description"
            value={block.value}
            onChange={(e) => updateBlock(index, 'value', e.target.value)}
            className="bg-zinc-800 text-white"
          />
        );
      case 'image':
        return (
          <div className="space-y-2">
            <Input
              placeholder="Enter image URL"
              value={block.value}
              onChange={(e) => updateBlock(index, 'value', e.target.value)}
              className="bg-zinc-800 text-white"
            />
            <label
              htmlFor={`upload-${index}`}
              className="relative w-full h-48 border-2 border-dashed border-zinc-700 rounded-lg bg-zinc-900 flex items-center justify-center overflow-hidden hover:border-purple-500"
            >
              {block.value ? (
                <Image
                  src={block.value}
                  alt={`Uploaded ${index}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  width={1920}
                  height={1080}
                />
              ) : (
                <span className="z-10 text-white">Click here to upload image</span>
              )}
              <input
                id={`upload-${index}`}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) readFile(file, (res) => updateBlock(index, 'value', res));
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </label>
          </div>
        );
      case 'checklist':
        return (
          <Textarea
            placeholder="Enter checklist items (one per line)"
            value={block.value}
            onChange={(e) => updateBlock(index, 'value', e.target.value)}
            className="bg-zinc-800 text-white"
          />
        );
      case 'link':
        return (
          <div className="space-y-2">
            <Input
              placeholder="Link title"
              value={block.value}
              onChange={(e) => updateBlock(index, 'value', e.target.value)}
              className="bg-zinc-800 text-white"
            />
            <Input
              placeholder="Hyperlink"
              value={block.link}
              onChange={(e) => updateBlock(index, 'link', e.target.value)}
              className="bg-zinc-800 text-white"
            />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col max:h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4 bg-zinc-900 rounded-2xl">
        <h1 className="text-xl font-semibold">Create Airdrop</h1>
        <div className="flex gap-3">
          <Button variant="destructive" onClick={handleDelete}>
            Delete Airdrop
          </Button>
          <Button className="bg-[#8373EE] hover:bg-[#8373EE]/80 text-white">Save Airdrop</Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Form Section */}
        <div className="w-full md:w-1/2 p-6 overflow-auto border-r border-zinc-800">
          <StepProgress progress={(step / totalSteps) * 100} />
          {step === 1 ? (
            <>
              <h2 className="text-lg font-bold mb-4">Step 1: Airdrop Details</h2>
              <Input
                placeholder="Airdrop Title"
                className="bg-zinc-800 text-white mb-4"
                value={airdropData.airdrop_title}
                onChange={(e) => handleInputChange('airdrop_title', e.target.value)}
              />
              <Textarea
                placeholder="Short Description"
                className="bg-zinc-900 border-zinc-700 text-white mb-4"
                value={airdropData.airdrop_description}
                onChange={(e) => handleInputChange('airdrop_description', e.target.value)}
              />
              <Input
                value={airdropData.airdrop_date}
                readOnly
                className="bg-zinc-800 text-white mb-4"
              />
              <Input
                placeholder="Category"
                className="bg-zinc-800 text-white mb-4"
                value={airdropData.airdrop_category}
                onChange={(e) => handleInputChange('airdrop_category', e.target.value)}
              />
              {/* Banner Upload */}
              <label className="relative flex items-center justify-center w-full h-48 border-2 border-dashed border-zinc-700 bg-zinc-900 rounded-lg overflow-hidden cursor-pointer hover:border-purple-500 mb-4">
                {airdropData.airdrop_banner_image ? (
                  <Image
                    src={airdropData.airdrop_banner_image}
                    alt="Banner"
                    className="absolute inset-0 w-full h-full object-cover"
                    width={1920}
                    height={1080}
                  />
                ) : (
                  <span className="z-10 text-white">Click here to upload banner image</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) readFile(file, (res) => handleInputChange('airdrop_banner_image', res));
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </label>
              <div className="flex justify-end">
                <Button onClick={() => setStep(2)} className="bg-[#8373EE] text-white">
                  Next
                </Button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold mb-4">Step 2: Airdrop Content</h2>
              <div className="flex gap-2 mb-4">
                {[['description', FileText], ['image', ImageIcon], ['checklist', CheckSquare], ['link', Link2]].map(
                  ([type, Icon]) => (
                    <Tooltip key={type}>
                      <TooltipTrigger asChild>
                        <Button onClick={() => addBlock(type as any)} className="bg-[#8373EE]">
                          <Icon className="text-white" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{`Add ${type}`}</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                )}
              </div>
              {contentBlocks.map((block, index) => (
                <div key={index} className="border border-zinc-700 bg-zinc-900 p-4 mb-4 rounded-lg space-y-2">
                  {renderContentBlock(block, index)}
                  <Button size="sm" variant="destructive" onClick={() => removeBlock(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="flex justify-start">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Live Preview */}
        <div className="w-full md:w-1/2 p-6 bg-black overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center space-x-2">
              <span className="bg-zinc-800 px-3 py-1 rounded-full">{airdropData.airdrop_category}</span>
              <span>{airdropData.airdrop_date}</span>
            </div>
            <h1 className="text-2xl font-bold mt-4">{airdropData.airdrop_title}</h1>
            <p className="text-zinc-400 mt-2">{airdropData.airdrop_description}</p>
            <div className="rounded-xl overflow-hidden my-4">
              {airdropData.airdrop_banner_image ? (
                <Image
                  src={airdropData.airdrop_banner_image}
                  alt="Banner"
                  className="w-full object-cover"
                  width={1920}
                  height={1080}
                />
              ) : (
                <div className="w-full h-48 bg-zinc-800 rounded-xl" />
              )}
            </div>
            {contentBlocks.map((block, i) => {
              if (block.type === 'description') return <p key={i} className="mb-4 text-zinc-300">{block.value}</p>;
              if (block.type === 'image')
                return block.value ? (
                  <Image
                    key={i}
                    src={block.value}
                    alt={`Image ${i}`}
                    width={1920}
                    height={1080}
                    className="rounded-xl mb-4 object-contain"
                    unoptimized
                  />
                ) : (
                  <div key={i} className="w-full h-48 bg-zinc-800 rounded-xl mb-4" />
                );
              if (block.type === 'checklist') {
                const items = block.value.split('\n').filter(Boolean);
                return (
                  <ul key={i} className="list-disc list-inside text-zinc-300 mb-4">
                    {items.map((item, idx) => <li key={idx}>{item}</li>)}
                  </ul>
                );
              }
              if (block.type === 'link') {
                return (
                  <p key={i} className="mb-4">
                    <a href={block.link || '#'} target="_blank" className="text-purple-400 underline">
                      {block.value}
                    </a>
                  </p>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAirdropPage;
