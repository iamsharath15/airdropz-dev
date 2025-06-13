'use client';

import Image from 'next/image';
import {
  Trash2,
  FileText,
  ImageIcon,
  CheckSquare,
  Link2,
  Highlighter,
  Heading1,
} from 'lucide-react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import SortableItem from '../SortableItem';
import StepProgress from '../StepProgress';

type ContentBlock = {
  type:
    | 'description'
    | 'image'
    | 'checklist'
    | 'link'
    | 'highlight'
    | 'header1';
  value: string;
  link?: string;
};

type Props = {
  airdropData: any;
  setAirdropData: (val: (prev: any) => any) => void;
  step: number;
  setStep: (step: number) => void;
  contentBlocks: ContentBlock[];
  setContentBlocks: React.Dispatch<React.SetStateAction<ContentBlock[]>>;
  renderBlock: (block: ContentBlock, index: number) => JSX.Element;
  removeBlock: (index: number) => void;
  addBlock: (type: ContentBlock['type']) => void;
  handleSubmit: () => void;
  sensors: any;
  airdropId?: string;
};

export default function AirdropFormEditor({
  airdropData,
  setAirdropData,
  step,
  setStep,
  contentBlocks,
  setContentBlocks,
  renderBlock,
  removeBlock,
  addBlock,
  handleSubmit,
  sensors,
  airdropId,
}: Props) {
  const totalSteps = 2;

  const progressPercent = (step / totalSteps) * 100;

  return (
    <div className="w-full md:w-1/2 md:p-6 px-1 py-6 overflow-auto md:border-t-0  md:border-r border-t border-zinc-800 bg-black">
      <div className="mb-6">
        <StepProgress progress={progressPercent} />
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="md:text-lg tetx-sm font-bold mb-4">Step 1: Airdrop Details</h2>

          <div>
            <label className="block text-sm text-white font-semibold mb-3">
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
              className="bg-zinc-800 text-white mb-4 border-white/60 hover:border-[#8373EE] active:border-[#8373EE] focus-visible:border-[#8373EE]"
            />
          </div>

          <div>
            <label className="block text-sm text-white mb-3 font-semibold">
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
              className="bg-zinc-900  text-white mb-4 border-white hover:border-[#8373EE] active:border-[#8373EE] focus-visible:border-[#8373EE]"
            />
          </div>

          <div>
            <label className="block text-sm text-white mb-3 font-semibold">Date</label>
            <Input
              value={airdropData.airdrops_date}
              disabled
              className="bg-zinc-800 text-white opacity-60 cursor-not-allowed mb-4 border-[#8373EE] hover:border-[#8373EE] active:border-[#8373EE] focus-visible:border-[#8373EE]"
            />
          </div>

          <div>
            <label className="block text-sm text-white mb-3 font-semibold">
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
              className="bg-zinc-800 text-white mb-3 border-white hover:border-[#8373EE] active:border-[#8373EE] focus-visible:border-[#8373EE]"
            />
          </div>

          <div>
            <label className="block text-sm text-white mb-4 font-semibold">
              Airdrop Banner Image
            </label>
            <div className="relative flex items-center justify-center w-full h-48 rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-900 cursor-pointer overflow-hidden hover:border-[#8373EE] transition">
              {airdropData.airdrops_banner_image ? (
                <Image
                  src={
                    airdropData.airdrops_banner_image instanceof File
                      ? URL.createObjectURL(airdropData.airdrops_banner_image)
                      : airdropData.airdrops_banner_image
                  }
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
                  if (file) {
                    setAirdropData((prev) => ({
                      ...prev,
                      airdrops_banner_image: file,
                    }));
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              onClick={() => setStep(2)}
              className="bg-[#8373EE] hover:bg-[#8373EE]/80 text-white cursor-pointer font-semibold"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <>
          <h2 className="md:text-lg text-sm font-bold mb-4">Step 2: Content & Reorder</h2>
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

          <div className="flex gap-2 flex-wrap">
            {[
              { icon: <FileText />, type: 'description' },
              { icon: <ImageIcon />, type: 'image' },
              { icon: <CheckSquare />, type: 'checklist' },
              { icon: <Link2 />, type: 'link' },
              { icon: <Highlighter />, type: 'highlight' },
              { icon: <Heading1 />, type: 'header1' },
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
              className="text-black font-semibold cursor-pointer"
              onClick={() => setStep(1)}
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-[#8373EE] hover:bg-[#8373EE]/80 cursor-pointer font-semibold"
            >
              {airdropId ? 'Update' : 'Create'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
