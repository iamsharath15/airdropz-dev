'use client';

import Link from 'next/link';
import Image from 'next/image';
import EditAirdropFormModal from './admin/EditAirdropFormModal';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

type AirdropCardProps = {
  airdrop: {
    id: string;
    title: string;
    category: string | null;
    preview_image_url: string;
    type: 'Free' | 'Paid';
  };
};

const AirdropCard = ({ airdrop }: AirdropCardProps) => {
  const userRole = useSelector((state: RootState) => state.auth.user?.role);
  const isAdmin = userRole === 'admin';

  return (

    <div className="p-[1%] lg:w-3/12 md:w-4/12 sm:w-6/12 w-full">

      <div className="relative group bg-[#151313] w-full rounded-lg overflow-hidden justify-between cursor-pointer flex flex-col transition-all hover:shadow-xl hover:-translate-y-1 duration-200">
        {/* Edit Icon on Hover */}
        {isAdmin && <EditAirdropFormModal airdrop={airdrop} />}

        <Link
          href={
            isAdmin
              ? `/dashboard/admin/airdrops/create/${airdrop.id}`
              : `/dashboard/user/airdrops/${airdrop.id}`
          }
          className="w-full"
        >
          <div className="w-full flex items-center justify-center h-7/12 p-[4%]">

            <Image
              className="object-cover w-full h-full rounded-3xl transition-transform group-hover:scale-105 duration-300"
              src={
                airdrop.preview_image_url ||
                'https://cdn.lootcrate.me/demo/airdropzimage.png'
              }
              alt="airdrop image"
              width={1920}
              height={1080}
            />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-white">
                {airdrop.title}
              </h3>
            </div>
            <div className="flex gap-2">
              <div className="bg-[#8373EE] py-1 px-3 rounded-full">
                <p className="text-sm text-white">
                  # {airdrop.category ?? 'Unknown'}
                </p>
              </div>
              <div className="bg-[#8373EE] py-1 px-3 rounded-full">
                <p className="text-sm text-white">
                  # {airdrop.type ?? 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
      </div>
  );
};

export default AirdropCard;
