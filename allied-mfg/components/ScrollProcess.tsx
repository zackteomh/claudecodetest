"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Material Preparation",
    description:
      "Premium-grade metals selected and verified to specification. Every job starts with the right material — aluminium, stainless steel, titanium, and more.",
    points: ["Material certification review", "Incoming quality check", "Stock cut to size"],
    color: "#E8F0FB",
    accentColor: "#1C3F6E",
  },
  {
    number: "02",
    title: "CNC Machining",
    description:
      "Multi-axis CNC milling and turning centres execute complex geometries with micron-level precision. Repeatability built into every cycle.",
    points: ["3, 4 & 5-axis milling", "CNC turning with live tooling", "In-process dimensional checks"],
    color: "#F0F0F0",
    accentColor: "#2C2C2E",
  },
  {
    number: "03",
    title: "Quality Inspection",
    description:
      "Every component is verified against drawing tolerances using CMM and precision instruments before leaving the floor.",
    points: ["CMM dimensional verification", "Surface finish measurement", "Full drawing compliance check"],
    color: "#EDF2EC",
    accentColor: "#2D6A4F",
  },
  {
    number: "04",
    title: "Finished Components",
    description:
      "Cleaned, certified, and delivered on time. Parts ready for your assembly line, production system, or R&D lab.",
    points: ["Final cleaning & packaging", "Documentation & labelling", "On-time delivery"],
    color: "#F5F3EE",
    accentColor: "#5C4033",
  },
];

// SVG visuals for each step
const stepVisuals = [
  // Material Preparation — stacked metal bars
  <svg key="01" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-w-[220px]">
    {[0, 1, 2, 3, 4].map((i) => (
      <rect key={i} x="20" y={30 + i * 32} width={160 - i * 10} height="22" rx="3"
        fill={i === 2 ? "#1C3F6E" : "#1C3F6E"} opacity={0.08 + (4 - i) * 0.12} />
    ))}
    <rect x="20" y="62" width="150" height="22" rx="3" fill="#1C3F6E" opacity="0.7" />
    <line x1="20" y1="62" x2="170" y2="62" stroke="#1C3F6E" strokeWidth="1.5" opacity="0.4" />
    <line x1="20" y1="84" x2="170" y2="84" stroke="#1C3F6E" strokeWidth="1.5" opacity="0.4" />
  </svg>,

  // CNC Machining — geometric machined part
  <svg key="02" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-w-[220px]">
    <circle cx="100" cy="100" r="60" stroke="#2C2C2E" strokeWidth="1.5" opacity="0.15" />
    <circle cx="100" cy="100" r="44" stroke="#2C2C2E" strokeWidth="1.5" opacity="0.25" />
    <circle cx="100" cy="100" r="16" fill="#2C2C2E" opacity="0.12" />
    <circle cx="100" cy="100" r="16" stroke="#2C2C2E" strokeWidth="1.5" opacity="0.3" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
      const rad = (angle * Math.PI) / 180;
      const x1 = 100 + 44 * Math.cos(rad);
      const y1 = 100 + 44 * Math.sin(rad);
      const x2 = 100 + 60 * Math.cos(rad);
      const y2 = 100 + 60 * Math.sin(rad);
      return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2C2C2E" strokeWidth="1.5" opacity="0.2" />;
    })}
    <circle cx="100" cy="100" r="4" fill="#2C2C2E" opacity="0.5" />
    {/* Tool path */}
    <path d="M100 36 L130 56 L130 144 L100 164 L70 144 L70 56 Z" stroke="#2C2C2E" strokeWidth="1" strokeDasharray="4 3" opacity="0.2" />
  </svg>,

  // Quality Inspection — CMM crosshair
  <svg key="03" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-w-[220px]">
    <circle cx="100" cy="100" r="65" stroke="#2D6A4F" strokeWidth="1" opacity="0.12" />
    <circle cx="100" cy="100" r="45" stroke="#2D6A4F" strokeWidth="1.5" opacity="0.2" />
    <circle cx="100" cy="100" r="25" stroke="#2D6A4F" strokeWidth="1.5" opacity="0.35" />
    <line x1="35" y1="100" x2="165" y2="100" stroke="#2D6A4F" strokeWidth="1.5" opacity="0.3" />
    <line x1="100" y1="35" x2="100" y2="165" stroke="#2D6A4F" strokeWidth="1.5" opacity="0.3" />
    <circle cx="100" cy="100" r="4" fill="#2D6A4F" opacity="0.7" />
    {/* tick marks */}
    {[0, 90, 180, 270].map((a) => {
      const rad = (a * Math.PI) / 180;
      return (
        <line key={a}
          x1={100 + 42 * Math.cos(rad)} y1={100 + 42 * Math.sin(rad)}
          x2={100 + 48 * Math.cos(rad)} y2={100 + 48 * Math.sin(rad)}
          stroke="#2D6A4F" strokeWidth="2" opacity="0.5" />
      );
    })}
    {/* Measurement bracket */}
    <path d="M140 68 L160 68 L160 132 L140 132" stroke="#2D6A4F" strokeWidth="1.5" opacity="0.4" fill="none" />
    <text x="163" y="102" fill="#2D6A4F" fontSize="9" opacity="0.5" fontFamily="monospace">±0.005</text>
  </svg>,

  // Finished Component — clean hex part
  <svg key="04" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-w-[220px]">
    <polygon points="100,40 150,68 150,132 100,160 50,132 50,68"
      fill="#5C4033" opacity="0.06" stroke="#5C4033" strokeWidth="1.5" strokeOpacity="0.25" />
    <polygon points="100,58 134,76 134,124 100,142 66,124 66,76"
      fill="#5C4033" opacity="0.08" stroke="#5C4033" strokeWidth="1.5" strokeOpacity="0.3" />
    <circle cx="100" cy="100" r="18" fill="#5C4033" opacity="0.12" stroke="#5C4033" strokeWidth="1.5" strokeOpacity="0.4" />
    <circle cx="100" cy="100" r="5" fill="#5C4033" opacity="0.5" />
    {/* bolt holes */}
    {[0, 60, 120, 180, 240, 300].map((a) => {
      const rad = (a * Math.PI) / 180;
      return <circle key={a} cx={100 + 36 * Math.cos(rad)} cy={100 + 36 * Math.sin(rad)} r="4"
        stroke="#5C4033" strokeWidth="1.2" opacity="0.3" fill="none" />;
    })}
  </svg>,
];

// ---- Sub-components (hooks called at component level = valid) ----

function StepText({
  step,
  index,
  total,
  progress,
}: {
  step: typeof steps[0];
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const s = index / total;
  const e = (index + 1) / total;
  const buf = 0.04;

  const opacity = useTransform(
    progress,
    [Math.max(0, s - buf), s + buf, e - buf, Math.min(1, e + buf)],
    [0, 1, 1, 0]
  );
  const y = useTransform(progress, [s, s + 0.08], [18, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col justify-center"
    >
      <p
        className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
        style={{ color: step.accentColor }}
      >
        Step {step.number}
      </p>
      <h3 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4 leading-tight">
        {step.title}
      </h3>
      <p className="text-base text-brand-silver leading-relaxed mb-6 max-w-sm">
        {step.description}
      </p>
      <ul className="space-y-2">
        {step.points.map((pt) => (
          <li key={pt} className="flex items-center gap-2.5 text-sm text-brand-graphite">
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: step.accentColor, opacity: 0.6 }}
            />
            {pt}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function StepVisual({
  step,
  visual,
  index,
  total,
  progress,
}: {
  step: typeof steps[0];
  visual: React.ReactNode;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const s = index / total;
  const e = (index + 1) / total;
  const buf = 0.04;

  const opacity = useTransform(
    progress,
    [Math.max(0, s - buf), s + buf, e - buf, Math.min(1, e + buf)],
    [0, 1, 1, 0]
  );
  const scale = useTransform(progress, [s, s + 0.08], [0.94, 1]);

  return (
    <motion.div
      style={{ opacity, scale }}
      className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center"
      css-bg={step.color}
    >
      <div
        className="w-full h-full rounded-3xl flex flex-col items-center justify-center p-10"
        style={{ backgroundColor: step.color }}
      >
        <div className="flex items-center justify-center w-full h-48">
          {visual}
        </div>
        <p className="text-xs font-semibold tracking-widest uppercase mt-6"
          style={{ color: step.accentColor, opacity: 0.5 }}>
          {step.title}
        </p>
      </div>
    </motion.div>
  );
}

function StepDot({
  index,
  total,
  progress,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const s = index / total;
  const e = (index + 1) / total;
  const opacity = useTransform(progress, [Math.max(0, s - 0.05), s + 0.05, e - 0.05, Math.min(1, e + 0.05)], [0.2, 1, 1, 0.2]);
  const width = useTransform(progress, [Math.max(0, s - 0.05), s + 0.05], [6, 24]);

  return (
    <motion.span
      style={{ opacity, width }}
      className="block h-1 rounded-full bg-brand-black"
    />
  );
}

export default function ScrollProcess() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const total = steps.length;

  return (
    <section
      ref={containerRef}
      className="relative bg-white"
      style={{ height: `${total * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full flex flex-col justify-center gap-8">
          {/* Eyebrow */}
          <div className="pt-20">
            <p className="text-xs font-semibold tracking-widest uppercase text-brand-accent">
              Our Process
            </p>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center flex-1">
            {/* Text column */}
            <div className="relative h-72">
              {steps.map((step, i) => (
                <StepText key={step.number} step={step} index={i} total={total} progress={scrollYProgress} />
              ))}
            </div>

            {/* Visual column */}
            <div className="relative h-72 lg:h-96">
              {steps.map((step, i) => (
                <StepVisual key={step.number} step={step} visual={stepVisuals[i]} index={i} total={total} progress={scrollYProgress} />
              ))}
            </div>
          </div>

          {/* Progress pills */}
          <div className="pb-10 flex gap-2 items-center">
            {steps.map((_, i) => (
              <StepDot key={i} index={i} total={total} progress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
