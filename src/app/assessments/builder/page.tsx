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
import { cn } from "@/lib/utils";

type SupportedLang = "en" | "de" | "fr" | "it";

function getLocalized(val: any, lang: SupportedLang = "en"): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    return val[lang] || val.en || val.de || val.fr || val.it || Object.values(val)[0] || "";
  }
  return String(val);
}

export default function QuestionBuilderPage() {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>(initialQuestions);
  const [editingQuestion, setEditingQuestion] = useState<AssessmentQuestion | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<SupportedLang>("en");

  // Multilingual Form states for Modal
  const [formTitles, setFormTitles] = useState<Record<SupportedLang, string>>({
    en: "",
    de: "",
    fr: "",
    it: "",
  });
  const [formSubtitles, setFormSubtitles] = useState<Record<SupportedLang, string>>({
    en: "",
    de: "",
    fr: "",
    it: "",
  });
  const [formCategory, setFormCategory] = useState<any>("custom");
  const [formOptions, setFormOptions] = useState<Record<SupportedLang, string[]>>({
    en: ["", "", "", ""],
    de: ["", "", "", ""],
    fr: ["", "", "", ""],
    it: ["", "", "", ""],
  });

  // Open Edit Modal
  const handleOpenEdit = (q: AssessmentQuestion) => {
    setEditingQuestion(q);
    setActiveLangTab("en");

    // Extract multilingual values or fallback
    const extractString = (val: any, l: SupportedLang) =>
      typeof val === "object" ? val?.[l] || val?.en || "" : String(val || "");

    setFormTitles({
      en: extractString(q.question, "en"),
      de: extractString(q.question, "de"),
      fr: extractString(q.question, "fr"),
      it: extractString(q.question, "it"),
    });

    setFormSubtitles({
      en: extractString(q.subtitle, "en"),
      de: extractString(q.subtitle, "de"),
      fr: extractString(q.subtitle, "fr"),
      it: extractString(q.subtitle, "it"),
    });

    setFormCategory(q.category);

    const extractOptions = (l: SupportedLang) =>
      q.options.map((opt: any) =>
        typeof opt === "object" && opt !== null ? opt[l] || opt.en || "" : String(opt || "")
      );

    setFormOptions({
      en: extractOptions("en"),
      de: extractOptions("de"),
      fr: extractOptions("fr"),
      it: extractOptions("it"),
    });

    setIsAddingNew(false);
  };

  // Open Add New Modal
  const handleOpenAdd = () => {
    setEditingQuestion(null);
    setActiveLangTab("en");
    setFormTitles({ en: "", de: "", fr: "", it: "" });
    setFormSubtitles({
      en: "Select the most relevant option",
      de: "Wählen Sie die am besten passende Option",
      fr: "Sélectionnez l'option la plus adaptée",
      it: "Seleziona l'opzione più pertinente",
    });
    setFormCategory("custom");
    setFormOptions({
      en: ["Option A", "Option B", "Option C", "Option D"],
      de: ["Option A", "Option B", "Option C", "Option D"],
      fr: ["Option A", "Option B", "Option C", "Option D"],
      it: ["Option A", "Option B", "Option C", "Option D"],
    });
    setIsAddingNew(true);
  };

  // Save Modal (Add or Edit)
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitles.en.trim() && !formTitles.de.trim()) {
      alert("Please enter at least an English or German question title.");
      return;
    }

    const enOpts = formOptions.en.filter((opt) => opt.trim().length > 0);
    if (enOpts.length < 2) {
      alert("Please provide at least 2 options for this question.");
      return;
    }

    const multiQuestionObj = {
      en: formTitles.en || formTitles.de,
      de: formTitles.de || formTitles.en,
      fr: formTitles.fr || formTitles.en,
      it: formTitles.it || formTitles.en,
    };

    const multiSubtitleObj = {
      en: formSubtitles.en || formSubtitles.de,
      de: formSubtitles.de || formSubtitles.en,
      fr: formSubtitles.fr || formSubtitles.en,
      it: formSubtitles.it || formSubtitles.en,
    };

    const multiOptions = formOptions.en.map((opt, idx) => ({
      en: opt || `Option ${idx + 1}`,
      de: formOptions.de[idx] || opt,
      fr: formOptions.fr[idx] || opt,
      it: formOptions.it[idx] || opt,
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
      alert("You must keep at least 1 question in the assessment flow.");
      return;
    }
    if (!confirm(`Are you sure you want to delete Question ${id}?`)) return;

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
      alert(`Published ${questions.length} Care Compass questions to the live backend engine!`);
    } catch (err) {
      console.warn("Publish error:", err);
      alert("Questions saved locally.");
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
              <span>Back to Assessments</span>
            </Link>
          </div>
          <h2 className="text-2xl font-bold text-[#0C2B4E]">
            Question Builder CMS
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Design, reorder, and localize the 12-question clinical Care Compass assessment.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="h-4 w-4 text-[#1A5695]" />
            <span>Add Question</span>
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
            <span>{isPublishing ? "Publishing..." : "Publish Live Flow"}</span>
          </button>
        </div>
      </div>

      {/* Info Notice */}
      <div className="rounded-2xl border border-blue-100 bg-[#F0F7FF] p-4 flex items-start gap-3">
        <SlidersHorizontal className="h-5 w-5 text-[#1A5695] shrink-0 mt-0.5" />
        <div className="text-xs text-[#0F2E59] space-y-1">
          <p className="font-bold">Clinical Care Assessment Architecture</p>
          <p className="text-slate-600 leading-relaxed">
            All questions and options support full Swiss multilingual JSON storage (DE, FR, IT, EN). Changes published here update the scoring weight and Care Compass flow in real-time.
          </p>
        </div>
      </div>

      {/* Questions Stack */}
      <div className="space-y-3">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className={cn(
              "rounded-2xl border bg-white p-5 shadow-xs transition-all space-y-3",
              q.isActive ? "border-slate-200" : "border-slate-200/60 opacity-60 bg-slate-50/50"
            )}
          >
            {/* Row Top Header */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
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
                  {q.isActive ? "Active" : "Disabled"}
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
                  title="Move Up"
                >
                  <MoveUp className="h-3.5 w-3.5" />
                </button>
                {/* Move Down */}
                <button
                  type="button"
                  disabled={idx === questions.length - 1}
                  onClick={() => handleMove(idx, "down")}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-30 cursor-pointer"
                  title="Move Down"
                >
                  <MoveDown className="h-3.5 w-3.5" />
                </button>
                {/* Edit */}
                <button
                  type="button"
                  onClick={() => handleOpenEdit(q)}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 hover:text-[#1A5695] text-slate-600 transition-colors cursor-pointer"
                  title="Edit"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDelete(q.id)}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 hover:text-red-600 text-slate-600 transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Question Title & Subtitle */}
            <div className="space-y-1 pl-1">
              <h4 className="text-sm sm:text-base font-bold text-[#0C2B4E]">
                {getLocalized(q.question, "en")}
              </h4>
              <p className="text-xs text-slate-400">{getLocalized(q.subtitle, "en")}</p>
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
                  <span>{getLocalized(opt, "en")}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Multilingual Edit / Add Modal */}
      {(editingQuestion || isAddingNew) && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#0C2B4E]">
                  {isAddingNew ? "Add New Question Step" : `Edit Question ${editingQuestion?.id}`}
                </h3>
                <p className="text-xs text-slate-500">
                  Provide localized question titles, prompts, and option labels.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingQuestion(null);
                  setIsAddingNew(false);
                }}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Language Tabs in Modal */}
            <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-100 bg-slate-50/60">
              {(["en", "de", "fr", "it"] as SupportedLang[]).map((l) => {
                const labels: Record<SupportedLang, string> = {
                  en: "🇬🇧 English (EN)",
                  de: "🇩🇪 Deutsch (DE)",
                  fr: "🇫🇷 Français (FR)",
                  it: "🇮🇹 Italiano (IT)",
                };
                return (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setActiveLangTab(l)}
                    className={cn(
                      "px-3.5 py-2 text-xs font-bold rounded-t-lg transition-colors cursor-pointer border-b-2",
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
            <form onSubmit={handleSaveModal} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0C2B4E]">
                  Question Title ({activeLangTab.toUpperCase()}) *
                </label>
                <input
                  type="text"
                  required={activeLangTab === "en"}
                  value={formTitles[activeLangTab]}
                  onChange={(e) =>
                    setFormTitles({ ...formTitles, [activeLangTab]: e.target.value })
                  }
                  placeholder={`Question title in ${activeLangTab.toUpperCase()}`}
                  className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A5695]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#0C2B4E]">
                    Subtitle / Prompt ({activeLangTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={formSubtitles[activeLangTab]}
                    onChange={(e) =>
                      setFormSubtitles({ ...formSubtitles, [activeLangTab]: e.target.value })
                    }
                    placeholder="e.g. Select the closest match"
                    className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A5695]/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#0C2B4E]">Category Group</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A5695]/30 cursor-pointer"
                  >
                    <option value="relation">Relation</option>
                    <option value="living">Living</option>
                    <option value="assistance">Assistance Level</option>
                    <option value="pflegegrad">Pflegegrad</option>
                    <option value="challenges">Challenges</option>
                    <option value="network">Network</option>
                    <option value="spitex">Spitex</option>
                    <option value="legal">Legal & Directives</option>
                    <option value="wellbeing">Wellbeing & Burnout</option>
                    <option value="canton">Canton & Region</option>
                    <option value="respite">Respite Care</option>
                    <option value="goals">Goals</option>
                    <option value="custom">Custom Dimension</option>
                  </select>
                </div>
              </div>

              {/* Options for Active Language */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-[#0C2B4E]">
                  Answer Options ({activeLangTab.toUpperCase()}) (2 to 4)
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
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#0F2E59] hover:bg-[#0A2244] text-white px-5 py-2 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
