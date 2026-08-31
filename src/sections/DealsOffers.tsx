import { useState, useEffect } from "react";
import { CaseVisual, ChargerVisual, EarbudsVisual, PowerBankVisual, NothingPixelMark } from "../components/common/ProductVisuals";
import { settingsApi, FlashSaleSettings } from "../api/settings";
import { productsApi, Product } from "../api/products";
import { navigateTo, resolveImageUrl } from "../utils/store";

interface DealCardItem {
  id: number;
  name: string;
  save: string;
  price: string;
  image?: string;
  visual: React.ReactNode;
}

function mapProductToDealCard(prod: Product): DealCardItem {
  const price = Number(prod.sale_price ?? prod.price);
  const oldPrice = prod.sale_price ? Number(prod.price) : 0;
  const discount = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 25;

  let visual = <CaseVisual color="#E53528" />;
  const catSlug = prod.category?.slug?.toLowerCase() || "";
  const nameLower = (prod.name || "").toLowerCase();

  if (catSlug.includes("charger") || nameLower.includes("charger") || nameLower.includes("power")) {
    visual = <ChargerVisual color="#0A0A0A" />;
  } else if (catSlug.includes("audio") || nameLower.includes("ear") || nameLower.includes("buds")) {
    visual = <EarbudsVisual color="#E53528" />;
  } else if (nameLower.includes("powerbank")) {
    visual = <PowerBankVisual color="#0A0A0A" />;
  } else if (prod.images?.[0]?.image) {
    visual = <img src={prod.images[0].image} alt={prod.name} className="w-full h-full object-contain" />;
  }

  return {
    id: prod.id,
    name: prod.name,
    save: `${discount}%`,
    price: `₨${price.toLocaleString()}`,
    image: prod.images?.[0]?.image,
    visual,
  };
}

const DEFAULT_FALLBACK_DEALS: DealCardItem[] = [
  { id: 1, name: "Nothing Phone (2) Clear Case", save: "28%", price: "₨2,499", visual: <CaseVisual color="#E53528" /> },
  { id: 2, name: "Nothing 45W Fast Charger", save: "15%", price: "₨3,999", visual: <ChargerVisual color="#0A0A0A" /> },
  { id: 3, name: "CMF Buds Pro 2", save: "30%", price: "₨8,999", visual: <EarbudsVisual color="#E53528" /> },
  { id: 4, name: "GaN Fast Power Delivery", save: "25%", price: "₨5,999", visual: <PowerBankVisual color="#0A0A0A" /> },
];

export function DealsOffers() {
  // Instant hydration from local cache prevents any flicker or jump on page reload
  const [flashConfig, setFlashConfig] = useState<FlashSaleSettings | null>(() => {
    return settingsApi.getCachedSettings()?.flash_sale_settings || null;
  });
  const [dealProducts, setDealProducts] = useState<DealCardItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState(() => {
    const hours = flashConfig?.countdown_hours || 12;
    return { h: Math.min(hours - 1, 23), m: 59, s: 59 };
  });

  const loadSettingsAndProducts = async (configOverride?: FlashSaleSettings) => {
    try {
      const data = await settingsApi.getSettings();
      const config = configOverride || data?.flash_sale_settings;
      if (config) {
        setFlashConfig(config);
        if (config.countdown_hours) {
          setTimeLeft({ h: Math.min(config.countdown_hours - 1, 23), m: 59, s: 59 });
        }
      }

      // Fetch products
      const productIds = config?.product_ids;
      if (Array.isArray(productIds) && productIds.length > 0) {
        const allRes = await productsApi.getProducts({ per_page: 50 });
        const allList = allRes.data || [];
        const selectedList = allList
          .filter((p) => productIds.includes(p.id))
          .map(mapProductToDealCard);

        if (selectedList.length > 0) {
          setDealProducts(selectedList);
          return;
        }
      }

      // Fallback: fetch deal products
      const dealsRes = await productsApi.getProducts({ deal: true, per_page: 4 });
      let dealsList = (dealsRes.data || []).map(mapProductToDealCard);

      if (dealsList.length === 0) {
        const generalRes = await productsApi.getProducts({ per_page: 4 });
        dealsList = (generalRes.data || []).map(mapProductToDealCard);
      }

      setDealProducts(dealsList.length > 0 ? dealsList : DEFAULT_FALLBACK_DEALS);
    } catch (err) {
      console.error("Failed to load flash sale data:", err);
      setDealProducts(DEFAULT_FALLBACK_DEALS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettingsAndProducts();

    const handleSettingsUpdate = (e: any) => {
      if (e.detail?.flash_sale_settings) {
        setFlashConfig(e.detail.flash_sale_settings);
        loadSettingsAndProducts(e.detail.flash_sale_settings);
      }
    };

    window.addEventListener("settings-updated", handleSettingsUpdate);
    return () => {
      window.removeEventListener("settings-updated", handleSettingsUpdate);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) {
          s = 59;
          m--;
        }
        if (m < 0) {
          m = 59;
          h--;
        }
        if (h < 0) {
          h = 23;
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // If section is disabled in admin
  if (flashConfig && flashConfig.show === false) {
    return null;
  }

  const pad = (n: number) => String(n).padStart(2, "0");

  const badge = flashConfig?.badge || "Limited Time";
  const title = flashConfig?.title || "Flash Deals";
  const highlight = flashConfig?.highlight || "Up to 40% Off";
  const description =
    flashConfig?.description ||
    "Exclusive limited-time offers on premium Nothing & CMF accessories. Don't miss out — prices reset daily.";
  const ctaText = flashConfig?.cta_text || "View All Deals";
  const ctaLink = flashConfig?.cta_link || "/shop?deal=true";
  const bgColor = flashConfig?.bg_color || "#FFF5F4";

  return (
    <section className="py-24 overflow-hidden transition-colors duration-300" style={{ background: bgColor }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side — Dynamic Copywriting & Countdown */}
          <div className="reveal">
            <div className="flex items-center gap-2 mb-4">
              <NothingPixelMark size={14} color="#E53528" />
              <span
                className="text-xs font-semibold tracking-[0.2em] uppercase"
                style={{ color: "#E53528", fontFamily: "Instrument Sans, sans-serif" }}
              >
                {badge}
              </span>
            </div>

            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
              style={{ fontFamily: "Instrument Sans, sans-serif", color: "#0A0A0A" }}
            >
              {title}
              {highlight && (
                <>
                  <br />
                  <span style={{ color: "#E53528" }}>{highlight}</span>
                </>
              )}
            </h2>

            <p className="text-base mb-8 max-w-lg" style={{ color: "#6B6B6B" }}>
              {description}
            </p>

            {/* Countdown Timer */}
            <div className="flex gap-3 sm:gap-4 mb-8">
              {[
                { val: pad(timeLeft.h), label: "Hours" },
                { val: pad(timeLeft.m), label: "Min" },
                { val: pad(timeLeft.s), label: "Sec" },
              ].map((unit) => (
                <div key={unit.label} className="text-center">
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl text-xl sm:text-2xl font-bold text-white shadow-xs"
                    style={{ background: "#E53528", fontFamily: "Instrument Sans, sans-serif" }}
                  >
                    {unit.val}
                  </div>
                  <div className="text-xs mt-1 font-semibold" style={{ color: "#6B6B6B" }}>
                    {unit.label}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => navigateTo(ctaLink)}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-white font-semibold text-sm transition-all duration-300 hover:opacity-90 cursor-pointer shadow-sm"
              style={{ background: "#E53528", borderRadius: "10px", fontFamily: "Instrument Sans, sans-serif" }}
            >
              {ctaText}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Right Side — Dynamic Deal Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 stagger">
            {dealProducts.slice(0, 4).map((deal) => (
              <div
                key={deal.id || deal.name}
                onClick={() => navigateTo(`/product/${deal.id}`)}
                className="reveal group p-4 rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer bg-white"
                style={{ border: "1px solid #FFE0DD" }}
              >
                <div className="flex justify-between items-start mb-3">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full text-white shadow-2xs"
                    style={{ background: "#E53528" }}
                  >
                    SAVE {deal.save}
                  </span>
                </div>
                <div className="h-28 sm:h-32 rounded-xl overflow-hidden bg-neutral-100/60 flex items-center justify-center">
                  {deal.image ? (
                    <img
                      src={resolveImageUrl(deal.image)}
                      alt={deal.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="p-2 h-full w-full flex items-center justify-center">
                      {deal.visual}
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <div
                    className="text-xs sm:text-sm font-semibold truncate group-hover:text-red-600 transition-colors"
                    style={{ fontFamily: "Instrument Sans, sans-serif", color: "#0A0A0A" }}
                  >
                    {deal.name}
                  </div>
                  <div
                    className="text-sm sm:text-base font-bold mt-0.5"
                    style={{ color: "#E53528", fontFamily: "Instrument Sans, sans-serif" }}
                  >
                    {deal.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default DealsOffers;
