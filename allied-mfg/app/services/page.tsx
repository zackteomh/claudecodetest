import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Allied MFG offers precision machining, CNC milling, CNC turning, metal fabrication, custom components, and quality inspection services in Singapore.",
};

const services = [
  {
    id: "precision-machining",
    number: "01",
    title: "Precision Machining",
    description:
      "From tight-tolerance shafts to complex multi-surface components — our precision machining capabilities deliver consistent results across a wide range of geometries and materials.",
    specs: ["Tolerances to ±0.005mm", "Wide material range", "High-mix, low-volume to mass production"],
  },
  {
    id: "cnc-milling",
    number: "02",
    title: "CNC Milling",
    description:
      "Our 3-axis, 4-axis, and 5-axis CNC machining centres handle prismatic and complex contoured parts with accuracy and efficiency. Ideal for brackets, housings, fixtures, and structural parts.",
    specs: ["3, 4, and 5-axis capability", "Complex contouring", "Large and small parts"],
  },
  {
    id: "cnc-turning",
    number: "03",
    title: "CNC Turning",
    description:
      "Precision turned components including shafts, bushings, fasteners, and rotational parts. Live tooling and sub-spindle capability for complete parts in a single setup.",
    specs: ["CNC lathes with live tooling", "Swiss-type turning for small parts", "OD/ID/thread machining"],
  },
  {
    id: "metal-fabrication",
    number: "04",
    title: "Metal Fabrication",
    description:
      "Cutting, bending, forming, and welding of sheet metal and structural steel. We produce frames, enclosures, panels, and fabricated assemblies to your drawings.",
    specs: ["Laser cutting", "CNC bending", "MIG/TIG welding"],
  },
  {
    id: "custom-parts",
    number: "05",
    title: "Custom Parts Manufacturing",
    description:
      "No standard part fits your application? We specialise in one-off and short-run custom components. Send us your drawing — we'll handle the rest.",
    specs: ["Prototype to production", "DFM support available", "Express lead times available"],
  },
  {
    id: "engineering-support",
    number: "06",
    title: "Engineering Support",
    description:
      "Our engineers work alongside your team on Design for Manufacturability (DFM), material selection, tolerance review, and process optimisation to ensure your part is built right the first time.",
    specs: ["DFM consultation", "Material advice", "Drawing review and feedback"],
  },
  {
    id: "quality-inspection",
    number: "07",
    title: "Quality Inspection",
    description:
      "Every part is inspected before leaving our facility. We use CMM and precision instruments to verify dimensions, surface finish, and compliance with your drawing requirements.",
    specs: ["CMM measurement", "Surface finish inspection", "Full dimensional reports on request"],
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-brand-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-widest uppercase text-brand-accent mb-5">Services</p>
            <h1 className="text-display-xl font-bold text-brand-black mb-5">
              Full-Cycle Precision Manufacturing
            </h1>
            <p className="text-lg text-brand-silver leading-relaxed">
              From your first drawing to final delivery — Allied MFG covers the complete manufacturing process with precision, speed, and quality assurance at every stage.
            </p>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="space-y-px">
            {services.map((svc, i) => (
              <div
                key={svc.id}
                className="group grid grid-cols-1 lg:grid-cols-12 gap-6 py-10 border-b border-black/[0.06] hover:bg-brand-light/50 px-2 rounded-xl transition-colors"
              >
                <div className="lg:col-span-1">
                  <span className="text-xs font-semibold text-brand-silver/60">{svc.number}</span>
                </div>
                <div className="lg:col-span-4">
                  <h3 className="text-xl font-bold text-brand-black mb-0">{svc.title}</h3>
                </div>
                <div className="lg:col-span-4">
                  <p className="text-sm text-brand-silver leading-relaxed">{svc.description}</p>
                </div>
                <div className="lg:col-span-3">
                  <ul className="space-y-1.5">
                    {svc.specs.map((spec) => (
                      <li key={spec} className="flex items-start gap-2 text-xs text-brand-graphite">
                        <span className="text-brand-accent">—</span>
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process overview */}
      <section className="py-20 bg-brand-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeading
            eyebrow="How We Work"
            title="Your Part, Our Process"
            subtitle="A straightforward workflow designed to get your parts right, on time."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
            {[
              { step: "01", title: "Send Drawing", desc: "Share your technical drawing, 3D file, or describe your part." },
              { step: "02", title: "Receive Quote", desc: "We review your requirements and provide a competitive quote within 24–48 hours." },
              { step: "03", title: "Manufacturing", desc: "Approved orders go directly to our floor. We keep you updated on progress." },
              { step: "04", title: "Delivery", desc: "Inspected, packaged, and delivered to your location in Singapore." },
            ].map((s) => (
              <div key={s.step} className="bg-white rounded-2xl p-7 shadow-card border border-black/[0.04]">
                <p className="text-xs font-semibold text-brand-accent mb-4">{s.step}</p>
                <h4 className="font-semibold text-brand-black mb-2">{s.title}</h4>
                <p className="text-sm text-brand-silver leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to get started?"
        subtitle="Upload your drawing or describe your project — we'll take it from there."
        cta="Request a Quote"
        secondary="View Machinery"
        secondaryHref="/machinery"
      />
    </>
  );
}
