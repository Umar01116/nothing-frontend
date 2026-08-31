import { useState, type FormEvent } from "react";
import { NothingPixelMark } from "../components/common/ProductVisuals";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="py-24" style={{ background: "#FFF5F4" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="reveal">
          <NothingPixelMark size={32} color="#E53528" />
          <h2
            className="mt-4 text-4xl md:text-5xl font-bold tracking-tight"
            style={{ fontFamily: "Instrument Sans, sans-serif", color: "#0A0A0A" }}
          >
            Stay in the Loop
          </h2>
          <p className="mt-3 text-base" style={{ color: "#6B6B6B" }}>
            Get early access to new drops, exclusive deals, and our buying guides —
            delivered to your inbox.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubmit} className="mt-8 flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                required
                className="flex-1 px-4 py-3 text-sm outline-none transition-colors"
                style={{
                  border: "1px solid #E2E2E0",
                  borderRadius: "10px",
                  background: "white",
                  fontFamily: "Inter, sans-serif",
                  color: "#0A0A0A",
                }}
              />
              <button
                type="submit"
                className="px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 whitespace-nowrap"
                style={{ background: "#E53528", borderRadius: "10px", fontFamily: "Instrument Sans, sans-serif" }}
              >
                Subscribe
              </button>
            </form>
          ) : (
            <div
              className="mt-8 py-4 px-6 rounded-xl inline-flex items-center gap-2"
              style={{ background: "white", border: "1px solid #E2E2E0" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span className="font-semibold text-sm" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
                You&apos;re subscribed! Check your inbox.
              </span>
            </div>
          )}

          <p className="mt-4 text-xs" style={{ color: "#AEAEAE" }}>
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────
