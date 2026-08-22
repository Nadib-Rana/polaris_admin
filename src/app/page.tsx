"use client";

import React from "react";
import Link from "next/link";
import {
  Compass,
  AlertTriangle,
  Inbox,
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
  Clock,
  Eye,
  CheckCircle2,
  Users,
  SlidersHorizontal,
} from "lucide-react";
import { initialSubmissions } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const metrics = [
  {
    title: "Completed Assessments",
    value: "1,428",
    change: "+14.2%",
    changeType: "positive",
    subtitle: "From 1,601 initiated",
    icon: Compass,
    iconBg: "bg-blue-50 text-[#1A5695]",
  },
  {
    title: "High Urgency / Burnout",
    value: "264",
    change: "18.5%",
    changeType: "urgent",
    subtitle: "Urgent respite needed",
    icon: AlertTriangle,
    iconBg: "bg-rose-50 text-rose-600",
  },
  {
    title: "Consultation Leads",
    value: "38",
    change: "14 New",
    changeType: "positive",
    subtitle: "Awaiting advisor callback",
    icon: Inbox,
    iconBg: "bg-amber-50 text-amber-600",
  },
  {
    title: "Completion Rate",
    value: "89.2%",
    change: "+3.1%",
    changeType: "positive",
    subtitle: "Avg. duration: 7.2 mins",
    icon: TrendingUp,
    iconBg: "bg-emerald-50 text-emerald-600",
  },
];

const challengeStats = [
  { label: "Navigating Bureaucracy & Spitex", percentage: 38, count: "542 families", color: "bg-[#0C2B4E]" },
  { label: "Emotional Fatigue & Burnout", percentage: 29, count: "414 families", color: "bg-rose-500" },
  { label: "Work & Family Care Balance", percentage: 21, count: "300 families", color: "bg-amber-500" },
  { label: "Financial Aid & Insurance", percentage: 12, count: "172 families", color: "bg-emerald-500" },
];

const cantonStats = [
  { canton: "Zurich (ZH)", count: 420, percent: "29.4%" },
  { canton: "Bern (BE)", count: 315, percent: "22.1%" },
  { canton: "Romandie (VD, GE, VS)", count: 285, percent: "19.9%" },
  { canton: "Central Switzerland (LU, ZG)", count: 218, percent: "15.3%" },
  { canton: "North-West & Basel (BS, BL)", count: 190, percent: "13.3%" },
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8">
      {/* 1. Welcome & Quick CTA Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200/60 px-3 py-1 text-xs font-semibold text-emerald-700 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Live Assessment Engine Active
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0C2B4E] tracking-tight">
            Care Compass Insights & Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time monitoring of Swiss family caregiving assessments, leads, and guidance outcomes.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/assessments/builder"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[#0C2B4E] px-4 py-2.5 text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="h-4 w-4 text-purple-600" />
            <span>Question CMS</span>
          </Link>
          <Link
            href="/assessments"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F2E59] hover:bg-[#0A2244] text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
          >
            <span>View All Assessments</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* 2. KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((card, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-white p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {card.title}
              </span>
              <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", card.iconBg)}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#0C2B4E] tracking-tight">
                  {card.value}
                </span>
                <span
                  className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded-md",
                    card.changeType === "urgent"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-emerald-100 text-emerald-800"
                  )}
                >
                  {card.change}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{card.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Analytics & Breakdowns (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Caregiver Challenge Distribution (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-white p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#0C2B4E]">
                Primary Caregiver Challenges
              </h3>
              <p className="text-xs text-slate-500">Where Swiss caregivers feel the most pressure today</p>
            </div>
            <Users className="h-5 w-5 text-slate-400" />
          </div>

          <div className="space-y-4">
            {challengeStats.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-normal">{item.count}</span>
                    <span className="font-bold text-[#0C2B4E]">{item.percentage}%</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-500", item.color)}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Cantonal Regional Breakdown (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-white p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#0C2B4E]">
                Swiss Cantonal Distribution
              </h3>
              <p className="text-xs text-slate-500">Assessments by regional Swiss Canton</p>
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600 font-bold text-xs">
              CH
            </div>
          </div>

          <div className="space-y-3.5">
            {cantonStats.map((canton, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-xs"
              >
                <span className="font-semibold text-slate-700">{canton.canton}</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">{canton.count} responses</span>
                  <span className="font-bold text-[#0C2B4E] min-w-[45px] text-right">
                    {canton.percent}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Recent Care Compass Submissions Table */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0C2B4E]">
              Recent Care Compass Submissions
            </h3>
            <p className="text-xs text-slate-500">Live stream of latest completed assessments</p>
          </div>

          <Link
            href="/assessments"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#1A5695] hover:text-[#0C2B4E] transition-colors"
          >
            <span>View all records</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 pr-4">Submission ID</th>
                <th className="pb-3 pr-4">Caregiver</th>
                <th className="pb-3 pr-4">Pflegegrad Status</th>
                <th className="pb-3 pr-4">Urgency Level</th>
                <th className="pb-3 pr-4">Canton</th>
                <th className="pb-3 pr-4">Time</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {initialSubmissions.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pr-4 font-mono font-bold text-[#0C2B4E]">
                    {row.id}
                  </td>
                  <td className="py-3.5 pr-4">
                    <p className="font-semibold text-slate-800">{row.caregiver}</p>
                    <p className="text-[11px] text-slate-400">{row.relation}</p>
                  </td>
                  <td className="py-3.5 pr-4 font-medium">{row.careDegree}</td>
                  <td className="py-3.5 pr-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold border",
                        row.urgency === "High" && "bg-rose-50 text-rose-700 border-rose-200",
                        row.urgency === "Medium" && "bg-amber-50 text-amber-700 border-amber-200",
                        row.urgency === "Normal" && "bg-emerald-50 text-emerald-700 border-emerald-200"
                      )}
                    >
                      {row.urgency === "High" && <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />}
                      {row.urgency === "Medium" && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
                      {row.urgency === "Normal" && <CheckCircle2 className="h-3 w-3 text-emerald-600" />}
                      <span>{row.urgency}</span>
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
                      <span>View</span>
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
