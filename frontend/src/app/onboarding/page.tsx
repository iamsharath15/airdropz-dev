'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingForm from './OnboardingForm';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

const Page = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else if (user.is_verified) {
      if (user.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/user');
      }
    }
  }, [user, router]);

  // Prevent rendering until user is authenticated
  if (!user) return <div className="text-white p-4">Loading...</div>;

  return (
    <div className="w-full">
      <OnboardingForm />
    </div>
  );
};

export default Page;
