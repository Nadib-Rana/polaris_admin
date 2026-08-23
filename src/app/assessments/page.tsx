"use client";

import React, { useEffect, useState } from "react";
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
  RefreshCw,
} from "lucide-react";
import { initialSubmissions, initialQuestions } from "@/lib/mockData";
import { AssessmentSubmission } from "@/types";
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

export default function AssessmentsPage() {
  const [submissions, setSubmissions] = useState<AssessmentSubmission[]>(initialSubmissions);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCanton, setSelectedCanton] = useState("all");
  const [selectedUrgency, setSelectedUrgency] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState<AssessmentSubmission | null>(null);
  const [advisorNoteInput, setAdvisorNoteInput] = useState("");

  const loadAssessments = async () => {
    if (typeof window !== "undefined" && !localStorage.getItem("polaris_admin_token")) {
      return;
    }
    setLoading(true);
    try {
      const data = await adminApi.getAssessments({
        canton: selectedCanton === "all" ? undefined : selectedCanton,
        urgency: selectedUrgency === "all" ? undefined : selectedUrgency,
        search: searchQuery || undefined,
      });
      if (data && data.items && data.items.length > 0) {
        setSubmissions(data.items);
      }
    } catch {
      // Fallback silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssessments();
  }, [selectedCanton, selectedUrgency]);

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

  const handleSaveNote = async () => {
    if (!selectedSubmission) return;
    try {
      await adminApi.updateAssessment(selectedSubmission.id, {
        advisorNotes: advisorNoteInput,
      });
    } catch (err) {
      console.warn("Failed saving note to backend:", err);
    }

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

  const handleStatusChange = async (id: string, newStatus: "Reviewed" | "Pending Action" | "Archived") => {
    try {
      await adminApi.updateAssessment(id, { status: newStatus });
    } catch (err) {
      console.warn("Status update error:", err);
    }

    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    if (selectedSubmission && selectedSubmission.id === id) {
      setSelectedSubmission((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
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
          <button
            type="button"
            onClick={loadAssessments}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            <span>Refresh</span>
          </button>
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
            placeholder="Search caregiver name, CC-ID, or canton..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl bg-[#F8FAFC] pl-10 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A5695]/30 border border-slate-200"
          />
        </div>

        {/* Canton Filter */}
        <div className="sm:col-span-3 lg:col-span-3">
          <select
            value={selectedCanton}
            onChange={(e) => setSelectedCanton(e.target.value)}
            className="w-full rounded-xl bg-[#F8FAFC] px-3 py-2 text-xs text-slate-700 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A5695]/30 cursor-pointer"
          >
            <option value="all">All Swiss Cantons</option>
            <option value="ZH">Zurich (ZH)</option>
            <option value="BE">Bern (BE)</option>
            <option value="VD">Vaud (VD)</option>
            <option value="GE">Geneva (GE)</option>
            <option value="LU">Lucerne (LU)</option>
            <option value="BS">Basel (BS)</option>
            <option value="TI">Ticino (TI)</option>
          </select>
        </div>

        {/* Urgency Filter */}
        <div className="sm:col-span-3 lg:col-span-2">
          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="w-full rounded-xl bg-[#F8FAFC] px-3 py-2 text-xs text-slate-700 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A5695]/30 cursor-pointer"
          >
            <option value="all">All Urgency</option>
            <option value="High">High Urgency</option>
            <option value="Medium">Medium</option>
            <option value="Normal">Normal</option>
          </select>
        </div>

        {/* Active Count Badge */}
        <div className="sm:col-span-12 lg:col-span-2 flex items-center justify-end">
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
            {filteredSubmissions.length} records found
          </span>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-5">ID</th>
                <th className="py-3.5 px-4">Caregiver</th>
                <th className="py-3.5 px-4">Assistance / Living</th>
                <th className="py-3.5 px-4">Pflegegrad</th>
                <th className="py-3.5 px-4">Urgency</th>
                <th className="py-3.5 px-4">Canton</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Drilldown</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No assessments match your current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-5 font-mono font-bold text-[#0C2B4E]">
                      {row.id}
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-900">{row.caregiver}</p>
                      <p className="text-[11px] text-slate-400">{row.relation}</p>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-600">
                      {row.living}
                    </td>
                    <td className="py-4 px-4 font-semibold text-[#1A5695]">
                      {row.careDegree}
                    </td>
                    <td className="py-4 px-4">
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
                    <td className="py-4 px-4 font-medium text-slate-600">{row.canton}</td>
                    <td className="py-4 px-4">
                      <select
                        value={row.status}
                        onChange={(e) => handleStatusChange(row.id, e.target.value as any)}
                        className={cn(
                          "rounded-lg px-2 py-1 text-[11px] font-semibold border cursor-pointer",
                          row.status === "Reviewed" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                          row.status === "Pending Action" && "bg-amber-50 text-amber-700 border-amber-200",
                          row.status === "Archived" && "bg-slate-100 text-slate-500 border-slate-200"
                        )}
                      >
                        <option value="Pending Action">Pending Action</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSubmission(row);
                          setAdvisorNoteInput(row.advisorNotes || "");
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-[#0C2B4E] px-3 py-1.5 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5 text-[#1A5695]" />
                        <span>Inspect 12-Q</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 12-Question Full Drilldown Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-extrabold text-[#0C2B4E]">
                    {selectedSubmission.id}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                      selectedSubmission.urgency === "High" && "bg-rose-50 text-rose-700 border-rose-200",
                      selectedSubmission.urgency === "Medium" && "bg-amber-50 text-amber-700 border-amber-200",
                      selectedSubmission.urgency === "Normal" && "bg-emerald-50 text-emerald-700 border-emerald-200"
                    )}
                  >
                    {selectedSubmission.urgency} Urgency
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Submitted by {selectedSubmission.caregiver} &bull; Canton {selectedSubmission.canton}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable 12 Questions) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Clinical Situation Badges */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated Pflegegrad</span>
                  <span className="font-bold text-[#1A5695] text-sm">{selectedSubmission.careDegree}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Care Score</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedSubmission.score} / 100</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Review Status</span>
                  <span className="font-bold text-emerald-700 text-sm">{selectedSubmission.status}</span>
                </div>
              </div>

              {/* 12 Questions Drilldown */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  12-Question Response Matrix
                </h4>

                <div className="space-y-3">
                  {initialQuestions.map((q) => {
                    const ansRecord = selectedSubmission.answers as Record<string | number, string>;
                    const rawAns = ansRecord[q.id] || ansRecord[String(q.id)] || "No response recorded";
                    const answer = getLocalized(rawAns);
                    return (
                      <div
                        key={q.id}
                        className="rounded-xl border border-slate-200/70 p-3.5 space-y-1 bg-white"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#0C2B4E]">
                            Q{q.id}. {getLocalized(q.question)}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase">
                            {q.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium pl-4 border-l-2 border-[#1A5695] mt-1 bg-blue-50/40 py-1 rounded-r-md">
                          {answer}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Advisor Notes Section */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-[#0C2B4E] block">
                  Advisor Consultation & Follow-up Notes
                </label>
                <textarea
                  rows={3}
                  value={advisorNoteInput}
                  onChange={(e) => setAdvisorNoteInput(e.target.value)}
                  placeholder="Enter clinical notes, SVA subsidy guidance, or Spitex follow-up details..."
                  className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A5695]/30 resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSaveNote}
                className="rounded-xl bg-[#0F2E59] hover:bg-[#0A2244] text-white px-4 py-2 text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Save Notes & Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
