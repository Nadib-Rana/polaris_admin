"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { initialSummaries, initialResources } from "@/lib/mockData";
import { SituationSummary, GuidanceResource } from "@/types";
import { cn } from "@/lib/utils";

export default function GuidanceCmsPage() {
  const [summaries, setSummaries] = useState<SituationSummary[]>(initialSummaries);
  const [resources, setResources] = useState<GuidanceResource[]>(initialResources);
  const [editingSummary, setEditingSummary] = useState<SituationSummary | null>(null);
  const [editingResource, setEditingResource] = useState<GuidanceResource | null>(null);

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

        <button
          type="button"
          onClick={() => alert("Published guidance configuration to live site!")}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          <Save className="h-4 w-4" />
          <span>Publish Changes</span>
        </button>
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

      {/* 2. Recommended Next Steps Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-[#1A5695]" />
            <h3 className="text-base font-bold text-[#0C2B4E]">
              Recommended Next-Step Resources
            </h3>
          </div>
          <button
            type="button"
            onClick={() => alert("Add resource modal coming up")}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#1A5695] hover:underline cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Resource</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {resources.map((res) => (
            <div
              key={res.id}
              className="flex flex-col justify-between rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                    {res.id}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                    {res.category}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#0C2B4E]">{res.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {res.description}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex flex-wrap gap-1">
                  {res.cantons.map((c, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                    >
                      {c}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <a
                    href={res.linkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-[#0C2B4E]"
                  >
                    <span>Resource Link</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setEditingResource(res)}
                    className="text-xs font-bold text-[#1A5695] hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
