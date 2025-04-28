// app/boards/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

type UserData = {
  login: string;
  email: string;
};

type Board = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

export default function BoardsPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
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
        // Проверка авторизации и получение данных пользователя
        const userResponse = await fetch(`${API_URL}users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userResponse.status === 200) {
          const userData = await userResponse.json();
          setUserData(userData);

          // Получение списка досок пользователя
          const boardsResponse = await fetch(`${API_URL}boards`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          if (boardsResponse.ok) {
            const boardsData = await boardsResponse.json();
            setBoards(boardsData);
          }
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

      <div className="mb-8 space-y-6">
        <div className="p-4 bg-[#1A1A1A] rounded-lg">
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

      <div className="mt-12">
        <h2 className="text-2xl mb-6">Your Boards</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <motion.div
              key={board.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#1A1A1A] p-6 rounded-xl border border-[#333] hover:border-[#3D8BFF]/50 transition-colors"
            >
              <Link href={`/boards/${board.id}`} className="block h-full">
                <h3 className="text-xl font-semibold mb-2">{board.name}</h3>
                <p className="text-gray-400 text-sm mb-3">{board.description}</p>
                <div className="text-[#3D8BFF] text-xs">
                  Created: {new Date(board.createdAt).toLocaleDateString()}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {boards.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-400">
            No boards found. Create your first board!
          </div>
        )}
      </div>
    </div>
  );
}