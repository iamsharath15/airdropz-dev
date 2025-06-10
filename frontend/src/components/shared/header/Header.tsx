'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { HiMenu, HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Airdrops', href: '/airdrops' },
  { label: 'Plans', href: '/plans' },
  { label: 'Partners', href: '/partners' },
  { label: 'Faq', href: '/faq' },
];

const MotionLink = motion(Link);

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavClick = (href: string) => {
    setMenuOpen(false); // Close menu with animation
    router.push(href);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      layout
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="bg-white shadow-md rounded-3xl my-6 md:px-4 px-3 md:py-3 py-2 md:w-10/12 w-11/12  max-w-10/12 mx-auto z-50 top-0 flex items-center justify-around flex-col fixed"
    >
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="https://airdropzofficial-static-v1.s3.ap-south-1.amazonaws.com/static-image-v1/airdropz-logo.png"
            alt="AirdropZ"
            width={100}
            height={50}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 pl-6">
          {navLinks.map(({ label, href }) => {
            const isActive = pathname === href;

            return (
              <MotionLink
                key={label}
                href={href}
                className={`transition font-medium ${
                  isActive ? 'text-[#8373EE] font-semibold' : 'text-black'
                }`}
                whileHover={{ scale: 1, y: -2 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                {label}
              </MotionLink>
            );
          })}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center space-x-2">
          <Link
            href="/login"
            className="text-black hover:bg-[#8373EE] hover:text-white font-semibold py-3 md:px-5 px-3 rounded-full transition text-sm"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-[#8373EE] hover:bg-[#8373EE]/90 text-white font-semibold py-3 md:px-5 px-3 rounded-full transition text-sm"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-2xl text-gray-800 cursor-pointer"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={menuOpen ? 'close' : 'menu'}
              initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="inline-block"
            >
              {menuOpen ? <HiX /> : <HiMenu />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Menu with animation */}
      <AnimatePresence mode="wait" initial={false}>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4 space-y-4 w-full px-4"
          >
            {navLinks.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <button
                  key={label}
                  onClick={() => handleNavClick(href)}
                  className={`block w-full text-left font-medium transition cursor-pointer ${
                    isActive ? 'text-[#8373EE] font-semibold' : 'text-gray-700'
                  } hover:text-black`}
                >
                  {label}
                </button>
              );
            })}
            <hr className="border-gray-300" />
            <button
              onClick={() => handleNavClick('/signin')}
              className="block text-gray-800 font-medium e="
            >
              Sign In
            </button>
            <button
              onClick={() => handleNavClick('/signup')}
              className="block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-5 rounded-full transition w-max"
            >
              Sign Up
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
