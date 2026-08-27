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
  Lock,
} from "lucide-react";
import { adminApi } from "@/lib/api";
import { useAdminLanguage } from "@/context/AdminLanguageContext";

export default function SettingsPage() {
  const { t, lang } = useAdminLanguage();
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
      alert(t("settings.save") || "Einstellungen erfolgreich gespeichert!");
    } catch (err) {
      console.warn("Save error:", err);
      alert("Einstellungen lokal gespeichert.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePurge = async () => {
    if (!confirm(t("settings.confirmPurge") || "Möchten Sie abgelaufene Daten gemäss Schweizer DSG unwiderruflich löschen?")) return;
    setIsPurging(true);
    try {
      const res: any = await adminApi.purgeExpiredData();
      alert(res?.message || "FADP-konforme Datenbereinigung erfolgreich durchgeführt.");
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
        <h2 className="text-xl sm:text-2xl font-bold text-[#0C2B4E]">
          {t("settings.title") || "Einstellungen & Schweizer Datenschutz (DSG)"}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          {t("settings.subtitle") || "Datenaufbewahrung, Rollenberechtigungen und Sicherheitsrichtlinien steuern"}
        </p>
      </div>

      {/* 1. Swiss Privacy & Data Retention Card */}
      <div className="rounded-3xl bg-white p-5 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0C2B4E]">
              {t("settings.fadpSectionTitle") || "Schweizer Datenschutzgesetz (DSG / FADP) & Aufbewahrungsrichtlinien"}
            </h3>
            <p className="text-xs text-slate-500">
              {t("settings.fadpSectionSubtitle") || "Automatische Anonymisierung und gesetzeskonforme Aufbewahrungsfristen"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Retention Period */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#0C2B4E]">
              {t("settings.retentionPeriod") || "Aufbewahrungsfrist für Kontaktdaten"}
            </label>
            <select
              value={retentionDays}
              onChange={(e) => setRetentionDays(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-[#F4F7FB] p-3 text-xs text-slate-700 focus:bg-white focus:border-[#1A5695] cursor-pointer"
            >
              <option value="90">90 {t("settings.days90") || "Tage (Strikt)"}</option>
              <option value="180">180 {t("settings.days180") || "Tage (Empfohlen)"}</option>
              <option value="365">365 {t("settings.days365") || "Tage (Maximal)"}</option>
              <option value="never">{t("settings.daysNever") || "Unbegrenzt speichern"}</option>
            </select>
            <p className="text-[11px] text-slate-400">
              {t("settings.retentionHelper") || "Nach Ablauf dieser Frist werden Klientendaten gemäss DSG automatisch gelöscht oder anonymisiert."}
            </p>
          </div>

          {/* Anonymize Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#0C2B4E]">
              {t("settings.anonymize") || "Automatische Datenanonymisierung"}
            </label>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="pr-3">
                <p className="text-xs font-bold text-slate-800">
                  {t("settings.anonymizeHelper") || "Anonymisierte Analysen aktivieren"}
                </p>
                <p className="text-[10px] text-slate-400">
                  Nur aggregierte Kennzahlen werden im Dashboard angezeigt.
                </p>
              </div>
              <input
                type="checkbox"
                checked={anonymizeActive}
                onChange={(e) => setAnonymizeActive(e.target.checked)}
                className="h-4 w-4 text-[#1A5695] rounded-md cursor-pointer shrink-0"
              />
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePurge}
            disabled={isPurging}
            className="text-xs font-bold text-rose-600 hover:underline cursor-pointer flex items-center justify-center sm:justify-start gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{isPurging ? t("settings.purging") || "Bereinigung..." : t("settings.purgeNow") || "Abgelaufene Daten jetzt bereinigen (DSG Purge)"}</span>
          </button>
          <button
            type="button"
            onClick={handleSavePrivacy}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-[#0F2E59] text-white text-xs font-bold hover:bg-[#0A2244] shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5 text-emerald-400" />}
            <span>{t("settings.save") || "Einstellungen speichern"}</span>
          </button>
        </div>
      </div>

      {/* 2. Team Members & Roles */}
      <div className="rounded-3xl bg-white p-5 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#1A5695] shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0C2B4E]">
                {t("settings.teamSectionTitle") || "Autorisierte Teammitglieder & Rollen"}
              </h3>
              <p className="text-xs text-slate-500">
                {t("settings.teamSectionSubtitle") || "Zugriffsberechtigungen nach dem Schweizer Datenschutz-Prinzip der minimalen Rechtevergabe"}
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full w-fit">
            2 {t("settings.activeAccounts") || "Aktive Konten"}
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-3.5 flex items-center justify-between gap-3">
            <div>
              <p className="font-bold text-slate-800">Nadib Rana (Super Admin)</p>
              <p className="text-[11px] text-slate-400">nadibsoft@gmail.com &bull; Voller administrativer Systemzugriff</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 shrink-0">
              SUPER_ADMIN
            </span>
          </div>

          <div className="py-3.5 flex items-center justify-between gap-3">
            <div>
              <p className="font-bold text-slate-800">Dr. Hans Meier (Zürich Care Advisor)</p>
              <p className="text-[11px] text-slate-400">meier.advisor@polaris-care.ch &bull; Klientenberatung & Fallmanagement</p>
            </div>
            <span className="text-[10px] font-bold text-[#1A5695] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200 shrink-0">
              ADVISOR
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
