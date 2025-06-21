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
      return;
    }

    if (user.role === 'user' && user.is_new_user === false) {
      router.push('/dashboard/user');
      return;
    }

    if (user.role === 'admin') {
      router.push('/dashboard/admin');
    }
  }, [user, router]);

  if (!user) return <div className="text-white p-4">Loading...</div>;

  return (
    <div className="w-full">
      <OnboardingForm />
    </div>
  );
};

export default Page;
