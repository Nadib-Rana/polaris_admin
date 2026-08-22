"use client";

import React, { useState } from "react";
import {
  MessageSquareQuote,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  HelpCircle,
  Quote,
} from "lucide-react";
import { initialTestimonials, initialFaqs } from "@/lib/mockData";
import { TestimonialItem, FaqItem } from "@/types";

export default function ContentCmsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials);
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#0C2B4E]">
          Testimonials & FAQ Content Management
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage member reviews, caregiver stories, and frequently asked questions for the public website.
        </p>
      </div>

      {/* 1. Testimonials Manager */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="h-5 w-5 text-[#1A5695]" />
            <h3 className="text-base font-bold text-[#0C2B4E]">
              Member Testimonials
            </h3>
          </div>
          <button
            type="button"
            onClick={() => alert("Add testimonial modal")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F2E59] hover:bg-[#0A2244] text-white px-3.5 py-1.5 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Review</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="flex flex-col justify-between rounded-3xl bg-[#0C2B4E] text-white p-6 shadow-md space-y-4"
            >
              <div className="space-y-3">
                <Quote className="h-6 w-6 text-white/40" />
                <p className="text-xs text-slate-200 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{t.name}</h4>
                  <p className="text-[10px] text-slate-400">{t.role}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title="Edit"
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Delete"
                    onClick={() => setTestimonials(testimonials.filter((x) => x.id !== t.id))}
                    className="p-1 text-rose-400 hover:text-rose-300"
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
      <div className="space-y-4">
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
    </div>
  );
}
