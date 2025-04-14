"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<0 | 1 | 2 | 3>(1);
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  // Обработчики отправки форм
  const handleSubmitEmail = () => {
    if (!validateEmail(email)) return;
    setStep(2);
  };

  const handleSubmitNickname = () => {
    if (nickname.length < 3) return;
    setStep(3);
  };

  const handleSubmitPassword = async () => {
    if (!validatePassword()) return;
    // Логика регистрации
  };

  const handleLogin = async () => {
    // Логика входа
  };

  // Валидации
  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = () =>
    password.length >= 6 && password === confirmPassword;

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      {/* Хедер с логотипом */}
      <header className="w-full py-4 flex justify-center border-b border-[#2a3c47]">
        <div className="w-[50px] h-[50px] relative">
          <Image
            src="/logo.png"
            alt="Melonity ID"
            fill
            className="object-contain"
          />
        </div>
      </header>

      {/* Основной контент */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#1a2833] rounded-lg p-8 shadow-xl transition-all duration-300">
          {/* Шаги форм */}
          <div className="relative h-96 overflow-hidden">
            {/* Форма входа (step 0) */}
            <div
              className={`absolute w-full transition-all duration-300 ${
                step === 0
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-full"
              }`}
            >
              <h2 className="text-2xl font-bold text-white text-center mb-8">
                Вход в Melonity ID
              </h2>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="form-input"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
                className="form-input"
              />
              <button onClick={handleLogin} className="form-button">
                Войти
              </button>
            </div>

            {/* Шаги регистрации */}
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`absolute w-full transition-all duration-300 ${
                  step === stepNumber
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-full"
                }`}
              >
                {stepNumber === 1 && (
                  <>
                    <h2 className="text-2xl font-bold text-white text-center mb-8">
                      Создать Melonity ID
                    </h2>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className="form-input"
                    />
                    <button onClick={handleSubmitEmail} className="form-button">
                      Продолжить
                    </button>
                  </>
                )}

                {stepNumber === 2 && (
                  <>
                    <h2 className="text-2xl font-bold text-white text-center mb-8">
                      Ваш никнейм
                    </h2>
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="Никнейм"
                      className="form-input"
                    />
                    <button
                      onClick={handleSubmitNickname}
                      className="form-button"
                    >
                      Продолжить
                    </button>
                  </>
                )}

                {stepNumber === 3 && (
                  <>
                    <h2 className="text-2xl font-bold text-white text-center mb-8">
                      Придумайте пароль
                    </h2>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Пароль"
                      className="form-input"
                    />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Повторите пароль"
                      className="form-input"
                    />
                    <button
                      onClick={handleSubmitPassword}
                      className="form-button"
                    >
                      Создать аккаунт
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Переключение между входом и регистрацией */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setStep((prev) => (prev === 0 ? 1 : 0))}
              className="text-[#255970] hover:text-[#1b3a47] text-sm transition-colors"
            >
              {step === 0
                ? "Нет аккаунта? Зарегистрироваться"
                : "Уже есть аккаунт? Войти"}
            </button>
          </div>
        </div>
      </main>

      {/* Футер */}
      <footer className="w-full py-4 text-center text-gray-400 text-xs border-t border-[#2a3c47]">
        <p>Melonity ID — единый вход для всех проектов</p>
        <p className="mt-1">
          Нажимая "Продолжить", вы соглашаетесь с нашими
          <a href="#" className="text-[#255970] hover:underline mx-1">
            Условиями использования
          </a>
          и
          <a href="#" className="text-[#255970] hover:underline mx-1">
            Политикой конфиденциальности
          </a>
        </p>
      </footer>

      {/* Стили */}
      <style jsx>{`
        .form-input {
          width: 100%;
          padding: 12px 16px;
          margin-bottom: 16px;
          background-color: #2a3c47;
          color: white;
          border: 1px solid #3a4c57;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #255970;
          box-shadow: 0 0 0 2px rgba(37, 89, 112, 0.3);
        }

        .form-button {
          width: 100%;
          padding: 14px;
          background-color: #255970;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .form-button:hover {
          background-color: #1b3a47;
        }
      `}</style>
    </div>
  );
};

export default AuthPage;
