'use client';

import Image from 'next/image';
import { useMemo } from 'react';

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
  airdropData: {
    airdrops_banner_image: File | string;
    airdrops_banner_title: string;
    airdrops_banner_description: string;
    airdrops_banner_subtitle: string;
    airdrops_date: string;
  };
  contentBlocks: ContentBlock[];
};

export default function AirdropPreview({ airdropData, contentBlocks }: Props) {
  const previewImage = useMemo(() => {
    const img = airdropData.airdrops_banner_image;
    if (typeof img === 'string' && img.trim() !== '') return img;
    if (img instanceof File) return URL.createObjectURL(img);
    return null;
  }, [airdropData.airdrops_banner_image]);

  return (
    <section className="w-full flex flex-col items-center md:py-[5%] py-[10%] justify-start bg-black overflow-y-auto md:px-6 px-1">
      <div className="w-full flex flex-col items-center justify-center">
        <div className=" md:w-8/12 w-10/12 flex flex-col items-center justify-center">
          <div className="flex items-center justify-center space-x-2">
            <h2 className="bg-zinc-800 px-2 py-1 rounded-full md:text-sm text-xs font-medium text-white'">
              {airdropData.airdrops_banner_subtitle}
            </h2>
            <p className='md:text-sm text-xs font-medium text-white' >{airdropData.airdrops_date}</p>
          </div>
          <div className="text-center py-4">
            <h1 className="md:text-2xl text-xl font-semibold">
              {airdropData.airdrops_banner_title}
            </h1>
            <p className="md:text-lg tetx-sm text-white/80 mt-2">
              {airdropData.airdrops_banner_description}
            </p>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden mb-6 w-full">
          {previewImage ? (
            <Image
              src={previewImage}
              alt="Banner"
              className="w-full object-cover rounded-2xl"
              width={1920}
              height={1080}
              unoptimized
            />
          ) : (
            <div className="w-full md:h-48 h-30 bg-zinc-800 rounded-2xl" />
          )}
        </div>
        <div className=" w-8/12 flex flex-col items-center justify-center">
          {contentBlocks.map((block, i) => {
            switch (block.type) {
              case 'description':
                return (
                  <p key={i} className="mb-4 text-zinc-300 text-left">
                    {block.value}
                  </p>
                );
              case 'image':
                return block.value?.trim() ? (
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
                    {items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                );
              case 'link':
                return (
                  <p key={i} className="mb-4">
                    {block.value}{' '}
                    <a
                      href={block.link}
                      target="_blank"
                      className="text-purple-400 underline"
                      rel="noreferrer"
                    >
                      Link
                    </a>
                  </p>
                );
              case 'highlight':
                return (
                  <div className="bg-[#111112] py-[2%] px-[10%] rounded-2xl w-full">
                    <p key={i} className="text-white text-2xl">
                      {block.value}
                    </p>
                  </div>
                );
              case 'header1':
                return (
                  <h1 key={i} className="text-white text-2xl text-left">
                    {block.value}
                  </h1>
                );
              default:
                return null;
            }
          })}
        </div>
      </div>
    </section>
  );
}
