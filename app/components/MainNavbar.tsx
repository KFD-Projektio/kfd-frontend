import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const MainNavbar = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 bg-[#121212]/95 backdrop-blur-md border-b border-[#333]"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <nav className="flex justify-between items-center h-16">
          {/* Левый блок */}
          <div className="flex items-center gap-12">
            <Link href="/" className="relative group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src="/logo.png"
                  alt="Projektio"
                  width={120}
                  height={28}
                  className="h-7 w-auto"
                />
              </motion.div>
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#3D8BFF] group-hover:w-full transition-all duration-300" />
            </Link>

            <div className="hidden lg:flex gap-8">
              <Link
                href="/#features"
                className="text-gray-300 hover:text-white transition-colors relative group"
              >
                Features
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#3D8BFF] group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href="/#pricing"
                className="text-gray-300 hover:text-white transition-colors relative group"
              >
                Pricing
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#3D8BFF] group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href="/#about"
                className="text-gray-300 hover:text-white transition-colors relative group"
              >
                About
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#3D8BFF] group-hover:w-full transition-all duration-300" />
              </Link>
            </div>
          </div>
          {/* Правый блок */}
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden lg:block"
            >
              <Link
                href="/auth"
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#3D8BFF] to-[#2B6BB5] text-white font-medium hover:opacity-90 transition-opacity"
              >
                Sign in
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2 text-gray-400 hover:text-white">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </nav>
      </div>
    </motion.header>
  );
};

export default MainNavbar;
