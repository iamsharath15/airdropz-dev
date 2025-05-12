'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const slides = [
  {
    image: '/images/slider1.png',
    title: 'Track Airdrops Effortlessly',
    description: 'Real-time updates and tracking tools for all your airdrops.',
  },
  {
    image: '/images/slider2.png',
    title: 'Earn With Referrals',
    description: 'Invite friends and earn bonuses through verified referrals.',
  },
  {
    image: '/images/slider1.png',
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
    <div className="hidden md:flex w-1/2 relative items-center justify-center bg-black text-white overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={cn(
            'absolute transition-opacity duration-1000 w-full h-full ease-in-out text-center',
            i === index ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Image width={1080} height={1920} src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          <div className='absolute bg-[linear-gradient(314deg,_#0000005c,_#000000f5)] bottom-0 text-left p-[6%] w-full pt-[10%]'>
          <h2 className="text-2xl font-bold mb-2 text-left">{slide.title}</h2>
          <p className=" text-left">{slide.description}</p>
         </div>
        </div>
      ))} 
    </div>
  )
}
