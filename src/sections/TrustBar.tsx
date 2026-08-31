import { useEffect, useState } from "react";
import { settingsApi, TrustBadgeItem, TrustBarSettings } from "../api/settings";

const DEFAULT_TRUST_ITEMS: TrustBadgeItem[] = [
  { id: "1", icon: "🚀", label: "Express Delivery", sub: "1–3 Days Nationwide", is_active: true },
  { id: "2", icon: "💎", label: "Premium Quality", sub: "Verified Authentic", is_active: true },
  { id: "3", icon: "💰", label: "Best Prices", sub: "Price Match Guarantee", is_active: true },
  { id: "4", icon: "🔒", label: "Secure Shopping", sub: "256-bit SSL Encrypted", is_active: true },
  { id: "5", icon: "💬", label: "24/7 Support", sub: "WhatsApp & Live Chat", is_active: true },
];

export function TrustBar() {
  const [trustConfig, setTrustConfig] = useState<TrustBarSettings | null>(() => {
    return settingsApi.getCachedSettings()?.trust_bar_settings || null;
  });

  useEffect(() => {
    let isMounted = true;
    settingsApi
      .getSettings()
      .then((data) => {
        if (isMounted && data?.trust_bar_settings) {
          setTrustConfig(data.trust_bar_settings);
        }
      })
      .catch((err) => console.error("Failed to load trust bar settings:", err));

    const handleSettingsUpdate = (e: any) => {
      if (isMounted && e.detail?.trust_bar_settings) {
        setTrustConfig(e.detail.trust_bar_settings);
      }
    };

    window.addEventListener("settings-updated", handleSettingsUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener("settings-updated", handleSettingsUpdate);
    };
  }, []);

  // If explicitly disabled in admin settings, do not render
  if (trustConfig && trustConfig.show === false) {
    return null;
  }

  const rawItems = trustConfig?.items;
  const activeItems: TrustBadgeItem[] = Array.isArray(rawItems) && rawItems.length > 0
    ? rawItems.filter((item) => item.is_active !== false)
    : DEFAULT_TRUST_ITEMS;

  if (activeItems.length === 0) {
    return null;
  }

  const bgColor = trustConfig?.bg_color || "#0A0A0A";
  const textColor = trustConfig?.text_color || "#FFFFFF";
  const subTextColor = trustConfig?.sub_text_color || "#6B6B6B";
  const borderColor = trustConfig?.border_color || "#2A2A2A";

  // Double items for seamless infinite marquee loop
  const marqueeItems = [...activeItems, ...activeItems];

  return (
    <section
      className="py-5 overflow-hidden transition-colors duration-300"
      style={{ background: bgColor }}
    >
      <div className="marquee-inner">
        {marqueeItems.map((t, i) => (
          <div
            key={`${t.id || t.label}-${i}`}
            className="flex items-center gap-2.5 px-8 flex-shrink-0"
            style={{ borderRight: `1px solid ${borderColor}` }}
          >
            <span className="text-base select-none">{t.icon}</span>
            <div>
              <div
                className="text-xs font-semibold whitespace-nowrap"
                style={{
                  color: textColor,
                  fontFamily: "Instrument Sans, sans-serif",
                }}
              >
                {t.label}
              </div>
              <div
                className="text-xs whitespace-nowrap"
                style={{ color: subTextColor }}
              >
                {t.sub}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TrustBar;
