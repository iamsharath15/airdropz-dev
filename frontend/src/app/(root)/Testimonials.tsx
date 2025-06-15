'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const testimonialsTop = [
  {
    name: 'Jessica Morgan',
    title: 'Product Manager at FutureTech',
    image: '/avatar1.jpg',
    review: 'Their 3D designs have been instrumental in showcasing our products in a new light...',
  },
  {
    name: 'Emily Carter',
    title: 'Founder of Blossom Beauty',
    image: '/avatar2.jpg',
    review: 'Working with this design team has been a game-changer for our brand...',
  },
  {
    name: 'Sarah Thompson',
    title: 'CEO of GreenLeaf',
    image: '/avatar3.jpg',
    review: 'Their creative vision and attention to detail have elevated our online presence...',
  },
];

const testimonialsBottom = [
  {
    name: 'Jonathan Perez',
    title: 'Owner of Coastal Crafts',
    image: '/avatar4.jpg',
    review: 'Every piece they created was visually stunning and aligned with our brand...',
  },
  {
    name: 'Rachel Adams',
    title: 'Head of UX at Bright Solutions',
    image: '/avatar5.jpg',
    review: 'The UI/UX design services have greatly improved our platform\'s usability...',
  },
  {
    name: 'Michael Lee',
    title: 'Creative Director',
    image: '/avatar6.jpg',
    review: 'The custom illustrations added a unique flair to our materials...',
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: any }) => (
  <div className="bg-[#111] text-white rounded-2xl p-6 w-[320px] mx-3 shrink-0">
    <div className="flex items-center gap-3 mb-3">
      <Image
        src={testimonial.image}
        alt={testimonial.name}
        width={40}
        height={40}
        className="rounded-full object-cover"
      />
      <div>
        <h4 className="font-semibold">{testimonial.name}</h4>
        <p className="text-sm text-white/60">{testimonial.title}</p>
      </div>
    </div>
    <p className="text-sm text-white/80">{testimonial.review}</p>
    <p className="text-yellow-400 mt-2">★★★★★</p>
  </div>
);

export default function Testimonials() {
  return (
    <section className="w-full bg-black py-20 px-4 overflow-hidden">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white">What Our Clients Are Saying</h2>
        <p className="text-white/80 mt-3">
          Discover how our design solutions have transformed businesses and brought visions to life.
        </p>
      </div>

      {/* Top row - scroll left */}
      <div className="overflow-hidden">
        <motion.div
          className="flex w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 25,
          }}
        >
          {[...testimonialsTop, ...testimonialsTop].map((t, i) => (
            <TestimonialCard key={`top-${i}`} testimonial={t} />
          ))}
        </motion.div>
      </div>

      {/* Bottom row - scroll right */}
      <div className="overflow-hidden mt-10">
        <motion.div
          className="flex w-max"
          animate={{ x: ['-50%', '0%'] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 25,
          }}
        >
          {[...testimonialsBottom, ...testimonialsBottom].map((t, i) => (
            <TestimonialCard key={`bottom-${i}`} testimonial={t} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
