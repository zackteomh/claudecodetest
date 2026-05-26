import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import CTASection from "@/components/CTASection";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Allied MFG serves semiconductor, automation, power & energy, and precision engineering industries with high-quality machined components from Singapore.",
};

const industries = [
  {
    id: "semiconductor",
    title: "Semiconductor",
    icon: "◈",
    tagline: "Cleanroom-ready precision components",
    description:
      "The semiconductor industry demands the tightest tolerances and the cleanest finishes. Allied MFG produces precision components for wafer handling, vacuum systems, process chambers, and test fixtures.",
    applications: [
      "Wafer handling components",
      "Vacuum chamber parts",
      "Process equipment fixtures",
      "Test and metrology hardware",
    ],
    materials: ["Aluminium 6061/7075", "Stainless Steel 316L", "PEEK", "Titanium"],
  },
  {
    id: "automation",
    title: "Automation",
    icon: "⚙",
    tagline: "Precise parts for automated systems",
    description:
      "Automation systems depend on components that perform flawlessly under continuous operation. We manufacture custom fixtures, end-effectors, mechanical assemblies, and structural parts for robotic and automated lines.",
    applications: [
      "Robotic arm components",
      "End-effectors and grippers",
      "Custom fixtures and jigs",
      "Machine frames and brackets",
    ],
    materials: ["Aluminium", "Tool Steel", "Stainless Steel", "Engineering Plastics"],
  },
  {
    id: "power-energy",
    title: "Power & Energy",
    icon: "⚡",
    tagline: "Robust components for demanding environments",
    description:
      "Power generation and distribution require components built for durability and reliability. Allied MFG delivers precision machined parts for switchgear, generators, turbines, and energy infrastructure.",
    applications: [
      "Switchgear components",
      "Turbine and generator parts",
      "High-voltage connector hardware",
      "Enclosure and housing components",
    ],
    materials: ["Mild Steel", "Stainless Steel", "Copper", "Brass", "Aluminium"],
  },
  {
    id: "customized-products",
    title: "Customized Products",
    icon: "◐",
    tagline: "One-off parts to production volumes",
    description:
      "Not every application fits a standard catalogue. We work with clients from a wide range of industries to develop and manufacture custom parts — from initial prototypes to full production runs.",
    applications: [
      "Prototype development",
      "One-off special parts",
      "Short-run production batches",
      "Reverse engineering",
    ],
    materials: ["Customer-specified", "Wide material selection available"],
  },
  {
    id: "precision-engineering",
    title: "Precision Engineering",
    icon: "◎",
    tagline: "High-tolerance machining across sectors",
    description:
      "Precision engineering spans medical devices, optical systems, aerospace, and advanced research. Allied MFG applies its full machining capability to deliver exact geometries, finishes, and tolerances.",
    applications: [
      "Optical mounts and stages",
      "Medical device components",
      "Aerospace structural parts",
      "High-precision assemblies",
    ],
    materials: ["Titanium", "Invar", "Aluminium", "Stainless Steel", "PEEK"],
  },
];

export default function IndustriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Industries"
        title="Built for the Most Demanding Applications"
        subtitle="Allied MFG serves industries where quality isn't optional — from semiconductor fabs to energy infrastructure."
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-6">
          {industries.map((ind, i) => (
            <FadeIn key={ind.id} delay={0.05}>
              <div
                id={ind.id}
                className={`rounded-3xl p-8 lg:p-12 border border-black/[0.06] ${i % 2 === 0 ? "bg-white" : "bg-brand-light"}`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-4 mb-5">
                      <span className="text-3xl opacity-25">{ind.icon}</span>
                      <div>
                        <p className="text-xs font-semibold tracking-widest uppercase text-brand-accent">{`0${i + 1}`}</p>
                        <h2 className="text-2xl font-bold text-brand-black">{ind.title}</h2>
                      </div>
                    </div>
                    <p className="text-base font-medium text-brand-graphite mb-3">{ind.tagline}</p>
                    <p className="text-sm text-brand-silver leading-relaxed mb-6 max-w-lg">{ind.description}</p>
                    <Link
                      href="/request-quote"
                      className="inline-flex items-center px-5 py-2.5 bg-brand-black text-white text-sm font-semibold rounded-full hover:bg-brand-graphite transition"
                    >
                      Request a Quote
                    </Link>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs font-semibold tracking-widest uppercase text-brand-silver mb-3">Applications</p>
                      <ul className="space-y-2">
                        {ind.applications.map((app) => (
                          <li key={app} className="flex items-start gap-2 text-sm text-brand-graphite">
                            <span className="text-brand-accent mt-0.5">—</span>
                            {app}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-widest uppercase text-brand-silver mb-3">Materials</p>
                      <div className="flex flex-wrap gap-2">
                        {ind.materials.map((mat) => (
                          <span key={mat} className="px-3 py-1 bg-white rounded-full text-xs font-medium text-brand-graphite border border-black/[0.08]">
                            {mat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <CTASection
        title="Ready to discuss your requirements?"
        subtitle="Our team is available to support your project from concept to delivery."
        cta="Request a Quote"
        secondary="Contact Us"
        secondaryHref="/contact"
        dark
      />
    </>
  );
}
