"use client";

import React, { useState, useRef } from "react";
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
} from "lucide-react";
import { initialTestimonials, initialFaqs } from "@/lib/mockData";
import { TestimonialItem, FaqItem } from "@/types";
import { cn } from "@/lib/utils";

export default function ContentCmsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials);
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs);

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
    setImagePreview(item.image);
    setIsTestimonialModalOpen(true);
  };

  // Save Testimonial
  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !quoteText.trim()) {
      alert("Please provide the author name and quote text.");
      return;
    }

    if (editingTestimonial) {
      setTestimonials((prev) =>
        prev.map((t) =>
          t.id === editingTestimonial.id
            ? {
                ...t,
                name: authorName,
                role: authorRole,
                canton: authorCanton,
                quote: quoteText,
                image: imagePreview,
              }
            : t
        )
      );
      alert("Testimonial updated successfully!");
    } else {
      const newItem: TestimonialItem = {
        id: Date.now(),
        name: authorName,
        role: authorRole,
        canton: authorCanton,
        quote: quoteText,
        image: imagePreview,
        isVerified: true,
      };
      setTestimonials((prev) => [...prev, newItem]);
      alert("New member review added successfully!");
    }

    setIsTestimonialModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#0C2B4E]">
          Testimonials & FAQ Content Management
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage member reviews, upload author photos, and update frequently asked questions for the public website.
        </p>
      </div>

      {/* 1. Testimonials Manager with Image Upload */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="h-5 w-5 text-[#1A5695]" />
            <h3 className="text-base font-bold text-[#0C2B4E]">
              Member Testimonials & Photo Manager
            </h3>
          </div>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F2E59] hover:bg-[#0A2244] text-white px-4 py-2 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Member Review & Photo</span>
          </button>
        </div>

        {/* Testimonials Grid with Photos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="flex flex-col justify-between rounded-3xl bg-[#0C2B4E] text-white p-6 shadow-md space-y-5 relative overflow-hidden"
            >
              <div className="space-y-3">
                <Quote className="h-6 w-6 text-white/40" />
                <p className="text-xs text-slate-200 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              {/* Author Photo & Profile */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 rounded-full overflow-hidden border-2 border-white/30 bg-slate-800 shrink-0">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1">
                      <span>{t.name}</span>
                      {t.isVerified && (
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      )}
                    </h4>
                    <p className="text-[10px] text-slate-400">{t.role}</p>
                    <span className="text-[9px] text-blue-300 font-semibold">{t.canton}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title="Edit"
                    onClick={() => handleOpenEdit(t)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Delete"
                    onClick={() => setTestimonials(testimonials.filter((x) => x.id !== t.id))}
                    className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-white/10 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. FAQ Manager */}
      <div className="space-y-4 pt-4 border-t border-slate-200/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[#1A5695]" />
            <h3 className="text-base font-bold text-[#0C2B4E]">
              Frequently Asked Questions (FAQ)
            </h3>
          </div>
          <button
            type="button"
            onClick={() => alert("Add FAQ modal")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-1.5 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 text-[#1A5695]" />
            <span>Add FAQ</span>
          </button>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs"
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase bg-blue-50 text-[#1A5695] px-2 py-0.5 rounded-md">
                    {faq.category}
                  </span>
                  <h4 className="text-xs font-bold text-[#0C2B4E]">{faq.question}</h4>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 pl-1">{faq.answer}</p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setFaqs(faqs.filter((f) => f.id !== faq.id))}
                  className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial Photo & Content Modal */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-[#F8FAFC]">
              <h3 className="text-lg font-bold text-[#0C2B4E]">
                {editingTestimonial ? "Edit Member Testimonial" : "Add New Member Testimonial"}
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
              {/* Photo Upload & Preview Section */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0C2B4E]">Member Photo / Avatar</label>
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
                      <span>Upload New Photo</span>
                    </button>
                    <p className="text-[10px] text-slate-400">
                      Supports PNG, JPG or WebP (square recommended)
                    </p>
                  </div>
                </div>
              </div>

              {/* Author Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0C2B4E]">Caregiver Name *</label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Sarah Renner"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-[#1A5695]"
                />
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0C2B4E]">Role / Subtitle</label>
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  placeholder="e.g. Family Caregiver, Zurich"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-[#1A5695]"
                />
              </div>

              {/* Swiss Canton */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0C2B4E]">Swiss Canton</label>
                <select
                  value={authorCanton}
                  onChange={(e) => setAuthorCanton(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-[#1A5695]"
                >
                  <option value="Zurich (ZH)">Zurich (ZH)</option>
                  <option value="Bern (BE)">Bern (BE)</option>
                  <option value="Vaud (VD)">Vaud (VD)</option>
                  <option value="Geneva (GE)">Geneva (GE)</option>
                  <option value="Lucerne (LU)">Lucerne (LU)</option>
                  <option value="Basel (BS)">Basel (BS)</option>
                </select>
              </div>

              {/* Quote Text */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0C2B4E]">Testimonial Quote *</label>
                <textarea
                  required
                  value={quoteText}
                  onChange={(e) => setQuoteText(e.target.value)}
                  placeholder="Write the caregiver's review or story here..."
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:outline-hidden focus:border-[#1A5695]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTestimonialModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0F2E59] hover:bg-[#0A2244] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Save Review & Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
