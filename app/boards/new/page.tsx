"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewBoardPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch("http://localhost:8080/api/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, isPrivate }),
      });

      if (response.ok) {
        const board = await response.json();
        router.push(`/boards/${board.id}`);
      }
    } catch {
      alert("Ошибка создания доски");
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] p-8 text-white">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Создать доску</h1>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Название"
            className="w-full p-3 bg-[#1A1A1A] rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Описание"
            className="w-full p-3 bg-[#1A1A1A] rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
            Приватная доска
          </label>
          <button
            onClick={handleSubmit}
            className="bg-[#3D8BFF] px-6 py-3 rounded-lg"
          >
            Создать
          </button>
        </div>
      </div>
    </div>
  );
}
