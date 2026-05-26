import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import CTASection from "@/components/CTASection";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Quality",
  description:
    "Allied MFG maintains rigorous quality assurance across all manufacturing operations, with in-house CMM inspection and full dimensional verification.",
};

const pillars = [
  {
    icon: "◎",
    title: "Tight Tolerances",
    description: "Our machining capability routinely achieves tolerances down to ±0.005mm, with documented process control for repeatability across the full production run.",
  },
  {
    icon: "✦",
    title: "In-house Inspection",
    description: "Every critical component is inspected on our in-house CMM. We verify dimensions, geometry, and surface finish before any part ships.",
  },
  {
    icon: "◈",
    title: "Repeatable Processes",
    description: "Standardised setups, tooling, and machining parameters ensure that part 500 matches part 1 — every time.",
  },
  {
    icon: "⚡",
    title: "Traceability",
    description: "Full material and process traceability available on request. We maintain records of all jobs to support your quality management system.",
  },
];

const inspectionSteps = [
  { step: "01", title: "Drawing Review", description: "Before machining starts, our team reviews your drawing for completeness, tolerance clarity, and DFM issues." },
  { step: "02", title: "First Article Inspection", description: "The first part off every new setup is fully inspected against all critical dimensions before production continues." },
  { step: "03", title: "In-process Checks", description: "Operators perform periodic checks during machining to catch any drift before it affects a full batch." },
  { step: "04", title: "Final Inspection", description: "Every part or batch is inspected using CMM, precision gauges, and surface finish instruments on completion." },
  { step: "05", title: "Documentation", description: "Dimensional reports, material certificates, and inspection records available on request for your quality records." },
];

export default function QualityPage() {
  return (
    <>
      <PageHeader
        eyebrow="Quality"
        title={"Quality Isn't an Option.\nIt's the Standard."}
        subtitle="At Allied MFG, quality is built into every step — from drawing review to final delivery. Our inspection processes ensure your parts are right, every time."
      />

      {/* Pillars */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeading eyebrow="Quality Pillars" title="How We Ensure Excellence" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
            {pillars.map((p, i) => (
              <FadeIn key={p.title} delay={i * 0.08}>
                <div className="bg-brand-light rounded-2xl p-7 border border-black/[0.04] h-full">
                  <div className="text-3xl opacity-20 mb-5">{p.icon}</div>
                  <h3 className="font-semibold text-brand-black mb-2">{p.title}</h3>
                  <p className="text-sm text-brand-silver leading-relaxed">{p.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Inspection process */}
      <section className="py-20 bg-brand-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <FadeIn direction="left">
              <p className="text-xs font-semibold tracking-widest uppercase text-brand-accent mb-4">Inspection Process</p>
              <h2 className="text-display-md font-bold text-brand-black mb-5">From Drawing to Delivery</h2>
              <p className="text-base text-brand-silver leading-relaxed">
                Our inspection process is structured to catch issues early and verify conformance at every key stage — not just at the end.
              </p>
            </FadeIn>
            <div className="space-y-6">
              {inspectionSteps.map((s, i) => (
                <FadeIn key={s.step} delay={i * 0.07}>
                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-black/[0.06] flex items-center justify-center">
                      <span className="text-xs font-semibold text-brand-accent">{s.step}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-black mb-1">{s.title}</h4>
                      <p className="text-sm text-brand-silver leading-relaxed">{s.description}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tolerance capability */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeading
            eyebrow="Capability"
            title="What We Can Hold"
            subtitle="General tolerance capability across our machining operations."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 mt-12">
            {[
              { param: "Linear Tolerance", value: "±0.005mm" },
              { param: "Flatness", value: "0.005mm" },
              { param: "Roundness", value: "0.003mm" },
              { param: "Surface Finish", value: "Ra 0.4 µm" },
              { param: "Position", value: "±0.01mm" },
            ].map((c, i) => (
              <FadeIn key={c.param} delay={i * 0.07}>
                <div className="bg-brand-light rounded-2xl p-6 text-center border border-black/[0.04]">
                  <p className="text-xl font-bold text-brand-black mb-2">{c.value}</p>
                  <p className="text-xs text-brand-silver uppercase tracking-wide">{c.param}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <p className="text-xs text-brand-silver/50 text-center mt-6">
            * Tolerance capability varies by material, geometry, and process. Contact us for application-specific discussion.
          </p>
        </div>
      </section>

      <CTASection
        title="Need a trusted precision manufacturer?"
        subtitle="Quality backed by documentation and process discipline — every order."
        cta="Request a Quote"
        secondary="Contact Our Team"
        secondaryHref="/contact"
        dark
      />
    </>
  );
}
