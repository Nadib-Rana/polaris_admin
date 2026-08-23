"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  MessageSquareQuote,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  HelpCircle,
  Quote,
  Upload,
  Image as ImageIcon,
  X,
  MapPin,
  Sparkles,
  RefreshCw,
  Languages,
} from "lucide-react";
import { initialTestimonials, initialFaqs } from "@/lib/mockData";
import { TestimonialItem, FaqItem } from "@/types";
import { adminApi } from "@/lib/api";
import { cn } from "@/lib/utils";

function getLocalized(val: any, lang: string = "en"): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    return val[lang] || val.en || val.de || val.fr || val.it || Object.values(val)[0] || "";
  }
  return String(val);
}

export default function ContentCmsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials);
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs);
  const [loading, setLoading] = useState(false);
  const [selectedFaqLang, setSelectedFaqLang] = useState<"en" | "de" | "fr" | "it">("en");

  // Modal State for Testimonial
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);

  // Form Fields
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [authorCanton, setAuthorCanton] = useState("Zurich (ZH)");
  const [quoteText, setQuoteText] = useState("");
  const [imagePreview, setImagePreview] = useState("/images/sarah.jpg");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadContent = async () => {
    if (typeof window !== "undefined" && !localStorage.getItem("polaris_admin_token")) {
      return;
    }
    setLoading(true);
    try {
      const [testData, faqData] = await Promise.all([
        adminApi.getTestimonials(),
        adminApi.getFaqs(),
      ]);
      if (testData && testData.length > 0) setTestimonials(testData);
      if (faqData && faqData.length > 0) setFaqs(faqData);
    } catch {
      // Fallback silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  // Handle Local File Upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingTestimonial(null);
    setAuthorName("");
    setAuthorRole("Family Caregiver");
    setAuthorCanton("Zurich (ZH)");
    setQuoteText("");
    setImagePreview("/images/sarah.jpg");
    setIsTestimonialModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: TestimonialItem) => {
    setEditingTestimonial(item);
    setAuthorName(item.name);
    setAuthorRole(item.role);
    setAuthorCanton(item.canton);
    setQuoteText(item.quote);
    setImagePreview(item.image || "/images/sarah.jpg");
    setIsTestimonialModalOpen(true);
  };

  // Save / Update Testimonial
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: authorName,
      role: authorRole,
      canton: authorCanton,
      quote: quoteText,
      image: imagePreview,
      imageUrl: imagePreview,
      isVerified: true,
    };

    try {
      if (editingTestimonial) {
        await adminApi.saveTestimonial({ id: editingTestimonial.id, ...payload });
        setTestimonials((prev) =>
          prev.map((t) => (t.id === editingTestimonial.id ? { ...t, ...payload } : t))
        );
      } else {
        const created: any = await adminApi.saveTestimonial(payload);
        setTestimonials((prev) => [
          ...prev,
          {
            id: created?.id || Date.now(),
            ...payload,
          },
        ]);
      }
    } catch (err) {
      console.warn("Save testimonial error:", err);
    }

    setIsTestimonialModalOpen(false);
  };

  // Delete Testimonial
  const handleDeleteTestimonial = async (id: number | string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await adminApi.deleteTestimonial(id);
    } catch (err) {
      console.warn("Delete error:", err);
    }
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0C2B4E]">
            Content Management (CMS)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage verified caregiver testimonials, FAQ entries, and public media assets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadContent}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F2E59] hover:bg-[#0A2244] text-white px-4 py-2 text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Member Story</span>
          </button>
        </div>
      </div>

      {/* 1. Testimonials Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="h-5 w-5 text-[#1A5695]" />
            <h3 className="text-base font-bold text-[#0C2B4E]">
              Verified Caregiver Testimonials
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Displayed on public homepage with photo & Swiss canton badge
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4"
            >
              <div className="space-y-3">
                {/* Header info */}
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <Image
                      src={item.image || item.imageUrl || "/images/sarah.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.currentTarget as any).src = "/images/sarah.jpg";
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0C2B4E]">{item.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{item.role}</p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-0.5 border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified Caregiver
                    </span>
                  </div>
                </div>

                {/* Quote */}
                <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-3 rounded-2xl">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400">
                  {item.canton}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 text-slate-400 hover:text-[#1A5695] transition-colors rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteTestimonial(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. FAQs Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200/60">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[#1A5695]" />
            <h3 className="text-base font-bold text-[#0C2B4E]">
              Frequently Asked Questions (FAQ CMS)
            </h3>
            <span className="text-xs text-slate-400">
              ({faqs.length} active questions)
            </span>
          </div>

          {/* Multilingual View Tabs */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Languages className="h-3.5 w-3.5" /> Language:
            </span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60">
              {(["en", "de", "fr", "it"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSelectedFaqLang(lang)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-bold rounded-lg uppercase transition-all cursor-pointer",
                    selectedFaqLang === lang
                      ? "bg-white text-[#0C2B4E] shadow-2xs"
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  {faq.id}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase text-[#1A5695] bg-blue-50 px-2 py-0.5 rounded">
                    {faq.category}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {selectedFaqLang}
                  </span>
                </div>
              </div>
              <h4 className="text-sm font-bold text-[#0C2B4E]">
                {getLocalized(faq.question, selectedFaqLang)}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {getLocalized(faq.answer, selectedFaqLang)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial Modal */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#0C2B4E]">
                {editingTestimonial ? "Edit Caregiver Story" : "Add Caregiver Testimonial"}
              </h3>
              <button
                type="button"
                onClick={() => setIsTestimonialModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Author Name *</label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Sarah Renner"
                    className="w-full rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Role / Context *</label>
                  <input
                    type="text"
                    required
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    placeholder="e.g. Daughter & Primary Caregiver"
                    className="w-full rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Swiss Canton</label>
                  <select
                    value={authorCanton}
                    onChange={(e) => setAuthorCanton(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white cursor-pointer"
                  >
                    <option value="Zurich (ZH)">Zurich (ZH)</option>
                    <option value="Bern (BE)">Bern (BE)</option>
                    <option value="Lucerne (LU)">Lucerne (LU)</option>
                    <option value="Geneva (GE)">Geneva (GE)</option>
                    <option value="Vaud (VD)">Vaud (VD)</option>
                    <option value="Basel (BS)">Basel (BS)</option>
                    <option value="Ticino (TI)">Ticino (TI)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Photo URL / Asset</label>
                  <input
                    type="text"
                    value={imagePreview}
                    onChange={(e) => setImagePreview(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Testimonial Quote *</label>
                <textarea
                  rows={4}
                  required
                  value={quoteText}
                  onChange={(e) => setQuoteText(e.target.value)}
                  placeholder="The Care Compass gave our family immediate clarity..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTestimonialModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0F2E59] text-white font-bold shadow-xs cursor-pointer"
                >
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
