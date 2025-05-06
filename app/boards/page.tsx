"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

type BoardData = {
  id: number;
  boardName: string;
  boardDescription: string;
};

export default function BoardsPage() {
  const [boards, setBoards] = useState<BoardData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  console.log("Hello");
  useEffect(() => {
    const checkAuth = async () => {
      console.log("[1] Начало проверки авторизации");
      const token = localStorage.getItem("access_token");

      if (!token) {
        console.warn("[2] Токен отсутствует - редирект");
        router.push(`/auth?ref_to=${encodeURIComponent("/boards")}`);
        return;
      }

      try {
        console.log("[3] Проверка валидности токена", token);
        const userCheck = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        console.log("[4] Статус проверки токена:", userCheck.status);
        if (!userCheck.ok) {
          console.error("[5] Ошибка проверки токена:", await userCheck.text());
          throw new Error("Invalid token");
        }

        console.log("[6] Загрузка досок...");
        const boardsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/boards/current`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        console.log("[7] Статус загрузки досок:", boardsResponse.status);
        if (!boardsResponse.ok) {
          console.error("[8] Ошибка загрузки:", await boardsResponse.text());
          throw new Error("Failed to load boards");
        }

        const data = await boardsResponse.json();
        console.log("[9] Получены данные:", data);
        setBoards(data);
      } catch (error) {
        console.error("[10] Критическая ошибка:", error);
        localStorage.removeItem("access_token");
        router.push(`/auth?ref_to=${encodeURIComponent("/boards")}`);
      } finally {
        console.log("[11] Завершение загрузки");
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] p-8 text-white">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-[#1A1A1A] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] p-8 text-white">
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-2xl font-bold">Мои доски</h1>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            router.push("/profile");
          }}
          className="bg-[#3D8BFF] px-4 py-2 rounded"
        >
          Профиль
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#3D8BFF] px-4 py-2 rounded-lg"
          onClick={() => router.push("/boards/new")}
        >
          + Новая доска
        </motion.button>
      </div>

      {boards.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          У вас пока нет досок
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => (
            <motion.div
              key={board.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={`/boards/${board.id}`}
                className="block bg-[#1A1A1A] p-6 rounded-xl border border-[#333] hover:border-[#3D8BFF] transition-colors"
              >
                <h3 className="text-xl font-semibold mb-2">
                  {board.boardName}
                </h3>
                <p className="text-gray-400">
                  {board.boardDescription || "Без описания"}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
