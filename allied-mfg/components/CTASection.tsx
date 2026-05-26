"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface CTASectionProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  cta?: string;
  ctaHref?: string;
  secondary?: string;
  secondaryHref?: string;
  dark?: boolean;
}

export default function CTASection({
  eyebrow = "Get Started",
  title = "Have a precision part to manufacture?",
  subtitle,
  cta = "Request a Quote",
  ctaHref = "/request-quote",
  secondary,
  secondaryHref,
  dark = false,
}: CTASectionProps) {
  return (
    <section className={`py-24 lg:py-32 ${dark ? "bg-brand-black" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {eyebrow && (
            <p className={`text-xs font-semibold tracking-widest uppercase mb-4 ${dark ? "text-white/40" : "text-brand-accent"}`}>
              {eyebrow}
            </p>
          )}
          <h2 className={`text-display-lg font-bold mb-4 max-w-2xl mx-auto ${dark ? "text-white" : "text-brand-black"}`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`text-lg mb-10 max-w-xl mx-auto ${dark ? "text-white/60" : "text-brand-silver"}`}>
              {subtitle}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={ctaHref}
              className={`inline-flex items-center px-8 py-4 text-sm font-semibold rounded-full transition-all hover:scale-[1.02] active:scale-[0.98] ${
                dark
                  ? "bg-white text-brand-black hover:bg-white/90"
                  : "bg-brand-black text-white hover:bg-brand-graphite"
              }`}
            >
              {cta}
            </Link>
            {secondary && secondaryHref && (
              <Link
                href={secondaryHref}
                className={`inline-flex items-center px-8 py-4 text-sm font-semibold rounded-full border transition-all hover:scale-[1.02] ${
                  dark
                    ? "border-white/20 text-white hover:border-white/40"
                    : "border-black/10 text-brand-black hover:border-black/20"
                }`}
              >
                {secondary}
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
