"use client";

import React, { useState } from "react";
import { Languages, Search, Save, Download } from "lucide-react";

interface TranslationRow {
  key: string;
  en: string;
  de: string;
  fr: string;
  it: string;
}

const initialRows: TranslationRow[] = [
  {
    key: "nav.home",
    en: "Home",
    de: "Startseite",
    fr: "Accueil",
    it: "Home",
  },
  {
    key: "nav.about",
    en: "About",
    de: "Über uns",
    fr: "À propos",
    it: "Chi siamo",
  },
  {
    key: "nav.careCompass",
    en: "Care compass",
    de: "Pflege-Kompass",
    fr: "Boussole de soins",
    it: "Bussola di cura",
  },
  {
    key: "hero.title",
    en: "Empowering Family Caregivers in Switzerland",
    de: "Unterstützung für pflegende Angehörige in der Schweiz",
    fr: "Soutenir les proches aidants en Suisse",
    it: "Sostenere i familiari curanti in Svizzera",
  },
  {
    key: "guidance.title",
    en: "Your Personalised Guidance",
    de: "Ihre persönliche Orientierung",
    fr: "Votre orientation personnalisée",
    it: "Il tuo orientamento personalizzato",
  },
];

export default function TranslationsPage() {
  const [rows, setRows] = useState<TranslationRow[]>(initialRows);
  const [search, setSearch] = useState("");

  const filtered = rows.filter((r) =>
    r.key.toLowerCase().includes(search.toLowerCase()) ||
    r.en.toLowerCase().includes(search.toLowerCase()) ||
    r.de.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0C2B4E]">
            Multilingual Translation Matrix
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Edit text strings across the 4 Swiss languages (Deutsch, English, Français, Italiano).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => alert("Translations saved and synced to public site locales!")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Save Translations</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search translation key or text..."
          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs text-slate-800 focus:border-[#1A5695] focus:outline-hidden"
        />
      </div>

      {/* Matrix Table */}
      <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 pr-4">Translation Key</th>
                <th className="pb-3 pr-4">English (en)</th>
                <th className="pb-3 pr-4">Deutsch (de)</th>
                <th className="pb-3 pr-4">Français (fr)</th>
                <th className="pb-3 pr-4">Italiano (it)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((row, idx) => (
                <tr key={row.key} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pr-4 font-mono font-bold text-[#0C2B4E]">
                    {row.key}
                  </td>
                  <td className="py-3.5 pr-4">
                    <input
                      type="text"
                      value={row.en}
                      onChange={(e) => {
                        const updated = [...rows];
                        updated[idx].en = e.target.value;
                        setRows(updated);
                      }}
                      className="w-full rounded-lg border border-slate-200 p-1.5 text-xs focus:border-[#1A5695]"
                    />
                  </td>
                  <td className="py-3.5 pr-4">
                    <input
                      type="text"
                      value={row.de}
                      onChange={(e) => {
                        const updated = [...rows];
                        updated[idx].de = e.target.value;
                        setRows(updated);
                      }}
                      className="w-full rounded-lg border border-slate-200 p-1.5 text-xs focus:border-[#1A5695]"
                    />
                  </td>
                  <td className="py-3.5 pr-4">
                    <input
                      type="text"
                      value={row.fr}
                      onChange={(e) => {
                        const updated = [...rows];
                        updated[idx].fr = e.target.value;
                        setRows(updated);
                      }}
                      className="w-full rounded-lg border border-slate-200 p-1.5 text-xs focus:border-[#1A5695]"
                    />
                  </td>
                  <td className="py-3.5 pr-4">
                    <input
                      type="text"
                      value={row.it}
                      onChange={(e) => {
                        const updated = [...rows];
                        updated[idx].it = e.target.value;
                        setRows(updated);
                      }}
                      className="w-full rounded-lg border border-slate-200 p-1.5 text-xs focus:border-[#1A5695]"
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
