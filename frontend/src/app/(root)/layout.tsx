// app/landing/layout.tsx
import Footer from '@/components/shared/footer/Footer';
import Header from '@/components/shared/header/Header';
import React from 'react';

export default function LandingRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col bg-black w-full min-h-screen h-full">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
