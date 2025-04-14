"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type FieldErrors = {
  email?: string;
  nickname?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
};

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<0 | 1 | 2 | 3>(1);
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const router = useRouter();

  const validateStep = () => {
    const newErrors: FieldErrors = {};

    if (step === 0) {
      if (!email.includes("@") || !email.includes("."))
        newErrors.email = "Некорректный email";
      if (password.length < 6) newErrors.password = "Пароль слишком короткий";
    }

    if (step === 1 && (!email.includes("@") || !email.includes("."))) {
      newErrors.email = "Некорректный email";
    }

    if (step === 2 && nickname.length < 3) {
      newErrors.nickname = "Минимум 3 символа";
    }

    if (step === 3) {
      if (password.length < 6) newErrors.password = "Минимум 6 символов";
      if (password !== confirmPassword)
        newErrors.confirmPassword = "Пароли не совпадают";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    try {
      if (step === 3) {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, nickname, password }),
        });
        if (response.ok) router.push("/boards");
      }

      if (step === 0) {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (response.ok) router.push("/boards");
      }

      if (step < 3 && step !== 0) setStep((prev) => (prev + 1) as typeof step);
    } catch (error) {
      setErrors({ general: "Ошибка соединения. Попробуйте позже" });
    }
  };

  const getButtonState = () => {
    const hasErrors = Object.keys(errors).length > 0;
    return {
      disabled: hasErrors,
      className: `w-full py-3 px-4 rounded font-medium transition-colors ${
        hasErrors
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-gray-700 hover:bg-gray-600 text-white"
      }`,
    };
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-between p-4">
      <header className="w-full flex justify-center pt-8">
        <div className="w-[50px] h-[50px] bg-[#121212] rounded-lg flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Melonity ID"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
      </header>

      <div className="w-full max-w-xs">
        <div className="bg-[#1A1A1A] rounded-xl p-6 shadow-xl border border-[#333]">
          {errors.general && (
            <div className="mb-4 text-red-400 text-sm text-center">
              {errors.general}
            </div>
          )}

          <h2 className="text-2xl font-bold text-white text-center mb-6">
            {step === 0 ? "Вход" : "Создать ID"}
          </h2>

          {/* Шаг 0: Вход */}
          {step === 0 && (
            <>
              <div className="mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className={`w-full px-4 py-3 bg-[#222] text-white rounded border ${
                    errors.email ? "border-red-500" : "border-[#333]"
                  } focus:outline-none`}
                />
                {errors.email && (
                  <span className="text-red-400 text-xs mt-1 block">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="mb-6">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Пароль"
                  className={`w-full px-4 py-3 bg-[#222] text-white rounded border ${
                    errors.password ? "border-red-500" : "border-[#333]"
                  } focus:outline-none`}
                />
                {errors.password && (
                  <span className="text-red-400 text-xs mt-1 block">
                    {errors.password}
                  </span>
                )}
              </div>
            </>
          )}

          {/* Шаги регистрации */}
          {step === 1 && (
            <div className="mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={`w-full px-4 py-3 bg-[#222] text-white rounded border ${
                  errors.email ? "border-red-500" : "border-[#333]"
                } focus:outline-none`}
              />
              {errors.email && (
                <span className="text-red-400 text-xs mt-1 block">
                  {errors.email}
                </span>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="mb-4">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Никнейм"
                className={`w-full px-4 py-3 bg-[#222] text-white rounded border ${
                  errors.nickname ? "border-red-500" : "border-[#333]"
                } focus:outline-none`}
              />
              {errors.nickname && (
                <span className="text-red-400 text-xs mt-1 block">
                  {errors.nickname}
                </span>
              )}
            </div>
          )}

          {step === 3 && (
            <>
              <div className="mb-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Пароль"
                  className={`w-full px-4 py-3 bg-[#222] text-white rounded border ${
                    errors.password ? "border-red-500" : "border-[#333]"
                  } focus:outline-none`}
                />
                {errors.password && (
                  <span className="text-red-400 text-xs mt-1 block">
                    {errors.password}
                  </span>
                )}
              </div>

              <div className="mb-6">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Подтвердите пароль"
                  className={`w-full px-4 py-3 bg-[#222] text-white rounded border ${
                    errors.confirmPassword ? "border-red-500" : "border-[#333]"
                  } focus:outline-none`}
                />
                {errors.confirmPassword && (
                  <span className="text-red-400 text-xs mt-1 block">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
            </>
          )}

          <button
            onClick={handleSubmit}
            disabled={getButtonState().disabled}
            className={getButtonState().className}
          >
            {step === 3 ? "Создать ID" : "Продолжить"}
          </button>

          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setStep(step === 0 ? 1 : 0);
                setErrors({});
              }}
              className="text-gray-400 hover:text-gray-300 text-sm transition-colors"
            >
              {step === 0
                ? "Нет аккаунта? Зарегистрироваться"
                : "Уже есть аккаунт? Войти"}
            </button>
          </div>
        </div>
      </div>

      <footer className="w-full max-w-xs text-center text-gray-500 text-xs pb-4">
        <p>Melonity ID — единый вход для всех проектов</p>
        <p className="mt-1">
          Нажимая "Продолжить", вы соглашаетесь с нашими Условиями использования
          и Политикой конфиденциальности
        </p>
      </footer>
    </div>
  );
};

export default AuthPage;
