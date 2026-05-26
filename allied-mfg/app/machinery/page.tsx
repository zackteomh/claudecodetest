import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import CTASection from "@/components/CTASection";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Machinery",
  description:
    "Allied MFG operates advanced CNC machining centres, CNC lathes, surface grinders, and CMM inspection equipment in Singapore.",
};

const machineCategories = [
  {
    category: "CNC Machining Centres",
    machines: [
      {
        name: "3-Axis Vertical Machining Centre",
        count: "Multiple units",
        capability: "Large envelope prismatic machining. Ideal for plates, blocks, housings, and brackets.",
        specs: ["Table: 1000 × 500mm typical", "Spindle: up to 15,000 RPM", "Tolerances: ±0.01mm standard"],
      },
      {
        name: "4-Axis Machining Centre",
        count: "Available",
        capability: "Rotational indexing for multi-face features without re-fixturing.",
        specs: ["4th axis rotary", "Complex contouring", "Reduced setups"],
      },
      {
        name: "5-Axis Machining Centre",
        count: "Available",
        capability: "Simultaneous 5-axis for complex geometries and undercuts in a single setup.",
        specs: ["Simultaneous 5-axis motion", "Complex 3D surfacing", "Ideal for aerospace & medical parts"],
      },
    ],
  },
  {
    category: "CNC Turning Centres",
    machines: [
      {
        name: "CNC Lathe with Live Tooling",
        count: "Multiple units",
        capability: "Turning, milling, drilling, and threading in a single setup.",
        specs: ["Diameter: up to 300mm", "Live tooling for milled features", "Y-axis capability"],
      },
      {
        name: "Sub-spindle Turning Centre",
        count: "Available",
        capability: "Complete parts in one cycle with front and back operations.",
        specs: ["Dual spindle", "Bar fed from 6–65mm", "Tight-tolerance turned parts"],
      },
    ],
  },
  {
    category: "Grinding & Finishing",
    machines: [
      {
        name: "Surface Grinder",
        count: "Multiple units",
        capability: "Flat and precision surface grinding for tight parallelism and flatness.",
        specs: ["Surface finish: Ra 0.4 typical", "Flat and angular grinding", "Gauge blocks and precision flats"],
      },
      {
        name: "Cylindrical Grinder",
        count: "Available",
        capability: "OD and ID cylindrical grinding for precision shafts and bores.",
        specs: ["OD and ID capability", "High diameter accuracy", "Fine roundness tolerances"],
      },
    ],
  },
  {
    category: "Quality & Inspection",
    machines: [
      {
        name: "Coordinate Measuring Machine (CMM)",
        count: "In-house",
        capability: "Full dimensional verification against drawing. 3D measurement of complex parts.",
        specs: ["3D probing", "Reporting to drawing", "Complex geometry verification"],
      },
      {
        name: "Profile Projector",
        count: "In-house",
        capability: "2D profile inspection for turned parts, threads, and small features.",
        specs: ["Profile measurement", "Thread verification", "Go/no-go gauging"],
      },
      {
        name: "Surface Roughness Tester",
        count: "In-house",
        capability: "Quantified surface finish measurement across all machined surfaces.",
        specs: ["Ra, Rz measurement", "Traceable calibration", "Portable for floor use"],
      },
    ],
  },
];

export default function MachineryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Machinery"
        title="The Equipment Behind the Precision"
        subtitle="Our manufacturing floor runs a comprehensive range of CNC machining centres, turning centres, grinding machines, and inspection equipment."
      />

      {/* Capacity bar */}
      <section className="bg-white py-12 border-y border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10+", label: "CNC Machining Centres" },
              { value: "8+", label: "CNC Turning Centres" },
              { value: "4+", label: "Grinding Machines" },
              { value: "In-house", label: "CMM Inspection" },
            ].map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.07}>
                <p className="text-2xl lg:text-3xl font-bold text-brand-black mb-1">{s.value}</p>
                <p className="text-xs text-brand-silver uppercase tracking-wide">{s.label}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Machine categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16">
          {machineCategories.map((cat, ci) => (
            <FadeIn key={cat.category}>
              <div>
                <h2 className="text-xl font-bold text-brand-black mb-8 pb-4 border-b border-black/[0.06]">
                  {cat.category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {cat.machines.map((machine, mi) => (
                    <FadeIn key={machine.name} delay={mi * 0.07}>
                      <div className="bg-brand-light rounded-2xl p-7 border border-black/[0.04] h-full">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <h3 className="font-semibold text-brand-black text-sm leading-snug">{machine.name}</h3>
                          <span className="text-xs text-brand-accent font-medium bg-brand-accent/5 px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">{machine.count}</span>
                        </div>
                        <p className="text-sm text-brand-silver leading-relaxed mb-4">{machine.capability}</p>
                        <ul className="space-y-1.5">
                          {machine.specs.map((spec) => (
                            <li key={spec} className="flex items-start gap-2 text-xs text-brand-graphite">
                              <span className="text-brand-accent">—</span>
                              {spec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Materials */}
      <section className="py-20 bg-brand-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeading
            eyebrow="Materials"
            title="What We Machine"
            subtitle="Allied MFG works with a broad range of engineering metals and plastics."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-12">
            {[
              "Aluminium", "Stainless Steel", "Mild Steel", "Titanium",
              "Copper", "Brass", "Tool Steel", "PEEK", "Delrin / POM",
              "Invar", "Bronze", "Inconel",
            ].map((mat, i) => (
              <FadeIn key={mat} delay={Math.min(i * 0.03, 0.2)}>
                <div className="bg-white rounded-xl p-4 text-center border border-black/[0.06] shadow-card">
                  <p className="text-sm font-medium text-brand-black">{mat}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Have a part that needs machining?"
        subtitle="Tell us your material, geometry, and tolerance requirements."
        cta="Request a Quote"
        dark
      />
    </>
  );
}
