"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface AdminPasswordScreenProps {
  onAuthenticated: () => void;
}

export function AdminPasswordScreen({ onAuthenticated }: AdminPasswordScreenProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Automatically focus the input when the screen loads
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPassword = password.trim();

    if (cleanPassword === "swati") {
      setError(false);
      try {
        sessionStorage.setItem("admin_auth", "swati");
        localStorage.setItem("admin_auth", "swati");
      } catch {
        // ignore storage errors
      }
      onAuthenticated();
    } else {
      setError(true);
      setErrorMessage("كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى");
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setPassword("");
      inputRef.current?.focus();
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#0c1829] to-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white font-sans"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle geometric grid backdrop */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M0 0h40v40H0z' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Main Glassmorphic Card */}
      <div
        className={`w-full max-w-md relative z-10 bg-white/[0.04] backdrop-blur-2xl border border-white/[0.1] rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/60 transition-transform duration-200 ${
          shake ? "animate-[shake_0.5s_ease-in-out]" : ""
        }`}
        style={{
          animation: shake
            ? "shake 0.5s cubic-bezier(.36,.07,.19,.97) both"
            : undefined,
        }}
      >
        <style jsx>{`
          @keyframes shake {
            10%, 90% { transform: translate3d(-2px, 0, 0); }
            20%, 80% { transform: translate3d(4px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
            40%, 60% { transform: translate3d(6px, 0, 0); }
          }
        `}</style>

        {/* Top Header & Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 p-2.5 flex items-center justify-center shadow-inner group">
              <img
                src="/chamber-logo.png"
                alt="شعار الغرفة"
                className="w-full h-full object-contain filter drop-shadow-md"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-500 border-2 border-slate-900 flex items-center justify-center text-[10px] text-white">
              🔒
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            لوحة الإدارة الآمنة
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            تسجيل الدخول إلى لوحة التحكم
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
            الرجاء إدخال كلمة المرور للوصول إلى إعدادات النظام
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              كلمة المرور
            </label>

            <div className="relative">
              {/* Lock Icon */}
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>

              <input
                ref={inputRef}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="أدخل كلمة المرور..."
                className={`w-full bg-white/[0.07] text-white placeholder-slate-500 text-sm rounded-xl py-3 pr-11 pl-11 border outline-hidden transition-all duration-200 ${
                  error
                    ? "border-rose-500 ring-2 ring-rose-500/20"
                    : "border-white/15 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                }`}
                autoComplete="current-password"
                required
              />

              {/* Show / Hide Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>

            {error && (
              <p className="mt-2 text-xs font-semibold text-rose-400 flex items-center gap-1.5 animate-fadeIn">
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {errorMessage}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/25 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>تسجيل الدخول</span>
            <svg
              className="w-4 h-4 rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/[0.08] text-center">
          <a
            href="/"
            className="text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors inline-flex items-center gap-1.5"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>العودة إلى الصفحة العامة للتحقق</span>
          </a>
        </div>
      </div>
    </div>
  );
}
