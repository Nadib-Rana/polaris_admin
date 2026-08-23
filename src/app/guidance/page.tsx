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
} from "lucide-react";
import { initialSummaries, initialResources } from "@/lib/mockData";
import { SituationSummary, GuidanceResource } from "@/types";
import { adminApi } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function GuidanceCmsPage() {
  const [summaries, setSummaries] = useState<SituationSummary[]>(initialSummaries);
  const [resources, setResources] = useState<GuidanceResource[]>(initialResources);
  const [loading, setLoading] = useState(false);
  const [editingSummary, setEditingSummary] = useState<SituationSummary | null>(null);
  const [editingResource, setEditingResource] = useState<GuidanceResource | null>(null);

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
      // Fallback silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGuidanceData();
  }, []);

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
    alert("Situation summary saved successfully!");
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
    alert("Guidance resource saved successfully!");
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm("Are you sure you want to remove this resource?")) return;
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
          <h2 className="text-2xl font-bold text-[#0C2B4E]">
            Personalised Guidance & Resource CMS
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage the clinical situation summaries and recommended next-step resources shown to caregivers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadGuidanceData}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={() => alert("Published guidance configuration to live site!")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Publish Changes</span>
          </button>
        </div>
      </div>

      {/* 1. Situation Summaries Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#1A5695]" />
            <h3 className="text-base font-bold text-[#0C2B4E]">
              Clinical Situation Summaries
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Generated on assessment completion based on caregiver pressure scores
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {summaries.map((sum) => (
            <div
              key={sum.id}
              className="flex flex-col justify-between rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                    {sum.id}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Active
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#0C2B4E]">{sum.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {sum.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">
                  {sum.targetCategory}
                </span>
                <button
                  type="button"
                  onClick={() => setEditingSummary(sum)}
                  className="text-xs font-bold text-[#1A5695] hover:underline cursor-pointer"
                >
                  Edit Summary
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Guidance Next-Step Resources Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-[#1A5695]" />
            <h3 className="text-base font-bold text-[#0C2B4E]">
              Recommended Next-Step Resource Catalog
            </h3>
          </div>
          <button
            type="button"
            onClick={() =>
              setEditingResource({
                id: `RES-NEW-${Date.now()}`,
                title: "",
                description: "",
                category: "therapy",
                cantons: ["All Switzerland"],
                linkUrl: "",
                isActive: true,
              })
            }
            className="inline-flex items-center gap-1 text-xs font-bold text-[#1A5695] hover:text-[#0C2B4E] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add New Resource</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {resources.map((res) => (
            <div
              key={res.id}
              className="flex flex-col justify-between rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4"
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

                <h4 className="text-sm font-bold text-[#0C2B4E]">{res.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {res.description}
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
                  onClick={() => setEditingResource(res)}
                  className="text-xs font-bold text-[#1A5695] hover:underline cursor-pointer"
                >
                  Edit Resource
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteResource(res.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Summary Modal */}
      {editingSummary && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#0C2B4E]">
                Edit Clinical Situation Summary
              </h3>
              <button
                type="button"
                onClick={() => setEditingSummary(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSummary} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Summary Title</label>
                <input
                  type="text"
                  required
                  value={editingSummary.title}
                  onChange={(e) =>
                    setEditingSummary({ ...editingSummary, title: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Description</label>
                <textarea
                  rows={4}
                  required
                  value={editingSummary.description}
                  onChange={(e) =>
                    setEditingSummary({ ...editingSummary, description: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Target Category</label>
                <input
                  type="text"
                  value={editingSummary.targetCategory}
                  onChange={(e) =>
                    setEditingSummary({ ...editingSummary, targetCategory: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSummary(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0F2E59] text-white font-bold"
                >
                  Save Summary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Resource Modal */}
      {editingResource && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#0C2B4E]">
                Edit Guidance Resource
              </h3>
              <button
                type="button"
                onClick={() => setEditingResource(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResource} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Resource Title</label>
                <input
                  type="text"
                  required
                  value={editingResource.title}
                  onChange={(e) =>
                    setEditingResource({ ...editingResource, title: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingResource.description}
                  onChange={(e) =>
                    setEditingResource({ ...editingResource, description: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category</label>
                  <select
                    value={editingResource.category}
                    onChange={(e) =>
                      setEditingResource({ ...editingResource, category: e.target.value as any })
                    }
                    className="w-full rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white"
                  >
                    <option value="therapy">Physical Therapy</option>
                    <option value="community">Community / CareCircle</option>
                    <option value="equipment">Equipment & Adaptations</option>
                    <option value="spitex">Spitex Nursing</option>
                    <option value="legal">Legal & Insurance</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">External URL</label>
                  <input
                    type="url"
                    value={editingResource.linkUrl || ""}
                    onChange={(e) =>
                      setEditingResource({ ...editingResource, linkUrl: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingResource(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0F2E59] text-white font-bold"
                >
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
