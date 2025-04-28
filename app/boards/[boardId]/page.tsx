"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

type BoardDetails = {
  id: string;
  name: string;
  description: string;
  columns: {
    id: string;
    name: string;
    tasks: {
      id: string;
      title: string;
      status: string;
    }[];
  }[];
};

export default function BoardPage() {
  const { boardId } = useParams();
  const [board, setBoard] = useState<BoardDetails | null>(null);
  // ... состояния загрузки

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/boards/${boardId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        });
        const data = await response.json();
        setBoard(data);
      } catch (error) {
        console.error("Error fetching board:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, [boardId]);

  return (
    <div className="min-h-screen bg-[#121212] p-8 text-white">
      {/* ... шапка как в boards/page.tsx */}
      
      {board && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          <div className="bg-[#1A1A1A] p-6 rounded-xl">
            <h1 className="text-3xl font-bold mb-2">{board.name}</h1>
            <p className="text-gray-400">{board.description}</p>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4">
            {board.columns.map((column) => (
              <motion.div
                key={column.id}
                className="bg-[#1A1A1A] p-4 rounded-xl min-w-[300px]"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-xl font-semibold mb-4">{column.name}</h3>
                <div className="space-y-3">
                  {column.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-[#252525] p-3 rounded-lg hover:bg-[#2e2e2e] transition-colors"
                    >
                      <p>{task.title}</p>
                      <span className="text-xs text-[#3D8BFF]">
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}