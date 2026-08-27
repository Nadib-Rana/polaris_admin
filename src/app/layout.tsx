"use client";

import React, { useState } from "react";
import { Montserrat } from "next/font/google";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminLanguageProvider } from "@/context/AdminLanguageContext";
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
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/login";

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("polaris_admin_token");
      if (!token && !isLoginPage) {
        window.location.href = "/login";
      }
    }
  }, [pathname, isLoginPage]);

  return (
    <html lang="de" className={montserrat.variable}>
      <head>
        <title>Polaris Admin — Pflege-Orientierung Management Hub</title>
        <meta name="description" content="Admin Dashboard für Schweizer Pflege-Orientierung & Angehörigenberatung" />
      </head>
      <body className={cn("min-h-screen bg-[#F4F7FB] font-sans antialiased text-slate-800", montserrat.className)}>
        <AdminLanguageProvider>
          {isLoginPage ? (
            // Standalone Login Layout without Sidebar & Header
            <main className="min-h-screen w-full">
              {children}
            </main>
          ) : (
            // Admin Dashboard Layout with Sidebar & Header
            <div className="flex min-h-screen">
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
                <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 sm:space-y-8">
                  {children}
                </main>
              </div>
            </div>
          )}
        </AdminLanguageProvider>
      </body>
    </html>
  );
}

