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
  Save,
  Globe2,
} from "lucide-react";
import { initialTestimonials, initialFaqs } from "@/lib/mockData";
import { TestimonialItem, FaqItem } from "@/types";
import { adminApi } from "@/lib/api";
import { useAdminLanguage } from "@/context/AdminLanguageContext";
import { getLocalizedContent } from "@/lib/formatters";
import { cn } from "@/lib/utils";

function getLocalized(val: any, lang: string = "de"): string {
  return getLocalizedContent(val, lang);
}

export default function ContentCmsPage() {
  const { lang, t } = useAdminLanguage();
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials);
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs);
  const [loading, setLoading] = useState(false);
  const [selectedFaqLang, setSelectedFaqLang] = useState<"de" | "en" | "fr" | "it">((lang as any) || "de");

  // Modal State for Testimonial
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
  const [modalTestimonialLang, setModalTestimonialLang] = useState<"de" | "en" | "fr" | "it">("de");

  // Form Fields for Testimonial
  const [authorName, setAuthorName] = useState("");
  const [authorRoleObj, setAuthorRoleObj] = useState<Record<string, string>>({ de: "", en: "", fr: "", it: "" });
  const [authorCanton, setAuthorCanton] = useState("Zürich (ZH)");
  const [quoteObj, setQuoteObj] = useState<Record<string, string>>({ de: "", en: "", fr: "", it: "" });
  const [imagePreview, setImagePreview] = useState("/images/sarah.jpg");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal State for FAQ
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [modalFaqLang, setModalFaqLang] = useState<"de" | "en" | "fr" | "it">("de");
  const [faqQuestionObj, setFaqQuestionObj] = useState<Record<string, string>>({ de: "", en: "", fr: "", it: "" });
  const [faqAnswerObj, setFaqAnswerObj] = useState<Record<string, string>>({ de: "", en: "", fr: "", it: "" });
  const [faqCategory, setFaqCategory] = useState("General");

  useEffect(() => {
    if (lang && ["de", "en", "fr", "it"].includes(lang)) {
      setSelectedFaqLang(lang as any);
    }
  }, [lang]);

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
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

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

  const handleOpenAddTestimonial = () => {
    setEditingTestimonial(null);
    setAuthorName("");
    setAuthorRoleObj({
      de: "Pflegende Angehörige",
      en: "Family Caregiver",
      fr: "Proche aidante",
      it: "Familiare curante",
    });
    setAuthorCanton("Zürich (ZH)");
    setQuoteObj({ de: "", en: "", fr: "", it: "" });
    setImagePreview("/images/sarah.jpg");
    setModalTestimonialLang(lang || "de");
    setIsTestimonialModalOpen(true);
  };

  const handleOpenEditTestimonial = (item: TestimonialItem) => {
    setEditingTestimonial(item);
    setAuthorName(item.name);
    setAuthorCanton(typeof item.canton === "string" ? item.canton : (item.canton as any)?.de || "Zürich (ZH)");
    
    const roleMap: Record<string, string> =
      typeof item.role === "object"
        ? { ...(item.role as Record<string, string>) }
        : {
            de: getLocalizedContent(item.role, "de"),
            en: getLocalizedContent(item.role, "en"),
            fr: getLocalizedContent(item.role, "fr"),
            it: getLocalizedContent(item.role, "it"),
          };
    setAuthorRoleObj(roleMap);

    const quoteMap: Record<string, string> =
      typeof item.quote === "object"
        ? { ...(item.quote as Record<string, string>) }
        : {
            de: getLocalizedContent(item.quote, "de"),
            en: getLocalizedContent(item.quote, "en"),
            fr: getLocalizedContent(item.quote, "fr"),
            it: getLocalizedContent(item.quote, "it"),
          };
    setQuoteObj(quoteMap);

    setImagePreview(item.image || item.imageUrl || "/images/sarah.jpg");
    setModalTestimonialLang(lang || "de");
    setIsTestimonialModalOpen(true);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: TestimonialItem = {
      id: editingTestimonial ? editingTestimonial.id : Date.now(),
      name: authorName,
      role: authorRoleObj,
      canton: authorCanton,
      quote: quoteObj,
      image: imagePreview,
      imageUrl: imagePreview,
      isVerified: true,
    };

    try {
      if (editingTestimonial) {
        await adminApi.saveTestimonial(payload);
        setTestimonials((prev) =>
          prev.map((t) => (t.id === editingTestimonial.id ? payload : t))
        );
      } else {
        const created: any = await adminApi.saveTestimonial(payload);
        setTestimonials((prev) => [
          ...prev,
          {
            ...payload,
            id: created?.id || Date.now(),
          },
        ]);
      }
    } catch (err) {
      console.warn("Save testimonial error:", err);
    }

    setIsTestimonialModalOpen(false);
    alert(t("content.saveTestimonial") || "Erfahrungsbericht erfolgreich gespeichert!");
  };

  const handleDeleteTestimonial = async (id: number | string) => {
    if (!confirm(t("content.confirmDeleteTestimonial") || "Möchten Sie diesen Erfahrungsbericht wirklich löschen?")) return;
    try {
      await adminApi.deleteTestimonial(id);
    } catch (err) {
      console.warn("Delete error:", err);
    }
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  const handleOpenAddFaq = () => {
    setEditingFaq(null);
    setFaqQuestionObj({ de: "", en: "", fr: "", it: "" });
    setFaqAnswerObj({ de: "", en: "", fr: "", it: "" });
    setFaqCategory("General");
    setModalFaqLang(selectedFaqLang || "de");
    setIsFaqModalOpen(true);
  };

  const handleOpenEditFaq = (item: FaqItem) => {
    setEditingFaq(item);
    const qMap: Record<string, string> =
      typeof item.question === "object"
        ? { ...(item.question as Record<string, string>) }
        : {
            de: getLocalizedContent(item.question, "de"),
            en: getLocalizedContent(item.question, "en"),
            fr: getLocalizedContent(item.question, "fr"),
            it: getLocalizedContent(item.question, "it"),
          };
    setFaqQuestionObj(qMap);

    const aMap: Record<string, string> =
      typeof item.answer === "object"
        ? { ...(item.answer as Record<string, string>) }
        : {
            de: getLocalizedContent(item.answer, "de"),
            en: getLocalizedContent(item.answer, "en"),
            fr: getLocalizedContent(item.answer, "fr"),
            it: getLocalizedContent(item.answer, "it"),
          };
    setFaqAnswerObj(aMap);

    setFaqCategory(item.category || "General");
    setModalFaqLang(selectedFaqLang || "de");
    setIsFaqModalOpen(true);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: FaqItem = {
      id: editingFaq ? editingFaq.id : `FAQ-${Date.now()}`,
      question: faqQuestionObj,
      answer: faqAnswerObj,
      category: faqCategory,
    };

    try {
      if (editingFaq) {
        await adminApi.saveFaq(payload);
        setFaqs((prev) =>
          prev.map((f) => (f.id === editingFaq.id ? payload : f))
        );
      } else {
        const created: any = await adminApi.saveFaq(payload);
        setFaqs((prev) => [
          ...prev,
          {
            ...payload,
            id: created?.id || `FAQ-${Date.now()}`,
          },
        ]);
      }
    } catch (err) {
      console.warn("Save FAQ error:", err);
    }

    setIsFaqModalOpen(false);
    alert(t("content.saveFaq") || "FAQ erfolgreich gespeichert!");
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm(t("content.confirmDeleteFaq") || "Möchten Sie diese FAQ wirklich löschen?")) return;
    try {
      await adminApi.deleteFaq(id);
    } catch (err) {
      console.warn("Delete error:", err);
    }
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0C2B4E]">
            {t("content.title") || "Erfahrungsberichte & FAQs"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t("content.subtitle") || "Mitgliederstimmen, Fotos und häufig gestellte Fragen verwalten"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={loadContent}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            <span>{t("overview.refresh") || "Aktualisieren"}</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAddTestimonial}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F2E59] hover:bg-[#0A2244] text-white px-4 py-2 text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{t("content.addMemberStory") || "Neuen Erfahrungsbericht erstellen"}</span>
          </button>
        </div>
      </div>

      {/* 1. Testimonials Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="h-5 w-5 text-[#1A5695]" />
            <h3 className="text-base font-bold text-[#0C2B4E]">
              {t("content.testimonialsTitle") || "Verifizierte Mitglieder-Erfahrungsberichte"}
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {t("content.testimonialsHelper") || "Wird auf der öffentlichen Startseite mit Foto & Schweizer Kantons-Badge angezeigt"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {testimonials.map((item) => {
            const localizedRole = getLocalized(item.role, lang);
            const localizedQuote = getLocalized(item.quote, lang);

            return (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-3xl bg-white p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4"
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
                      <p className="text-xs text-slate-500 font-medium">{localizedRole}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-0.5 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        {t("content.verifiedBadge") || "Verifizierter Angehöriger"}
                      </span>
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-3.5 rounded-2xl">
                    &ldquo;{localizedQuote}&rdquo;
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400">
                    {typeof item.canton === "string" ? item.canton : (item.canton as any)?.de || item.canton}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditTestimonial(item)}
                      className="p-1.5 text-slate-400 hover:text-[#1A5695] transition-colors rounded-lg hover:bg-slate-50 cursor-pointer"
                      title="Bearbeiten"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTestimonial(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 cursor-pointer"
                      title="Löschen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. FAQs Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200/60">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[#1A5695]" />
            <h3 className="text-base font-bold text-[#0C2B4E]">
              {t("content.faqsTitle") || "Häufig gestellte Fragen (FAQs)"}
            </h3>
            <span className="text-xs text-slate-400">
              ({faqs.length} {t("content.faqsActive") || "Fragen aktiv"})
            </span>
          </div>

          {/* Multilingual View Tabs & Add FAQ Button */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60">
              {(["de", "en", "fr", "it"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setSelectedFaqLang(l)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-bold rounded-lg uppercase transition-all cursor-pointer",
                    selectedFaqLang === l
                      ? "bg-white text-[#0C2B4E] shadow-2xs"
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleOpenAddFaq}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#1A5695] bg-blue-50 border border-blue-200/70 hover:bg-blue-100 px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{t("content.addFaq") || "Neue FAQ hinzufügen"}</span>
            </button>
          </div>
        </div>

        {/* FAQs List */}
        <div className="space-y-3">
          {faqs.map((faq) => {
            const currentQ = getLocalized(faq.question, selectedFaqLang);
            const currentA = getLocalized(faq.answer, selectedFaqLang);

            return (
              <div
                key={faq.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs"
              >
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase bg-blue-50 text-[#1A5695] px-2 py-0.5 rounded-md">
                      {faq.category || "General"}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {faq.id}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-[#0C2B4E]">
                      {currentQ}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 pl-1 leading-relaxed">
                    {currentA}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEditFaq(faq)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Bearbeiten
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Testimonial Photo & Content Modal */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-[#F8FAFC]">
              <h3 className="text-lg font-bold text-[#0C2B4E]">
                {editingTestimonial ? "Erfahrungsbericht bearbeiten" : "Neuen Erfahrungsbericht erstellen"}
              </h3>
              <button
                type="button"
                onClick={() => setIsTestimonialModalOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-200 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Language Switcher inside Testimonial Modal */}
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
                      onClick={() => setModalTestimonialLang(l)}
                      className={cn(
                        "px-2.5 py-1 text-xs font-bold uppercase rounded-lg transition-all",
                        modalTestimonialLang === l
                          ? "bg-white text-[#1A5695] shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Upload & Preview Section */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0C2B4E]">Foto des Mitglieds / Avatars</label>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-[#1A5695] bg-slate-200 shrink-0">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-[#0C2B4E] hover:bg-slate-100 shadow-2xs cursor-pointer"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Neues Foto hochladen</span>
                    </button>
                    <p className="text-[10px] text-slate-400">
                      Unterstützt PNG, JPG oder WebP
                    </p>
                  </div>
                </div>
              </div>

              {/* Author Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0C2B4E]">Name der / des Angehörigen *</label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="z.B. Sarah Renner"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-[#1A5695]"
                />
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0C2B4E]">
                  Rolle / Untertitel ({modalTestimonialLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={authorRoleObj[modalTestimonialLang] || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAuthorRoleObj((prev) => ({ ...prev, [modalTestimonialLang]: val }));
                  }}
                  placeholder="z.B. Pflegende Angehörige, Zürich"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-[#1A5695]"
                />
              </div>

              {/* Swiss Canton */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0C2B4E]">Schweizer Kanton</label>
                <select
                  value={authorCanton}
                  onChange={(e) => setAuthorCanton(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-[#1A5695]"
                >
                  <option value="Zürich (ZH)">Zürich (ZH)</option>
                  <option value="Bern (BE)">Bern (BE)</option>
                  <option value="Waadt (VD)">Waadt (VD)</option>
                  <option value="Genf (GE)">Genf (GE)</option>
                  <option value="Luzern (LU)">Luzern (LU)</option>
                  <option value="Basel (BS)">Basel (BS)</option>
                  <option value="St. Gallen (SG)">St. Gallen (SG)</option>
                </select>
              </div>

              {/* Quote Text */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0C2B4E]">
                  Erfahrungsbericht / Zitat ({modalTestimonialLang.toUpperCase()}) *
                </label>
                <textarea
                  required
                  rows={4}
                  value={quoteObj[modalTestimonialLang] || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setQuoteObj((prev) => ({ ...prev, [modalTestimonialLang]: val }));
                  }}
                  placeholder="Schreiben Sie hier den Erfahrungsbericht..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:outline-hidden focus:border-[#1A5695] leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTestimonialModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0F2E59] hover:bg-[#0A2244] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Erfahrungsbericht speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-[#F8FAFC]">
              <h3 className="text-lg font-bold text-[#0C2B4E]">
                {editingFaq ? "FAQ bearbeiten" : "Neue FAQ hinzufügen"}
              </h3>
              <button
                type="button"
                onClick={() => setIsFaqModalOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-200 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Language Switcher inside FAQ Modal */}
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
                      onClick={() => setModalFaqLang(l)}
                      className={cn(
                        "px-2.5 py-1 text-xs font-bold uppercase rounded-lg transition-all",
                        modalFaqLang === l
                          ? "bg-white text-[#1A5695] shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0C2B4E]">Kategorie</label>
                <select
                  value={faqCategory}
                  onChange={(e) => setFaqCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-[#1A5695]"
                >
                  <option value="General">General / Allgemein</option>
                  <option value="Assessment">Assessment / Pflege-Kompass</option>
                  <option value="Privacy & Legal">Privacy & Legal / Datenschutz</option>
                  <option value="Finanzen & Spitex">Finanzen & Spitex</option>
                </select>
              </div>

              {/* Question */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0C2B4E]">
                  Frage ({modalFaqLang.toUpperCase()}) *
                </label>
                <input
                  type="text"
                  required
                  value={faqQuestionObj[modalFaqLang] || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFaqQuestionObj((prev) => ({ ...prev, [modalFaqLang]: val }));
                  }}
                  placeholder="z.B. Was ist Polaris Care?"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-[#1A5695]"
                />
              </div>

              {/* Answer */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0C2B4E]">
                  Antwort ({modalFaqLang.toUpperCase()}) *
                </label>
                <textarea
                  required
                  rows={4}
                  value={faqAnswerObj[modalFaqLang] || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFaqAnswerObj((prev) => ({ ...prev, [modalFaqLang]: val }));
                  }}
                  placeholder="Schreiben Sie hier die ausführliche Antwort..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:outline-hidden focus:border-[#1A5695] leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0F2E59] hover:bg-[#0A2244] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  FAQ speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
