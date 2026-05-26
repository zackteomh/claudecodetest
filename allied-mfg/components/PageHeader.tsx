"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  cta?: { label: string; href: string };
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function PageHeader({ eyebrow, title, subtitle, cta }: PageHeaderProps) {
  return (
    <section className="pt-32 pb-20 bg-brand-light">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease }}
            className="text-xs font-semibold tracking-widest uppercase text-brand-accent mb-5"
          >
            {eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12, ease }}
            className="text-display-xl font-bold text-brand-black mb-5"
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22, ease }}
              className="text-lg text-brand-silver leading-relaxed"
            >
              {subtitle}
            </motion.p>
          )}

          {cta && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32, ease }}
              className="mt-8"
            >
              <Link
                href={cta.href}
                className="inline-flex items-center px-6 py-3 bg-brand-black text-white text-sm font-semibold rounded-full hover:bg-brand-graphite transition-all hover:scale-[1.02]"
              >
                {cta.label}
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
