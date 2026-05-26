"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`${align === "center" ? "text-center mx-auto" : ""} max-w-3xl`}
    >
      {eyebrow && (
        <p className={`text-xs font-semibold tracking-widest uppercase mb-4 ${light ? "text-white/50" : "text-brand-accent"}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`text-display-md font-bold mb-4 ${light ? "text-white" : "text-brand-black"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-base lg:text-lg leading-relaxed ${light ? "text-white/60" : "text-brand-silver"}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
