"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const projectTypes = [
  "CNC Milling",
  "CNC Turning",
  "Metal Fabrication",
  "Prototype",
  "Production Run",
  "Assembly",
  "Other",
];

const materials = [
  "Aluminium",
  "Stainless Steel",
  "Mild Steel",
  "Titanium",
  "Copper / Brass",
  "Plastic / Polymer",
  "Other",
];

interface FormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  projectType: string;
  material: string;
  quantity: string;
  message: string;
}

export default function QuoteForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    company: "",
    email: "",
    phone: "",
    projectType: "",
    material: "",
    quantity: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFileName(e.target.files[0].name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20"
      >
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-brand-black mb-3">Quote Request Sent</h3>
        <p className="text-brand-silver">Our team will get back to you within 1–2 business days.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-brand-graphite mb-2 uppercase tracking-wide">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white text-brand-black placeholder-brand-silver/60 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent/40 transition text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-brand-graphite mb-2 uppercase tracking-wide">
            Company
          </label>
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Company name"
            className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white text-brand-black placeholder-brand-silver/60 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent/40 transition text-sm"
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-brand-graphite mb-2 uppercase tracking-wide">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="you@company.com"
            className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white text-brand-black placeholder-brand-silver/60 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent/40 transition text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-brand-graphite mb-2 uppercase tracking-wide">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+65 xxxx xxxx"
            className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white text-brand-black placeholder-brand-silver/60 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent/40 transition text-sm"
          />
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-brand-graphite mb-2 uppercase tracking-wide">
            Project Type
          </label>
          <select
            name="projectType"
            value={form.projectType}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent/40 transition text-sm"
          >
            <option value="">Select project type</option>
            {projectTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-brand-graphite mb-2 uppercase tracking-wide">
            Material
          </label>
          <select
            name="material"
            value={form.material}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent/40 transition text-sm"
          >
            <option value="">Select material</option>
            {materials.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-xs font-semibold text-brand-graphite mb-2 uppercase tracking-wide">
          Quantity / Volume
        </label>
        <input
          type="text"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          placeholder="e.g. 50 units, prototype, production run"
          className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white text-brand-black placeholder-brand-silver/60 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent/40 transition text-sm"
        />
      </div>

      {/* File upload */}
      <div>
        <label className="block text-xs font-semibold text-brand-graphite mb-2 uppercase tracking-wide">
          Upload Drawing / File
        </label>
        <label className="flex items-center gap-4 w-full px-4 py-4 rounded-xl border border-dashed border-black/15 bg-white/60 cursor-pointer hover:border-brand-accent/30 transition">
          <svg className="w-5 h-5 text-brand-silver flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span className="text-sm text-brand-silver">
            {fileName || "Attach DXF, DWG, PDF, STEP, or IGES file"}
          </span>
          <input type="file" accept=".dxf,.dwg,.pdf,.step,.stp,.iges,.igs" onChange={handleFile} className="hidden" />
        </label>
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-semibold text-brand-graphite mb-2 uppercase tracking-wide">
          Project Details
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={5}
          placeholder="Describe your part, tolerances, surface finish requirements, timeline..."
          className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white text-brand-black placeholder-brand-silver/60 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent/40 transition text-sm resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full sm:w-auto inline-flex justify-center items-center px-10 py-4 bg-brand-black text-white text-sm font-semibold rounded-full hover:bg-brand-graphite transition-all hover:scale-[1.01] active:scale-[0.99]"
      >
        Submit Quote Request
      </button>
    </form>
  );
}
