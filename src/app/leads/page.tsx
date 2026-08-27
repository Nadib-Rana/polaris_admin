"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Inbox,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Clock,
  User,
  Plus,
  CheckCircle2,
  AlertTriangle,
  FileText,
  X,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Compass,
} from "lucide-react";
import { initialLeads } from "@/lib/mockData";
import { ConsultationLead } from "@/types";
import { adminApi } from "@/lib/api";
import { useAdminLanguage } from "@/context/AdminLanguageContext";
import {
  formatDateTime,
  formatPreferredTime,
  formatCaregiverName,
} from "@/lib/formatters";
import { cn } from "@/lib/utils";

function formatLeadId(id: string): string {
  if (!id) return "";
  if (id.startsWith("LEAD-")) return id;
  return `LEAD-${id.slice(0, 4).toUpperCase()}`;
}

function formatAssessmentCode(lead: ConsultationLead): string | null {
  if (lead.publicCode) return lead.publicCode;
  if (lead.assessmentId) {
    if (lead.assessmentId.startsWith("CC-")) return lead.assessmentId;
    return `CC-${lead.assessmentId.slice(0, 4).toUpperCase()}`;
  }
  return null;
}

export default function LeadsCrmPage() {
  const { t, lang } = useAdminLanguage();
  const [leads, setLeads] = useState<ConsultationLead[]>(initialLeads);
  const [loading, setLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState<ConsultationLead | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const [activeMobileStage, setActiveMobileStage] = useState<string>("all");

  const stages = [
    { id: "new", label: t("leads.newStage") || "Neu", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { id: "contacted", label: t("leads.contactedStage") || "Kontaktiert", color: "bg-amber-50 text-amber-700 border-amber-200" },
    { id: "scheduled", label: t("leads.scheduledStage") || "Termin", color: "bg-purple-50 text-purple-700 border-purple-200" },
    { id: "resolved", label: t("leads.resolvedStage") || "Erledigt", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  ];

  const loadLeads = async () => {
    if (typeof window !== "undefined" && !localStorage.getItem("polaris_admin_token")) {
      return;
    }
    setLoading(true);
    try {
      const data = await adminApi.getLeads();
      if (data && data.items && data.items.length > 0) {
        setLeads(data.items);
      }
    } catch {
      // Fallback silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  // Move Lead to next/prev stage
  const handleMoveStage = async (leadId: string, nextStage: any) => {
    try {
      await adminApi.updateLeadStatus(leadId, { status: nextStage });
    } catch (err) {
      console.warn("Status update error:", err);
    }

    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: nextStage } : l))
    );
    if (selectedLead?.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, status: nextStage } : null));
    }
  };

  // Add Note
  const handleAddNote = async () => {
    if (!noteInput.trim() || !selectedLead) return;
    const noteText = noteInput.trim();

    try {
      await adminApi.addLeadNote(selectedLead.id, noteText);
    } catch (err) {
      console.warn("Error saving note to backend:", err);
    }

    const updatedNotes = [...(selectedLead.notes || []), `${new Date().toLocaleDateString("de-CH")}: ${noteText}`];
    setLeads((prev) =>
      prev.map((l) => (l.id === selectedLead.id ? { ...l, notes: updatedNotes } : l))
    );
    setSelectedLead((prev) => (prev ? { ...prev, notes: updatedNotes } : null));
    setNoteInput("");
  };

  const handleAdvisorAssign = async (leadId: string, advisorName: string) => {
    try {
      await adminApi.updateLeadStatus(leadId, { assignedAdvisor: advisorName });
    } catch (err) {
      console.warn("Advisor assign error:", err);
    }

    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, assignedAdvisor: advisorName } : l))
    );
    if (selectedLead?.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, assignedAdvisor: advisorName } : null));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0C2B4E]">
            {t("leads.title")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t("leads.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={loadLeads}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            <span>{t("overview.refresh")}</span>
          </button>
          <div className="flex items-center gap-2 rounded-xl bg-white px-3.5 py-1.5 border border-slate-200 text-xs font-semibold text-slate-600 shadow-2xs">
            <span>Anfragen gesamt:</span>
            <span className="font-extrabold text-[#0C2B4E]">{leads.length}</span>
          </div>
        </div>
      </div>

      {/* Mobile Stage Selector Tabs (visible on < md) */}
      <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        <button
          type="button"
          onClick={() => setActiveMobileStage("all")}
          className={cn(
            "px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border",
            activeMobileStage === "all"
              ? "bg-[#0F2E59] text-white border-[#0F2E59]"
              : "bg-white text-slate-600 border-slate-200"
          )}
        >
          {t("leads.filterAll")} ({leads.length})
        </button>
        {stages.map((st) => {
          const count = leads.filter((l) => l.status === st.id).length;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => setActiveMobileStage(st.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border",
                activeMobileStage === st.id
                  ? "bg-[#0F2E59] text-white border-[#0F2E59]"
                  : "bg-white text-slate-600 border-slate-200"
              )}
            >
              {st.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Responsive Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stages.map((stage) => {
          const stageLeads = leads.filter((l) => l.status === stage.id);
          const isHiddenOnMobile = activeMobileStage !== "all" && activeMobileStage !== stage.id;

          if (isHiddenOnMobile) {
            return null;
          }

          return (
            <div
              key={stage.id}
              className="flex flex-col rounded-3xl bg-slate-100/70 p-4 border border-slate-200/80 space-y-3 min-h-[300px] sm:min-h-[500px]"
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-xs font-extrabold text-[#0C2B4E] tracking-tight">
                  {stage.label}
                </span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-slate-700 shadow-2xs border border-slate-200">
                  {stageLeads.length}
                </span>
              </div>

              {/* Cards in Column */}
              <div className="space-y-3 flex-1">
                {stageLeads.length === 0 ? (
                  <div className="h-28 sm:h-32 flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 text-xs text-slate-400 font-medium text-center p-3">
                    {t("leads.noLeadsInStage")}
                  </div>
                ) : (
                  stageLeads.map((lead) => {
                    const displayId = formatLeadId(lead.id);
                    const linkedCode = formatAssessmentCode(lead);

                    return (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-3"
                      >
                        {/* Top Badges */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-slate-400">
                            {displayId}
                          </span>
                          <span
                            className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-md border",
                              (lead.urgency === "High" || (lead.urgency as string) === "Hoch") && "bg-rose-50 text-rose-700 border-rose-200",
                              (lead.urgency === "Medium" || (lead.urgency as string) === "Mittel") && "bg-amber-50 text-amber-700 border-amber-200",
                              ((lead.urgency as string) === "Standard" || (lead.urgency as string) === "Normal") &&
                                "bg-slate-50 text-slate-600 border-slate-200"
                            )}
                          >
                            {lead.urgency === "High" ? t("assessments.urgencyHigh") : lead.urgency === "Medium" ? t("assessments.urgencyMedium") : t("assessments.urgencyNormal")}
                          </span>
                        </div>

                        {/* Lead Name & Details */}
                        <div>
                          <h4 className="text-sm font-bold text-[#0C2B4E]">{lead.name}</h4>
                          <p className="text-xs text-slate-500 font-medium">Kanton {lead.canton}</p>
                        </div>

                        {/* Message Snippet */}
                        {lead.message && (
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-xl">
                            &ldquo;{lead.message}&rdquo;
                          </p>
                        )}

                        {/* Preferred Time & Footer */}
                        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-400">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{lead.preferredTime}</span>
                          </div>
                          {linkedCode ? (
                            <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-[#1A5695] bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-md">
                              <Compass className="h-3 w-3 text-[#1A5695]" />
                              <span>{linkedCode}</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">Direktanfrage</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lead Detail & Notes Drawer / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-[#0C2B4E]">
                    {formatCaregiverName(selectedLead.name, lang)}
                  </h3>
                  <span className="font-mono text-xs text-slate-400">
                    ({formatLeadId(selectedLead.id)})
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {t("leads.receivedOn", {
                    date: formatDateTime(selectedLead.createdAt, lang),
                    canton: selectedLead.canton,
                  })}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* Connected Quiz Alert / Link */}
              {formatAssessmentCode(selectedLead) && (
                <div className="rounded-2xl bg-[#EBF3FC] border border-[#1A5695]/30 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F2E59]">
                      <Compass className="h-4 w-4 text-[#1A5695]" />
                      <span>{t("leads.linkedAssessment")}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {t("leads.referenceCode")}:{" "}
                      <span className="font-mono font-bold text-[#0C2B4E]">
                        {formatAssessmentCode(selectedLead)}
                      </span>
                    </p>
                  </div>
                  <Link
                    href={`/assessments?id=${encodeURIComponent(formatAssessmentCode(selectedLead)!)}`}
                    className="inline-flex items-center gap-1 text-xs font-bold bg-[#0F2E59] hover:bg-[#0A2244] text-white px-3 py-1.5 rounded-xl shadow-xs transition-colors shrink-0"
                  >
                    <span>{t("leads.view12Questions")}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}

              {/* Contact Information Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#1A5695]" />
                  <a href={`tel:${selectedLead.phone}`} className="font-bold text-[#0C2B4E] hover:underline">
                    {selectedLead.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#1A5695]" />
                  <a href={`mailto:${selectedLead.email}`} className="font-bold text-[#0C2B4E] hover:underline truncate">
                    {selectedLead.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>
                    {t("leads.preferredTime")}: {formatPreferredTime(selectedLead.preferredTime, lang)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" />
                  <span>
                    {t("leads.advisorLabel")}: {selectedLead.assignedAdvisor || t("leads.unassigned")}
                  </span>
                </div>
              </div>

              {/* Inquiry Message */}
              {selectedLead.message && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {t("leads.inquiryMessageTitle")}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 p-4 rounded-2xl bg-blue-50/50 border border-blue-100 leading-relaxed font-medium">
                    &ldquo;{selectedLead.message}&rdquo;
                  </p>
                </div>
              )}

              {/* Pipeline Stage Transition Actions */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t("leads.changePipelineStageTitle") || "Pipeline-Status ändern"}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {stages.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => handleMoveStage(selectedLead.id, st.id)}
                      className={cn(
                        "p-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-center",
                        selectedLead.status === st.id
                          ? "bg-[#0F2E59] text-white border-[#0F2E59] shadow-xs"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advisor Assignment Dropdown */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-[#0C2B4E] block">
                  {t("leads.assignAdvisor")}
                </label>
                <select
                  value={selectedLead.assignedAdvisor || ""}
                  onChange={(e) => handleAdvisorAssign(selectedLead.id, e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] p-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A5695]/30 cursor-pointer"
                >
                  <option value="">{t("leads.unassigned")}</option>
                  <option value="Dr. Hans Meier">Dr. Hans Meier (ZÃ¼rich Care Advisor)</option>
                  <option value="Elena Fischer">Elena Fischer (Senior Spitex Advisor)</option>
                  <option value="Marc Bernet">Marc Bernet (Bern & Romandie Advisor)</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>

              {/* Advisor Notes Timeline */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t("leads.leadNotes")}
                </span>

                <div className="space-y-2">
                  {selectedLead.notes && selectedLead.notes.length > 0 ? (
                    selectedLead.notes.map((n, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl bg-slate-50 p-3 text-xs text-slate-700 border border-slate-200/70"
                      >
                        {n}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">{t("leads.noNotesYet")}</p>
                  )}
                </div>

                {/* Add Note Input */}
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder={t("leads.addNotePlaceholder")}
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                    className="flex-1 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A5695]/30"
                  />
                  <button
                    type="button"
                    onClick={handleAddNote}
                    className="px-4 py-2 rounded-xl bg-[#0F2E59] hover:bg-[#0A2244] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    {t("leads.addNoteBtn")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


