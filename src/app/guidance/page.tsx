"use client";

import React, { useEffect, useState } from "react";
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Layers,
  HeartHandshake,
  CheckCircle2,
  X,
  Save,
  RefreshCw,
  Globe2,
} from "lucide-react";
import { initialSummaries, initialResources } from "@/lib/mockData";
import { SituationSummary, GuidanceResource } from "@/types";
import { adminApi } from "@/lib/api";
import { useAdminLanguage } from "@/context/AdminLanguageContext";
import { cn } from "@/lib/utils";

export default function GuidanceCmsPage() {
  const { t, lang } = useAdminLanguage();
  const [summaries, setSummaries] = useState<SituationSummary[]>(initialSummaries);
  const [resources, setResources] = useState<GuidanceResource[]>(initialResources);
  const [loading, setLoading] = useState(false);
  const [editingSummary, setEditingSummary] = useState<SituationSummary | null>(null);
  const [editingResource, setEditingResource] = useState<GuidanceResource | null>(null);

  // Active language inside modal editor
  const [modalEditLang, setModalEditLang] = useState<"de" | "en" | "fr" | "it">("de");

  // Helper to extract localized text
  const getLocaleText = (value: any, preferredLang = lang || "de"): string => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      return value[preferredLang] || value.de || value.en || value.fr || value.it || Object.values(value)[0] || "";
    }
    return String(value);
  };

  const loadGuidanceData = async () => {
    if (typeof window !== "undefined" && !localStorage.getItem("polaris_admin_token")) {
      return;
    }
    setLoading(true);
    try {
      const [sumData, resData] = await Promise.all([
        adminApi.getGuidanceSummaries(),
        adminApi.getGuidanceResources(),
      ]);
      if (sumData && sumData.length > 0) setSummaries(sumData);
      if (resData && resData.length > 0) setResources(resData);
    } catch {
      // Fallback to initial local state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGuidanceData();
  }, []);

  const handleOpenEditSummary = (sum: SituationSummary) => {
    setEditingSummary(JSON.parse(JSON.stringify(sum)));
    setModalEditLang(lang || "de");
  };

  const handleOpenEditResource = (res: GuidanceResource) => {
    setEditingResource(JSON.parse(JSON.stringify(res)));
    setModalEditLang(lang || "de");
  };

  const handleSaveSummary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSummary) return;

    try {
      await adminApi.saveGuidanceSummary(editingSummary);
    } catch (err) {
      console.warn("Save error:", err);
    }

    setSummaries((prev) =>
      prev.map((s) => (s.id === editingSummary.id ? editingSummary : s))
    );
    setEditingSummary(null);
    alert(t("guidance.save") || "Erfolgreich gespeichert!");
  };

  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource) return;

    try {
      await adminApi.saveGuidanceResource(editingResource);
    } catch (err) {
      console.warn("Save error:", err);
    }

    setResources((prev) =>
      prev.map((r) => (r.id === editingResource.id ? editingResource : r))
    );
    setEditingResource(null);
    alert(t("guidance.save") || "Erfolgreich gespeichert!");
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm(t("guidance.confirmDeleteResource") || "Möchten Sie diese Ressource wirklich löschen?")) return;
    try {
      await adminApi.deleteGuidanceResource(id);
    } catch (err) {
      console.warn("Delete error:", err);
    }
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0C2B4E]">
            {t("guidance.title") || "Guidance & Recommendations CMS"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t("guidance.subtitle") || "Manage situation summaries and accredited Swiss regional resources"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={loadGuidanceData}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            <span>{t("overview.refresh") || "Aktualisieren"}</span>
          </button>
          <button
            type="button"
            onClick={() => alert("Empfehlungen und Pflegeressourcen im Backend synchronisiert!")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>{t("builder.saveAndPublish") || "Speichern & Live schalten"}</span>
          </button>
        </div>
      </div>

      {/* 1. Situation Summaries Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#1A5695]" />
            <h3 className="text-base font-bold text-[#0C2B4E]">
              {t("guidance.summariesTitle") || t("guidance.tabSummaries") || "Situations-Zusammenfassungen"}
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {t("guidance.autoGenerated") || "Automatisch generiert basierend auf den Belastungswerten des Fragebogens"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {summaries.map((sum) => {
            const currentTitle = getLocaleText(sum.title);
            const currentDescription = getLocaleText(sum.description);
            const currentCategory = getLocaleText(sum.targetCategory);

            return (
              <div
                key={sum.id}
                className="flex flex-col justify-between rounded-3xl bg-white p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      {sum.id}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {sum.isActive ? t("guidance.active") || "Aktiv" : t("guidance.inactive") || "Inaktiv"}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#0C2B4E]">{currentTitle}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {currentDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium capitalize">
                    {currentCategory}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenEditSummary(sum)}
                    className="text-xs font-bold text-[#1A5695] hover:underline cursor-pointer"
                  >
                    {t("guidance.editSummary") || "Zusammenfassung bearbeiten"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Guidance Next-Step Resources Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-[#1A5695]" />
            <h3 className="text-base font-bold text-[#0C2B4E]">
              {t("guidance.resourcesTitle") || t("guidance.tabResources") || "Regionale Hilfsressourcen"}
            </h3>
          </div>
          <button
            type="button"
            onClick={() =>
              handleOpenEditResource({
                id: `RES-NEW-${Date.now()}`,
                title: { de: "", en: "", fr: "", it: "" },
                description: { de: "", en: "", fr: "", it: "" },
                category: "therapy",
                cantons: ["Ganze Schweiz"],
                linkUrl: "",
                isActive: true,
              })
            }
            className="inline-flex items-center gap-1 text-xs font-bold text-[#1A5695] hover:text-[#0C2B4E] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t("guidance.addResource") || "Neue Ressource hinzufügen"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {resources.map((res) => {
            const currentTitle = getLocaleText(res.title);
            const currentDescription = getLocaleText(res.description);

            return (
              <div
                key={res.id}
                className="flex flex-col justify-between rounded-3xl bg-white p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      {res.id}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-[#1A5695] bg-blue-50 px-2 py-0.5 rounded-md">
                      {res.category}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#0C2B4E]">{currentTitle}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {currentDescription}
                  </p>

                  {/* Cantons tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {res.cantons.map((c, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleOpenEditResource(res)}
                    className="text-xs font-bold text-[#1A5695] hover:underline cursor-pointer"
                  >
                    {t("guidance.editResource") || "Ressource bearbeiten"}
                  </button>

                  <button
                    type="button"
                    title="Löschen"
                    onClick={() => handleDeleteResource(res.id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1 rounded-md"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Situation Summary Modal */}
      {editingSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-[#F8FAFC]">
              <h3 className="text-lg font-bold text-[#0C2B4E]">
                {t("guidance.modalTitleSummary") || "Situationsanalyse bearbeiten"} ({editingSummary.id})
              </h3>
              <button
                type="button"
                onClick={() => setEditingSummary(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSummary} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Language Switcher inside Modal */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <Globe2 className="h-4 w-4 text-[#1A5695]" />
                  <span>Language Variant</span>
                </span>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                  {(["de", "en", "fr", "it"] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setModalEditLang(l)}
                      className={cn(
                        "px-2.5 py-1 text-xs font-bold uppercase rounded-lg transition-all",
                        modalEditLang === l
                          ? "bg-white text-[#1A5695] shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0C2B4E]">
                  Title ({modalEditLang.toUpperCase()}) *
                </label>
                <input
                  type="text"
                  required
                  value={
                    typeof editingSummary.title === "object"
                      ? (editingSummary.title as Record<string, string>)[modalEditLang] || ""
                      : editingSummary.title || ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditingSummary((prev) => {
                      if (!prev) return null;
                      const titleObj: Record<string, string> =
                        typeof prev.title === "object" ? { ...(prev.title as Record<string, string>) } : { de: prev.title || "" };
                      titleObj[modalEditLang] = val;
                      return { ...prev, title: titleObj };
                    });
                  }}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-[#1A5695]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0C2B4E]">
                  Description / Situation Text ({modalEditLang.toUpperCase()}) *
                </label>
                <textarea
                  required
                  rows={5}
                  value={
                    typeof editingSummary.description === "object"
                      ? (editingSummary.description as Record<string, string>)[modalEditLang] || ""
                      : editingSummary.description || ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditingSummary((prev) => {
                      if (!prev) return null;
                      const descObj: Record<string, string> =
                        typeof prev.description === "object" ? { ...(prev.description as Record<string, string>) } : { de: prev.description || "" };
                      descObj[modalEditLang] = val;
                      return { ...prev, description: descObj };
                    });
                  }}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:outline-hidden focus:border-[#1A5695] leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0C2B4E]">
                  Target Category / Trigger ({modalEditLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={
                    typeof editingSummary.targetCategory === "object"
                      ? (editingSummary.targetCategory as Record<string, string>)[modalEditLang] || ""
                      : editingSummary.targetCategory || ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditingSummary((prev) => {
                      if (!prev) return null;
                      const catObj: Record<string, string> =
                        typeof prev.targetCategory === "object" ? { ...(prev.targetCategory as Record<string, string>) } : { de: prev.targetCategory || "" };
                      catObj[modalEditLang] = val;
                      return { ...prev, targetCategory: catObj };
                    });
                  }}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-[#1A5695]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSummary(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0F2E59] hover:bg-[#0A2244] text-white text-xs font-bold transition-colors"
                >
                  {t("guidance.saveSummary") || "Zusammenfassung speichern"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Guidance Resource Modal */}
      {editingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-[#F8FAFC]">
              <h3 className="text-lg font-bold text-[#0C2B4E]">
                {t("guidance.modalTitleResource") || "Regionale Ressource bearbeiten"} ({editingResource.id})
              </h3>
              <button
                type="button"
                onClick={() => setEditingResource(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResource} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Language Switcher inside Resource Modal */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <Globe2 className="h-4 w-4 text-[#1A5695]" />
                  <span>Language Variant</span>
                </span>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                  {(["de", "en", "fr", "it"] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setModalEditLang(l)}
                      className={cn(
                        "px-2.5 py-1 text-xs font-bold uppercase rounded-lg transition-all",
                        modalEditLang === l
                          ? "bg-white text-[#1A5695] shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0C2B4E]">
                  Resource Title ({modalEditLang.toUpperCase()}) *
                </label>
                <input
                  type="text"
                  required
                  value={
                    typeof editingResource.title === "object"
                      ? (editingResource.title as Record<string, string>)[modalEditLang] || ""
                      : editingResource.title || ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditingResource((prev) => {
                      if (!prev) return null;
                      const titleObj: Record<string, string> =
                        typeof prev.title === "object" ? { ...(prev.title as Record<string, string>) } : { de: prev.title || "" };
                      titleObj[modalEditLang] = val;
                      return { ...prev, title: titleObj };
                    });
                  }}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-[#1A5695]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0C2B4E]">
                  Description ({modalEditLang.toUpperCase()}) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={
                    typeof editingResource.description === "object"
                      ? (editingResource.description as Record<string, string>)[modalEditLang] || ""
                      : editingResource.description || ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditingResource((prev) => {
                      if (!prev) return null;
                      const descObj: Record<string, string> =
                        typeof prev.description === "object" ? { ...(prev.description as Record<string, string>) } : { de: prev.description || "" };
                      descObj[modalEditLang] = val;
                      return { ...prev, description: descObj };
                    });
                  }}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-[#1A5695]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0C2B4E]">
                    {t("guidance.category") || "Ziel-Kategorie"}
                  </label>
                  <select
                    value={editingResource.category}
                    onChange={(e) =>
                      setEditingResource({ ...editingResource, category: e.target.value as any })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:outline-hidden"
                  >
                    <option value="therapy">Physiotherapie (Therapy)</option>
                    <option value="community">Angehörigen-Gruppe (Community)</option>
                    <option value="equipment">Hilfsmittel (Equipment)</option>
                    <option value="spitex">Spitex-Pflege (Spitex)</option>
                    <option value="legal">Recht & Vorsorge (Legal)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0C2B4E]">
                    {t("guidance.url") || "Weblink / URL"}
                  </label>
                  <input
                    type="url"
                    value={editingResource.linkUrl || ""}
                    onChange={(e) =>
                      setEditingResource({ ...editingResource, linkUrl: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingResource(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0F2E59] hover:bg-[#0A2244] text-white text-xs font-bold transition-colors"
                >
                  {t("guidance.saveResource") || "Ressource speichern"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
