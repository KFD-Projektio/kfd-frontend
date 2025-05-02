"use client";
import React from "react";
import MainNavbar from "./components/MainNavbar";
import Link from "next/link";
import { motion } from "framer-motion";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const cardVariants = {
  hover: { scale: 1.03, transition: { duration: 0.3 } },
  tap: { scale: 0.98 },
};

const HomePage = () => {
  return (
    <div className="relative min-h-screen bg-[#121212]">
      <MainNavbar />

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] max-w-96 max-h-96 bg-[#3D8BFF]/20 blur-3xl rounded-full" />
        <div className="absolute bottom-[15%] left-[5%] w-[30vw] h-[30vw] max-w-72 max-h-72 bg-[#2B6BB5]/20 blur-3xl rounded-full" />
      </div>

      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="relative overflow-hidden  text-white z-10 pt-28 pb-40 px-4"
      >
        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <motion.h1
            className="text-5xl font-bold mb-6"
            whileHover={{ scale: 1.02 }}
          >
            Projektio
          </motion.h1>

          <p className="text-xl md:text-2xl opacity-90 mb-12 max-w-2xl mx-auto">
            Transform your product development
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block"
          >
            <Link
              href="/auth"
              className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-[#3D8BFF] to-[#2B6BB5] text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Start Now
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="relative z-10 py-24 px-4"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <div className="container mx-auto max-w-6xl i">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <motion.div
                key={item}
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                className="bg-[#1A1A1A] p-8 rounded-xl border border-[#333]"
              >
                <h3 className="text-xl font-semibold mb-4">
                  {item % 2 === 0 ? "Advanced Analytics" : "Task Management"}
                </h3>
                <p className="opacity-80 mb-4">
                  Leverage AI-powered insights to optimize your workflow and
                  resource allocation.
                </p>
                <Link
                  href="/details"
                  className="text-[#3D8BFF] hover:text-[#2B6BB5] transition-colors"
                >
                  Explore feature →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
