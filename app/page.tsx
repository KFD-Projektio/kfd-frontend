import React from "react";
import MainNavbar from "./components/MainNavbar"; // импортируем Navbar
import Link from "next/link";

const HomePage = () => {
  return (
    <>
      <MainNavbar />
      <section className="bg-black text-white py-50">
        <div className="container mx-auto px-5 font-bold">
          <h1 className="text-4xl font-bold text-center mb-4">Projektio</h1>
          <p className="text-xl text-center mb-8 opacity-80">
            Make your product better
          </p>
        </div>
      </section>

      <section className="bg-black text-white">
        <div className="flex justify-center py-80">
          <div className="max-w-3xl text-center bg-[#1a2833] p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">
              Tools for better team management
            </h2>
            <div className="flex gap-6 mb-6">
              <div className="flex-1 bg-[#2a3c47] p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Lorem Ipsum</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Ridiculus vivamus euismod velit facilisis vulputate mi
                  interdum.
                </p>
              </div>
              <div className="flex-1 bg-[#2a3c47] p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Ipsum Lorem</h3>
                <p>
                  Etiam eleifend magna nibh hendrerit urna viverra potenti est.
                  Curabitur dapibus habitasque augue ante fusce.
                </p>
                <Link
                  href="/details"
                  className="text-[#255970] hover:text-[#1b3a47]"
                >
                  More details
                </Link>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-1 bg-[#2a3c47] p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Lorem Ipsum</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Ridiculus vivamus euismod velit facilisis vulputate mi
                  interdum.
                </p>
              </div>
              <div className="flex-1 bg-[#2a3c47] p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Ipsum Lorem</h3>
                <p>
                  Etiam eleifend magna nibh hendrerit urna viverra potenti est.
                  Curabitur dapibus habitasque augue ante fusce.
                </p>
                <Link
                  href="/details"
                  className="text-[#255970] hover:text-[#1b3a47]"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Секция с прайсингом */}
      <section className="bg-[#1a2833] py-50">
        <div className="container mx-auto px-5 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Projektio Pricing
          </h2>
          <div className="flex justify-center gap-10">
            <div className="w-1/3 bg-[#2a3c47] p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">
                Standard Edition
              </h3>
              <p className="text-white mb-4">$FREE</p>
              <Link
                href="/pricing/standard"
                className="text-[#255970] hover:text-[#1b3a47]"
              >
                Check out for free
              </Link>
            </div>
            <div className="w-1/3 bg-[#2a3c47] p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">
                Small Business
              </h3>
              <p className="text-white mb-4">$20 per month</p>
              <Link
                href="/pricing/small-business"
                className="text-[#255970] hover:text-[#1b3a47]"
              >
                Check out for $20
              </Link>
            </div>
            <div className="w-1/3 bg-[#2a3c47] p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">
                Enterprise Edition
              </h3>
              <p className="text-white mb-4">Contact Us</p>
              <Link
                href="/contact"
                className="text-[#255970] hover:text-[#1b3a47]"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
