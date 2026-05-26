"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Material Preparation",
    description:
      "Premium-grade metals selected and prepared to specification. Every job begins with the right material — aluminium, stainless steel, titanium, and more.",
    icon: "⬡",
    bg: "from-slate-100 to-slate-200",
  },
  {
    number: "02",
    title: "CNC Machining",
    description:
      "Multi-axis CNC milling and turning centres execute complex geometries with micron-level precision. Repeatability built into every cycle.",
    icon: "⚙",
    bg: "from-blue-50 to-slate-100",
  },
  {
    number: "03",
    title: "Quality Inspection",
    description:
      "Every component is inspected against drawing tolerances using CMM and precision measurement instruments before leaving our floor.",
    icon: "◎",
    bg: "from-gray-100 to-gray-200",
  },
  {
    number: "04",
    title: "Finished Components",
    description:
      "Finished, certified, and delivered on time. Parts ready for your assembly line, production system, or R&D lab.",
    icon: "✦",
    bg: "from-slate-50 to-gray-100",
  },
];

function ProcessStep({ step, index, progress }: {
  step: typeof steps[0];
  index: number;
  progress: import("framer-motion").MotionValue<number>;
}) {
  const start = index / steps.length;
  const end = (index + 1) / steps.length;

  const opacity = useTransform(progress, [start - 0.1, start + 0.05, end - 0.05, end + 0.1], [0, 1, 1, 0]);
  const y = useTransform(progress, [start - 0.1, start + 0.1], [30, 0]);

  const vizOpacity = useTransform(progress, [start - 0.1, start + 0.1, end - 0.05, end + 0.05], [0, 1, 1, 0]);
  const vizScale = useTransform(progress, [start - 0.1, start + 0.1], [0.92, 1]);

  return (
    <>
      {/* Left text */}
      <motion.div
        style={{ opacity, y }}
        className="absolute inset-0 flex flex-col justify-center pl-6 lg:pl-0 pr-6 lg:pr-16"
      >
        <span className="text-xs font-semibold tracking-widest text-brand-accent/60 uppercase mb-4">
          Step {step.number}
        </span>
        <h3 className="text-display-md font-bold text-brand-black mb-4">
          {step.title}
        </h3>
        <p className="text-base lg:text-lg text-brand-silver leading-relaxed max-w-sm">
          {step.description}
        </p>
      </motion.div>

      {/* Right visual */}
      <motion.div
        style={{ opacity: vizOpacity, scale: vizScale }}
        className={`absolute inset-0 bg-gradient-to-br ${step.bg} rounded-2xl flex items-center justify-center shadow-card`}
      >
        <div className="text-center">
          <div className="text-8xl mb-6 opacity-20">{step.icon}</div>
          <div className="text-6xl font-black text-brand-black/5">{step.number}</div>
          <p className="text-sm font-medium text-brand-silver mt-4">{step.title}</p>
        </div>
      </motion.div>
    </>
  );
}

export default function ScrollProcess() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={containerRef} className="relative bg-brand-light" style={{ height: `${steps.length * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          {/* Eyebrow */}
          <div className="absolute top-20 left-6 lg:left-8 xl:left-[max(2rem,calc((100vw-80rem)/2+2rem))]">
            <p className="text-xs font-semibold tracking-widest uppercase text-brand-accent">
              Our Process
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center h-full pt-24">
            {/* Left: text (relative, steps overlap) */}
            <div className="relative h-64 lg:h-80">
              {steps.map((step, i) => (
                <ProcessStep key={step.number} step={step} index={i} progress={scrollYProgress} />
              ))}
            </div>

            {/* Right: visual */}
            <div className="relative h-64 lg:h-96">
              {steps.map((step, i) => (
                <ProcessStep key={`viz-${step.number}`} step={step} index={i} progress={scrollYProgress} />
              ))}
            </div>
          </div>

          {/* Progress dots */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
            {steps.map((_, i) => {
              const dotStart = i / steps.length;
              const dotEnd = (i + 1) / steps.length;
              return (
                <ProgressDot key={i} progress={scrollYProgress} start={dotStart} end={dotEnd} />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgressDot({
  progress,
  start,
  end,
}: {
  progress: import("framer-motion").MotionValue<number>;
  start: number;
  end: number;
}) {
  const scale = useTransform(progress, [start, (start + end) / 2, end], [0.6, 1, 0.6]);
  const opacity = useTransform(progress, [start - 0.05, start + 0.05, end - 0.05, end + 0.05], [0.3, 1, 1, 0.3]);

  return (
    <motion.span
      style={{ scale, opacity }}
      className="w-1.5 h-1.5 rounded-full bg-brand-black"
    />
  );
}
