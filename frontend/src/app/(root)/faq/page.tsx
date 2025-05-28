"use client";

import Link from 'next/link';
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { faqData } from '../../../lib/constants/index';

const FaqPage = () => {
  const headerControls = useAnimation(); // Controls for header and subheader
  const categoriesControls = useAnimation(); // Controls for categories

  useEffect(() => {
    // Start header animations first
    const startAnimations = async () => {
      await headerControls.start('visible'); // Wait for header animations to complete
      categoriesControls.start('visible'); // Start categories animations
    };
    startAnimations();
  }, [headerControls, categoriesControls]);

  // Variants for header animation
  const headerVariant = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren", // Ensure child animations wait
        staggerChildren: 0.3, // Stagger child animations
      },
    },
  };

  // Variants for category animation (fade-in and slide-up)
  const categoryVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="bg-black flex flex-col items-center justify-start min-h-screen p-5 md:p-10">
      <div className="max-w-[1440px] w-11/12 md:w-9/12 flex flex-col items-center py-16">
        {/* Header Section */}
        <motion.div
          className="w-full text-center"
          initial="hidden"
          animate={headerControls}
          variants={headerVariant}
        >
          <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl font-semibold text-center text-white mb-4"
          >
            FAQ
          </motion.h1>
          <motion.p
            className="text-lg lg:text-xl text-center text-white mb-10"
          >
            Answers to your questions.
          </motion.p>
        </motion.div>

        {/* FAQ Categories */}
        <motion.div
          className="flex flex-wrap items-center justify-center w-full"
          initial="hidden"
          animate={categoriesControls}
          variants={{
            visible: {
              transition: { staggerChildren: 0.3 }, // Reveal each child one by one
            },
          }}
        >
          {faqData.map((category) => (
            <motion.div
              key={category.id}
              variants={categoryVariant} // Category animation
              className="w-full md:w-6/12 lg:w-4/12 p-2"
            >
              <Link href={`/faq/${category.id}`} passHref>
                <div className="border border-[#1A1A1A] rounded-lg p-6 hover:border-[#393838] transition duration-200 cursor-pointer w-full">
                  {/* Icon */}
                  <div className="w-3 h-3 bg-white rounded-full mb-4"></div>
                  {/* Title */}
                  <h2 className="text-lg md:text-2xl font-semibold text-white mb-2">
                    {category.title}
                  </h2>
                  {/* Description */}
                  <p className="text-gray-400 font-medium text-base md:text-lg mb-4">
                    {category.description}
                  </p>
                  {/* Articles Count */}
                  <p className="text-gray-500 text-sm md:text-lg">
                    {category.articles.length} articles
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FaqPage;
