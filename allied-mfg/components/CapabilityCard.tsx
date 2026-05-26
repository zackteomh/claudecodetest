"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface CapabilityCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
  index?: number;
}

export default function CapabilityCard({
  icon,
  title,
  description,
  href = "/services",
  index = 0,
}: CapabilityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={href}
        className="group block bg-white rounded-2xl p-7 shadow-card hover:shadow-card-hover border border-black/[0.04] transition-all duration-300 hover:-translate-y-1 h-full"
      >
        <div className="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center mb-5 group-hover:bg-brand-accent/10 transition-colors">
          <span className="text-brand-accent">{icon}</span>
        </div>
        <h3 className="font-semibold text-brand-black mb-2 text-base">{title}</h3>
        <p className="text-sm text-brand-silver leading-relaxed">{description}</p>
        <span className="inline-block mt-4 text-xs font-semibold text-brand-accent group-hover:translate-x-1 transition-transform">
          Learn more →
        </span>
      </Link>
    </motion.div>
  );
}
