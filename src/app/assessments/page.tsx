"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Download,
  Eye,
  SlidersHorizontal,
  X,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  User,
  Heart,
  FileText,
  Clock,
} from "lucide-react";
import { initialSubmissions, initialQuestions } from "@/lib/mockData";
import { AssessmentSubmission } from "@/types";
import { cn } from "@/lib/utils";

export default function AssessmentsPage() {
  const [submissions, setSubmissions] = useState<AssessmentSubmission[]>(initialSubmissions);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCanton, setSelectedCanton] = useState("all");
  const [selectedUrgency, setSelectedUrgency] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState<AssessmentSubmission | null>(null);
  const [advisorNoteInput, setAdvisorNoteInput] = useState("");

  // Filtering
  const filteredSubmissions = submissions.filter((item) => {
    const matchesSearch =
      item.caregiver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.canton.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCanton =
      selectedCanton === "all" || item.canton.includes(selectedCanton);

    const matchesUrgency =
      selectedUrgency === "all" || item.urgency === selectedUrgency;

    return matchesSearch && matchesCanton && matchesUrgency;
  });

  const handleSaveNote = () => {
    if (!selectedSubmission) return;
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === selectedSubmission.id
          ? { ...sub, advisorNotes: advisorNoteInput }
          : sub
      )
    );
    setSelectedSubmission((prev) =>
      prev ? { ...prev, advisorNotes: advisorNoteInput } : null
    );
    alert("Advisor consultation note saved successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0C2B4E]">
            Care Compass Assessment Records
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Search, filter, inspect 12-question responses, and export clinical caregiver records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/assessments/builder"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-bold text-[#0C2B4E] shadow-2xs transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="h-4 w-4 text-purple-600" />
            <span>Questionnaire CMS</span>
          </Link>
          <button
            type="button"
            onClick={() => alert(`Exporting ${filteredSubmissions.length} assessment records to CSV...`)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F2E59] hover:bg-[#0A2244] text-white px-4 py-2 text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Export Filtered (CSV)</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs">
        {/* Search */}
        <div className="relative sm:col-span-6 lg:col-span-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search caregiver name, submission ID, Canton..."
            className="w-full rounded-xl border border-slate-200 bg-[#F4F7FB] pl-10 pr-4 py-2 text-xs text-slate-800 focus:bg-white focus:border-[#1A5695] focus:outline-hidden transition-all"
          />
        </div>

        {/* Canton Filter */}
        <div className="sm:col-span-3 lg:col-span-3">
          <select
            value={selectedCanton}
            onChange={(e) => setSelectedCanton(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-[#F4F7FB] px-3 py-2 text-xs text-slate-700 focus:bg-white focus:border-[#1A5695] focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Swiss Cantons</option>
            <option value="Zurich">Zurich (ZH)</option>
            <option value="Bern">Bern (BE)</option>
            <option value="Vaud">Vaud / Romandie (VD)</option>
            <option value="Ticino">Ticino (TI)</option>
            <option value="Basel">Basel (BS)</option>
          </select>
        </div>

        {/* Urgency Filter */}
        <div className="sm:col-span-3 lg:col-span-4 flex items-center gap-2">
          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-[#F4F7FB] px-3 py-2 text-xs text-slate-700 focus:bg-white focus:border-[#1A5695] focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Urgency Levels</option>
            <option value="High">High Urgency (Burnout)</option>
            <option value="Medium">Medium Urgency</option>
            <option value="Normal">Normal / Early Stage</option>
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 pr-4">ID</th>
                <th className="pb-3 pr-4">Caregiver Profile</th>
                <th className="pb-3 pr-4">Living Situation</th>
                <th className="pb-3 pr-4">Care Degree</th>
                <th className="pb-3 pr-4">Urgency</th>
                <th className="pb-3 pr-4">Canton</th>
                <th className="pb-3 pr-4">Submitted</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                    No assessments match your current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 pr-4 font-mono font-bold text-[#0C2B4E]">
                      {row.id}
                    </td>
                    <td className="py-3.5 pr-4">
                      <p className="font-semibold text-slate-800">{row.caregiver}</p>
                      <p className="text-[11px] text-slate-400">{row.relation}</p>
                    </td>
                    <td className="py-3.5 pr-4 max-w-[160px] truncate text-slate-600">
                      {row.living}
                    </td>
                    <td className="py-3.5 pr-4 font-medium">{row.careDegree}</td>
                    <td className="py-3.5 pr-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold border",
                          row.urgency === "High" && "bg-rose-50 text-rose-700 border-rose-200",
                          row.urgency === "Medium" && "bg-amber-50 text-amber-700 border-amber-200",
                          row.urgency === "Normal" && "bg-emerald-50 text-emerald-700 border-emerald-200"
                        )}
                      >
                        {row.urgency === "High" && <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />}
                        {row.urgency === "Medium" && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
                        {row.urgency === "Normal" && <CheckCircle2 className="h-3 w-3 text-emerald-600" />}
                        <span>{row.urgency}</span>
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 font-medium text-slate-600">{row.canton}</td>
                    <td className="py-3.5 pr-4 text-slate-400 whitespace-nowrap">
                      {row.submittedAt}
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSubmission(row);
                          setAdvisorNoteInput(row.advisorNotes || "");
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#0C2B4E] transition-colors cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5 text-[#1A5695]" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer Modal (Shows all 12 Answers) */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-[#F8FAFC]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#1A5695] bg-blue-50 px-2 py-0.5 rounded-md">
                    {selectedSubmission.id}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-bold px-2 py-0.5 rounded-md border",
                      selectedSubmission.urgency === "High" && "bg-rose-50 text-rose-700 border-rose-200",
                      selectedSubmission.urgency === "Medium" && "bg-amber-50 text-amber-700 border-amber-200",
                      selectedSubmission.urgency === "Normal" && "bg-emerald-50 text-emerald-700 border-emerald-200"
                    )}
                  >
                    {selectedSubmission.urgency} Urgency
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#0C2B4E]">
                  {selectedSubmission.caregiver} — Assessment Details
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl bg-[#F8FAFC] p-3 border border-slate-100">
                  <p className="text-[11px] text-slate-400 font-medium">Canton</p>
                  <p className="text-xs font-bold text-slate-800">{selectedSubmission.canton}</p>
                </div>
                <div className="rounded-xl bg-[#F8FAFC] p-3 border border-slate-100">
                  <p className="text-[11px] text-slate-400 font-medium">Care Degree</p>
                  <p className="text-xs font-bold text-slate-800">{selectedSubmission.careDegree}</p>
                </div>
                <div className="rounded-xl bg-[#F8FAFC] p-3 border border-slate-100">
                  <p className="text-[11px] text-slate-400 font-medium">Submitted</p>
                  <p className="text-xs font-bold text-slate-800">{selectedSubmission.submittedAt}</p>
                </div>
                <div className="rounded-xl bg-[#F8FAFC] p-3 border border-slate-100">
                  <p className="text-[11px] text-slate-400 font-medium">Care Score</p>
                  <p className="text-xs font-bold text-[#1A5695]">{selectedSubmission.score} / 100</p>
                </div>
              </div>

              {/* 12 Questions Breakdown */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-[#0C2B4E] uppercase tracking-wider flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#1A5695]" />
                  <span>Submitted Responses (12 Questions)</span>
                </h4>

                <div className="space-y-3">
                  {initialQuestions.map((q) => {
                    const answer = selectedSubmission.answers[q.id] || "No response";
                    return (
                      <div
                        key={q.id}
                        className="rounded-xl p-3.5 bg-slate-50 border border-slate-100 space-y-1"
                      >
                        <p className="text-xs font-semibold text-slate-500">
                          {q.id}. {q.question}
                        </p>
                        <p className="text-xs font-bold text-[#0C2B4E] pl-2 border-l-2 border-[#1A5695]">
                          {answer}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Advisor Notes Section */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-[#0C2B4E]">
                  Internal Care Advisor Notes & Action Log
                </label>
                <textarea
                  value={advisorNoteInput}
                  onChange={(e) => setAdvisorNoteInput(e.target.value)}
                  placeholder="Type notes from phone call, recommended local Spitex, or next follow-up..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:outline-hidden focus:border-[#1A5695]"
                  rows={3}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-4 px-6 border-t border-slate-100 bg-[#F8FAFC]">
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleSaveNote}
                className="rounded-xl bg-[#0F2E59] hover:bg-[#0A2244] text-white px-5 py-2 text-xs font-bold transition-colors cursor-pointer"
              >
                Save Notes & Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
