"use client";

import React, { useState } from "react";
import { Montserrat } from "next/font/google";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <html lang="en" className={montserrat.variable}>
      <head>
        <title>Polaris Admin — Pflege Orientierung Management Hub</title>
        <meta name="description" content="Admin Dashboard for Swiss Elder Care & Family Caregiving Platform" />
      </head>
      <body className={cn("flex min-h-screen bg-[#F4F7FB] font-sans antialiased text-slate-800", montserrat.className)}>
        {/* Desktop Persistent Sidebar */}
        <div className="hidden md:flex md:shrink-0 sticky top-0 h-screen z-40">
          <AdminSidebar />
        </div>

        {/* Mobile Drawer Sidebar */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative flex w-72 flex-1 flex-col bg-[#081F38] shadow-2xl">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                aria-label="Close sidebar"
                className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
              <AdminSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col min-w-0 overflow-y-auto">
          <AdminHeader onToggleMobileMenu={() => setMobileSidebarOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
