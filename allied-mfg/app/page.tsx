import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import ScrollProcess from "@/components/ScrollProcess";
import SectionHeading from "@/components/SectionHeading";
import CapabilityCard from "@/components/CapabilityCard";
import IndustryCard from "@/components/IndustryCard";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Allied MFG Pte Ltd — Precision Manufacturing in Singapore",
  description:
    "Allied MFG delivers high-quality precision machining and manufacturing solutions for semiconductor, automation, and industrial applications in Singapore.",
};

const capabilities = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
    title: "CNC Machining",
    description: "Multi-axis CNC milling and turning with micron-level tolerances for complex parts.",
    href: "/services",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
    title: "Custom Components",
    description: "One-off prototypes to high-volume production. Every part built to your exact specification.",
    href: "/services",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
      </svg>
    ),
    title: "Industrial Manufacturing",
    description: "Scalable manufacturing solutions for automation, semiconductor, and power industries.",
    href: "/industries",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Quality Control",
    description: "Rigorous CMM inspection and tolerance verification on every component before delivery.",
    href: "/quality",
  },
];

const industries = [
  {
    title: "Semiconductor",
    description: "Ultra-precision components for wafer processing, vacuum systems, and cleanroom equipment.",
    icon: "◈",
  },
  {
    title: "Automation",
    description: "Custom fixtures, jigs, and mechanical assemblies for automated production lines.",
    icon: "⚙",
  },
  {
    title: "Power & Energy",
    description: "Robust machined parts for power generation, distribution, and energy infrastructure.",
    icon: "⚡",
  },
  {
    title: "Precision Engineering",
    description: "High-tolerance components across aerospace, medical, and advanced manufacturing.",
    icon: "◎",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Stats bar */}
      <section className="bg-white border-y border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "20+", label: "Years Experience" },
              { value: "500+", label: "Active Clients" },
              { value: "±0.005mm", label: "Tolerance Capability" },
              { value: "24/7", label: "Production Capacity" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl lg:text-3xl font-bold text-brand-black mb-1">{stat.value}</p>
                <p className="text-xs text-brand-silver uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-24 lg:py-32 bg-brand-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeading
            eyebrow="What We Do"
            title="Manufacturing Capabilities"
            subtitle="From raw material to finished component — we cover the full precision manufacturing cycle."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
            {capabilities.map((cap, i) => (
              <CapabilityCard key={cap.title} {...cap} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Scroll-driven process */}
      <ScrollProcess />

      {/* Industries */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
            <SectionHeading
              eyebrow="Industries"
              title="Built for Demanding Sectors"
              align="left"
            />
            <Link
              href="/industries"
              className="text-sm font-semibold text-brand-accent hover:underline shrink-0"
            >
              See all industries →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {industries.map((ind, i) => (
              <IndustryCard key={ind.title} {...ind} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Machinery preview */}
      <section className="py-24 lg:py-32 bg-brand-light overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-brand-accent mb-4">Machinery</p>
              <h2 className="text-display-md font-bold text-brand-black mb-5">
                Advanced CNC Equipment
              </h2>
              <p className="text-base text-brand-silver leading-relaxed mb-8 max-w-md">
                Our facility runs a comprehensive range of multi-axis CNC machining centres, lathes, and inspection equipment — enabling complex geometries and tight tolerances at scale.
              </p>
              <Link
                href="/machinery"
                className="inline-flex items-center px-6 py-3 bg-brand-black text-white text-sm font-semibold rounded-full hover:bg-brand-graphite transition-all"
              >
                View Machinery
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "CNC Machining Centres", count: "10+" },
                { label: "CNC Lathes", count: "8+" },
                { label: "Surface Grinders", count: "4+" },
                { label: "CMM Inspection", count: "In-house" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white rounded-2xl p-6 shadow-card border border-black/[0.04]"
                >
                  <p className="text-2xl font-bold text-brand-black mb-1">{item.count}</p>
                  <p className="text-xs text-brand-silver">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        eyebrow="Start Your Project"
        title="Have a precision part to manufacture?"
        subtitle="Send us your drawings and we'll respond within 1–2 business days with a competitive quote."
        cta="Request a Quote"
        ctaHref="/request-quote"
        secondary="Talk to an Engineer"
        secondaryHref="/contact"
        dark
      />
    </>
  );
}
