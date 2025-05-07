"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type FieldErrors = {
  email?: string;
  login?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
};

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: bigint;
  email: string;
};

const API_URL = "http://localhost:8080/api";
const AUTH_URI = `${API_URL}/auth`;

const slideVariants = {
  hiddenRight: { x: "100%", opacity: 0 },
  hiddenLeft: { x: "-100%", opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
  exit: { x: "-50%", opacity: 0, transition: { duration: 0.2 } },
};

const fadeVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<0 | 1 | 2 | 3>(1);
  const [login, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (prev.email && email) delete newErrors.email;
      if (prev.login && login) delete newErrors.login;
      if (prev.password && password) delete newErrors.password;
      if (prev.confirmPassword && confirmPassword)
        delete newErrors.confirmPassword;
      delete newErrors.general;
      return newErrors;
    });
  }, [email, login, password, confirmPassword]);

  const validateStep = useCallback(() => {
    const newErrors: FieldErrors = { ...errors };

    if (step === 0) {
      delete newErrors.email;
      delete newErrors.password;
    }
    if (step === 1) delete newErrors.email;
    if (step === 2) delete newErrors.login;
    if (step === 3) {
      delete newErrors.password;
      delete newErrors.confirmPassword;
    }

    if (step === 0) {
      const emailValid =
        (email.includes("@") && email.includes(".")) || email.length > 3;
      if (!emailValid) {
        setErrors({
          general: "Введите email или логин",
        });
        return false;
      }
    }

    if (step === 1 && (!email.includes("@") || !email.includes("."))) {
      newErrors.email = "Некорректный email";
    }

    if (step === 2 && login.length < 3) {
      newErrors.login = "Минимум 3 символа";
    }

    if (step === 3) {
      if (password.length < 6) newErrors.password = "Минимум 6 символов";
      if (password !== confirmPassword)
        newErrors.confirmPassword = "Пароли не совпадают";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [confirmPassword, email, errors, login.length, password, step]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      validateStep();
    }
  }, [email, login, password, confirmPassword, step, validateStep, errors]);

  const handleAuthSuccess = (tokens: AuthResponse) => {
    localStorage.setItem("access_token", tokens.accessToken);
    localStorage.setItem("refresh_token", tokens.refreshToken);

    const urlParams = new URLSearchParams(window.location.search);
    const refTo = urlParams.get("ref_to") || "/boards";
    router.push(refTo);
  };

  const handleSubmit = async () => {
    if (!validateStep() || isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (step === 3) {
        const response = await fetch(`${AUTH_URI}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, login, password }),
        });
        console.log(response);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Ошибка регистрации");
        }

        const data: AuthResponse = await response.json();
        handleAuthSuccess(data);
      }

      if (step === 0) {
        const authData = email.includes("@")
          ? { email, password }
          : { login: email, password };

        const response = await fetch(`${AUTH_URI}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(authData),
        });

        // const response = await fetch(`${API_URL}/login`, {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },

        //   body: JSON.stringify({ email, password }),
        // });

        /*
        const handleSubmit = async () => {
          if (step === 0) {


          }
          */

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Ошибка входа");
        }

        const data: AuthResponse = await response.json();
        handleAuthSuccess(data);
      }

      if (step < 3 && step !== 0) setStep((prev) => (prev + 1) as typeof step);
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : "Неизвестная ошибка",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getButtonState = () => {
    const hasErrors = Object.keys(errors).length > 0;
    return {
      disabled: hasErrors || isSubmitting,
      className: `w-full py-3 px-4 rounded font-medium transition-colors ${
        hasErrors || isSubmitting
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-gray-700 hover:bg-gray-600 text-white"
      }`,
    };
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-between p-4">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex justify-center pt-8"
      >
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          className="w-[50px] h-[50px] bg-[#121212] rounded-lg flex items-center justify-center"
        >
          <Image
            src="/logo.png"
            alt="logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </motion.div>
      </motion.header>

      <div className="w-full max-w-xs">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#1A1A1A] rounded-xl p-6 shadow-xl border border-[#333] relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {errors.general && (
              <motion.div
                key="general-error"
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="mb-4 text-red-400 text-sm text-center"
              >
                {errors.general}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={slideVariants}
              initial="hiddenRight"
              animate="visible"
              exit="exit"
            >
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                {step === 0 ? "Вход" : "Создать ID"}
              </h2>

              {step === 0 && (
                <>
                  <motion.div className="mb-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className={`w-full px-4 py-3 bg-[#222] text-white rounded border ${
                        errors.email ? "border-red-500" : "border-[#333]"
                      } focus:outline-none`}
                    />
                    <AnimatePresence>
                      {errors.email && (
                        <motion.span
                          variants={fadeVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="text-red-400 text-xs mt-1 block"
                        >
                          {errors.email}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div className="mb-6">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Пароль"
                      className={`w-full px-4 py-3 bg-[#222] text-white rounded border ${
                        errors.password ? "border-red-500" : "border-[#333]"
                      } focus:outline-none`}
                    />
                    <AnimatePresence>
                      {errors.password && (
                        <motion.span
                          variants={fadeVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="text-red-400 text-xs mt-1 block"
                        >
                          {errors.password}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </>
              )}

              {step === 1 && (
                <motion.div className="mb-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className={`w-full px-4 py-3 bg-[#222] text-white rounded border ${
                      errors.email ? "border-red-500" : "border-[#333]"
                    } focus:outline-none`}
                  />
                  <AnimatePresence>
                    {errors.email && (
                      <motion.span
                        variants={fadeVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="text-red-400 text-xs mt-1 block"
                      >
                        {errors.email}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div className="mb-4">
                  <input
                    type="text"
                    value={login}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Никнейм"
                    className={`w-full px-4 py-3 bg-[#222] text-white rounded border ${
                      errors.login ? "border-red-500" : "border-[#333]"
                    } focus:outline-none`}
                  />
                  <AnimatePresence>
                    {errors.login && (
                      <motion.span
                        variants={fadeVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="text-red-400 text-xs mt-1 block"
                      >
                        {errors.login}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {step === 3 && (
                <>
                  <motion.div className="mb-4">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Пароль"
                      className={`w-full px-4 py-3 bg-[#222] text-white rounded border ${
                        errors.password ? "border-red-500" : "border-[#333]"
                      } focus:outline-none`}
                    />
                    <AnimatePresence>
                      {errors.password && (
                        <motion.span
                          variants={fadeVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="text-red-400 text-xs mt-1 block"
                        >
                          {errors.password}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div className="mb-6">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Подтвердите пароль"
                      className={`w-full px-4 py-3 bg-[#222] text-white rounded border ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-[#333]"
                      } focus:outline-none`}
                    />
                    <AnimatePresence>
                      {errors.confirmPassword && (
                        <motion.span
                          variants={fadeVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="text-red-400 text-xs mt-1 block"
                        >
                          {errors.confirmPassword}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
          <motion.button
            onClick={handleSubmit}
            disabled={getButtonState().disabled}
            className={getButtonState().className}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="inline-block"
              >
                ⌛
              </motion.span>
            ) : step === 3 ? (
              "Создать ID"
            ) : (
              "Продолжить"
            )}
          </motion.button>
          <motion.div className="mt-4 text-center">
            <motion.button
              onClick={() => {
                setStep(step === 0 ? 1 : 0);
                setErrors({});
              }}
              className="text-gray-400 hover:text-gray-300 text-sm transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {step === 0
                ? "Нет аккаунта? Зарегистрироваться"
                : "Уже есть аккаунт? Войти"}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-xs text-center text-gray-500 text-xs pb-4"
      >
        <p>Projektio — бара бара бере бере</p>
        <p className="mt-1">
          Нажимая Продолжить, вы соглашаетесь с нашими Условиями использования и
          Политикой конфиденциальности;
        </p>
      </motion.footer>
    </div>
  );
};

export default AuthPage;
