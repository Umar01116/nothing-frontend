import { NothingPixelMark } from "../components/common/ProductVisuals";

export function WhyChooseUs() {
  const reasons = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E53528" strokeWidth="1.5" strokeLinecap="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
      title: "Authentic Products",
      desc: "Every accessory is sourced from verified suppliers. Guaranteed original Nothing & CMF compatible accessories.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E53528" strokeWidth="1.5" strokeLinecap="round">
          <rect x="1" y="3" width="15" height="13" rx="2" />
          <path d="M16 8h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1" />
          <circle cx="7" cy="19" r="2" />
          <circle cx="17" cy="19" r="2" />
        </svg>
      ),
      title: "Fast Nationwide Delivery",
      desc: "1–3 business day delivery across Pakistan. Express options available. Free delivery on orders above ₨2,000.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E53528" strokeWidth="1.5" strokeLinecap="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      title: "Guaranteed Best Prices",
      desc: "We match any verified lower price. Our buying power means you always get the best value in Pakistan.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E53528" strokeWidth="1.5" strokeLinecap="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      title: "100% Compatibility",
      desc: "Every accessory is tested for compatibility with your exact Nothing or CMF device model. Precise fit guaranteed.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E53528" strokeWidth="1.5" strokeLinecap="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      title: "Expert Support",
      desc: "Dedicated Nothing accessory experts available via WhatsApp, chat, and email. We know your device inside out.",
    },
  ];

  return (
    <section className="py-24" style={{ background: "#FFFFFF" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 reveal">
          <div className="flex items-center justify-center gap-2 mb-3">
            <NothingPixelMark size={14} color="#E53528" />
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: "#E53528", fontFamily: "Instrument Sans, sans-serif" }}
            >
              Our Promise
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight"
            style={{ fontFamily: "Instrument Sans, sans-serif", color: "#0A0A0A" }}
          >
            Why Choose Us
          </h2>
          <p className="mt-3 text-base max-w-xl mx-auto" style={{ color: "#6B6B6B" }}>
            We&apos;re not just a store — we&apos;re the destination for Nothing enthusiasts in Pakistan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 stagger">
          {reasons.map((r, i) => (
            <div
              key={r.title}
              className="reveal group p-6 rounded-2xl transition-all duration-400 hover:shadow-lg hover:-translate-y-1"
              style={{ background: "#F7F7F5", border: "1px solid #F0F0EE" }}
            >
              <div
                className="w-12 h-12 flex items-center justify-center rounded-xl mb-4"
                style={{ background: "#FFF0EE" }}
              >
                {r.icon}
              </div>
              <h3
                className="font-bold text-sm mb-2"
                style={{ fontFamily: "Instrument Sans, sans-serif", color: "#0A0A0A" }}
              >
                {r.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "#6B6B6B" }}>
                {r.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Buying Guide ─────────────────────────────────────────────────────────────
