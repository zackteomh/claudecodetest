import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import QuoteForm from "@/components/QuoteForm";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Request a precision machining or manufacturing quote from Allied MFG Pte Ltd in Singapore. Upload your drawing and describe your requirements.",
};

export default function RequestQuotePage() {
  return (
    <>
      <PageHeader
        eyebrow="Get Started"
        title="Request a Quote"
        subtitle="Fill in the details below and our team will respond with a competitive quote within 1–2 business days."
      />

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <QuoteForm />
          </FadeIn>
        </div>
      </section>

      <section className="py-16 bg-brand-light border-t border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { icon: "⏱", title: "Fast Response", desc: "Quote within 1–2 business days" },
              { icon: "🔒", title: "Confidential", desc: "Your drawings and details are kept strictly confidential" },
              { icon: "💬", title: "Engineering Support", desc: "Our team is available to discuss your requirements" },
            ].map((t, i) => (
              <FadeIn key={t.title} delay={i * 0.1}>
                <div className="text-3xl mb-3">{t.icon}</div>
                <p className="font-semibold text-brand-black mb-1">{t.title}</p>
                <p className="text-sm text-brand-silver">{t.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
