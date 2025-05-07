"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { FiPlus, FiTrash2, FiX } from "react-icons/fi";
import ReactModal from "react-modal";

if (typeof window !== "undefined") {
  ReactModal.setAppElement("#__next");
}

type TaskWithColumn = CardData & { columnId: number };

interface ColumnData {
  id: number;
  title: string;
  columnPosition: number;
  cards: CardData[];
}

interface CardData {
  id: number;
  title: string;
  description?: string;
}

interface BoardData {
  boardName: string;
  columns?: ColumnData[];
}

export default function BoardDetailPage() {
  const [board, setBoard] = useState<BoardData>({ boardName: "" });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [selectedColumn, setSelectedColumn] = useState<ColumnData | null>(null);
  const router = useRouter();
  const params = useParams();
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDescription, setNewCardDescription] = useState("");
  const [selectedColumnForCard, setSelectedColumnForCard] =
    useState<ColumnData | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userIdInput, setUserIdInput] = useState("");
  const [userAction, setUserAction] = useState<
    "add" | "change-owner" | "remove"
  >("add");

  const handleAddCard = async () => {
    const token = localStorage.getItem("access_token");
    const boardId = Array.isArray(params.id) ? params.id[0] : params.id;

    console.log(boardId);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newCardTitle,
          description: newCardDescription,
          columnId: selectedColumnForCard?.id,
          boardId: boardId,
          createdBy: 0, // не играет роли мискилк
        }),
      });
      if (response.ok) {
        // Обновить список задач в колонке
        fetchBoardData();
        setShowAddCardModal(false);
        setNewCardTitle(""); // ⬅️ ОЧИСТКА ПОЛЕЙ
        setNewCardDescription(""); // ⬅️ ОЧИСТКА ПОЛЕЙ
      }
    } catch (error) {
      console.error("Ошибка создания задачи:", error);
    }
  };

  // Стили для модальных окон
  const modalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      background: "#1A1A1A",
      border: "1px solid #333",
      borderRadius: "12px",
      padding: "24px",
      color: "white",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
    },
  };

  const handleDeleteCard = async (taskId: number) => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        fetchBoardData();
      }
    } catch (error) {
      console.error("Ошибка удаления задачи:", error);
    }
  };

  const fetchBoardData = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    const boardId = Array.isArray(params.id) ? params.id[0] : params.id;

    if (!token || !boardId) {
      router.push(
        `/auth?ref_to=${encodeURIComponent(window.location.pathname)}`,
      );
      return;
    }

    try {
      const userCheck = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!userCheck.ok) throw new Error("Ошибка авторизации");

      const [boardRes, columnsRes, tasksRes] = await Promise.all([
        fetch(`http://localhost:8080/api/boards/${boardId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://localhost:8080/api/boards/${boardId}/columns`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://localhost:8080/api/tasks?boardId=${boardId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!boardRes.ok || !columnsRes.ok) throw new Error("Ошибка загрузки");

      const boardData = await boardRes.json();
      const columnsData = await columnsRes.json();
      const tasksData = await tasksRes.json();

      const columnsWithCards = columnsData.map((column: ColumnData) => ({
        ...column,
        cards: tasksData.filter(
          (task: TaskWithColumn) => task.columnId === column.id,
        ),
      }));

      setBoard({
        boardName: boardData.boardName || "Без названия",
        columns: columnsWithCards.sort(
          (a: ColumnData, b: ColumnData) => a.columnPosition - b.columnPosition,
        ),
      });
    } catch (error) {
      console.error(error);
      router.push("/boards");
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    fetchBoardData();
  }, [params.id, fetchBoardData]);

  const handleAddColumn = async () => {
    if (!newColumnTitle) return;

    const token = localStorage.getItem("access_token");
    const boardId = Array.isArray(params.id) ? params.id[0] : params.id;

    try {
      const response = await fetch(
        `http://localhost:8080/api/boards/${boardId}/columns`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: newColumnTitle }),
        },
      );

      if (!response.ok) throw new Error("Ошибка создания");

      const newColumn = await response.json();
      setBoard((prev) => ({
        ...prev,
        columns: [...(prev.columns || []), { ...newColumn, cards: [] }],
      }));
      setShowAddModal(false);
      setNewColumnTitle("");
    } catch (error) {
      console.error("Ошибка создания колонки:", error);
      alert("Не удалось создать колонку");
    }
  };

  const handleUserAction = async () => {
    const token = localStorage.getItem("access_token");
    const boardId = Array.isArray(params.id) ? params.id[0] : params.id;

    try {
      const method =
        userAction === "add"
          ? "POST"
          : userAction === "change-owner"
            ? "PUT"
            : "DELETE";

      const response = await fetch(
        `http://localhost:8080/api/boards/${boardId}/users`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: Number(userIdInput) }),
        },
      );

      if (response.ok) {
        const updatedBoard = await response.json();
        setBoard((prev) => ({ ...prev, userIds: updatedBoard.userIds }));
        setShowUserModal(false);
        setUserIdInput("");
      }
    } catch (error) {
      console.error("Ошибка выполнения действия:", error);
    }
  };

  const handleDeleteColumn = async () => {
    if (!selectedColumn) return;

    const token = localStorage.getItem("access_token");
    const boardId = Array.isArray(params.id) ? params.id[0] : params.id;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/boards/${boardId}/columns/${selectedColumn.columnPosition}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Ошибка удаления");

      setBoard((prev) => ({
        ...prev,
        columns: prev.columns?.filter((col) => col.id !== selectedColumn.id),
      }));
      setShowDeleteModal(false);
      setSelectedColumn(null);
    } catch (error) {
      console.error("Ошибка удаления колонки:", error);
      alert("Не удалось удалить колонку");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] p-8 text-white">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-[#1A1A1A] rounded-xl w-1/3 mb-8" />
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-72 h-64 bg-[#1A1A1A] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] p-8 text-white">
      <ReactModal
        isOpen={showUserModal}
        onRequestClose={() => setShowUserModal(false)}
        style={modalStyles}
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {userAction === "add" && "Добавить пользователя"}
              {userAction === "change-owner" && "Изменить владельца"}
              {userAction === "remove" && "Удалить пользователя"}
            </h2>
            <button
              onClick={() => setShowUserModal(false)}
              className="text-gray-400 hover:text-white"
            >
              <FiX size={24} />
            </button>
          </div>
          <input
            type="number"
            placeholder="ID пользователя"
            className="w-full p-3 bg-[#222] rounded border border-[#333] focus:outline-none"
            value={userIdInput}
            onChange={(e) => setUserIdInput(e.target.value)}
          />
          <button
            onClick={handleUserAction}
            className="bg-[#3D8BFF] px-4 py-2 rounded-lg hover:bg-[#2B6BB5]"
          >
            Подтвердить
          </button>
        </div>
      </ReactModal>

      {/* Модальное окно добавления карточки */}
      <ReactModal
        isOpen={showAddCardModal}
        onRequestClose={() => setShowAddCardModal(false)}
        style={modalStyles}
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Новая карточка</h2>
            <button
              onClick={() => setShowAddCardModal(false)}
              className="text-gray-400 hover:text-white"
            >
              <FiX size={24} />
            </button>
          </div>
          <input
            type="text"
            placeholder="Название карточки"
            className="w-full p-3 bg-[#222] rounded border border-[#333] focus:outline-none focus:border-[#3D8BFF]"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            autoFocus
          />
          <textarea
            placeholder="Описание"
            className="w-full p-3 bg-[#222] rounded border border-[#333] focus:outline-none focus:border-[#3D8BFF]"
            value={newCardDescription}
            onChange={(e) => setNewCardDescription(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setShowAddCardModal(false)}
              className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500"
            >
              Отмена
            </button>
            <button
              onClick={handleAddCard}
              className="px-4 py-2 rounded-lg bg-[#3D8BFF] hover:bg-[#2B6BB5]"
            >
              Создать
            </button>
          </div>
        </div>
      </ReactModal>

      {/* Модальное окно добавления */}
      <ReactModal
        isOpen={showAddModal}
        onRequestClose={() => setShowAddModal(false)}
        style={modalStyles}
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Новая колонка</h2>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-gray-400 hover:text-white"
            >
              <FiX size={24} />
            </button>
          </div>
          <input
            type="text"
            placeholder="Название колонки"
            className="w-full p-3 bg-[#222] rounded border border-[#333] focus:outline-none focus:border-[#3D8BFF]"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500"
            >
              Отмена
            </button>
            <button
              onClick={handleAddColumn}
              className="px-4 py-2 rounded-lg bg-[#3D8BFF] hover:bg-[#2B6BB5]"
            >
              Создать
            </button>
          </div>
        </div>
      </ReactModal>

      {/* Модальное окно удаления */}
      <ReactModal
        isOpen={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
        style={modalStyles}
      >
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold mb-4">Удалить колонку</h2>
          <p>
            Вы уверены что хотите удалить колонку &quot;{selectedColumn?.title}
            &quot;?
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500"
            >
              Отмена
            </button>
            <button
              onClick={handleDeleteColumn}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500"
            >
              Удалить
            </button>
          </div>
        </div>
      </ReactModal>

      {/* Остальной интерфейс */}
      <div className="flex justify-between items-start mb-8">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold"
        >
          {board.boardName}
        </motion.h1>

        {/* В разделе с заголовком доски */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#3D8BFF] px-4 py-2 rounded-lg"
            onClick={() => {
              setUserAction("add");
              setShowUserModal(true);
            }}
          >
            + Пользователь
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-yellow-600 px-4 py-2 rounded-lg"
            onClick={() => {
              setUserAction("change-owner");
              setShowUserModal(true);
            }}
          >
            Сменить владельца
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-600 px-4 py-2 rounded-lg"
            onClick={() => {
              setUserAction("remove");
              setShowUserModal(true);
            }}
          >
            - Пользователь
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#3D8BFF] px-4 py-2 rounded-lg"
          onClick={() => router.push("/boards")}
        >
          ← Все доски
        </motion.button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 items-start h-[calc(100vh-160px)]">
        {board.columns?.map((column) => (
          <motion.div
            key={column.id}
            className="min-w-[300px] bg-[#1A1A1A] p-4 rounded-xl border border-[#333] flex flex-col"
            style={{ height: "calc(50vh - 60px)" }}
          >
            {/* Заголовок с кнопкой удаления */}
            <div className="flex justify-between items-center mb-4 group relative">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <h3 className="font-semibold truncate pr-8">{column.title}</h3>
                <span className="text-sm text-gray-400 flex-shrink-0">
                  #{column.columnPosition + 1}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedColumn(column);
                  setShowDeleteModal(true);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100
                                transition-opacity text-gray-400 hover:text-red-500 p-1 z-10"
              >
                <FiTrash2 size={18} />
              </button>
            </div>

            {/* Область карточек */}
            {/* <div className="space-y-2 flex-1 overflow-y-auto">
              {column.cards?.map((card) => (
                <motion.div
                  key={card.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-3 bg-[#222] rounded-lg border border-[#333] cursor-pointer"
                >
                  <p className="text-sm">{card.title}</p>
                  {card.description && (
                    <p className="text-xs text-gray-400 mt-1">
                      {card.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </div> */}

            <div className="space-y-2 flex-1 overflow-y-auto">
              {column.cards?.map((card) => (
                <motion.div
                  key={card.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-3 bg-[#222] rounded-lg border border-[#333] cursor-pointer relative group"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCard(card.id);
                    }}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300"
                  >
                    <FiTrash2 size={14} />
                  </button>

                  <p className="text-sm">{card.title}</p>
                  {card.description && (
                    <p className="text-xs text-gray-400 mt-1">
                      {card.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
            <button
              onClick={() => {
                setSelectedColumnForCard(column); // ⬅️ УСТАНАВЛИВАЕМ ТЕКУЩУЮ КОЛОНКУ
                setShowAddCardModal(true);
              }}
              className="mt-4 p-2 text-gray-400 hover:text-white transition-colors"
            >
              + Добавить карточку
            </button>
          </motion.div>
        ))}

        {/* Кнопка добавления колонки */}
        <div className="min-w-[300px]" style={{ height: "calc(50vh - 60px)" }}>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full h-full bg-[#1A1A1A] hover:bg-[#252525] transition-colors
                            rounded-xl border-2 border-dashed border-[#3D8BFF] flex items-center justify-center"
          >
            <FiPlus className="w-8 h-8 text-[#3D8BFF]" />
          </button>
        </div>
      </div>
    </div>
  );
}
