"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Users,
  Key,
  Database,
  Trash2,
  CheckCircle2,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  const [retentionDays, setRetentionDays] = useState("180");
  const [anonymizeActive, setAnonymizeActive] = useState(true);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#0C2B4E]">
          Settings & Swiss Data Privacy (FADP)
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage clinical data retention, Swiss privacy regulations, team access roles, and API integrations.
        </p>
      </div>

      {/* 1. Swiss Privacy & Data Retention Card */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0C2B4E]">
              Swiss Federal Act on Data Protection (FADP) & GDPR Compliance
            </h3>
            <p className="text-xs text-slate-500">
              Healthcare and assessment data security configuration
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Retention Period */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#0C2B4E]">
              Automated Data Retention Window
            </label>
            <select
              value={retentionDays}
              onChange={(e) => setRetentionDays(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-[#F4F7FB] p-3 text-xs text-slate-700 focus:bg-white focus:border-[#1A5695] cursor-pointer"
            >
              <option value="90">90 Days (Strict clinical privacy)</option>
              <option value="180">180 Days (Standard Swiss healthcare)</option>
              <option value="365">365 Days (1 Year retention)</option>
              <option value="never">Indefinite (Manual deletion only)</option>
            </select>
            <p className="text-[11px] text-slate-400">
              Responses older than this period are automatically anonymized or purged.
            </p>
          </div>

          {/* Anonymize Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#0C2B4E]">
              Client-Side Health Data Encryption
            </label>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Strip Personal Identifiers in Analytics
                </p>
                <p className="text-[10px] text-slate-400">
                  Only aggregate statistics are sent to regional dashboards.
                </p>
              </div>
              <input
                type="checkbox"
                checked={anonymizeActive}
                onChange={(e) => setAnonymizeActive(e.target.checked)}
                className="h-4 w-4 text-[#1A5695] rounded-md cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => alert("Anonymized statistical dataset exported successfully.")}
            className="text-xs font-bold text-[#1A5695] hover:underline cursor-pointer"
          >
            Download Anonymized Audit Log
          </button>
          <button
            type="button"
            onClick={() => alert("Privacy settings saved successfully.")}
            className="px-4 py-2 rounded-xl bg-[#0F2E59] text-white text-xs font-bold hover:bg-[#0A2244] cursor-pointer"
          >
            Save Privacy Settings
          </button>
        </div>
      </div>

      {/* 2. Team Members & Roles */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#1A5695]">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0C2B4E]">
                Team Access & Role-Based Permissions (RBAC)
              </h3>
              <p className="text-xs text-slate-500">
                Authorized care advisors and platform administrators
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A5695] text-white font-bold text-xs">
                AD
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Admin Advisor (You)</p>
                <p className="text-[11px] text-slate-400">admin@polaris-care.ch</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Super Admin
            </span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-700 font-bold text-xs">
                CB
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Claire Blanc</p>
                <p className="text-[11px] text-slate-400">c.blanc@polaris-care.ch (Romandie)</p>
              </div>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              Care Advisor
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
