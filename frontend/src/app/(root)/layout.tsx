'use client';

import AppLoader from '@/components/shared/AppLoader';
import Footer from '@/components/shared/footer/Footer';
import Header from '@/components/shared/header/Header';
import React, { useState } from 'react';

export default function LandingRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [showChildren, setShowChildren] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center bg-black w-full min-h-screen h-full relative">
      {!showChildren && <AppLoader onFinish={() => setShowChildren(true)} />}
      {showChildren && (
        <>
          <Header />
          <main className='flex items-center justify-center flex-col w-full py-[10%]'>
           {children}
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}
