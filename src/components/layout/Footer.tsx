import { NothingPixelMark } from "../../components/common/ProductVisuals";
import logoImage from "../../imports/image.png";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ background: "#F7F7F5", borderTop: "1px solid #E2E2E0" }}>
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <img
              src={logoImage}
              alt="Nothing Pakistan"
              className="object-contain mb-4"
              style={{ height: "36px" }}
            />
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: "#6B6B6B" }}>
              Pakistan&apos;s premier destination for authentic Nothing & CMF accessories.
              Fast delivery, genuine products, unbeatable prices.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {[
                { label: "Instagram", icon: <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /> },
                { label: "Facebook", icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /> },
                { label: "YouTube", icon: <><rect x="2" y="7" width="20" height="15" rx="2" ry="2" /><polyline points="17 2 12 7 7 2" /></> },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-red-50 hover:text-red-600"
                  style={{ border: "1px solid #E2E2E0" }}
                  aria-label={s.label}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    {s.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4
              className="font-bold text-sm mb-4"
              style={{ fontFamily: "Instrument Sans, sans-serif", color: "#0A0A0A" }}
            >
              Shop
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: "Cases & Covers", path: "/shop?category=Cases" },
                { name: "Chargers", path: "/shop?category=Chargers" },
                { name: "Cables", path: "/shop?category=Cables" },
                { name: "Earbuds & Audio", path: "/shop?category=Audio" },
                { name: "Power Banks", path: "/shop?category=Power" },
                { name: "All Products", path: "/shop" },
              ].map((l) => (
                <li key={l.name}>
                  <a
                    href={l.path}
                    onClick={(e) => {
                      e.preventDefault();
                      window.history.pushState({}, "", l.path);
                      window.dispatchEvent(new PopStateEvent("popstate"));
                    }}
                    className="text-sm underline-hover transition-colors hover:text-red-600 cursor-pointer"
                    style={{ color: "#6B6B6B", fontFamily: "Inter, sans-serif" }}
                  >
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Guides & Resources */}
          <div>
            <h4
              className="font-bold text-sm mb-4"
              style={{ fontFamily: "Instrument Sans, sans-serif", color: "#0A0A0A" }}
            >
              Resources
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: "Buying Guide", path: "/buying-guide" },
                { name: "Compare Devices", path: "/compare" },
                { name: "Customer Reviews", path: "/reviews" },
                { name: "Blog & Insights", path: "/blog" },
                { name: "FAQs", path: "/faq" },
                { name: "Compatibility Guide", path: "/buying-guide" },
              ].map((l) => (
                <li key={l.name}>
                  <a
                    href={l.path}
                    onClick={(e) => {
                      e.preventDefault();
                      window.history.pushState({}, "", l.path);
                      window.dispatchEvent(new PopStateEvent("popstate"));
                    }}
                    className="text-sm underline-hover transition-colors hover:text-red-600 cursor-pointer"
                    style={{ color: "#6B6B6B", fontFamily: "Inter, sans-serif" }}
                  >
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="font-bold text-sm mb-4"
              style={{ fontFamily: "Instrument Sans, sans-serif", color: "#0A0A0A" }}
            >
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://wa.me/923001234567"
                  className="flex items-center gap-2 text-sm transition-colors hover:text-red-600"
                  style={{ color: "#6B6B6B" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@accessoriess.pk"
                  className="flex items-center gap-2 text-sm transition-colors hover:text-red-600"
                  style={{ color: "#6B6B6B" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  hello@accessoriess.pk
                </a>
              </li>
              <li className="text-sm" style={{ color: "#6B6B6B" }}>
                🇵🇰 Pakistan — Nationwide Delivery
              </li>
            </ul>

            {/* Payment badges */}
            <div className="mt-6">
              <div className="text-xs font-semibold mb-2" style={{ color: "#AEAEAE" }}>
                We Accept
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["COD", "JazzCash", "EasyPaisa", "Bank"].map((pm) => (
                  <span
                    key={pm}
                    className="text-xs px-2 py-1 rounded"
                    style={{ background: "#E2E2E0", color: "#6B6B6B", fontFamily: "Instrument Sans, sans-serif" }}
                  >
                    {pm}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid #E2E2E0" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <NothingPixelMark size={14} color="#E53528" />
            <span className="text-xs" style={{ color: "#AEAEAE" }}>
              © {currentYear} NothingAccessoriess.pk · All rights reserved
            </span>
          </div>
          <div className="flex gap-5">
            {[
              { name: "Privacy Policy", path: "/privacy" },
              { name: "Terms of Service", path: "/terms" },
              { name: "Returns Policy", path: "/return-policy" },
              { name: "Shipping Policy", path: "/shipping-policy" },
            ].map((l) => (
              <a
                key={l.name}
                href={l.path}
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState({}, "", l.path);
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                className="text-xs transition-colors hover:text-red-600 cursor-pointer"
                style={{ color: "#AEAEAE" }}
              >
                {l.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── WhatsApp Float Button ────────────────────────────────────────────────────
