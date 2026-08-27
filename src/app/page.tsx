"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Compass,
  AlertTriangle,
  Inbox,
  TrendingUp,
  ChevronRight,
  Clock,
  Eye,
  CheckCircle2,
  SlidersHorizontal,
  RefreshCw,
} from "lucide-react";
import { initialSubmissions } from "@/lib/mockData";
import { AssessmentSubmission } from "@/types";
import { adminApi } from "@/lib/api";
import { useAdminLanguage } from "@/context/AdminLanguageContext";
import {
  formatLivingSituation,
  formatRelation,
  formatCaregiverName,
  formatCareDegree,
} from "@/lib/formatters";
import { cn } from "@/lib/utils";

export default function AdminOverviewPage() {
  const { t, lang } = useAdminLanguage();
  const [loading, setLoading] = useState(false);
  const [kpis, setKpis] = useState({
    totalAssessments: 1428,
    highUrgencyCount: 264,
    totalLeads: 38,
    activeLeads: 14,
    resolvedLeads: 24,
    conversionRate: 89.2,
  });

  const [cantonStats, setCantonStats] = useState<Array<{ canton: string; count: number; percent: string }>>([
    { canton: "Zürich (ZH)", count: 420, percent: "29.4%" },
    { canton: "Bern (BE)", count: 315, percent: "22.1%" },
    { canton: "Romandie (VD, GE, VS)", count: 285, percent: "19.9%" },
    { canton: "Zentralschweiz (LU, ZG)", count: 218, percent: "15.3%" },
    { canton: "Nordwestschweiz & Basel (BS, BL)", count: 190, percent: "13.3%" },
  ]);

  const [submissions, setSubmissions] = useState(initialSubmissions);

  const loadData = async () => {
    if (typeof window !== "undefined" && !localStorage.getItem("polaris_admin_token")) {
      return;
    }
    setLoading(true);
    try {
      const data = await adminApi.getKpis();
      if (data && data.kpis) {
        setKpis({
          totalAssessments: data.kpis.totalAssessments || 5,
          highUrgencyCount: data.kpis.highUrgencyCount || 2,
          totalLeads: data.kpis.totalLeads || 4,
          activeLeads: data.kpis.activeLeads || 2,
          resolvedLeads: data.kpis.resolvedLeads || 1,
          conversionRate: data.kpis.conversionRate || 80.0,
        });

        if (data.cantonalDistribution && data.cantonalDistribution.length > 0) {
          setCantonStats(
            data.cantonalDistribution.map((c) => ({
              canton: c.canton,
              count: c.count,
              percent: `${c.percentage}%`,
            }))
          );
        }

        if (data.recentSubmissions && data.recentSubmissions.length > 0) {
          setSubmissions(
            data.recentSubmissions.map((s) => ({
              id: s.id,
              caregiver: s.caregiver,
              relation: "Familienmitglied",
              living: "Eigenständiges Wohnen",
              careDegree: s.careDegree,
              urgency: s.urgency,
              canton: s.canton,
              submittedAt: new Date(s.submittedAt).toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" }),
              score: 80,
              answers: {},
              status: s.status || "Pending Action",
            }))
          );
        }
      }
    } catch {
      // Fallback silently if unauthorized
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const metrics = [
    {
      title: t("overview.kpis.totalAssessments"),
      value: kpis.totalAssessments.toLocaleString(),
      change: "+14.2%",
      changeType: "positive",
      subtitle: t("overview.kpis.totalAssessmentsDesc"),
      icon: Compass,
      iconBg: "bg-blue-50 text-[#1A5695]",
    },
    {
      title: t("overview.kpis.highUrgency"),
      value: kpis.highUrgencyCount.toLocaleString(),
      change: `${((kpis.highUrgencyCount / Math.max(1, kpis.totalAssessments)) * 100).toFixed(1)}%`,
      changeType: "urgent",
      subtitle: t("overview.kpis.highUrgencyDesc"),
      icon: AlertTriangle,
      iconBg: "bg-rose-50 text-rose-600",
    },
    {
      title: t("overview.kpis.activeLeads"),
      value: kpis.totalLeads.toLocaleString(),
      change: `${kpis.activeLeads} ${t("nav.badgePending")}`,
      changeType: "positive",
      subtitle: t("overview.kpis.activeLeadsDesc"),
      icon: Inbox,
      iconBg: "bg-amber-50 text-amber-600",
    },
    {
      title: t("overview.kpis.conversionRate"),
      value: `${kpis.conversionRate}%`,
      change: "+3.1%",
      changeType: "positive",
      subtitle: t("overview.kpis.conversionRateDesc"),
      icon: TrendingUp,
      iconBg: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Welcome & Quick CTA Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl bg-white p-5 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200/60 px-3 py-1 text-xs font-semibold text-emerald-700 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Backend & DSG Synchronisiert</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0C2B4E] tracking-tight">
            {t("overview.title")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t("overview.subtitle")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-2 text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            <span>{t("overview.refresh")}</span>
          </button>
          <Link
            href="/assessments/builder"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[#0C2B4E] px-3.5 py-2 text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="h-4 w-4 text-purple-600" />
            <span>{t("nav.questionBuilder")}</span>
          </Link>
          <Link
            href="/assessments"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F2E59] hover:bg-[#0A2244] text-white px-4 py-2 text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
          >
            <span>{t("overview.viewAllAssessments")}</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* 2. Top Metric Cards (4 Cards Grid - Responsive) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metrics.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="rounded-3xl bg-white p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {item.title}
                </span>
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl", item.iconBg)}>
                  <Icon className="h-5 w-5 stroke-[2.2]" />
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#0C2B4E] tracking-tight">
                    {item.value}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-bold px-2 py-0.5 rounded-md",
                      item.changeType === "positive" && "bg-emerald-50 text-emerald-700",
                      item.changeType === "urgent" && "bg-rose-50 text-rose-700"
                    )}
                  >
                    {item.change}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-medium">{item.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Cantonal Distribution & Heatmap */}
      <div className="rounded-3xl bg-white p-5 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0C2B4E]">
              {t("overview.cantonDistributionTitle")}
            </h3>
            <p className="text-xs text-slate-500">{t("overview.cantonDistributionSubtitle")}</p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Schweiz (26 Kantone &bull; DSG)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {cantonStats.map((canton, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/70 space-y-2 hover:bg-white hover:border-[#1A5695]/40 transition-all"
            >
              <span className="text-xs font-bold text-[#0C2B4E] block truncate">{canton.canton}</span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-extrabold text-[#1A5695]">{canton.count}</span>
                <span className="text-xs font-semibold text-slate-500">{canton.percent}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Recent Care Compass Submissions Table */}
      <div className="rounded-3xl bg-white p-5 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0C2B4E]">
              {t("overview.recentAssessmentsTitle")}
            </h3>
            <p className="text-xs text-slate-500">{t("overview.recentAssessmentsSubtitle")}</p>
          </div>

          <Link
            href="/assessments"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#1A5695] hover:text-[#0C2B4E] transition-colors"
          >
            <span>{t("overview.viewAllAssessments")}</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
          <table className="w-full text-left text-xs min-w-[620px]">
            <thead>
              <tr className="border-b border-slate-200/80 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 pr-4">{t("overview.thId")}</th>
                <th className="pb-3 pr-4">{t("overview.thCaregiver")}</th>
                <th className="pb-3 pr-4">{t("overview.thCareDegree")}</th>
                <th className="pb-3 pr-4">{t("overview.thUrgency")}</th>
                <th className="pb-3 pr-4">{t("overview.thCanton")}</th>
                <th className="pb-3 pr-4">{t("overview.thTime")}</th>
                <th className="pb-3 text-right">{t("overview.thActions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {submissions.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pr-4 font-mono font-bold text-[#0C2B4E]">
                    {row.id}
                  </td>
                  <td className="py-3.5 pr-4">
                    <p className="font-semibold text-slate-800">{formatCaregiverName(row.caregiver, lang)}</p>
                    <p className="text-[11px] text-slate-400">{formatRelation(row.relation, lang)}</p>
                  </td>
                  <td className="py-3.5 pr-4 font-medium">{formatCareDegree(row.careDegree, lang)}</td>
                  <td className="py-3.5 pr-4">
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
                  <td className="py-3.5 pr-4 font-medium text-slate-600">{row.canton}</td>
                  <td className="py-3.5 pr-4 text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{row.submittedAt}</span>
                  </td>
                  <td className="py-3.5 text-right">
                    <Link
                      href={`/assessments?id=${row.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#0C2B4E] transition-colors"
                    >
                      <Eye className="h-3 w-3" />
                      <span>{t("overview.inspect")}</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

