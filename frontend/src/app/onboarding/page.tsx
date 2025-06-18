'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingForm from './OnboardingForm';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

const Page = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = !!user;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/'); 
    }
  }, [isAuthenticated, router]);

  // Prevent rendering until user is authenticated
  if (!isAuthenticated) return null;

  return (
    <div className="w-full">
      <OnboardingForm />
    </div>
  );
};

export default Page;
