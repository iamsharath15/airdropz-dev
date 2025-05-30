'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  PencilIcon,
  FileText,
  Image as ImageIcon,
  CheckSquare,
  Link2,
  Trash2,
} from 'lucide-react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import StepProgress from '@/components/shared/StepProgress';
import Image from 'next/image';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

const CreateAirdropPage = () => {
  const params = useParams();
  const router = useRouter();
  const { airdropId } = params;
  const handleDelete = async () => {
    if (!airdropId) {
      toast.error('Airdrop ID not found in URL.');
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/api/airdrop/v1/${airdropId}`, {
        withCredentials: true,
      });
      toast.success('Airdrop deleted successfully!');
      router.push('/dashboard/admin/airdrops/');
    } catch (error) {
      console.error('Failed to delete airdrop:', error);
      toast.error('Failed to delete airdrop. Please try again.');
    }
  };

  const [step, setStep] = useState(1);
  const totalSteps = 2;
  const progress = (step / totalSteps) * 100;
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
    {
      type: 'description' | 'image' | 'checklist' | 'link';
      value: string;
      link?: string;
    }[]
  >([]);

  const handleChange = (field: string, value: string) => {
    setAirdropData((prev) => ({ ...prev, [field]: value }));
  };

  const addBlock = (type: 'description' | 'image' | 'checklist' | 'link') => {
    if (type === 'link') {
      setContentBlocks([...contentBlocks, { type, value: '', link: '' }]);
    } else {
      setContentBlocks([...contentBlocks, { type, value: '' }]);
    }
  };

  const updateBlockValue = (index: number, value: string) => {
    const updated = [...contentBlocks];
    updated[index].value = value;
    setContentBlocks(updated);
  };

  const removeBlock = (index: number) => {
    const updated = [...contentBlocks];
    updated.splice(index, 1);
    setContentBlocks(updated);
  };

  const nextStep = () => setStep((s) => Math.min(2, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="flex flex-col max:h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4 bg-zinc-900 shadow-sm">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Create Airdrop</h1>
          <PencilIcon className="w-4 h-4 text-purple-400" />
        </div>
        <div className="flex gap-3">
          <Button
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleDelete}
          >
            Delete Airdrop
          </Button>
          <Button className="bg-[#8373EE] hover:bg-[#8373EE]/80 text-white">
            Save Airdrop
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Steps */}
        <div className="w-full md:w-1/2 p-6 overflow-auto border-r border-zinc-800 bg-black">
          <div className="mb-6">
            <StepProgress progress={progress} />
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold mb-4">
                Step 1: Airdrop Details
              </h2>

              <div>
                <label
                  htmlFor="airdrop-title"
                  className="block text-sm text-white mb-1"
                >
                  Airdrop Title
                </label>
                <Input
                  id="airdrop-title"
                  className="bg-zinc-800 text-white"
                  placeholder="airdrop Title"
                  value={airdropData.airdrop_title}
                  onChange={(e) =>
                    handleChange('airdrop_title', e.target.value)
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="airdrop-short-description"
                  className="block text-sm text-white mb-1"
                >
                  Short Banner Description
                </label>
                <Textarea
                  id="airdrop-short-description"
                  placeholder="Short banner description"
                  value={airdropData.airdrop_description}
                  onChange={(e) =>
                    handleChange('airdrop_description', e.target.value)
                  }
                  className="bg-zinc-900 border-zinc-700 text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="airdrop-date"
                  className="block text-sm text-white mb-1"
                >
                  Date
                </label>
                <Input
                  id="airdrop-date"
                  className="bg-zinc-800 text-white"
                  placeholder="Date"
                  value={airdropData.airdrop_date}
                  readOnly
                />
              </div>

              <div>
                <label
                  htmlFor="airdrop-category"
                  className="block text-sm text-white mb-1"
                >
                  Category
                </label>
                <Input
                  id="airdrop-category"
                  className="bg-zinc-800 text-white"
                  placeholder="Category (e.g., Guides)"
                  value={airdropData.airdrop_category}
                  onChange={(e) => handleChange('airdrop_category', e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="banner-upload"
                  className="block text-sm text-white mb-1"
                >
                  Banner Image
                </label>
                <div className="relative flex items-center justify-center w-full h-48 rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-900 cursor-pointer overflow-hidden hover:border-purple-500 transition">
                  {airdropData.airdrop_banner_image ? (
                    <Image
                      src={airdropData.airdrop_banner_image}
                      alt="Banner preview"
                      className="absolute inset-0 w-full h-full object-cover"
                      width={1920}
                      height={1080}
                    />
                  ) : (
                    <span className="text-white z-10 pointer-events-none select-none px-4 text-center">
                      Click here to upload banner image
                    </span>
                  )}
                  <input
                    id="banner-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          handleChange(
                            'airdrop_banner_image',
                            reader.result as string
                          );
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  onClick={nextStep}
                  className="bg-[#8373EE] hover:bg-[#8373EE]/80 text-white"
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold mb-4">
                Step 2: Airdrop Content
              </h2>
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={() => addBlock('description')}
                      className="bg-[#8373EE] hover:bg-[#8373EE]/80 cursor-pointer"
                    >
                      <FileText className="w-5 h-5 text-white" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add About</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      onClick={() => addBlock('image')}
                      className="bg-[#8373EE] hover:bg-[#8373EE]/80 cursor-pointer"
                    >
                      <ImageIcon className="w-5 h-5 text-white" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add Image block</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      onClick={() => addBlock('checklist')}
                      className="bg-[#8373EE] hover:bg-[#8373EE]/80 cursor-pointer"
                    >
                      <CheckSquare className="w-5 h-5 text-white" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add Checklist</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      onClick={() => addBlock('link')}
                      className="bg-[#8373EE] hover:bg-[#8373EE]/80 cursor-pointer"
                    >
                      <Link2 className="w-5 h-5 text-white" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add Link</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {contentBlocks.map((block, index) => (
                <div
                  key={index}
                  className="space-y-2 border border-zinc-700 p-3 rounded-md bg-zinc-900"
                >
                  {block.type === 'description' && (
                    <Textarea
                      placeholder="Enter description"
                      value={block.value}
                      onChange={(e) => updateBlockValue(index, e.target.value)}
                      className="bg-zinc-800 text-white"
                    />
                  )}
                  {block.type === 'image' && (
                    <div className="space-y-2">
                      {/* Image URL input */}
                      <Input
                        placeholder="Enter image URL"
                        value={block.value}
                        onChange={(e) =>
                          updateBlockValue(index, e.target.value)
                        }
                        className="bg-zinc-800 text-white"
                      />

                      {/* Image upload label and file input */}
                      <label
                        htmlFor={`image-upload-${index}`}
                        className="relative flex items-center justify-center w-full h-48 rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-900 cursor-pointer overflow-hidden hover:border-purple-500 transition"
                      >
                        {block.value ? (
                          <Image
                            src={block.value}
                            alt={`Content Image ${index + 1}`}
                            className="absolute inset-0 w-full h-full object-cover"
                            width={1920}
                            height={1080}
                          />
                        ) : (
                          <span className="text-white z-10 pointer-events-none select-none px-4 text-center">
                            Click here to upload image
                          </span>
                        )}
                        <input
                          id={`image-upload-${index}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                updateBlockValue(
                                  index,
                                  reader.result as string
                                );
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </label>
                    </div>
                  )}

                  {block.type === 'checklist' && (
                    <Textarea
                      placeholder="Enter checklist items (e.g. one per line)"
                      value={block.value}
                      onChange={(e) => updateBlockValue(index, e.target.value)}
                      className="bg-zinc-800 text-white"
                    />
                  )}
                  {block.type === 'link' && (
                    <div className="space-y-2">
                      <Input
                        placeholder="Enter title"
                        value={block.value}
                        onChange={(e) =>
                          updateBlockValue(index, e.target.value)
                        }
                        className="bg-zinc-800 text-white"
                      />
                      <Input
                        placeholder="Enter hyperlink"
                        value={block.link}
                        onChange={(e) => {
                          const updated = [...contentBlocks];
                          updated[index].link = e.target.value;
                          setContentBlocks(updated);
                        }}
                        className="bg-zinc-800 text-white"
                      />
                    </div>
                  )}

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeBlock(index)}
                    className="text-sm cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <div className="flex justify-start mt-6">
                <Button
                  onClick={prevStep}
                  variant="outline"
                  className="border-zinc-700 text-zinc-400"
                >
                  Back
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Live Preview */}
        <section className="w-full flex flex-col items-center py-[5%] justify-start bg-black overflow-y-auto px-6">
          <div className="w-full max-w-2xl">
            <div className="flex items-center justify-center space-x-2">
              <h2 className="bg-zinc-800 px-2 py-1 rounded-full">
                {airdropData.airdrop_category}
              </h2>
              <h2>{airdropData.airdrop_date}</h2>
            </div>
            <div className="text-center py-4">
              <h1 className="text-2xl font-semibold">
                {airdropData.airdrop_title}
              </h1>
              <p className="text-sm text-zinc-400 mt-2">
                {airdropData.airdrop_description}
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden mb-6">
              {airdropData.airdrop_banner_image ? (
                <Image
                  src={airdropData.airdrop_banner_image}
                  alt="Banner"
                  className="w-full  object-cover rounded-2xl"
                  width={1920}
                  height={1080}
                />
              ) : (
                <div className="w-full h-48 bg-zinc-800 rounded-2xl"></div>
              )}
            </div>
            {/* Render content blocks */}
            {contentBlocks.map((block, i) => {
              if (block.type === 'description') {
                return (
                  <p key={i} className="mb-4 text-zinc-300">
                    {block.value || `Description ${i + 1}`}
                  </p>
                );
              }
              if (block.type === 'image') {
                return block.value ? (
                  <Image
                    key={i}
                    src={block.value}
                    alt={`Content Image ${i + 1}`}
                    className="mb-4 rounded-md object-contain"
                    width={1920}
                    height={1080}
                    unoptimized // Add this if you're using base64 or non-remote images to prevent optimization errors
                  />
                ) : (
                  <div
                    key={i}
                    className="w-full h-48 bg-zinc-800 rounded-2xl mb-4"
                    aria-label={`Placeholder for image ${i + 1}`}
                  />
                );
              }

              if (block.type === 'checklist') {
                const items = block.value
                  ? block.value.split('\n').filter((line) => line.trim() !== '')
                  : [`Checklist item ${i + 1}.1`, `Checklist item ${i + 1}.2`];
                return (
                  <ul
                    key={i}
                    className="list-disc list-inside mb-4 text-zinc-300"
                  >
                    {items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                );
              }
              if (block.type === 'link') {
                const linkText = block.value || `Example Link ${i + 1}`;
                const linkHref = block.link || 'https://example.com';
                return (
                  <p key={i} className="mb-4">
                    <a
                      href={linkHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 underline"
                    >
                      {linkText}
                    </a>
                  </p>
                );
              }
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CreateAirdropPage;
