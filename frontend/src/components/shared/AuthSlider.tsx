'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'

const slides = [
  {
    image: 'https://cdn.lootcrate.me/static-image-v1/auth/slider1.png',
    title: 'Track Airdrops Effortlessly',
    description: 'Real-time updates and tracking tools for all your airdrops.',
  },
  {
    image: 'https://cdn.lootcrate.me/static-image-v1/auth/slider2.png',
    title: 'Earn With Referrals',
    description: 'Invite friends and earn bonuses through verified referrals.',
  },
  {
    image: 'https://cdn.lootcrate.me/static-image-v1/auth/slider1.png',
    title: 'Your Web3 Dashboard',
    description: 'Everything you need for airdrops, rewards, and insights—all in one place.',
  },
]

export default function AuthSlider() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="hidden lg:flex w-1/2 relative items-center justify-center bg-black text-white overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: 'easeIn' }}
          className="absolute w-full h-full text-center"
        >
          <Image
            width={1080}
            height={1920}
            src={slides[index].image}
            alt={slides[index].title}
            className="w-full h-full object-cover"
          />
          <div className='absolute bg-[linear-gradient(314deg,_#0000005c,_#000000f5)] bottom-0 text-left p-[6%] w-full pt-[10%]'>
            <h2 className="text-2xl font-bold mb-2 text-left">{slides[index].title}</h2>
            <p className="text-left">{slides[index].description}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
