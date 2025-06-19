import React from 'react';
import ProfilePictureUpload from './ProfilePictureUpload';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AccountSectionProps } from '@/types';

const AccountSection: React.FC<AccountSectionProps> = ({
  title,
  userName,
  setUsername,
  userEmail,
  setProfileImageUrl,
  profileImageUrl,
  userId,
}) => {
  return (
    <section className="py-6 px-2 mb-6 w-full">
      <h2 className="text-xl font-semibold text-gray-200 mb-5">{title}</h2>
      <div className="space-y-6 w-full">
        <ProfilePictureUpload
          userId={(userId ?? '').toString()}
          userName={userName}
          setProfileImageUrl={setProfileImageUrl}
          profileImageUrl={profileImageUrl ?? ''}
        />
        <div>
          <Label htmlFor="username" className="text-white mb-4 block">
            Username
          </Label>
          <Input
            id="username"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUsername(e.target.value)}
            className="border-0 text-black placeholder:text-black bg-white"
          />
        </div>
        <div>
          <Label htmlFor="email" className="text-white mb-4 block">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            disabled
            placeholder={userEmail}
            className="border-0 text-black placeholder:text-black bg-white opacity-70 cursor-not-allowed"
          />
        </div>
      </div>
    </section>
  );
};

export default AccountSection;
