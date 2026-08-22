"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { initialLeads } from "@/lib/mockData";
import { ConsultationLead } from "@/types";
import { cn } from "@/lib/utils";

const stages = [
  { id: "new", label: "New Requests", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "contacted", label: "Contacted / In Progress", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: "scheduled", label: "Consultation Booked", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { id: "resolved", label: "Assisted / Resolved", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
];

export default function LeadsCrmPage() {
  const [leads, setLeads] = useState<ConsultationLead[]>(initialLeads);
  const [selectedLead, setSelectedLead] = useState<ConsultationLead | null>(null);
  const [noteInput, setNoteInput] = useState("");

  // Move Lead to next/prev stage
  const handleMoveStage = (leadId: string, nextStage: any) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: nextStage } : l))
    );
    if (selectedLead?.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, status: nextStage } : null));
    }
  };

  // Add Note
  const handleAddNote = () => {
    if (!noteInput.trim() || !selectedLead) return;
    const updatedNotes = [...selectedLead.notes, `${new Date().toLocaleDateString()}: ${noteInput.trim()}`];
    setLeads((prev) =>
      prev.map((l) => (l.id === selectedLead.id ? { ...l, notes: updatedNotes } : l))
    );
    setSelectedLead((prev) => (prev ? { ...prev, notes: updatedNotes } : null));
    setNoteInput("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0C2B4E]">
            Personal Support Consultation Leads
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Track, assign, and manage caregiver consultation inquiries from the website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 border border-slate-200 text-xs font-semibold text-slate-600 shadow-2xs">
            <span>Total Leads:</span>
            <span className="font-extrabold text-[#0C2B4E]">{leads.length}</span>
          </div>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stages.map((stage) => {
          const stageLeads = leads.filter((l) => l.status === stage.id);

          return (
            <div
              key={stage.id}
              className="flex flex-col rounded-3xl bg-slate-100/70 p-4 border border-slate-200/80 space-y-3 min-h-[500px]"
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
                  <div className="flex h-32 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 text-center text-xs text-slate-400 p-4">
                    No leads in this stage
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="group cursor-pointer rounded-2xl bg-white p-4 border border-slate-200/90 shadow-2xs hover:border-[#1A5695] hover:shadow-md transition-all space-y-3"
                    >
                      {/* Top Bar */}
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-slate-400">
                          {lead.id}
                        </span>
                        <span
                          className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-md border",
                            lead.urgency === "High" && "bg-rose-50 text-rose-700 border-rose-200",
                            lead.urgency === "Medium" && "bg-amber-50 text-amber-700 border-amber-200",
                            lead.urgency === "Standard" && "bg-slate-50 text-slate-600 border-slate-200"
                          )}
                        >
                          {lead.urgency}
                        </span>
                      </div>

                      {/* Caregiver Name & Canton */}
                      <div>
                        <h4 className="text-xs font-bold text-[#0C2B4E] group-hover:text-[#1A5695] transition-colors">
                          {lead.name}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          <span>{lead.canton}</span>
                        </div>
                      </div>

                      {/* Message Snippet */}
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                        "{lead.message}"
                      </p>

                      {/* Footer Info */}
                      <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 border-t border-slate-100">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {lead.createdAt}
                        </span>
                        {lead.assessmentId && (
                          <span className="font-bold text-[#1A5695]">
                            Quiz Linked
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lead Detail & Activity Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-[#F8FAFC]">
              <div className="space-y-1">
                <span className="font-mono text-xs font-bold text-[#1A5695] bg-blue-50 px-2 py-0.5 rounded-md">
                  {selectedLead.id}
                </span>
                <h3 className="text-xl font-bold text-[#0C2B4E]">{selectedLead.name}</h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-200 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Phone className="h-4 w-4 text-[#1A5695]" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold">Phone Number</p>
                    <p className="text-xs font-bold text-slate-800">{selectedLead.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Mail className="h-4 w-4 text-[#1A5695]" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold">Email Address</p>
                    <p className="text-xs font-bold text-slate-800">{selectedLead.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Clock className="h-4 w-4 text-[#1A5695]" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold">Preferred Callback Time</p>
                    <p className="text-xs font-bold text-slate-800">{selectedLead.preferredTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <MapPin className="h-4 w-4 text-[#1A5695]" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold">Canton</p>
                    <p className="text-xs font-bold text-slate-800">{selectedLead.canton}</p>
                  </div>
                </div>
              </div>

              {/* Inquiry Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0C2B4E]">Caregiver Inquiry Message</label>
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
                  "{selectedLead.message}"
                </div>
              </div>

              {/* Move Stage Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0C2B4E]">Pipeline Status</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {stages.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => handleMoveStage(selectedLead.id, st.id)}
                      className={cn(
                        "p-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-center",
                        selectedLead.status === st.id
                          ? "bg-[#0F2E59] text-white border-[#0F2E59]"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity & Consultation Notes */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-[#0C2B4E] flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-[#1A5695]" />
                  <span>Advisor Activity & Call Logs</span>
                </label>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedLead.notes.map((note, nIdx) => (
                    <div key={nIdx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700">
                      {note}
                    </div>
                  ))}
                </div>

                {/* Add Note Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Log a call, scheduled meeting, or note..."
                    className="flex-1 rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-[#1A5695]"
                  />
                  <button
                    type="button"
                    onClick={handleAddNote}
                    className="px-4 py-2 rounded-xl bg-[#0F2E59] text-white text-xs font-bold hover:bg-[#0A2244] cursor-pointer"
                  >
                    Add Log
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 px-6 border-t border-slate-100 bg-[#F8FAFC]">
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => alert(`Calling caregiver at ${selectedLead.phone}...`)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Call Caregiver</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
