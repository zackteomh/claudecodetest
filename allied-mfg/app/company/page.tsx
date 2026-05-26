import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Company",
  description:
    "Allied MFG is a Singapore precision engineering company with over 20 years of manufacturing expertise serving semiconductor, automation, and industrial sectors.",
};

const values = [
  {
    title: "Precision",
    description: "Tolerances down to ±0.005mm. Every dimension matters.",
    icon: "◎",
  },
  {
    title: "Reliability",
    description: "Consistent quality, on-time delivery, every order.",
    icon: "✦",
  },
  {
    title: "Engineering Support",
    description: "Our team works with yours — from DFM review to final inspection.",
    icon: "⚙",
  },
  {
    title: "Singapore Made",
    description: "Manufactured in Singapore to the highest industrial standards.",
    icon: "◈",
  },
];

export default function CompanyPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-brand-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-widest uppercase text-brand-accent mb-5">About Us</p>
            <h1 className="text-display-xl font-bold text-brand-black mb-6">
              Built on Precision.<br />Driven by Engineering.
            </h1>
            <p className="text-lg text-brand-silver leading-relaxed max-w-xl">
              Allied MFG Pte Ltd is a Singapore-based precision engineering and manufacturing company. For over two decades, we have been delivering machined components and manufacturing solutions to industries that demand the highest standards.
            </p>
          </div>
        </div>
      </section>

      {/* About body */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-brand-accent mb-4">Who We Are</p>
              <h2 className="text-display-md font-bold text-brand-black mb-5">
                Singapore Precision Engineering Since the Beginning
              </h2>
              <div className="space-y-4 text-base text-brand-silver leading-relaxed">
                <p>
                  Allied MFG Pte Ltd specialises in precision machining, CNC milling, CNC turning, and metal fabrication for demanding industrial applications. Our manufacturing floor runs advanced multi-axis CNC equipment operated by experienced machinists and engineers.
                </p>
                <p>
                  We serve clients across the semiconductor, automation, power and energy, and precision engineering sectors. Whether you need a single prototype or a high-volume production run, we deliver consistent quality and competitive lead times.
                </p>
                <p>
                  Headquartered in Singapore, we combine local manufacturing expertise with global quality standards to support your production requirements.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {[
                { value: "20+", label: "Years in Operation" },
                { value: "500+", label: "Clients Served" },
                { value: "±0.005mm", label: "Tolerance Capability" },
                { value: "100%", label: "Singapore Manufactured" },
              ].map((s) => (
                <div key={s.label} className="bg-brand-light rounded-2xl p-6 border border-black/[0.04]">
                  <p className="text-3xl font-bold text-brand-black mb-2">{s.value}</p>
                  <p className="text-xs text-brand-silver uppercase tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-brand-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Values"
            title="What Drives Us"
            subtitle="Four principles that define how we work and why our clients come back."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl p-7 shadow-card border border-black/[0.04]"
              >
                <div className="text-3xl mb-5 opacity-30">{v.icon}</div>
                <h3 className="font-semibold text-brand-black mb-2">{v.title}</h3>
                <p className="text-sm text-brand-silver leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Singapore presence */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs font-semibold tracking-widest uppercase text-brand-accent mb-4">Location</p>
            <h2 className="text-display-md font-bold text-brand-black mb-5">Rooted in Singapore</h2>
            <p className="text-base text-brand-silver leading-relaxed mb-8">
              Our manufacturing facility is located in Singapore, giving you direct access to our team for site visits, part reviews, and technical discussions. We're local — and that matters.
            </p>
            <address className="not-italic space-y-2 text-sm text-brand-graphite">
              <p className="font-medium">Allied MFG Pte Ltd</p>
              <p>Singapore</p>
              <p>
                <a href="tel:+6562820900" className="text-brand-accent hover:underline">+65 6282 0900</a>
              </p>
              <p>
                <a href="mailto:enquiries@alliedmfg.com.sg" className="text-brand-accent hover:underline">enquiries@alliedmfg.com.sg</a>
              </p>
            </address>
          </div>
        </div>
      </section>

      <CTASection
        title="Work with a trusted precision manufacturer."
        subtitle="Let's discuss your next project."
        cta="Request a Quote"
        secondary="Contact Us"
        secondaryHref="/contact"
      />
    </>
  );
}
