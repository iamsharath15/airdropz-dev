'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AppLoader({ onFinish }: { onFinish: () => void }) {
  const [loading, setLoading] = useState(false); // initially false
  const words = ['Welcome', 'to', 'Airdropz'];

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('hasLoaded');

    if (!hasLoaded) {
      setLoading(true);
      sessionStorage.setItem('hasLoaded', 'true');

      const timer = setTimeout(() => {
        setLoading(false);
        onFinish(); // Notify parent when done
      }, 2500);

      return () => clearTimeout(timer);
    } else {
      onFinish(); // Immediately notify if already loaded
    }
  }, [onFinish]);

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.4, duration: 0.5, ease: 'easeOut' },
    }),
  };

  if (!loading) return null;

  return (
    <motion.div
      className="fixed flex items-center justify-center bg-black z-50 w-full h-screen"
      initial={{ y: 0 }}
      animate={{ y: '-100%' }}
      transition={{ duration: 0.8, delay: 2.5, ease: 'easeInOut' }}
    >
      <div className="flex items-center justify-center flex-col relative">
        <motion.div
          className="flex flex-wrap justify-center text-white text-3xl font-bold space-x-2"
          initial="hidden"
          animate="visible"
          variants={wordVariants}
        >
          {words.map((word, index) => (
            <motion.span
              className="text-white"
              key={index}
              custom={index}
              variants={wordVariants}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>
        <div className="mt-4 w-full h-1 bg-white/10 rounded-md relative overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full"
            style={{
              background:
                'linear-gradient(90deg, #6F2BE4 10%, #B877A6 50%, #F4B572 80%)',
            }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.0, delay: 0, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
