import Link from "next/link";
import Logo from "./Logo";

const services = [
  "Precision Machining",
  "CNC Milling",
  "CNC Turning",
  "Metal Fabrication",
  "Custom Components",
  "Quality Inspection",
];

const company = [
  { label: "Company", href: "/company" },
  { label: "Industries", href: "/industries" },
  { label: "Services", href: "/services" },
  { label: "Machinery", href: "/machinery" },
  { label: "Quality", href: "/quality" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <svg
                height="28"
                viewBox="0 0 280 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Allied MFG"
              >
                <text
                  x="0"
                  y="38"
                  fontFamily="'Inter', system-ui, sans-serif"
                  fontWeight="800"
                  fontSize="38"
                  letterSpacing="-1"
                  fill="white"
                >
                  ALLIED MFG
                </text>
                <text
                  x="0"
                  y="50"
                  fontFamily="'Inter', system-ui, sans-serif"
                  fontWeight="500"
                  fontSize="11"
                  letterSpacing="2"
                  fill="rgba(255,255,255,0.5)"
                >
                  PTE LTD
                </text>
              </svg>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              Precision manufacturing and engineering solutions for demanding industrial applications. Engineered in Singapore.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-5">Navigate</h3>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/70 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-5">Services</h3>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s}>
                  <Link href="/services" className="text-sm text-white/70 hover:text-white transition-colors">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + CTA */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-5">Contact</h3>
            <address className="not-italic space-y-3 text-sm text-white/70 mb-8">
              <p>Singapore</p>
              <p>
                <a href="tel:+6562820900" className="hover:text-white transition-colors">
                  +65 6282 0900
                </a>
              </p>
              <p>
                <a href="mailto:enquiries@alliedmfg.com.sg" className="hover:text-white transition-colors">
                  enquiries@alliedmfg.com.sg
                </a>
              </p>
            </address>
            <Link
              href="/request-quote"
              className="inline-flex items-center px-5 py-2.5 bg-white text-brand-black text-sm font-semibold rounded-full hover:bg-white/90 transition-colors"
            >
              Request a Quote
            </Link>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Allied MFG Pte Ltd. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            Precision Manufacturing · Singapore
          </p>
        </div>
      </div>
    </footer>
  );
}
