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
import { useAdminLanguage } from "@/context/AdminLanguageContext";
import {
  formatLivingSituation,
  formatRelation,
  formatCaregiverName,
  formatCareDegree,
  formatAnswer,
} from "@/lib/formatters";
import { cn } from "@/lib/utils";

function getLocalized(val: any, lang: string = "de"): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    return val[lang] || val.de || val.en || val.fr || val.it || Object.values(val)[0] || "";
  }
  return String(val);
}

export default function AssessmentsPage() {
  const { lang, t } = useAdminLanguage();
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
    alert(t("assessments.saveNotes") + " ✓");
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
          <h2 className="text-xl sm:text-2xl font-bold text-[#0C2B4E]">
            {t("assessments.title")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t("assessments.subtitle")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={loadAssessments}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            <span>{t("overview.refresh")}</span>
          </button>
          <Link
            href="/assessments/builder"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-bold text-[#0C2B4E] shadow-2xs transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="h-4 w-4 text-purple-600" />
            <span>{t("nav.questionBuilder")}</span>
          </Link>
          <button
            type="button"
            onClick={() => alert(`Exporting ${filteredSubmissions.length} assessment records to CSV...`)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F2E59] hover:bg-[#0A2244] text-white px-3.5 py-2 text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>{t("header.exportCsv")}</span>
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
            placeholder={t("assessments.searchPlaceholder")}
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
            <option value="all">{t("assessments.filterCanton")}</option>
            <option value="ZH">Zürich (ZH)</option>
            <option value="BE">Bern (BE)</option>
            <option value="VD">Waadt (VD)</option>
            <option value="GE">Genf (GE)</option>
            <option value="LU">Luzern (LU)</option>
            <option value="BS">Basel-Stadt (BS)</option>
            <option value="TI">Tessin (TI)</option>
          </select>
        </div>

        {/* Urgency Filter */}
        <div className="sm:col-span-3 lg:col-span-2">
          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="w-full rounded-xl bg-[#F8FAFC] px-3 py-2 text-xs text-slate-700 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A5695]/30 cursor-pointer"
          >
            <option value="all">{t("assessments.filterUrgency")}</option>
            <option value="High">{t("assessments.urgencyHigh")}</option>
            <option value="Medium">{t("assessments.urgencyMedium")}</option>
            <option value="Normal">{t("assessments.urgencyNormal")}</option>
          </select>
        </div>

        {/* Active Count Badge */}
        <div className="sm:col-span-12 lg:col-span-2 flex items-center justify-end">
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
            {t("assessments.totalCount", { count: filteredSubmissions.length })}
          </span>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-5">{t("assessments.thPublicCode")}</th>
                <th className="py-3.5 px-4">{t("overview.thCaregiver")}</th>
                <th className="py-3.5 px-4">{t("assessments.thLiving")}</th>
                <th className="py-3.5 px-4">{t("overview.thCareDegree")}</th>
                <th className="py-3.5 px-4">{t("overview.thUrgency")}</th>
                <th className="py-3.5 px-4">{t("overview.thCanton")}</th>
                <th className="py-3.5 px-4">{t("overview.thStatus")}</th>
                <th className="py-3.5 px-5 text-right">{t("overview.thActions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Keine Analysen entsprechen den aktuellen Filterkriterien.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-5 font-mono font-bold text-[#0C2B4E]">
                      {row.id}
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-900">{formatCaregiverName(row.caregiver, lang)}</p>
                      <p className="text-[11px] text-slate-400">{formatRelation(row.relation, lang)}</p>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-600">
                      {formatLivingSituation(row.living, lang)}
                    </td>
                    <td className="py-4 px-4 font-semibold text-[#1A5695]">
                      {formatCareDegree(row.careDegree, lang)}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold border",
                          (row.urgency === "High" || (row.urgency as string) === "Hoch") && "bg-rose-50 text-rose-700 border-rose-200",
                          (row.urgency === "Medium" || (row.urgency as string) === "Mittel") && "bg-amber-50 text-amber-700 border-amber-200",
                          ((row.urgency as string) === "Normal") && "bg-emerald-50 text-emerald-700 border-emerald-200"
                        )}
                      >
                        {(row.urgency === "High" || (row.urgency as string) === "Hoch") && <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />}
                        {(row.urgency === "Medium" || (row.urgency as string) === "Mittel") && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
                        {((row.urgency as string) === "Normal") && <CheckCircle2 className="h-3 w-3 text-emerald-600" />}
                        <span>{row.urgency === "High" ? t("assessments.urgencyHigh") : row.urgency === "Medium" ? t("assessments.urgencyMedium") : t("assessments.urgencyNormal")}</span>
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
                        <option value="Pending Action">{t("assessments.statusPending")}</option>
                        <option value="Reviewed">{t("assessments.statusReviewed")}</option>
                        <option value="Archived">{t("assessments.statusArchived")}</option>
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
                        <span>{t("overview.inspect")}</span>
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
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-extrabold text-[#0C2B4E]">
                    {selectedSubmission.id}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                      (selectedSubmission.urgency === "High" || (selectedSubmission.urgency as string) === "Hoch") && "bg-rose-50 text-rose-700 border-rose-200",
                      (selectedSubmission.urgency === "Medium" || (selectedSubmission.urgency as string) === "Mittel") && "bg-amber-50 text-amber-700 border-amber-200",
                      ((selectedSubmission.urgency as string) === "Normal") && "bg-emerald-50 text-emerald-700 border-emerald-200"
                    )}
                  >
                    {selectedSubmission.urgency}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {t("assessments.submittedBy", {
                    name: formatCaregiverName(selectedSubmission.caregiver, lang),
                    canton: selectedSubmission.canton,
                  })}
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
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* Clinical Situation Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">{t("overview.thCareDegree")}</span>
                  <span className="font-bold text-[#1A5695] text-sm">{formatCareDegree(selectedSubmission.careDegree, lang)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">{t("assessments.thScore")}</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedSubmission.score} / 100</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">{t("overview.thStatus")}</span>
                  <span className="font-bold text-emerald-700 text-sm">{selectedSubmission.status}</span>
                </div>
              </div>

              {/* 12 Questions Drilldown */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t("assessments.answers12Title")}
                </h4>

                <div className="space-y-3">
                  {initialQuestions.map((q) => {
                    const ansRecord = selectedSubmission.answers as Record<string | number, string>;
                    const rawAns = ansRecord[q.id] || ansRecord[String(q.id)] || t("assessments.noAnswer");
                    const answer = formatAnswer(rawAns, lang);
                    return (
                      <div
                        key={q.id}
                        className="rounded-xl border border-slate-200/70 p-3.5 space-y-1 bg-white"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#0C2B4E]">
                            {t("assessments.questionPrefix")} {q.id}. {getLocalized(q.question, lang)}
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
                  {t("assessments.advisorNotesTitle")}
                </label>
                <textarea
                  rows={3}
                  value={advisorNoteInput}
                  onChange={(e) => setAdvisorNoteInput(e.target.value)}
                  placeholder={t("assessments.advisorNotesPlaceholder")}
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
                {t("assessments.close")}
              </button>
              <button
                type="button"
                onClick={handleSaveNote}
                className="rounded-xl bg-[#0F2E59] hover:bg-[#0A2244] text-white px-4 py-2 text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                {t("assessments.saveNotes")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

