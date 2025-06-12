'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import StepProgress from '@/components/shared/StepProgress';

import {
  FileText,
  Image as ImageIcon,
  CheckSquare,
  Link2,
  Trash2,
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import SortableItem from '@/components/shared/SortableItem';

const CreateAirdropPage = () => {
  const params = useParams();
  const { airdropId } = params;
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 2;
  const progress = (step / totalSteps) * 100;

  const [airdropData, setAirdropData] = useState({
    airdrops_banner_title: '',
    airdrops_banner_description: '',
    airdrops_banner_subtitle: '',
    airdrops_date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    airdrops_banner_image: '',
    title: '',
  });
  const [contentBlocks, setContentBlocks] = useState<
    {
      type: 'description' | 'image' | 'checklist' | 'link';
      value: string;
      link?: string;
    }[]
  >([]);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    const fetchAirdrop = async () => {
      if (!airdropId) return;
      try {
        const res = await axios.get(
          `http://localhost:8080/api/airdrop/v1/${airdropId}`,
          { withCredentials: true }
        );
        const data = res.data;
        setAirdropData({
          title: data.title || 'aidrop title',
          airdrops_banner_title:
            data.airdrops_banner_title || 'How to Join the 3DOS Airdrop',
          airdrops_banner_description:
            data.airdrops_banner_description ||
            '3DOS Network is building a more efficient, accessible, and globally distributed system...',
          airdrops_banner_subtitle: data.airdrops_banner_subtitle || 'Guides',
          airdrops_date: new Date(data.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
          airdrops_banner_image: data.airdrops_banner_image || '',
        });
        setContentBlocks(data.content_blocks || []);
      } catch (error) {
        toast.error(`Failed to load airdrop for editing.${error}`);
      }
    };
    fetchAirdrop();
  }, [airdropId]);

  const readFile = (file: File, callback: (res: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDelete = async () => {
    if (!airdropId) {
      toast.error('Airdrop ID not found in URL.');
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
  const handleSubmit = async () => {
    // if (!airdropData.airdrop_title.trim())
    //   return toast.error('Title is required.');
    const payload = {
      title: airdropData.title,
      // category: "",
      //type: airdropData.type,
      content_blocks: contentBlocks,
      airdrops_banner_title: airdropData.airdrops_banner_title,
      airdrops_banner_description: airdropData.airdrops_banner_description,
      airdrops_banner_subtitle: airdropData.airdrops_banner_subtitle,
      airdrops_banner_image: airdropData.airdrops_banner_image,
    };
    try {
      if (airdropId) {
        await axios.put(
          `http://localhost:8080/api/airdrop/v1/${airdropId}`,
          payload,
          { withCredentials: true }
        );
        toast.success('Airdrop updated!');
      } else {
        await axios.post(`http://localhost:8080/api/airdrop/v1`, payload, {
          withCredentials: true,
        });
        toast.success('Airdrop created!');
      }
      router.push('/dashboard/admin/airdrops');
    } catch {
      toast.error('Submit failed.');
    }
  };

  const updateBlock = useCallback(
    (idx: number, field: 'value' | 'link', val: string) => {
      setContentBlocks((blocks) =>
        blocks.map((b, i) => (i === idx ? { ...b, [field]: val } : b))
      );
    },
    []
  );

  const removeBlock = useCallback((idx: number) => {
    setContentBlocks((blocks) => blocks.filter((_, i) => i !== idx));
  }, []);

  const addBlock = useCallback((type) => {
    setContentBlocks((blocks) => [
      ...blocks,
      { type, value: '', ...(type === 'link' && { link: '' }) },
    ]);
  }, []);
  const handleChange = (field: string, value: string) => {
    setAirdropData((prev) => ({ ...prev, [field]: value }));
  };
  const renderBlock = (block: (typeof contentBlocks)[number], idx: number) => {
    switch (block.type) {
      case 'description':
        return (
          <Textarea
            value={block.value}
            onChange={(e) => updateBlock(idx, 'value', e.target.value)}
            placeholder="Enter description"
            className="bg-zinc-800 text-white"
          />
        );
      case 'image':
        return (
          <div className="space-y-2">
            <Input
              value={block.value}
              onChange={(e) => updateBlock(idx, 'value', e.target.value)}
              placeholder="Enter image URL"
              className="bg-zinc-800 text-white"
            />
            <label className="relative w-full h-48 border-dashed border-2 border-zinc-700 rounded-lg bg-zinc-900 flex items-center justify-center overflow-hidden hover:border-purple-500">
              {block.value ? (
                <Image
                  src={block.value}
                  alt={`Block image ${idx}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  width={1920}
                  height={1080}
                />
              ) : (
                <span className="z-10 text-white">Upload image</span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file)
                    readFile(file, (res) => updateBlock(idx, 'value', res));
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </label>
          </div>
        );
      case 'checklist':
        return (
          <Textarea
            value={block.value}
            onChange={(e) => updateBlock(idx, 'value', e.target.value)}
            placeholder="Checklist items, one per line"
            className="bg-zinc-800 text-white"
          />
        );
      case 'link':
        return (
          <div className="space-y-2">
            <Input
              value={block.value}
              onChange={(e) => updateBlock(idx, 'value', e.target.value)}
              placeholder="Link title"
              className="bg-zinc-800 text-white"
            />
            <Input
              value={block.link || ''}
              onChange={(e) => updateBlock(idx, 'link', e.target.value)}
              placeholder="URL"
              className="bg-zinc-800 text-white"
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
      <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4 bg-zinc-900 shadow-sm rounded-2xl">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">{airdropData.title}</h1>
        </div>
        <div className="flex gap-3">
          {airdropId && (
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
          <Button
            className="bg-[#8373EE] hover:bg-[#8373EE]/80 text-white cursor-pointer"
            onClick={handleSubmit}
          >
            {airdropId ? 'Update' : 'Create'}
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
                  value={airdropData.airdrops_banner_title}
                  onChange={(e) =>
                    setAirdropData((p) => ({
                      ...p,
                      airdrops_banner_title: e.target.value,
                    }))
                  }
                  placeholder="Title"
                  className="bg-zinc-800 text-white mb-4"
                />
              </div>

              <div>
                <label
                  htmlFor="airdrop-short-description"
                  className="block text-sm text-white mb-3"
                >
                  Airdrop Description
                </label>
                <Textarea
                  value={airdropData.airdrops_banner_description}
                  onChange={(e) =>
                    setAirdropData((p) => ({
                      ...p,
                      airdrops_banner_description: e.target.value,
                    }))
                  }
                  placeholder="Short description"
                  className="bg-zinc-900 border-zinc-700 text-white mb-4"
                />
              </div>

              <div>
                <label
                  htmlFor="airdrop-date"
                  className="block text-sm text-white mb-3"
                >
                  Date
                </label>
                <Input
                  value={airdropData.airdrops_date}
                  readOnly
                  className="bg-zinc-800 text-white mb-4"
                />
              </div>

              <div>
                <label
                  htmlFor="airdrop-category"
                  className="block text-sm text-white mb-3"
                >
                  Airdrop Sub Title
                </label>
                <Input
                  value={airdropData.airdrops_banner_subtitle}
                  onChange={(e) =>
                    setAirdropData((p) => ({
                      ...p,
                      airdrops_banner_subtitle: e.target.value,
                    }))
                  }
                  placeholder="Category"
                  className="bg-zinc-800 text-white mb-3"
                />
              </div>

              <div>
                <label
                  htmlFor="banner-upload"
                  className="block text-sm text-white mb-4"
                >
                  Airdrop Banner Image
                </label>
                <div className="relative flex items-center justify-center w-full h-48 rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-900 cursor-pointer overflow-hidden hover:border-purple-500 transition">
                  {airdropData.airdrops_banner_image ? (
                    <Image
                      src={airdropData.airdrops_banner_image}
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
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file)
                        readFile(file, (res) =>
                          setAirdropData((p) => ({
                            ...p,
                            airdrops_banner_image: res,
                          }))
                        );
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  onClick={() => setStep(2)}
                  className="bg-[#8373EE] hover:bg-[#8373EE]/80 text-white cursor-pointer"
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            // <div className="space-y-4">
            //   <h2 className="text-lg font-bold mb-4">
            //     Step 2: Airdrop Content
            //   </h2>
            //   <div className="flex gap-2">
            //     <Tooltip>
            //       <TooltipTrigger asChild>
            //         <Button
            //           variant="ghost"
            //           onClick={() => addBlock('description')}
            //           className="bg-[#8373EE] hover:bg-[#8373EE]/80 cursor-pointer"
            //         >
            //           <FileText className="w-5 h-5 text-white" />
            //         </Button>
            //       </TooltipTrigger>
            //       <TooltipContent>
            //         <p>Add About</p>
            //       </TooltipContent>
            //     </Tooltip>

            //     <Tooltip>
            //       <TooltipTrigger asChild>
            //         <Button
            //           variant="secondary"
            //           onClick={() => addBlock('image')}
            //           className="bg-[#8373EE] hover:bg-[#8373EE]/80 cursor-pointer"
            //         >
            //           <ImageIcon className="w-5 h-5 text-white" />
            //         </Button>
            //       </TooltipTrigger>
            //       <TooltipContent>
            //         <p>Add Image block</p>
            //       </TooltipContent>
            //     </Tooltip>

            //     <Tooltip>
            //       <TooltipTrigger asChild>
            //         <Button
            //           variant="secondary"
            //           onClick={() => addBlock('checklist')}
            //           className="bg-[#8373EE] hover:bg-[#8373EE]/80 cursor-pointer"
            //         >
            //           <CheckSquare className="w-5 h-5 text-white" />
            //         </Button>
            //       </TooltipTrigger>
            //       <TooltipContent>
            //         <p>Add Checklist</p>
            //       </TooltipContent>
            //     </Tooltip>

            //     <Tooltip>
            //       <TooltipTrigger asChild>
            //         <Button
            //           variant="secondary"
            //           onClick={() => addBlock('link')}
            //           className="bg-[#8373EE] hover:bg-[#8373EE]/80 cursor-pointer"
            //         >
            //           <Link2 className="w-5 h-5 text-white" />
            //         </Button>
            //       </TooltipTrigger>
            //       <TooltipContent>
            //         <p>Add Link</p>
            //       </TooltipContent>
            //     </Tooltip>
            //   </div>

            //   {contentBlocks.map((block, index) => (
            //     <div
            //       key={index}
            //       className="space-y-2 border border-zinc-700 p-3 rounded-md bg-zinc-900"
            //     >
            //       {block.type === 'description' && (
            //         <Textarea
            //           placeholder="Enter description"
            //           value={block.value}
            //           onChange={(e) => updateBlockValue(index, e.target.value)}
            //           className="bg-zinc-800 text-white"
            //         />
            //       )}
            //       {block.type === 'image' && (
            //         <div className="space-y-2">
            //           {/* Image URL input */}
            //           <Input
            //             placeholder="Enter image URL"
            //             value={block.value}
            //             onChange={(e) =>
            //               updateBlockValue(index, e.target.value)
            //             }
            //             className="bg-zinc-800 text-white"
            //           />

            //           {/* Image upload label and file input */}
            //           <label
            //             htmlFor={`image-upload-${index}`}
            //             className="relative flex items-center justify-center w-full h-48 rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-900 cursor-pointer overflow-hidden hover:border-purple-500 transition"
            //           >
            //             {block.value ? (
            //               <Image
            //                 src={block.value}
            //                 alt={`Content Image ${index + 1}`}
            //                 className="absolute inset-0 w-full h-full object-cover"
            //                 width={1920}
            //                 height={1080}
            //               />
            //             ) : (
            //               <span className="text-white z-10 pointer-events-none select-none px-4 text-center">
            //                 Click here to upload image
            //               </span>
            //             )}
            //             <input
            //               id={`image-upload-${index}`}
            //               type="file"
            //               accept="image/*"
            //               onChange={(e) => {
            //                 const file = e.target.files?.[0];
            //                 if (file) {
            //                   const reader = new FileReader();
            //                   reader.onloadend = () => {
            //                     updateBlockValue(
            //                       index,
            //                       reader.result as string
            //                     );
            //                   };
            //                   reader.readAsDataURL(file);
            //                 }
            //               }}
            //               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            //             />
            //           </label>
            //         </div>
            //       )}

            //       {block.type === 'checklist' && (
            //         <Textarea
            //           placeholder="Enter checklist items (e.g. one per line)"
            //           value={block.value}
            //           onChange={(e) => updateBlockValue(index, e.target.value)}
            //           className="bg-zinc-800 text-white"
            //         />
            //       )}
            //       {block.type === 'link' && (
            //         <div className="space-y-2">
            //           <Input
            //             placeholder="Enter title"
            //             value={block.value}
            //             onChange={(e) =>
            //               updateBlockValue(index, e.target.value)
            //             }
            //             className="bg-zinc-800 text-white"
            //           />
            //           <Input
            //             placeholder="Enter hyperlink"
            //             value={block.link}
            //             onChange={(e) => {
            //               const updated = [...contentBlocks];
            //               updated[index].link = e.target.value;
            //               setContentBlocks(updated);
            //             }}
            //             className="bg-zinc-800 text-white"
            //           />
            //         </div>
            //       )}

            //       <Button
            //         variant="destructive"
            //         size="sm"
            //         onClick={() => removeBlock(index)}
            //         className="text-sm cursor-pointer"
            //       >
            //         <Trash2 className="w-4 h-4" />
            //       </Button>
            //     </div>
            //   ))}

            //   <div className="flex justify-start mt-6">
            //     <Button
            //       onClick={prevStep}
            //       variant="outline"
            //       className="border-zinc-700 text-zinc-400"
            //     >
            //       Back
            //     </Button>
            //   </div>
            // </div>
            <>
              <h2 className="text-lg font-bold mb-4">
                Step 2: Content & Reorder
              </h2>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={({ active, over }) => {
                  if (active.id !== over?.id) {
                    const oldIndex = parseInt(active.id);
                    const newIndex = parseInt(over!.id);
                    setContentBlocks((blocks) =>
                      arrayMove(blocks, oldIndex, newIndex)
                    );
                  }
                }}
              >
                <SortableContext
                  items={contentBlocks.map((_, i) => i.toString())}
                  strategy={verticalListSortingStrategy}
                >
                  {contentBlocks.map((block, index) => (
                    <SortableItem key={index} id={index.toString()}>
                      <div className="border border-zinc-700 rounded-lg p-4 mb-4 relative">
                        <button
                          className="absolute top-2 right-2 text-white bg-black hover:bg-red-400 p-1 rounded-md cursor-pointer"
                          onClick={() => removeBlock(index)}
                          type="button"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="mt-6">{renderBlock(block, index)}</div>
                      </div>
                    </SortableItem>
                  ))}
                </SortableContext>
              </DndContext>

              <div className="flex gap-2">
                {[
                  { icon: <FileText />, type: 'description' },
                  { icon: <ImageIcon />, type: 'image' },
                  { icon: <CheckSquare />, type: 'checklist' },
                  { icon: <Link2 />, type: 'link' },
                ].map((tool) => (
                  <Tooltip key={tool.type}>
                    <TooltipTrigger asChild>
                      <Button
                        className="bg-[#8373EE] hover:bg-[#8373EE]/80 cursor-pointer"
                        onClick={() => addBlock(tool.type as any)}
                      >
                        {tool.icon}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add {tool.type}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  className="text-black cursor-pointer"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-[#8373EE] hover:bg-[#8373EE]/80 cursor-pointer"
                >
                  {airdropId ? 'Update' : 'Create'}
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Right Panel: Live Preview */}
        <section className="w-full flex flex-col items-center py-[5%] justify-start bg-black overflow-y-auto px-6">
          <div className="w-full max-w-2xl">
            <div className="flex items-center justify-center space-x-2">
              <h2 className="bg-zinc-800 px-2 py-1 rounded-full">
                {airdropData.airdrops_banner_subtitle}
              </h2>
              <h2>{airdropData.airdrops_date}</h2>
            </div>
            <div className="text-center py-4">
              <h1 className="text-2xl font-semibold">
                {airdropData.airdrops_banner_title}
              </h1>
              <p className="text-sm text-zinc-400 mt-2">
                {airdropData.airdrops_banner_description}
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden mb-6">
              {airdropData.airdrops_banner_image ? (
                <Image
                  src={airdropData.airdrops_banner_image}
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
            {/* {contentBlocks.map((block, i) => {
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
            })} */}
            {contentBlocks.map((block, i) => {
              switch (block.type) {
                case 'description':
                  return (
                    <p key={i} className="mb-4 text-zinc-300">
                      {block.value}
                    </p>
                  );
                case 'image':
                  return block.value ? (
                    <Image
                      key={i}
                      src={block.value}
                      alt={`Content ${i}`}
                      width={1920}
                      height={1080}
                      className="mb-4 rounded-xl object-contain"
                      unoptimized
                    />
                  ) : (
                    <div
                      key={i}
                      className="w-full h-48 bg-zinc-800 rounded-xl mb-4"
                    />
                  );
                case 'checklist':
                  const items = block.value.split('\n').filter(Boolean);
                  return (
                    <ul
                      key={i}
                      className="list-disc list-inside text-zinc-300 mb-4"
                    >
                      {items.map((it, idx) => (
                        <li key={idx}>{it}</li>
                      ))}
                    </ul>
                  );
                case 'link':
                  return (
                    <p key={i} className="mb-4">
                      <a
                        href={block.link}
                        target="_blank"
                        className="text-purple-400 underline"
                      >
                        {block.value}
                      </a>
                    </p>
                  );
                default:
                  return null;
              }
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CreateAirdropPage;
