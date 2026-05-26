"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="/images/hero-poster.jpg"
        >
          <source src="/videos/hero-machining.mp4" type="video/mp4" />
        </video>
        {/* Light overlay */}
        <div className="absolute inset-0 bg-white/55" />
        {/* Subtle gradient fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F5F5F7] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs font-semibold tracking-widest uppercase text-brand-accent mb-6"
          >
            Singapore Precision Engineering
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-display-xl font-bold text-brand-black leading-[1.04] tracking-tight mb-6"
          >
            Precision Manufacturing,{" "}
            <span className="text-brand-accent">Engineered</span>{" "}
            in Singapore.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg text-brand-graphite/80 leading-relaxed mb-10 max-w-xl"
          >
            Allied MFG delivers high-quality machining and manufacturing solutions for demanding industrial applications.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/request-quote"
              className="inline-flex items-center px-7 py-3.5 bg-brand-black text-white text-sm font-semibold rounded-full hover:bg-brand-graphite transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Request a Quote
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center px-7 py-3.5 bg-white/80 backdrop-blur text-brand-black text-sm font-semibold rounded-full border border-black/10 hover:bg-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              View Capabilities
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border-2 border-brand-graphite/40 flex justify-center pt-1.5"
        >
          <span className="block w-1 h-1.5 bg-brand-graphite/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
