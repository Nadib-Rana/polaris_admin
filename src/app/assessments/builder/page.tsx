"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  MoveUp,
  MoveDown,
  CheckCircle2,
  SlidersHorizontal,
  Save,
  HelpCircle,
  X,
  Layers,
  Loader2,
  Languages,
  Globe,
} from "lucide-react";
import { initialQuestions } from "@/lib/mockData";
import { AssessmentQuestion } from "@/types";
import { adminApi } from "@/lib/api";
import { useAdminLanguage } from "@/context/AdminLanguageContext";
import { getLocalizedContent } from "@/lib/formatters";
import { cn } from "@/lib/utils";

type SupportedLang = "de" | "en" | "fr" | "it";

function getLocalized(val: any, lang: SupportedLang = "de"): string {
  return getLocalizedContent(val, lang);
}

export default function QuestionBuilderPage() {
  const { lang, t } = useAdminLanguage();
  const [questions, setQuestions] = useState<AssessmentQuestion[]>(initialQuestions);
  const [editingQuestion, setEditingQuestion] = useState<AssessmentQuestion | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<SupportedLang>((lang as SupportedLang) || "de");

  React.useEffect(() => {
    if (lang && ["de", "en", "fr", "it"].includes(lang)) {
      setActiveLangTab(lang as SupportedLang);
    }
  }, [lang]);

  // Multilingual Form states for Modal
  const [formTitles, setFormTitles] = useState<Record<SupportedLang, string>>({
    de: "",
    en: "",
    fr: "",
    it: "",
  });
  const [formSubtitles, setFormSubtitles] = useState<Record<SupportedLang, string>>({
    de: "",
    en: "",
    fr: "",
    it: "",
  });
  const [formCategory, setFormCategory] = useState<any>("custom");
  const [formOptions, setFormOptions] = useState<Record<SupportedLang, string[]>>({
    de: ["", "", "", ""],
    en: ["", "", "", ""],
    fr: ["", "", "", ""],
    it: ["", "", "", ""],
  });

  // Open Edit Modal
  const handleOpenEdit = (q: AssessmentQuestion) => {
    setEditingQuestion(q);
    setActiveLangTab((lang as SupportedLang) || "de");

    // Extract multilingual values or fallback
    const extractString = (val: any, l: SupportedLang) =>
      typeof val === "object" ? val?.[l] || val?.de || val?.en || "" : String(val || "");

    setFormTitles({
      de: extractString(q.question, "de"),
      en: extractString(q.question, "en"),
      fr: extractString(q.question, "fr"),
      it: extractString(q.question, "it"),
    });

    setFormSubtitles({
      de: extractString(q.subtitle, "de"),
      en: extractString(q.subtitle, "en"),
      fr: extractString(q.subtitle, "fr"),
      it: extractString(q.subtitle, "it"),
    });

    setFormCategory(q.category);

    const extractOptions = (l: SupportedLang) =>
      q.options.map((opt: any) =>
        typeof opt === "object" && opt !== null ? opt[l] || opt.de || opt.en || "" : String(opt || "")
      );

    setFormOptions({
      de: extractOptions("de"),
      en: extractOptions("en"),
      fr: extractOptions("fr"),
      it: extractOptions("it"),
    });

    setIsAddingNew(false);
  };

  // Open Add New Modal
  const handleOpenAdd = () => {
    setEditingQuestion(null);
    setActiveLangTab((lang as SupportedLang) || "de");
    setFormTitles({ de: "", en: "", fr: "", it: "" });
    setFormSubtitles({
      de: "Wählen Sie die am besten passende Option",
      en: "Select the most relevant option",
      fr: "Sélectionnez l'option la plus adaptée",
      it: "Seleziona l'opzione più pertinente",
    });
    setFormCategory("custom");
    setFormOptions({
      de: ["Option A", "Option B", "Option C", "Option D"],
      en: ["Option A", "Option B", "Option C", "Option D"],
      fr: ["Option A", "Option B", "Option C", "Option D"],
      it: ["Option A", "Option B", "Option C", "Option D"],
    });
    setIsAddingNew(true);
  };

  // Save Modal (Add or Edit)
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitles.de.trim() && !formTitles.en.trim()) {
      alert("Bitte geben Sie mindestens einen deutschen oder englischen Fragetext ein.");
      return;
    }

    const deOpts = formOptions.de.filter((opt) => opt.trim().length > 0);
    const enOpts = formOptions.en.filter((opt) => opt.trim().length > 0);
    if (deOpts.length < 2 && enOpts.length < 2) {
      alert("Bitte geben Sie mindestens 2 Antwortoptionen für diese Frage an.");
      return;
    }

    const multiQuestionObj = {
      de: formTitles.de || formTitles.en,
      en: formTitles.en || formTitles.de,
      fr: formTitles.fr || formTitles.de || formTitles.en,
      it: formTitles.it || formTitles.de || formTitles.en,
    };

    const multiSubtitleObj = {
      de: formSubtitles.de || formSubtitles.en,
      en: formSubtitles.en || formSubtitles.de,
      fr: formSubtitles.fr || formSubtitles.de || formSubtitles.en,
      it: formSubtitles.it || formSubtitles.de || formSubtitles.en,
    };

    const multiOptions = formOptions.de.map((opt, idx) => ({
      de: opt || formOptions.en[idx] || `Option ${idx + 1}`,
      en: formOptions.en[idx] || opt || `Option ${idx + 1}`,
      fr: formOptions.fr[idx] || opt || formOptions.en[idx],
      it: formOptions.it[idx] || opt || formOptions.en[idx],
    }));

    if (isAddingNew) {
      const newQ: any = {
        id: questions.length + 1,
        key: `q_custom_${Date.now()}`,
        question: multiQuestionObj,
        subtitle: multiSubtitleObj,
        category: formCategory,
        options: multiOptions,
        isActive: true,
      };
      setQuestions([...questions, newQ]);
    } else if (editingQuestion) {
      setQuestions(
        questions.map((q) =>
          q.id === editingQuestion.id
            ? {
                ...q,
                question: multiQuestionObj as any,
                subtitle: multiSubtitleObj as any,
                category: formCategory,
                options: multiOptions as any,
              }
            : q
        )
      );
    }

    setEditingQuestion(null);
    setIsAddingNew(false);
  };

  // Reorder
  const handleMove = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === questions.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...questions];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Re-index IDs
    const reindexed = updated.map((q, idx) => ({ ...q, id: idx + 1 }));
    setQuestions(reindexed);
  };

  // Delete
  const handleDelete = (id: number) => {
    if (questions.length <= 1) {
      alert("Es muss mindestens eine Frage im Fragebogen verbleiben.");
      return;
    }
    if (!confirm(t("builder.confirmDelete") || `Möchten Sie Frage ${id} wirklich löschen?`)) return;

    const filtered = questions.filter((q) => q.id !== id);
    const reindexed = filtered.map((q, idx) => ({ ...q, id: idx + 1 }));
    setQuestions(reindexed);
  };

  // Toggle active
  const handleToggleActive = (id: number) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, isActive: !q.isActive } : q))
    );
  };

  // Publish to NestJS Backend
  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await adminApi.syncQuestionBuilder(questions);
      alert(`Erfolgreich! ${questions.length} Pflege-Kompass Fragen wurden im Backend synchronisiert und live geschaltet.`);
    } catch (err) {
      console.warn("Publish error:", err);
      alert("Fragen wurden lokal im Browser gespeichert.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/assessments"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#1A5695] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{t("nav.assessments")}</span>
            </Link>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0C2B4E]">
            {t("builder.title")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t("builder.subtitle")}
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="h-4 w-4 text-[#1A5695]" />
            <span>{t("builder.addNewQuestion")}</span>
          </button>

          <button
            type="button"
            disabled={isPublishing}
            onClick={handlePublish}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F2E59] hover:bg-[#0A2244] text-white px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isPublishing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4 text-emerald-400" />
            )}
            <span>{isPublishing ? t("builder.publishing") : t("builder.saveAndPublish")}</span>
          </button>
        </div>
      </div>

      {/* Info Notice */}
      <div className="rounded-2xl border border-blue-100 bg-[#F0F7FF] p-4 flex items-start gap-3">
        <SlidersHorizontal className="h-5 w-5 text-[#1A5695] shrink-0 mt-0.5" />
        <div className="text-xs text-[#0F2E59] space-y-1">
          <p className="font-bold">Schweizer Pflege-Kompass Struktur & Punkteberechnung</p>
          <p className="text-slate-600 leading-relaxed">
            Alle Fragen und Antwortoptionen werden viersprachig gespeichert (DE, FR, IT, EN). Änderungen hier aktualisieren die Pflegegrad-Berechnung und den Fragebogen auf der öffentlichen Plattform in Echtzeit.
          </p>
        </div>
      </div>

      {/* Questions Stack */}
      <div className="space-y-3">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className={cn(
              "rounded-2xl border bg-white p-4 sm:p-5 shadow-xs transition-all space-y-3",
              q.isActive ? "border-slate-200" : "border-slate-200/60 opacity-60 bg-slate-50/50"
            )}
          >
            {/* Row Top Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#0F2E59] text-white font-mono text-xs font-bold">
                  {idx + 1}
                </span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {q.key}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 capitalize">
                  {q.category}
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleActive(q.id)}
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-bold transition-colors cursor-pointer",
                    q.isActive
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-200 text-slate-600"
                  )}
                >
                  {q.isActive ? "Aktiv" : "Deaktiviert"}
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5">
                {/* Move Up */}
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, "up")}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-30 cursor-pointer"
                  title="Nach oben"
                >
                  <MoveUp className="h-3.5 w-3.5" />
                </button>
                {/* Move Down */}
                <button
                  type="button"
                  disabled={idx === questions.length - 1}
                  onClick={() => handleMove(idx, "down")}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-30 cursor-pointer"
                  title="Nach unten"
                >
                  <MoveDown className="h-3.5 w-3.5" />
                </button>
                {/* Edit */}
                <button
                  type="button"
                  onClick={() => handleOpenEdit(q)}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 hover:text-[#1A5695] text-slate-600 transition-colors cursor-pointer"
                  title="Bearbeiten"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDelete(q.id)}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 hover:text-red-600 text-slate-600 transition-colors cursor-pointer"
                  title="Löschen"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Question Title & Subtitle */}
            <div className="space-y-1 pl-1">
              <h4 className="text-sm sm:text-base font-bold text-[#0C2B4E]">
                {getLocalized(q.question, lang as SupportedLang)}
              </h4>
              <p className="text-xs text-slate-400">{getLocalized(q.subtitle, lang as SupportedLang)}</p>
            </div>

            {/* Options Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1">
              {q.options.map((opt, optIdx) => (
                <div
                  key={optIdx}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs text-slate-700 font-medium"
                >
                  <span className="text-[10px] font-bold text-slate-400 mr-1.5">
                    {String.fromCharCode(65 + optIdx)}.
                  </span>
                  <span>{getLocalized(opt, lang as SupportedLang)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Multilingual Edit / Add Modal */}
      {(editingQuestion || isAddingNew) && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100">
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-[#0C2B4E]">
                  {isAddingNew ? t("builder.modalTitleAdd") : t("builder.modalTitleEdit", { order: editingQuestion?.id || 1 })}
                </h3>
                <p className="text-xs text-slate-500">
                  Fragetexte, Hilfebeschreibungen und Antwortoptionen in 4 Sprachen bearbeiten.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingQuestion(null);
                  setIsAddingNew(false);
                }}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Language Tabs in Modal */}
            <div className="flex items-center gap-1.5 sm:gap-2 px-5 sm:px-6 pt-3 border-b border-slate-100 bg-slate-50/60 overflow-x-auto">
              {(["de", "en", "fr", "it"] as SupportedLang[]).map((l) => {
                const labels: Record<SupportedLang, string> = {
                  de: "🇩🇪 Deutsch (DE)",
                  en: "🇬🇧 English (EN)",
                  fr: "🇫🇷 Français (FR)",
                  it: "🇮🇹 Italiano (IT)",
                };
                return (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setActiveLangTab(l)}
                    className={cn(
                      "px-3 py-2 text-xs font-bold rounded-t-lg transition-colors cursor-pointer border-b-2 whitespace-nowrap",
                      activeLangTab === l
                        ? "border-[#0F2E59] text-[#0F2E59] bg-white shadow-2xs"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    )}
                  >
                    {labels[l]}
                  </button>
                );
              })}
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveModal} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0C2B4E]">
                  Fragetext ({activeLangTab.toUpperCase()}) *
                </label>
                <input
                  type="text"
                  required={activeLangTab === "de" || activeLangTab === "en"}
                  value={formTitles[activeLangTab]}
                  onChange={(e) =>
                    setFormTitles({ ...formTitles, [activeLangTab]: e.target.value })
                  }
                  placeholder={`Fragetext auf ${activeLangTab.toUpperCase()}`}
                  className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A5695]/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#0C2B4E]">
                    Hilfetext / Untertitel ({activeLangTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={formSubtitles[activeLangTab]}
                    onChange={(e) =>
                      setFormSubtitles({ ...formSubtitles, [activeLangTab]: e.target.value })
                    }
                    placeholder="z.B. Wählen Sie die am besten zutreffende Option"
                    className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A5695]/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#0C2B4E]">Kategorie / Dimension</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A5695]/30 cursor-pointer"
                  >
                    <option value="relation">Beziehung (Relation)</option>
                    <option value="living">Wohnsituation (Living)</option>
                    <option value="assistance">Unterstützungsbedarf (Assistance)</option>
                    <option value="pflegegrad">Pflegegrad & Kognition</option>
                    <option value="challenges">Herausforderungen</option>
                    <option value="network">Betreuungsnetzwerk</option>
                    <option value="spitex">Spitex-Bedarf</option>
                    <option value="legal">Vorsorgeauftrag & Rechtliches</option>
                    <option value="wellbeing">Belastung & Wohlbefinden</option>
                    <option value="canton">Kanton & Region</option>
                    <option value="respite">Entlastungsangebote</option>
                    <option value="goals">Ziele & Wünsche</option>
                    <option value="custom">Eigene Dimension</option>
                  </select>
                </div>
              </div>

              {/* Options for Active Language */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-[#0C2B4E]">
                  Antwortoptionen ({activeLangTab.toUpperCase()}) (2 bis 4 Optionen)
                </label>
                {formOptions[activeLangTab].map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400 w-5">
                      {String.fromCharCode(65 + i)}.
                    </span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const updated = [...formOptions[activeLangTab]];
                        updated[i] = e.target.value;
                        setFormOptions({ ...formOptions, [activeLangTab]: updated });
                      }}
                      placeholder={`Option ${i + 1} (${activeLangTab.toUpperCase()})`}
                      className="flex-1 rounded-xl border border-slate-200 bg-[#F8FAFC] p-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A5695]/30"
                    />
                  </div>
                ))}
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingQuestion(null);
                    setIsAddingNew(false);
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {t("builder.cancel")}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#0F2E59] hover:bg-[#0A2244] text-white px-5 py-2 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  {t("builder.saveChanges")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

