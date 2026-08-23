"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Compass,
} from "lucide-react";
import { adminApi } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await adminApi.login(identifier.trim(), password);
      if (res && res.accessToken) {
        if (typeof window !== "undefined") {
          localStorage.setItem("polaris_admin_token", res.accessToken);
          localStorage.setItem("polaris_admin_user", JSON.stringify(res.user));
        }
        setSuccessMessage("Authentication successful! Redirecting to management hub...");
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 600);
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setErrorMessage(
        err.message || "Invalid username or password. Please verify your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (user: string, pass: string) => {
    setIdentifier(user);
    setPassword(pass);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-[#081F38] flex flex-col justify-center items-center px-4 sm:px-6 py-12 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#1A5695]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#0F2E59]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-[#0F2E59] to-[#1A5695] border border-blue-400/30 text-white shadow-xl mb-2">
            <Compass className="h-7 w-7 animate-pulse text-blue-200" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Polaris Admin Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xs mx-auto">
            Secure Swiss Healthcare Administration & Caregiver Guidance Management
          </p>
        </div>

        {/* Login Form Card */}
        <div className="rounded-3xl bg-white/95 backdrop-blur-xl p-8 sm:p-10 border border-white/20 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Staff Portal
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Swiss FADP Encrypted</span>
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="flex items-start gap-2.5 rounded-2xl bg-rose-50 p-3.5 border border-rose-200 text-xs text-rose-700 animate-in fade-in duration-200">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <p className="leading-snug">{errorMessage}</p>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-50 p-3.5 border border-emerald-200 text-xs text-emerald-700 animate-in fade-in duration-200">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <p className="font-semibold">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username or Email */}
            <div className="space-y-1.5">
              <label htmlFor="identifier" className="block text-xs font-bold text-slate-700">
                Username or Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="identifier"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin or nadibsoft@gmail.com"
                  className="w-full rounded-xl bg-[#F4F7FB] pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2E59] border border-slate-200 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="passwordField" className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <span className="text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="passwordField"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl bg-[#F4F7FB] pl-10 pr-11 py-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2E59] border border-slate-200 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#0F2E59] rounded-md cursor-pointer"
                />
                <span>Keep me signed in</span>
              </label>

              <span className="text-[11px] font-medium text-slate-400">JWT 24h</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F2E59] hover:bg-[#0A2244] text-white py-3.5 text-xs sm:text-sm font-bold shadow-lg shadow-[#0F2E59]/20 transition-all cursor-pointer disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Hub</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo 1-Click Fill Helpers */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <KeyRound className="h-3 w-3 text-[#1A5695]" />
              <span>Quick Demo Accounts (1-Click Fill)</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill("admin", "NADIBRANA")}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50/60 text-left transition-colors cursor-pointer group"
              >
                <p className="text-xs font-bold text-[#0C2B4E] group-hover:text-[#1A5695]">
                  Super Admin
                </p>
                <p className="text-[10px] text-slate-400 font-mono">admin / NADIBRANA</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill("meier_advisor", "NADIBRANA")}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50/60 text-left transition-colors cursor-pointer group"
              >
                <p className="text-xs font-bold text-[#0C2B4E] group-hover:text-[#1A5695]">
                  Zurich Advisor
                </p>
                <p className="text-[10px] text-slate-400 font-mono">meier_advisor</p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-500">
          Polaris Care Admin &bull; Protected under Swiss Federal Act on Data Protection (FADP)
        </p>
      </div>
    </div>
  );
}
