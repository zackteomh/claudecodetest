import type { Metadata } from "next";
import QuoteForm from "@/components/QuoteForm";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Request a precision machining or manufacturing quote from Allied MFG Pte Ltd in Singapore. Upload your drawing and describe your requirements.",
};

export default function RequestQuotePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-brand-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-xl">
            <p className="text-xs font-semibold tracking-widest uppercase text-brand-accent mb-5">Get Started</p>
            <h1 className="text-display-xl font-bold text-brand-black mb-4">
              Request a Quote
            </h1>
            <p className="text-lg text-brand-silver leading-relaxed">
              Fill in the details below and our team will respond with a competitive quote within 1–2 business days.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <QuoteForm />
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-16 bg-brand-light border-t border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: "⏱",
                title: "Fast Response",
                desc: "Quote within 1–2 business days",
              },
              {
                icon: "🔒",
                title: "Confidential",
                desc: "Your drawings and project details are kept strictly confidential",
              },
              {
                icon: "💬",
                title: "Engineering Support",
                desc: "Our team is available to discuss your requirements",
              },
            ].map((t) => (
              <div key={t.title}>
                <div className="text-3xl mb-3">{t.icon}</div>
                <p className="font-semibold text-brand-black mb-1">{t.title}</p>
                <p className="text-sm text-brand-silver">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
