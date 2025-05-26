'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import React from 'react';

const transition = {
  duration: 1.5,
  ease: [0.22, 1, 0.36, 1],
};

export default function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        className="relative w-full h-full"
      >
        {children}

        {/* Slide In - from bottom scaling up */}
        <motion.div
          className="fixed top-0 left-0 w-full h-screen bg-[#8373EE] z-50 origin-bottom"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 1 }}
          transition={transition}
        />

        {/* Slide Out - from top scaling down */}
        <motion.div
          className="fixed top-0 left-0 w-full h-screen bg-[#8373EE] z-50 origin-top"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 0 }}
          transition={transition}
        />
      </motion.div>
    </AnimatePresence>
  );
}
