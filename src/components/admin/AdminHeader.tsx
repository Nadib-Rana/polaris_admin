"use client";

import React from "react";
import { Menu, Search, Bell, Download } from "lucide-react";

interface AdminHeaderProps {
  onToggleMobileMenu: () => void;
  title?: string;
  subtitle?: string;
}

export function AdminHeader({
  onToggleMobileMenu,
  title = "Overview",
  subtitle = "Swiss Elder Care & Caregiver Assessment Platform",
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-18 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-4 sm:px-8">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          aria-label="Open sidebar"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#0C2B4E] leading-tight">
            {title}
          </h1>
          <p className="hidden sm:block text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>

      {/* Right: Search, Swiss Badge, Notifications & Export */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Search Bar */}
        <div className="relative hidden md:block w-64 lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search assessments, cantons, leads..."
            className="w-full rounded-xl border border-slate-200 bg-[#F4F7FB] pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#1A5695] focus:outline-hidden transition-all"
          />
        </div>

        {/* Swiss Canton Indicator Badge */}
        <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Switzerland (26 Cantons)</span>
        </div>

        {/* Notifications Icon */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 hover:text-[#0C2B4E] transition-colors cursor-pointer"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
        </button>

        {/* Export Data Button */}
        <button
          type="button"
          onClick={() => alert("Exporting latest Care Compass assessment dataset (CSV)...")}
          className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border-2 border-[#0F2E59] bg-white px-3.5 py-1.5 text-xs font-bold text-[#0F2E59] hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export CSV</span>
        </button>
      </div>
    </header>
  );
}
