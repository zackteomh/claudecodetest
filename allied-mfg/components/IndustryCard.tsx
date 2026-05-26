"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface IndustryCardProps {
  title: string;
  description: string;
  icon: string;
  href?: string;
  index?: number;
}

export default function IndustryCard({
  title,
  description,
  icon,
  href = "/industries",
  index = 0,
}: IndustryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={href}
        className="group block rounded-2xl border border-black/[0.06] bg-white p-6 hover:border-brand-accent/20 hover:shadow-card transition-all duration-300 h-full"
      >
        <div className="text-3xl mb-4">{icon}</div>
        <h3 className="font-semibold text-brand-black mb-2">{title}</h3>
        <p className="text-sm text-brand-silver leading-relaxed">{description}</p>
      </Link>
    </motion.div>
  );
}
