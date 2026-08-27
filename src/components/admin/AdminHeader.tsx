"use client";

import React, { useState } from "react";
import { Menu, Search, Bell, Download, ChevronDown, Globe } from "lucide-react";
import { useAdminLanguage } from "@/context/AdminLanguageContext";
import { cn } from "@/lib/utils";

interface AdminHeaderProps {
  onToggleMobileMenu: () => void;
  title?: string;
  subtitle?: string;
}

function FlagIcon({ code, className = "h-3.5 w-4.5 rounded-2xs overflow-hidden" }: { code: string; className?: string }) {
  if (code === "DE") {
    return (
      <svg className={className} viewBox="0 0 640 480">
        <path fill="#000" d="M0 0h640v160H0z" />
        <path fill="#d00" d="M0 160h640v160H0z" />
        <path fill="#ffce00" d="M0 320h640v160H0z" />
      </svg>
    );
  }
  if (code === "FR") {
    return (
      <svg className={className} viewBox="0 0 640 480">
        <path fill="#002395" d="M0 0h213.3v480H0z" />
        <path fill="#fff" d="M213.3 0h213.4v480H213.3z" />
        <path fill="#ed2939" d="M426.7 0H640v480H426.7z" />
      </svg>
    );
  }
  if (code === "IT") {
    return (
      <svg className={className} viewBox="0 0 640 480">
        <path fill="#009246" d="M0 0h213.3v480H0z" />
        <path fill="#fff" d="M213.3 0h213.4v480H213.3z" />
        <path fill="#ce2b37" d="M426.7 0H640v480H426.7z" />
      </svg>
    );
  }
  // US Flag
  return (
    <svg className={className} viewBox="0 0 640 480">
      <g fillRule="evenodd">
        <path fill="#bd3d44" d="M0 0h640v480H0z" />
        <path stroke="#fff" strokeWidth="37" d="M0 55.4h640M0 129.2h640M0 203h640M0 277h640M0 350.8h640M0 424.6h640" />
        <path fill="#192f5d" d="M0 0h256v258.5H0z" />
      </g>
    </svg>
  );
}

export function AdminHeader({
  onToggleMobileMenu,
  title,
  subtitle,
}: AdminHeaderProps) {
  const { lang, setLang, currentLanguage, languages, t } = useAdminLanguage();
  const [langOpen, setLangOpen] = useState(false);

  const displayTitle = title || t("overview.title");
  const displaySubtitle = subtitle || t("overview.subtitle");

  return (
    <header className="sticky top-0 z-30 flex h-18 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-3 sm:px-6 lg:px-8">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          aria-label="Open sidebar"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden cursor-pointer shrink-0"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg lg:text-xl font-bold text-[#0C2B4E] leading-tight truncate">
            {displayTitle}
          </h1>
          <p className="hidden md:block text-xs text-slate-500 truncate max-w-md">
            {displaySubtitle}
          </p>
        </div>
      </div>

      {/* Right: Language Selector, Search, Swiss Badge, Notifications & Export */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Search Bar (Desktop) */}
        <div className="relative hidden xl:block w-56 lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder={t("header.searchPlaceholder")}
            className="w-full rounded-xl border border-slate-200 bg-[#F4F7FB] pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#1A5695] focus:outline-hidden transition-all"
          />
        </div>

        {/* Swiss Multilingual Language Selector Dropdown (DE Default) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-slate-200 bg-[#F8FAFC] hover:bg-slate-100 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-[#0C2B4E] transition-colors cursor-pointer shadow-2xs"
            aria-label="Select admin language"
          >
            <FlagIcon code={currentLanguage.code} />
            <span className="hidden sm:inline">{currentLanguage.name}</span>
            <span className="sm:hidden">{currentLanguage.code}</span>
            <ChevronDown className="h-3 w-3 text-slate-500" />
          </button>

          {langOpen && (
            <div className="absolute right-0 mt-2 w-36 sm:w-40 rounded-2xl border border-slate-200 bg-white py-1.5 shadow-xl z-50 animate-in fade-in-50 zoom-in-95">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                Sprache / Language
              </div>
              {languages.map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => {
                    setLang(opt.lang);
                    setLangOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer",
                    currentLanguage.code === opt.code
                      ? "bg-[#F0F7FF] text-[#0F2E59] font-bold"
                      : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <FlagIcon code={opt.code} />
                    <span>{opt.name}</span>
                  </div>
                  {currentLanguage.code === opt.code && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                      Aktiv
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Swiss Canton Indicator Badge */}
        <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 sm:px-3 py-1 text-[11px] font-semibold text-slate-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{t("header.swissCoverage")}</span>
        </div>

        {/* Notifications Icon */}
        <button
          type="button"
          aria-label={t("header.notifications")}
          className="relative rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 hover:text-[#0C2B4E] transition-colors cursor-pointer"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
        </button>

        {/* Export Data Button */}
        <button
          type="button"
          onClick={() => alert(t("header.exportNotice"))}
          className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border-2 border-[#0F2E59] bg-white px-3 py-1.5 text-xs font-bold text-[#0F2E59] hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" />
          <span>{t("header.exportCsv")}</span>
        </button>
      </div>
    </header>
  );
}

