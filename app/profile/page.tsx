// app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import MainNavbar from "../components/MainNavbar";
import { motion } from "framer-motion";

interface UserProfile {
  id: number;
  login: string;
  email: string;
  created_at: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      setProfile(data);
    };
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <MainNavbar />
      <div className="container mx-auto p-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1A1A1A] rounded-xl p-6 border border-[#333]"
        >
          <h1 className="text-2xl font-bold mb-6">Профиль</h1>
          {profile && (
            <div className="space-y-4">
              <div>
                <label className="text-gray-400">ID:</label>
                <p className="text-lg">{profile.id}</p>
              </div>
              <div>
                <label className="text-gray-400">Логин:</label>
                <p className="text-lg">{profile.login}</p>
              </div>
              <div>
                <label className="text-gray-400">Email:</label>
                <p className="text-lg">{profile.email}</p>
              </div>
              <div>
                <label className="text-gray-400">Дата регистрации:</label>
                <p className="text-lg">
                  {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
