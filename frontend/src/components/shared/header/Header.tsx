'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { HiMenu, HiX } from 'react-icons/hi';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Airdrops', href: '/airdrops' },
  { label: 'Plans', href: '/plans' },
  { label: 'Partners', href: '/partners' },
  { label: 'Faq', href: '/faq' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
    const pathname = usePathname();


  const handleNavClick = (href: string) => {
    setMenuOpen(false);         // Close the mobile menu
    router.push(href);          // Navigate to selected page
  };

  return (
    <header className="bg-white shadow-md rounded-2xl my-6 px-6 py-3 w-11/12 max-w-6xl mx-auto z-50">
      <div className="flex items-center justify-between">
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
              <Link
                key={label}
                href={href}
                className={`transition font-medium hover:text-black ${
                  isActive ? 'text-[#8373EE] font-semibold' : 'text-gray-700'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/signin" className="text-black hover:bg-[#8373EE] hover:text-white font-semibold py-2 px-5 rounded-full transition">
            Sign In
          </Link>
          <Link
            href="/signup"
            className="bg-[#8373EE] hover:bg-black  text-white font-semibold py-2 px-5 rounded-full transition"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-2xl text-gray-800 cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
       {menuOpen && (
        <div className="md:hidden mt-4 space-y-4">
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
            className="block text-gray-800 font-medium"
          >
            Sign In
          </button>
          <button
            onClick={() => handleNavClick('/signup')}
            className="block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-5 rounded-full transition w-max"
          >
            Sign Up
          </button>
        </div>
      )}
    </header>
  );
}
