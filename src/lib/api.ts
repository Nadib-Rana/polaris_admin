/**
 * API Client for Polaris Care Admin Hub
 * Connects to NestJS Backend at process.env.NEXT_PUBLIC_API_URL or http://localhost:8000
 */

import {
  AssessmentQuestion,
  AssessmentSubmission,
  ConsultationLead,
  SituationSummary,
  GuidanceResource,
  TestimonialItem,
  FaqItem,
} from "@/types";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/api$/, "");

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("polaris_admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("polaris_admin_token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    throw new Error("Unauthorized - Please sign in to access the admin portal.");
  }
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || `HTTP error ${res.status}`);
  }
  const json = await res.json();
  // Unwrap standardized response structure { statusCode, success, data, message }
  return (json.data !== undefined ? json.data : json) as T;
}

export const adminApi = {
  // ==================== Auth ====================
  async login(identifier: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/api/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: identifier.includes("@") ? undefined : identifier,
        email: identifier.includes("@") ? identifier : undefined,
        password,
      }),
    });
    const data = await handleResponse<{ accessToken: string; user: any }>(res);
    if (typeof window !== "undefined" && data.accessToken) {
      localStorage.setItem("polaris_admin_token", data.accessToken);
    }
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE_URL}/api/admin/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    return await handleResponse(res);
  },

  // ==================== Overview KPIs ====================
  async getKpis() {
    const res = await fetch(`${API_BASE_URL}/api/admin/overview/kpis`, {
      headers: { ...getAuthHeader() },
    });
    return await handleResponse<{
      kpis: {
        totalAssessments: number;
        highUrgencyCount: number;
        totalLeads: number;
        activeLeads: number;
        resolvedLeads: number;
        conversionRate: number;
      };
      cantonalDistribution: Array<{ canton: string; count: number; percentage: number }>;
      urgencyBreakdown: { High: number; Medium: number; Normal: number };
      recentSubmissions: Array<any>;
    }>(res);
  },

  // ==================== Assessments ====================
  async getAssessments(params?: {
    canton?: string;
    careDegree?: string;
    urgency?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    let url = `${API_BASE_URL}/api/admin/assessments`;
    if (params) {
      const q = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== "All" && v !== "") q.append(k, String(v));
      });
      if (q.toString()) url += `?${q.toString()}`;
    }

    const res = await fetch(url, {
      headers: { ...getAuthHeader() },
    });
    return await handleResponse<{ items: AssessmentSubmission[]; meta: any }>(res);
  },

  async getAssessmentById(id: string) {
    const res = await fetch(`${API_BASE_URL}/api/admin/assessments/${encodeURIComponent(id)}`, {
      headers: { ...getAuthHeader() },
    });
    return await handleResponse(res);
  },

  async updateAssessment(id: string, payload: { status?: string; advisorNotes?: string }) {
    const res = await fetch(`${API_BASE_URL}/api/admin/assessments/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return await handleResponse(res);
  },

  async syncQuestionBuilder(questions: any[]) {
    const res = await fetch(`${API_BASE_URL}/api/admin/assessments/builder`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify({ questions }),
    });
    return await handleResponse(res);
  },

  // ==================== Leads (Kanban) ====================
  async getLeads(params?: {
    status?: string;
    canton?: string;
    urgency?: string;
    search?: string;
  }) {
    let url = `${API_BASE_URL}/api/admin/leads`;
    if (params) {
      const q = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v) q.append(k, v);
      });
      if (q.toString()) url += `?${q.toString()}`;
    }

    const res = await fetch(url, {
      headers: { ...getAuthHeader() },
    });
    return await handleResponse<{ items: ConsultationLead[]; meta: any }>(res);
  },

  async updateLeadStatus(id: string, payload: {
    status?: string;
    assignedAdvisor?: string;
    advisorNotes?: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/api/admin/leads/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return await handleResponse(res);
  },

  async addLeadNote(id: string, note: string) {
    const res = await fetch(`${API_BASE_URL}/api/admin/leads/${encodeURIComponent(id)}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify({ note }),
    });
    return await handleResponse(res);
  },

  // ==================== Guidance CMS ====================
  async getGuidanceSummaries() {
    const res = await fetch(`${API_BASE_URL}/api/admin/guidance/summaries`, {
      headers: { ...getAuthHeader() },
    });
    return await handleResponse<SituationSummary[]>(res);
  },

  async saveGuidanceSummary(summary: SituationSummary) {
    const isNew = !summary.id || summary.id.startsWith("SUM-NEW");
    const method = isNew ? "POST" : "PATCH";
    const url = isNew
      ? `${API_BASE_URL}/api/admin/guidance/summaries`
      : `${API_BASE_URL}/api/admin/guidance/summaries/${encodeURIComponent(summary.id)}`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(summary),
    });
    return await handleResponse(res);
  },

  async deleteGuidanceSummary(id: string) {
    const res = await fetch(`${API_BASE_URL}/api/admin/guidance/summaries/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { ...getAuthHeader() },
    });
    return await handleResponse(res);
  },

  async getGuidanceResources() {
    const res = await fetch(`${API_BASE_URL}/api/admin/guidance/resources`, {
      headers: { ...getAuthHeader() },
    });
    return await handleResponse<GuidanceResource[]>(res);
  },

  async saveGuidanceResource(resource: GuidanceResource) {
    const isNew = !resource.id || resource.id.startsWith("RES-NEW");
    const method = isNew ? "POST" : "PATCH";
    const url = isNew
      ? `${API_BASE_URL}/api/admin/guidance/resources`
      : `${API_BASE_URL}/api/admin/guidance/resources/${encodeURIComponent(resource.id)}`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(resource),
    });
    return await handleResponse(res);
  },

  async deleteGuidanceResource(id: string) {
    const res = await fetch(`${API_BASE_URL}/api/admin/guidance/resources/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { ...getAuthHeader() },
    });
    return await handleResponse(res);
  },

  // ==================== Content CMS (Testimonials & FAQs) ====================
  async getTestimonials() {
    const res = await fetch(`${API_BASE_URL}/api/admin/content/testimonials`, {
      headers: { ...getAuthHeader() },
    });
    return await handleResponse<TestimonialItem[]>(res);
  },

  async saveTestimonial(item: Partial<TestimonialItem>) {
    const isNew = !item.id || typeof item.id === "number" || !String(item.id).includes("-");
    const method = isNew ? "POST" : "PATCH";
    const url = isNew
      ? `${API_BASE_URL}/api/admin/content/testimonials`
      : `${API_BASE_URL}/api/admin/content/testimonials/${encodeURIComponent(String(item.id))}`;

    const { id, ...data } = item;
    const bodyPayload = isNew ? data : item;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(bodyPayload),
    });
    return await handleResponse(res);
  },

  async deleteTestimonial(id: number | string) {
    const res = await fetch(`${API_BASE_URL}/api/admin/content/testimonials/${encodeURIComponent(String(id))}`, {
      method: "DELETE",
      headers: { ...getAuthHeader() },
    });
    return await handleResponse(res);
  },

  async getFaqs() {
    const res = await fetch(`${API_BASE_URL}/api/admin/content/faqs`, {
      headers: { ...getAuthHeader() },
    });
    return await handleResponse<FaqItem[]>(res);
  },

  async saveFaq(item: Partial<FaqItem>) {
    const isNew = !item.id || String(item.id).startsWith("FAQ-NEW");
    const method = isNew ? "POST" : "PATCH";
    const url = isNew
      ? `${API_BASE_URL}/api/admin/content/faqs`
      : `${API_BASE_URL}/api/admin/content/faqs/${encodeURIComponent(String(item.id))}`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(item),
    });
    return await handleResponse(res);
  },

  async deleteFaq(id: string) {
    const res = await fetch(`${API_BASE_URL}/api/admin/content/faqs/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { ...getAuthHeader() },
    });
    return await handleResponse(res);
  },

  // ==================== Translations ====================
  async syncTranslations(payload: {
    questions?: Record<string, any>;
    faqs?: Record<string, any>;
  }) {
    const res = await fetch(`${API_BASE_URL}/api/admin/translations/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return await handleResponse(res);
  },

  // ==================== Settings & FADP ====================
  async getSettings() {
    const res = await fetch(`${API_BASE_URL}/api/admin/settings`, {
      headers: { ...getAuthHeader() },
    });
    return await handleResponse<{
      retentionDays: string;
      anonymizeActive: boolean;
      contactEmail: string;
      lastAuditExport: string;
    }>(res);
  },

  async saveSettings(payload: {
    retentionDays: string;
    anonymizeActive: boolean;
    contactEmail?: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/api/admin/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return await handleResponse(res);
  },

  async purgeExpiredData() {
    const res = await fetch(`${API_BASE_URL}/api/admin/settings/purge-expired`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
    });
    return await handleResponse(res);
  },

  // ==================== Activity & Audit Logs ====================
  async getAuditLogs(params?: {
    category?: string;
    severity?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const query = new URLSearchParams();
    if (params?.category && params.category !== "ALL") query.append("category", params.category);
    if (params?.severity && params.severity !== "ALL") query.append("severity", params.severity);
    if (params?.search) query.append("search", params.search);
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));

    const res = await fetch(`${API_BASE_URL}/api/admin/audit-logs?${query.toString()}`, {
      headers: { ...getAuthHeader() },
    });
    return await handleResponse<{
      items: import("@/types").AuditLogItem[];
      meta: { total: number; page: number; limit: number; totalPages: number };
    }>(res);
  },

  async getAuditStats() {
    const res = await fetch(`${API_BASE_URL}/api/admin/audit-logs/stats`, {
      headers: { ...getAuthHeader() },
    });
    return await handleResponse<import("@/types").AuditStats>(res);
  },
};

