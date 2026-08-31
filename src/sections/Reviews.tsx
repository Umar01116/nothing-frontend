import { useEffect, useState } from "react";
import { NothingPixelMark } from "../components/common/ProductVisuals";
import { settingsApi, ReviewItem, ReviewsSectionSettings } from "../api/settings";
import { navigateTo } from "../utils/store";

const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    id: "r-1",
    name: "Ahmed K.",
    city: "Karachi",
    rating: 5,
    text: "Ordered a case for my Nothing Phone 2 — arrived next day, perfect fit, quality is unreal. Finally a store that gets it right.",
    product: "Nothing Phone (2) Clear Case",
    is_verified: true,
    is_active: true,
  },
  {
    id: "r-2",
    name: "Fatima S.",
    city: "Lahore",
    rating: 5,
    text: "The CMF Buds Pro are insane value. Sound quality blew my mind. Delivery was super fast too. Highly recommend this store!",
    product: "CMF Buds Pro 2",
    is_verified: true,
    is_active: true,
  },
  {
    id: "r-3",
    name: "Usman R.",
    city: "Islamabad",
    rating: 5,
    text: "65W charger is legit. Charges my Nothing 2 from 0 to 100 in under an hour. No fake charging specs here.",
    product: "65W GaN Charger",
    is_verified: true,
    is_active: true,
  },
  {
    id: "r-4",
    name: "Sara M.",
    city: "Faisalabad",
    rating: 4,
    text: "Great case, lovely packaging. Looks just like the official product. Will definitely order again.",
    product: "Nothing Phone (2a) Case",
    is_verified: true,
    is_active: true,
  },
  {
    id: "r-5",
    name: "Bilal H.",
    city: "Peshawar",
    rating: 5,
    text: "The power bank quality exceeded my expectations. WhatsApp support was amazing when I had a question.",
    product: "CMF PowerBank 10000",
    is_verified: true,
    is_active: true,
  },
  {
    id: "r-6",
    name: "Zara N.",
    city: "Multan",
    rating: 5,
    text: "Best Nothing accessories store in Pakistan, period. Fast, authentic, and competitively priced. 10/10!",
    product: "Nothing Phone (3a) Bundle",
    is_verified: true,
    is_active: true,
  },
];

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function Reviews() {
  // Instant cache hydration ensures zero flicker on page reload
  const [config, setConfig] = useState<ReviewsSectionSettings | null>(() => {
    return settingsApi.getCachedSettings()?.reviews_section_settings || null;
  });

  useEffect(() => {
    let isMounted = true;
    settingsApi
      .getSettings()
      .then((data) => {
        if (isMounted && data?.reviews_section_settings) {
          setConfig(data.reviews_section_settings);
        }
      })
      .catch((err) => console.error("Failed to load reviews settings:", err));

    const handleSettingsUpdate = (e: any) => {
      if (isMounted && e.detail?.reviews_section_settings) {
        setConfig(e.detail.reviews_section_settings);
      }
    };

    window.addEventListener("settings-updated", handleSettingsUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener("settings-updated", handleSettingsUpdate);
    };
  }, []);

  if (config && config.show === false) {
    return null;
  }

  const rawItems = config?.items;
  const activeReviews: ReviewItem[] = Array.isArray(rawItems) && rawItems.length > 0
    ? rawItems.filter((item) => item.is_active !== false)
    : DEFAULT_REVIEWS;

  const badge = config?.badge || "Customer Love";
  const title = config?.title || "What Customers Say";
  const ratingText = config?.rating_text || "4.9 / 5 from 2,400+ verified Pakistani reviews";

  return (
    <section id="reviews" className="py-24 transition-colors duration-300" style={{ background: "#F7F7F5" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 reveal">
          <div className="flex items-center justify-center gap-2 mb-3">
            <NothingPixelMark size={14} color="#E53528" />
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: "#E53528", fontFamily: "Instrument Sans, sans-serif" }}
            >
              {badge}
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight"
            style={{ fontFamily: "Instrument Sans, sans-serif", color: "#0A0A0A" }}
          >
            {title}
          </h2>
          <div className="flex items-center justify-center gap-2.5 mt-4">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#E53528">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span
              className="text-xs sm:text-sm font-semibold text-neutral-700"
              style={{ fontFamily: "Instrument Sans, sans-serif" }}
            >
              {ratingText}
            </span>
          </div>
        </div>

        {/* Dynamic Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {activeReviews.map((r, i) => (
            <div
              key={r.id || `${r.name}-${i}`}
              className="reveal group p-6 rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 bg-white border border-neutral-200/80 flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars & Verified Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-0.5">
                    {[...Array(r.rating || 5)].map((_, si) => (
                      <svg key={si} width="14" height="14" viewBox="0 0 24 24" fill="#E53528">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  {r.is_verified !== false && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ Verified Buyer
                    </span>
                  )}
                </div>

                {/* Review Text */}
                <p className="text-sm leading-relaxed text-neutral-700 mb-4">
                  &ldquo;{r.text}&rdquo;
                </p>
              </div>

              {/* Customer Info & Product Tag */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {getInitials(r.name)}
                  </div>
                  <div>
                    <div
                      className="text-xs font-bold text-neutral-900 leading-tight"
                      style={{ fontFamily: "Instrument Sans, sans-serif" }}
                    >
                      {r.name}
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      {r.city}
                    </div>
                  </div>
                </div>

                {r.product && (
                  <span className="text-[10px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-1 rounded-lg truncate max-w-[120px]">
                    {r.product}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Explore / View Reviews CTA */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => navigateTo("/shop")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
          >
            <span>Experience Authentic Quality — Shop Now</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Reviews;
