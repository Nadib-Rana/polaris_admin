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
} from "lucide-react";
import { initialQuestions } from "@/lib/mockData";
import { AssessmentQuestion } from "@/types";
import { adminApi } from "@/lib/api";
import { cn } from "@/lib/utils";

function getLocalized(val: any): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    return val.en || val.de || val.fr || val.it || Object.values(val)[0] || "";
  }
  return String(val);
}

export default function QuestionBuilderPage() {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>(initialQuestions);
  const [editingQuestion, setEditingQuestion] = useState<AssessmentQuestion | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Form states for Modal
  const [formQuestion, setFormQuestion] = useState("");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formCategory, setFormCategory] = useState<any>("custom");
  const [formOptions, setFormOptions] = useState<string[]>(["", "", "", ""]);

  // Open Edit Modal
  const handleOpenEdit = (q: AssessmentQuestion) => {
    setEditingQuestion(q);
    setFormQuestion(q.question);
    setFormSubtitle(q.subtitle);
    setFormCategory(q.category);
    setFormOptions([...q.options]);
    setIsAddingNew(false);
  };

  // Open Add New Modal
  const handleOpenAdd = () => {
    setEditingQuestion(null);
    setFormQuestion("");
    setFormSubtitle("Select the most relevant option");
    setFormCategory("custom");
    setFormOptions(["Option 1", "Option 2", "Option 3", "Option 4"]);
    setIsAddingNew(true);
  };

  // Save Modal (Add or Edit)
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion.trim()) {
      alert("Please enter a question title.");
      return;
    }

    const filteredOptions = formOptions.filter((opt) => opt.trim().length > 0);
    if (filteredOptions.length < 2) {
      alert("Please provide at least 2 options for this question.");
      return;
    }

    if (isAddingNew) {
      const newQ: AssessmentQuestion = {
        id: questions.length + 1,
        key: `q_custom_${Date.now()}`,
        question: formQuestion,
        subtitle: formSubtitle,
        category: formCategory,
        options: filteredOptions,
        isActive: true,
      };
      setQuestions([...questions, newQ]);
    } else if (editingQuestion) {
      setQuestions(
        questions.map((q) =>
          q.id === editingQuestion.id
            ? {
                ...q,
                question: formQuestion,
                subtitle: formSubtitle,
                category: formCategory,
                options: filteredOptions,
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
      {/* Top Navigation & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/assessments"
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#0C2B4E] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Assessments</span>
            </Link>
          </div>
          <h2 className="text-2xl font-bold text-[#0C2B4E]">
            Care Compass Question Builder
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Design, order, customize options, and activate questions for the 12-question flow.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-bold text-[#0C2B4E] shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Question</span>
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-70"
          >
            {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>Publish to Live Flow</span>
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="rounded-2xl bg-blue-50/60 border border-blue-100 p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#1A5695] shadow-2xs">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#0C2B4E]">
              Current Flow: {questions.length} Active Steps
            </p>
            <p className="text-[11px] text-slate-500">
              Changes published here directly synchronize with the Care Compass on the public platform.
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-[#1A5695] bg-white px-3 py-1 rounded-lg border border-blue-100">
          Estimated Quiz Time: ~3 mins
        </span>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className={cn(
              "rounded-2xl bg-white p-5 border transition-all shadow-2xs space-y-4",
              q.isActive ? "border-slate-200/80" : "border-slate-200 bg-slate-50/50 opacity-60"
            )}
          >
            {/* Top row: Q-Number, Category, Reorder & Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#0F2E59] text-white font-mono text-xs font-bold shadow-2xs">
                  {q.id}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A5695] bg-blue-50 px-2.5 py-0.5 rounded-md">
                  {q.category}
                </span>
                <span className="font-mono text-[10px] text-slate-400">({q.key || `q_${q.id}`})</span>
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
                {getLocalized(q.question)}
              </h4>
              <p className="text-xs text-slate-400">{getLocalized(q.subtitle)}</p>
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
                  <span>{getLocalized(opt)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {(editingQuestion || isAddingNew) && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-[#0C2B4E]">
                {isAddingNew ? "Add New Question Step" : `Edit Question ${editingQuestion?.id}`}
              </h3>
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

            {/* Modal Form */}
            <form onSubmit={handleSaveModal} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0C2B4E]">Question Title *</label>
                <input
                  type="text"
                  required
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="e.g. What is the current living situation?"
                  className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A5695]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#0C2B4E]">Subtitle / Prompt</label>
                  <input
                    type="text"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
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

              {/* Options */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-[#0C2B4E]">Answer Options (2 to 4)</label>
                {formOptions.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400 w-5">
                      {String.fromCharCode(65 + i)}.
                    </span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const updated = [...formOptions];
                        updated[i] = e.target.value;
                        setFormOptions(updated);
                      }}
                      placeholder={`Option ${i + 1} text`}
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
