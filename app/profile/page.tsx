"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; // Добавляем импорт роутера

type UserData = {
  id: number;
  login: string;
  email: string;
  created_at: string;
};

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/auth"); // Перенаправляем на страницу авторизации
  };

  if (!userData)
    return (
      <div className="min-h-screen bg-[#121212] p-8 text-white">Loading...</div>
    );

  return (
    <div className="min-h-screen bg-[#121212] p-8 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-[#1A1A1A] p-6 rounded-xl"
      >
        <h1 className="text-2xl font-bold mb-6">Профиль</h1>
        <div className="space-y-4">
          <div>
            <label className="text-gray-400">ID пользователя:</label>
            <p className="text-white">{userData.id}</p>
          </div>
          <div>
            <label className="text-gray-400">Логин:</label>
            <p className="text-white">{userData.login}</p>
          </div>
          <div>
            <label className="text-gray-400">Email:</label>
            <p className="text-white">{userData.email}</p>
          </div>
          <div>
            <label className="text-gray-400">Дата регистрации:</label>
            <p className="text-white">
              {new Date(userData.created_at).toLocaleDateString()}
            </p>
          </div>
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full mt-6 py-3 px-4 rounded font-medium bg-red-600 hover:bg-red-500 transition-colors"
          >
            Выйти из аккаунта
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
