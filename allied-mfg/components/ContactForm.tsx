"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-brand-black mb-2">Message Sent</h3>
        <p className="text-brand-silver text-sm">We'll get back to you within one business day.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-brand-graphite mb-2 uppercase tracking-wide">
            Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Your name"
            className="w-full px-4 py-3 rounded-xl border border-black/10 bg-brand-light text-brand-black placeholder-brand-silver/60 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent/40 transition text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-brand-graphite mb-2 uppercase tracking-wide">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            required
            placeholder="you@company.com"
            className="w-full px-4 py-3 rounded-xl border border-black/10 bg-brand-light text-brand-black placeholder-brand-silver/60 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent/40 transition text-sm"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-brand-graphite mb-2 uppercase tracking-wide">
          Subject
        </label>
        <input
          type="text"
          placeholder="How can we help?"
          className="w-full px-4 py-3 rounded-xl border border-black/10 bg-brand-light text-brand-black placeholder-brand-silver/60 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent/40 transition text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-brand-graphite mb-2 uppercase tracking-wide">
          Message
        </label>
        <textarea
          rows={6}
          placeholder="Tell us about your project or enquiry..."
          className="w-full px-4 py-3 rounded-xl border border-black/10 bg-brand-light text-brand-black placeholder-brand-silver/60 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent/40 transition text-sm resize-none"
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center px-8 py-3.5 bg-brand-black text-white text-sm font-semibold rounded-full hover:bg-brand-graphite transition"
      >
        Send Message
      </button>
    </form>
  );
}
