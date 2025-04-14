import React from "react";
import Link from "next/link";
import Image from "next/image";

const MainNavbar = () => {
  return (
    <div className="px-5 py-3 bg-black shadow-sm">
      <div
        className="px-5 py-2 gap-5 rounded-lg"
        style={{ backgroundColor: "#1a212a" }}
      >
        <nav className="flex justify-between items-center">
          {/* Левый блок - логотип и навигация */}
          <div className="flex items-center gap-10">
            <Link href="/">
              <Image src="/logo.png" alt="logo" width={70} height={15} />
            </Link>
            <div className="flex gap-6">
              <Link href="/#pricing" className="text-white hover:text-gray-300">
                Pricing
              </Link>
              <Link
                href="/#about-us"
                className="text-white hover:text-gray-300"
              >
                About us
              </Link>
            </div>
          </div>
          {/* Правый блок - кнопки */}
          <div className="flex gap-4">
            <Link
              href="/auth"
              className="px-4 py-2 rounded-lg shadow-2xs text-white transition-colors"
              style={{ backgroundColor: "#255970" }}
            >
              Sign in
            </Link>
            <Link
              href="/auth"
              className="px-4 py-2 rounded-lg text-white transition-colors"
              style={{ backgroundColor: "#255970" }}
            >
              Sign up
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MainNavbar;
