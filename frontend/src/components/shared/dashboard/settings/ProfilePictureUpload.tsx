"use client"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { uploadImageToS3 } from '@/lib/uploadToS3';
import Image from 'next/image';
import React, { useState } from 'react';

const ProfilePictureUpload = ({
  userId,
  userName,
  setProfileImageUrl,
  profileImageUrl,
}: {
  userId: string;
  userName: string;
  setProfileImageUrl: (url: string) => void;
  profileImageUrl: string;
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const initial = userName.charAt(0).toUpperCase();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    try {
      const url = await uploadImageToS3(file, `profile-pictures/${userId}`);
      setProfileImageUrl(url);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="w-4/12 rounded-full overflow-hidden flex items-center justify-center text-white text-3xl font-bold">
        {previewUrl || profileImageUrl ? (
          <Image
            width={96}
            height={96}
            src={previewUrl || profileImageUrl}
            alt="Profile"
            className="object-cover w-24 h-24 rounded-full border border-gray-500 bg-gray-700"
          />
        ) : (
          <div className="w-24 h-24 bg-[#8373EE] rounded-full flex items-center justify-center">
            <span>{initial}</span>
          </div>
        )}
      </div>

      <div className="w-8/12">
        <Label className="text-white block mb-1">Profile Picture</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="cursor-pointer bg-white text-black"
        />
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
