import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Allied MFG Pte Ltd in Singapore for precision machining and manufacturing enquiries. Call, email, or submit an enquiry.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's Talk About Your Project"
        subtitle="Whether you have a drawing ready or just an idea — our team is here to help. Reach out and we'll respond within one business day."
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Info */}
            <FadeIn direction="left">
              <h2 className="text-xl font-bold text-brand-black mb-8">Contact Information</h2>
              <div className="space-y-8">
                {[
                  { label: "Address", content: <address className="not-italic text-sm text-brand-graphite leading-relaxed"><p className="font-semibold text-brand-black">Allied MFG Pte Ltd</p><p>Singapore</p></address> },
                  { label: "Phone", content: <a href="tel:+6562820900" className="text-sm text-brand-graphite hover:text-brand-accent transition-colors">+65 6282 0900</a> },
                  { label: "Email", content: <a href="mailto:enquiries@alliedmfg.com.sg" className="text-sm text-brand-graphite hover:text-brand-accent transition-colors">enquiries@alliedmfg.com.sg</a> },
                  { label: "Business Hours", content: <div className="text-sm text-brand-graphite space-y-1"><p>Monday – Friday: 8:30am – 5:30pm</p><p>Saturday: 8:30am – 12:30pm</p><p>Sunday &amp; Public Holidays: Closed</p></div> },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-xs font-semibold tracking-widest uppercase text-brand-silver mb-2">{item.label}</p>
                    {item.content}
                  </div>
                ))}
              </div>
              <div className="mt-10 p-6 bg-brand-light rounded-2xl border border-black/[0.04]">
                <p className="text-sm font-semibold text-brand-black mb-2">Ready to get a quote?</p>
                <p className="text-sm text-brand-silver mb-4">For faster turnaround, use our dedicated quote form to share your project details.</p>
                <Link
                  href="/request-quote"
                  className="inline-flex items-center px-5 py-2.5 bg-brand-black text-white text-sm font-semibold rounded-full hover:bg-brand-graphite transition"
                >
                  Request a Quote
                </Link>
              </div>
            </FadeIn>

            {/* Form */}
            <FadeIn>
              <h2 className="text-xl font-bold text-brand-black mb-8">Send an Enquiry</h2>
              <ContactForm />
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
