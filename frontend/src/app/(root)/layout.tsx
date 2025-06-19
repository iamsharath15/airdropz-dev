'use client';

import Header from '@/components/shared/landingPage/Header';
import React from 'react';

export default function LandingRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col items-center justify-center bg-black w-full min-h-screen h-full relative">
      <>
        <Header />
        <main className="flex items-center justify-center flex-col w-full ">
          {children}
        </main>
      </>
    </div>
  );
}
