import { useEffect, useState } from "react";
import { CaseVisual, ChargerVisual, EarbudsVisual, PowerBankVisual, NothingPixelMark } from "../components/common/ProductVisuals";
import { settingsApi, BrandStorySettings } from "../api/settings";
import { navigateTo, resolveImageUrl } from "../utils/store";

function renderCardVisual(type?: string, accentColor = "#E53528") {
  switch (type) {
    case "audio":
      return <EarbudsVisual color={accentColor} />;
    case "charger":
      return <ChargerVisual color={accentColor} />;
    case "power":
      return <PowerBankVisual color={accentColor} />;
    case "case":
    default:
      return <CaseVisual color={accentColor} />;
  }
}

export function BrandStory() {
  // Instant cache hydration ensures 0 flicker on page reload
  const [config, setConfig] = useState<BrandStorySettings | null>(() => {
    return settingsApi.getCachedSettings()?.brand_story_settings || null;
  });

  useEffect(() => {
    let isMounted = true;
    settingsApi
      .getSettings()
      .then((data) => {
        if (isMounted && data?.brand_story_settings) {
          setConfig(data.brand_story_settings);
        }
      })
      .catch((err) => console.error("Failed to load brand story settings:", err));

    const handleSettingsUpdate = (e: any) => {
      if (isMounted && e.detail?.brand_story_settings) {
        setConfig(e.detail.brand_story_settings);
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

  const heading1 = config?.heading_line1 || "Built for";
  const highlight = config?.heading_highlight || "Nothing.";
  const heading2 = config?.heading_line2 || "Made for Pakistan.";
  const description =
    config?.description ||
    "We started Nothing Accessories because Pakistani Nothing users deserved better. No counterfeit products, no inflated prices, no waiting weeks for delivery. Just premium accessories, verified authentic, at your door in days.";

  const stats = Array.isArray(config?.stats) && config.stats.length > 0
    ? config.stats
    : [
        { id: "1", num: "3+", label: "Years Serving Pakistan" },
        { id: "2", num: "15K+", label: "Happy Customers" },
        { id: "3", num: "500+", label: "SKUs Available" },
      ];

  const cards = Array.isArray(config?.cards) && config.cards.length > 0
    ? config.cards
    : [
        { id: "1", label: "Cases", type: "case", image: "", link: "/shop?category=phone-cases" },
        { id: "2", label: "Audio", type: "audio", image: "", link: "/shop?category=mobile-accessories" },
        { id: "3", label: "Chargers", type: "charger", image: "", link: "/shop?category=mobile-accessories" },
        { id: "4", label: "Power", type: "power", image: "", link: "/shop?category=mobile-accessories" },
      ];

  const bgColor = config?.bg_color || "#0A0A0A";
  const accentColor = config?.accent_color || "#E53528";

  return (
    <section
      id="brand-story"
      className="py-16 lg:py-20 overflow-hidden transition-colors duration-300 flex items-center min-h-[600px]"
      style={{ background: bgColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Brand Mission & Dynamic Stats (7 cols) */}
          <div className="lg:col-span-7 reveal">
            <NothingPixelMark size={32} color={accentColor} />

            <h2
              className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight"
              style={{ fontFamily: "Instrument Sans, sans-serif", color: "white" }}
            >
              {heading1}{" "}
              <span style={{ color: accentColor }}>{highlight}</span>
              <br />
              {heading2}
            </h2>

            <p
              className="mt-4 text-sm sm:text-base leading-relaxed"
              style={{ color: "#999999", maxWidth: "520px" }}
            >
              {description}
            </p>

            {/* Dynamic Milestones Stats */}
            <div
              className="grid grid-cols-3 gap-4 sm:gap-6 mt-8 pt-6"
              style={{ borderTop: "1px solid #222222" }}
            >
              {stats.map((s, idx) => (
                <div key={s.id || idx}>
                  <div
                    className="text-2xl sm:text-3xl font-bold"
                    style={{ fontFamily: "Instrument Sans, sans-serif", color: "white" }}
                  >
                    {s.num}
                  </div>
                  <div className="text-[11px] sm:text-xs mt-1 font-medium" style={{ color: "#777777" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 4-Grid Showcase Cards (5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5 reveal">
            {cards.slice(0, 4).map((item, idx) => {
              const hasImage = Boolean(item.image);

              return (
                <div
                  key={item.id || idx}
                  onClick={() => item.link && navigateTo(item.link)}
                  className="group relative overflow-hidden rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:scale-[1.03] hover:shadow-lg cursor-pointer h-44 sm:h-48"
                  style={{
                    background: "#161616",
                    border: "1px solid #262626",
                  }}
                >
                  {hasImage ? (
                    <>
                      <img
                        src={resolveImageUrl(item.image)}
                        alt={item.label}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />
                    </>
                  ) : null}

                  {/* Visual slot (if no image) */}
                  <div className="relative z-10 w-full flex-1 flex items-center justify-center">
                    {!hasImage && (
                      <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform">
                        {renderCardVisual(item.type, accentColor)}
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="relative z-10 flex items-center justify-between w-full pt-2 border-t border-neutral-800/80">
                    <span
                      className="text-xs font-semibold text-white/90 group-hover:text-white transition-colors"
                      style={{ fontFamily: "Instrument Sans, sans-serif" }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="text-xs font-bold transition-transform group-hover:translate-x-0.5"
                      style={{ color: accentColor }}
                    >
                      →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default BrandStory;
