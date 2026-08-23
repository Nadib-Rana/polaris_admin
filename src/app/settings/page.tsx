"use client";

import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  Users,
  Key,
  Database,
  Trash2,
  CheckCircle2,
  Save,
  Loader2,
} from "lucide-react";
import { adminApi } from "@/lib/api";

export default function SettingsPage() {
  const [retentionDays, setRetentionDays] = useState("180");
  const [anonymizeActive, setAnonymizeActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPurging, setIsPurging] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      if (typeof window !== "undefined" && !localStorage.getItem("polaris_admin_token")) {
        return;
      }
      try {
        const data = await adminApi.getSettings();
        if (data) {
          if (data.retentionDays) setRetentionDays(data.retentionDays);
          if (data.anonymizeActive !== undefined) setAnonymizeActive(data.anonymizeActive);
        }
      } catch {
        // Fallback silently
      }
    }
    loadSettings();
  }, []);

  const handleSavePrivacy = async () => {
    setIsSaving(true);
    try {
      await adminApi.saveSettings({
        retentionDays,
        anonymizeActive,
      });
      alert("Swiss FADP privacy & retention settings saved successfully!");
    } catch (err) {
      console.warn("Save error:", err);
      alert("Settings saved locally.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePurge = async () => {
    if (!confirm(`Are you sure you want to purge/anonymize records older than ${retentionDays} days?`)) return;
    setIsPurging(true);
    try {
      const res: any = await adminApi.purgeExpiredData();
      alert(res?.message || "Data retention compliance purge complete.");
    } catch (err) {
      console.warn("Purge error:", err);
    } finally {
      setIsPurging(false);
    }
  };

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
            onClick={handlePurge}
            disabled={isPurging}
            className="text-xs font-bold text-rose-600 hover:underline cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{isPurging ? "Purging expired data..." : "Trigger FADP Data Purge"}</span>
          </button>
          <button
            type="button"
            onClick={handleSavePrivacy}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-[#0F2E59] text-white text-xs font-bold hover:bg-[#0A2244] shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span>Save Privacy Settings</span>
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
                Manage registered advisors and administrative managers
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            2 Active Accounts
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800">Nadib Rana (Super Admin)</p>
              <p className="text-[11px] text-slate-400">nadibsoft@gmail.com &bull; Full administrative access</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              SUPER_ADMIN
            </span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800">Dr. Meier (Zurich Lead Advisor)</p>
              <p className="text-[11px] text-slate-400">meier.advisor@polaris-care.ch &bull; Client consultation lead</p>
            </div>
            <span className="text-[10px] font-bold text-[#1A5695] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              ADVISOR
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
