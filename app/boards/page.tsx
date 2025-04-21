// app/boards/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type UserData = {
  login: string;
  email: string;
};

export default function BoardsPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const API_URL = "http://localhost:8080/api/";

  // Функция выхода
  const handleLogout = async () => {
    try {
      // Отправляем запрос на выход
      await fetch(`${API_URL}auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Очищаем хранилище и перенаправляем
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      router.push("/auth");
    }
  };

  // Проверка авторизации (существующий код)
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.push("/auth");
        return;
      }

      try {
        const response = await fetch(`${API_URL}users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          const data = await response.json();
          setUserData(data);
        } else {
          router.push("/auth");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <div className="p-4 text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#121212] p-8 text-white">
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-2xl">Boards Page</h1>

        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
        >
          Logout
        </motion.button>
      </div>

      <div className="mb-4 p-4 bg-[#1A1A1A] rounded-lg">
        <h2 className="text-green-400 mb-2">Frontend Authorization:</h2>
        <p>You're authorized on frontend</p>
      </div>

      {userData && (
        <div className="p-4 bg-[#1A1A1A] rounded-lg">
          <h2 className="text-green-400 mb-2">Backend Authorization:</h2>
          <p>{userData.login} authorized on backend</p>
          <p className="text-gray-400 mt-1">Email: {userData.email}</p>
        </div>
      )}
    </div>
  );
}
