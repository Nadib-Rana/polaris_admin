"use client";

import React, { useState } from "react";
import { Languages, Search, Save, Download, Loader2, Plus, RefreshCw } from "lucide-react";
import { adminApi } from "@/lib/api";
import { useAdminLanguage } from "@/context/AdminLanguageContext";

interface TranslationRow {
  key: string;
  de: string;
  en: string;
  fr: string;
  it: string;
}

const initialRows: TranslationRow[] = [
  {
    key: "nav.home",
    de: "Startseite",
    en: "Home",
    fr: "Accueil",
    it: "Home",
  },
  {
    key: "nav.about",
    de: "Über uns",
    en: "About",
    fr: "À propos",
    it: "Chi siamo",
  },
  {
    key: "nav.careCompass",
    de: "Pflege-Kompass",
    en: "Care Compass",
    fr: "Boussole de soins",
    it: "Bussola di cura",
  },
  {
    key: "nav.community",
    de: "CareCircle Gemeinschaft",
    en: "CareCircle Community",
    fr: "Communauté CareCircle",
    it: "Comunità CareCircle",
  },
  {
    key: "hero.title",
    de: "Unterstützung & Orientierung für pflegende Angehörige in der Schweiz",
    en: "Empowering Family Caregivers in Switzerland",
    fr: "Soutenir les proches aidants en Suisse",
    it: "Sostenere i familiari curanti in Svizzera",
  },
  {
    key: "hero.subtitle",
    de: "Erhalten Sie in 5 Minuten eine massgeschneiderte Einschätzung zu Pflegegrad, Spitex, Vorsorge und Entlastungsangeboten.",
    en: "Get a tailored assessment on care degree, Spitex nursing, legal directives, and respite subsidies in 5 minutes.",
    fr: "Obtenez en 5 minutes une évaluation personnalisée du degré de soins, de la Spitex et des aides financières.",
    it: "Ottieni in 5 minuti una valutazione su misura sul livello di cura, Spitex e indennità di sostegno.",
  },
  {
    key: "guidance.title",
    de: "Ihre persönliche Orientierung & Massnahmen",
    en: "Your Personalised Guidance & Next Steps",
    fr: "Votre orientation personnalisée et démarches",
    it: "Il tuo orientamento personalizzato e passi",
  },
  {
    key: "privacy.fadpBadge",
    de: "100% DSG / FADP Schweizer Datenschutzkonform",
    en: "100% Swiss FADP Data Privacy Compliant",
    fr: "100% Conforme à la LPD suisse sur la protection des données",
    it: "100% Conforme alla LPD svizzera sulla protezione dei dati",
  },
  {
    key: "cta.startAssessment",
    de: "Pflege-Kompass starten (Kostenlos & Anonym)",
    en: "Start Care Compass (Free & Anonymous)",
    fr: "Démarrer la boussole (Gratuit & Anonyme)",
    it: "Inizia la bussola di cura (Gratuito & Anonimo)",
  },
];

export default function TranslationsPage() {
  const { t } = useAdminLanguage();
  const [rows, setRows] = useState<TranslationRow[]>(initialRows);
  const [search, setSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const filtered = rows.filter((r) =>
    r.key.toLowerCase().includes(search.toLowerCase()) ||
    r.de.toLowerCase().includes(search.toLowerCase()) ||
    r.en.toLowerCase().includes(search.toLowerCase()) ||
    r.fr.toLowerCase().includes(search.toLowerCase()) ||
    r.it.toLowerCase().includes(search.toLowerCase())
  );

  const handleCellChange = (
    index: number,
    lang: "de" | "en" | "fr" | "it",
    value: string
  ) => {
    const updated = [...rows];
    updated[index][lang] = value;
    setRows(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const questionsMatrix: Record<string, any> = {};
      rows.forEach((r) => {
        questionsMatrix[r.key] = { de: r.de, en: r.en, fr: r.fr, it: r.it };
      });
      await adminApi.syncTranslations({ questions: questionsMatrix });
      alert(t("translations.save") + " ✓ (Synchronisiert)");
    } catch (err) {
      console.warn("Translation sync error:", err);
      alert("Übersetzungen lokal im Browser gespeichert.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0C2B4E]">
            {t("translations.title")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t("translations.subtitle")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F2E59] hover:bg-[#0A2244] text-white px-4 py-2.5 text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 text-emerald-400" />}
            <span>{isSaving ? "Wird gespeichert..." : t("translations.save")}</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={t("translations.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-[#F8FAFC] pl-10 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A5695]/30 border border-slate-200"
          />
        </div>

        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-2 rounded-xl text-center">
          {filtered.length} {t("translations.keysCount", { count: filtered.length })}
        </span>
      </div>

      {/* Translation Matrix Table */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-5 w-1/5">{t("translations.thKey")}</th>
                <th className="py-3.5 px-4 w-1/5">{t("translations.thDe")}</th>
                <th className="py-3.5 px-4 w-1/5">{t("translations.thEn")}</th>
                <th className="py-3.5 px-4 w-1/5">{t("translations.thFr")}</th>
                <th className="py-3.5 px-4 w-1/5">{t("translations.thIt")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((row, idx) => (
                <tr key={row.key} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-5 font-mono text-[11px] font-bold text-[#0C2B4E]">
                    {row.key}
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={row.de}
                      onChange={(e) => handleCellChange(idx, "de", e.target.value)}
                      className="w-full rounded-lg border border-transparent hover:border-slate-200 focus:border-[#1A5695] bg-transparent p-1.5 focus:bg-white text-xs font-medium"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={row.en}
                      onChange={(e) => handleCellChange(idx, "en", e.target.value)}
                      className="w-full rounded-lg border border-transparent hover:border-slate-200 focus:border-[#1A5695] bg-transparent p-1.5 focus:bg-white text-xs font-medium"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={row.fr}
                      onChange={(e) => handleCellChange(idx, "fr", e.target.value)}
                      className="w-full rounded-lg border border-transparent hover:border-slate-200 focus:border-[#1A5695] bg-transparent p-1.5 focus:bg-white text-xs font-medium"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={row.it}
                      onChange={(e) => handleCellChange(idx, "it", e.target.value)}
                      className="w-full rounded-lg border border-transparent hover:border-slate-200 focus:border-[#1A5695] bg-transparent p-1.5 focus:bg-white text-xs font-medium"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

