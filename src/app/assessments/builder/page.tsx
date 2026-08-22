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
} from "lucide-react";
import { initialQuestions } from "@/lib/mockData";
import { AssessmentQuestion } from "@/types";
import { cn } from "@/lib/utils";

export default function QuestionBuilderPage() {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>(initialQuestions);
  const [editingQuestion, setEditingQuestion] = useState<AssessmentQuestion | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

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

    const cleanOptions = formOptions.filter((opt) => opt.trim().length > 0);
    if (cleanOptions.length < 2) {
      alert("Please provide at least 2 options.");
      return;
    }

    if (isAddingNew) {
      const newQ: AssessmentQuestion = {
        id: questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1,
        question: formQuestion,
        subtitle: formSubtitle,
        category: formCategory,
        options: cleanOptions,
        isActive: true,
      };
      setQuestions((prev) => [...prev, newQ]);
      alert("New question added successfully!");
    } else if (editingQuestion) {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === editingQuestion.id
            ? {
                ...q,
                question: formQuestion,
                subtitle: formSubtitle,
                category: formCategory,
                options: cleanOptions,
              }
            : q
        )
      );
      alert("Question updated successfully!");
    }

    setEditingQuestion(null);
    setIsAddingNew(false);
  };

  // Delete Question
  const handleDeleteQuestion = (id: number) => {
    if (confirm(`Are you sure you want to delete Question #${id}?`)) {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    }
  };

  // Move Question Up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newArr = [...questions];
    const temp = newArr[index];
    newArr[index] = newArr[index - 1];
    newArr[index - 1] = temp;
    setQuestions(newArr);
  };

  // Move Question Down
  const handleMoveDown = (index: number) => {
    if (index === questions.length - 1) return;
    const newArr = [...questions];
    const temp = newArr[index];
    newArr[index] = newArr[index + 1];
    newArr[index + 1] = temp;
    setQuestions(newArr);
  };

  // Toggle Active/Inactive
  const handleToggleActive = (id: number) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, isActive: !q.isActive } : q))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/assessments"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0C2B4E] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Submissions</span>
          </Link>
          <h2 className="text-2xl font-bold text-[#0C2B4E]">
            Dynamic Care Compass Question Builder
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Add, edit, reorder, or delete questions. The public site automatically adapts progress bars.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F2E59] hover:bg-[#0A2244] text-white px-4 py-2 text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Question</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Total Questions</span>
            <span className="text-base font-extrabold text-[#0C2B4E]">{questions.length} Questions</span>
          </div>
          <div className="h-7 w-[1px] bg-slate-200" />
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Active in Live Assessment</span>
            <span className="text-base font-extrabold text-emerald-600">
              {questions.filter((q) => q.isActive).length} Active
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => alert("Published question configuration to live Care Compass engine!")}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          <Save className="h-3.5 w-3.5" />
          <span>Publish to Live Site</span>
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q, index) => (
          <div
            key={q.id}
            className={cn(
              "rounded-2xl p-5 border transition-all bg-white shadow-xs space-y-4",
              q.isActive ? "border-slate-200/80" : "border-slate-200/40 bg-slate-50/60 opacity-60"
            )}
          >
            {/* Top Bar of Question Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0F2E59] text-white font-bold text-xs">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#0C2B4E]">{q.question}</h3>
                  <p className="text-xs text-slate-400">{q.subtitle}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleToggleActive(q.id)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer",
                    q.isActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-100 text-slate-500 border-slate-200"
                  )}
                >
                  {q.isActive ? "Active" : "Inactive"}
                </button>

                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMoveUp(index)}
                  title="Move Up"
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                >
                  <MoveUp className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  disabled={index === questions.length - 1}
                  onClick={() => handleMoveDown(index)}
                  title="Move Down"
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                >
                  <MoveDown className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEdit(q)}
                  title="Edit Question"
                  className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50 cursor-pointer"
                >
                  <Edit2 className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(q.id)}
                  title="Delete Question"
                  className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Options List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {q.options.map((opt, optIdx) => (
                <div
                  key={optIdx}
                  className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-100 text-xs text-slate-700"
                >
                  <span className="h-2 w-2 rounded-full bg-[#1A5695] shrink-0" />
                  <span className="font-medium">{opt}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Question Modal */}
      {(isAddingNew || editingQuestion) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-[#F8FAFC]">
              <h3 className="text-lg font-bold text-[#0C2B4E]">
                {isAddingNew ? "Add New Assessment Question" : `Edit Question #${editingQuestion?.id}`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingQuestion(null);
                  setIsAddingNew(false);
                }}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-200 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Question Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0C2B4E]">Question Title *</label>
                <input
                  type="text"
                  required
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="e.g. Has a formal Pflegegrad been assigned?"
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:outline-hidden focus:border-[#1A5695]"
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0C2B4E]">Subtitle / Helper Instruction</label>
                <input
                  type="text"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  placeholder="e.g. Select the closest match for your family"
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:outline-hidden focus:border-[#1A5695]"
                />
              </div>

              {/* Options Builder */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#0C2B4E]">Answer Options</label>
                  <button
                    type="button"
                    onClick={() => setFormOptions((prev) => [...prev, `Option ${prev.length + 1}`])}
                    className="text-xs font-bold text-[#1A5695] hover:underline cursor-pointer"
                  >
                    + Add Option
                  </button>
                </div>

                <div className="space-y-2">
                  {formOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 w-4">{idx + 1}.</span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...formOptions];
                          updated[idx] = e.target.value;
                          setFormOptions(updated);
                        }}
                        placeholder={`Option ${idx + 1}`}
                        className="flex-1 rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-[#1A5695]"
                      />
                      {formOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => setFormOptions(formOptions.filter((_, i) => i !== idx))}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingQuestion(null);
                    setIsAddingNew(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0F2E59] hover:bg-[#0A2244] text-white text-xs font-bold transition-colors cursor-pointer"
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
