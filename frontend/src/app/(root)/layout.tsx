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
    <div className="flex flex-col bg-black w-full min-h-screen h-full">
      {!showChildren && <AppLoader onFinish={() => setShowChildren(true)} />}
      {showChildren && (
        <>
          <Header />
          <main>{children}</main>
          <Footer />
        </>
      )}
    </div>
  );
}
