"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AdminLanguageCode,
  AdminLanguageOption,
  ADMIN_SUPPORTED_LANGUAGES,
  adminTranslations,
} from "@/translations/adminTranslations";

interface AdminLanguageContextType {
  lang: AdminLanguageCode;
  setLang: (lang: AdminLanguageCode) => void;
  currentLanguage: AdminLanguageOption;
  languages: AdminLanguageOption[];
  t: (path: string, params?: Record<string, string | number>) => any;
}

const AdminLanguageContext = createContext<AdminLanguageContextType | undefined>(undefined);

export function AdminLanguageProvider({ children }: { children: React.ReactNode }) {
  // Default language is German ("de") as requested
  const [lang, setLangState] = useState<AdminLanguageCode>("de");

  // Load saved preference if any
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("polaris_admin_lang") as AdminLanguageCode;
      if (savedLang && ["de", "en", "fr", "it"].includes(savedLang)) {
        setLangState(savedLang);
      } else {
        // Default to German
        setLangState("de");
        localStorage.setItem("polaris_admin_lang", "de");
      }
    } catch {
      // Fallback
    }
  }, []);

  const setLang = (newLang: AdminLanguageCode) => {
    setLangState(newLang);
    try {
      localStorage.setItem("polaris_admin_lang", newLang);
      if (typeof document !== "undefined") {
        document.documentElement.lang = newLang;
      }
    } catch {
      // Fallback
    }
  };

  const currentLanguage =
    ADMIN_SUPPORTED_LANGUAGES.find((l) => l.lang === lang) || ADMIN_SUPPORTED_LANGUAGES[0];

  /**
   * Helper function for deep nested translation lookup (e.g. t("overview.title"))
   */
  const t = (path: string, params?: Record<string, string | number>): any => {
    const keys = path.split(".");
    let result: any = adminTranslations[lang];

    for (const key of keys) {
      if (result && typeof result === "object" && key in result) {
        result = result[key];
      } else {
        // Fallback to German, then English
        let fallback: any = adminTranslations.de;
        for (const fbKey of keys) {
          if (fallback && typeof fallback === "object" && fbKey in fallback) {
            fallback = fallback[fbKey];
          } else {
            // Second fallback to EN
            let enFb: any = adminTranslations.en;
            for (const enKey of keys) {
              if (enFb && typeof enFb === "object" && enKey in enFb) {
                enFb = enFb[enKey];
              } else {
                return path;
              }
            }
            fallback = enFb;
            break;
          }
        }
        result = fallback;
        break;
      }
    }

    if (typeof result === "string" && params) {
      return Object.entries(params).reduce((acc, [k, v]) => {
        return acc.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }, result);
    }

    return result;
  };

  return (
    <AdminLanguageContext.Provider
      value={{
        lang,
        setLang,
        currentLanguage,
        languages: ADMIN_SUPPORTED_LANGUAGES,
        t,
      }}
    >
      {children}
    </AdminLanguageContext.Provider>
  );
}

export function useAdminLanguage() {
  const context = useContext(AdminLanguageContext);
  if (!context) {
    throw new Error("useAdminLanguage must be used within an AdminLanguageProvider");
  }
  return context;
}
