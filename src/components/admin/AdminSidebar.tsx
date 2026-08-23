"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  SlidersHorizontal,
  Inbox,
  Sparkles,
  MessageSquareQuote,
  Languages,
  Settings,
  ExternalLink,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Assessments",
    href: "/assessments",
    icon: Compass,
    badge: "12 New",
    badgeColor: "bg-[#EBF3FC] text-[#0F2E59]",
  },
  {
    title: "Question Builder",
    href: "/assessments/builder",
    icon: SlidersHorizontal,
    badge: "CMS",
    badgeColor: "bg-purple-100 text-purple-800",
  },
  {
    title: "Consultation Leads",
    href: "/leads",
    icon: Inbox,
    badge: "3 Pending",
    badgeColor: "bg-amber-100 text-amber-800",
  },
  {
    title: "Guidance CMS",
    href: "/guidance",
    icon: Sparkles,
  },
  {
    title: "Testimonials & FAQs",
    href: "/content",
    icon: MessageSquareQuote,
  },
  {
    title: "Multilingual Matrix",
    href: "/translations",
    icon: Languages,
  },
  {
    title: "Settings & Privacy",
    href: "/settings",
    icon: Settings,
  },
];

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = React.useState<{ name?: string; role?: string } | null>(null);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("polaris_admin_user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("polaris_admin_token");
      localStorage.removeItem("polaris_admin_user");
    } catch {
      // Ignore
    }
    window.location.href = "/login";
  };

  return (
    <aside className="flex h-full w-72 flex-col justify-between border-r border-slate-200/80 bg-[#081F38] text-slate-200">
      {/* Top Section: Brand & Navigation */}
      <div className="flex flex-col gap-6 p-6">
        {/* Brand Header with Main Official Logo - Shifted left with negative margin for 0 gap */}
        <div className="flex flex-col pb-4 border-b border-slate-700/60 space-y-2.5">
          <BrandLogo variant="dark" showTagline={false} className="-ml-3" />
          
          {/* Flush Left Admin Pill Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 w-fit shadow-2xs">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Admin Management Hub</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Platform Modules
          </div>
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  "group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium transition-all",
                  isActive
                    ? "bg-[#1A5695] text-white shadow-sm font-semibold"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                    )}
                  />
                  <span>{item.title}</span>
                </div>

                {item.badge && (
                  <span
                    className={cn(
                      "rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide",
                      item.badgeColor
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Public Website Link & Admin Profile */}
      <div className="p-6 border-t border-slate-700/60 space-y-4">
        <a
          href="https://polaris-care.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/50 px-3.5 py-2.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            <span>Public Website</span>
          </div>
          <span className="text-[10px] text-slate-400">polaris-care.ch</span>
        </a>

        {/* User Profile Card */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1A5695] text-white font-bold text-xs shadow-xs">
              {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : "NR"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate max-w-[120px]">
                {currentUser?.name || "Nadib Rana"}
              </p>
              <p className="text-[10px] text-slate-400 truncate max-w-[120px]">
                {currentUser?.role || "SUPER_ADMIN"}
              </p>
            </div>
          </div>
          <button
            type="button"
            title="Log out"
            onClick={handleLogout}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
