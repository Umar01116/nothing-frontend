import { useEffect, useState, useRef } from "react";
import { NothingPixelMark } from "../components/common/ProductVisuals";
import { settingsApi, DeviceModelItem, DeviceModelsSettings } from "../api/settings";
import { productsApi, Product } from "../api/products";
import { ProductCard } from "../components/product/ProductCard";
import type { Product as LegacyProduct } from "../types/product";
import { CaseVisual, ChargerVisual, EarbudsVisual, CableVisual, PowerBankVisual } from "../components/common/ProductVisuals";
import { navigateTo } from "../utils/store";

const DEFAULT_MODELS: DeviceModelItem[] = [
  { id: "1", name: "Phone (1)", year: "2022", brand: "Nothing", color: "#1A1A1A", is_active: true },
  { id: "2", name: "Phone (2)", year: "2023", brand: "Nothing", color: "#0A0A0A", is_active: true },
  { id: "3", name: "Phone (2a)", year: "2024", brand: "Nothing", color: "#2A2A2A", is_active: true },
  { id: "4", name: "Phone (2a) Plus", year: "2024", brand: "Nothing", color: "#111111", is_active: true },
  { id: "5", name: "Phone (3a)", year: "2025", brand: "Nothing", color: "#0A0A0A", is_active: true },
  { id: "6", name: "CMF Phone 1", year: "2024", brand: "CMF", color: "#E53528", is_active: true },
  { id: "7", name: "CMF Phone 2", year: "2025", brand: "CMF", color: "#E53528", is_active: true },
];

function mapBackendProductToUI(prod: Product): LegacyProduct {
  const price = Number(prod.sale_price ?? prod.price);
  const oldPrice = prod.sale_price ? Number(prod.price) : 0;
  const discount = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  let visual = <CaseVisual color="#E53528" />;
  const catSlug = prod.category?.slug?.toLowerCase() || "";
  const nameLower = (prod.name || "").toLowerCase();

  if (catSlug.includes("charger") || nameLower.includes("charger") || nameLower.includes("power")) {
    visual = <ChargerVisual color="#0A0A0A" />;
  } else if (catSlug.includes("audio") || nameLower.includes("ear") || nameLower.includes("buds")) {
    visual = <EarbudsVisual color="#E53528" />;
  } else if (catSlug.includes("cable") || nameLower.includes("cable")) {
    visual = <CableVisual color="#E53528" />;
  } else if (nameLower.includes("powerbank")) {
    visual = <PowerBankVisual color="#E53528" />;
  } else if (prod.images?.[0]?.image) {
    visual = <img src={prod.images[0].image} alt={prod.name} className="w-full h-full object-contain" />;
  }

  return {
    id: prod.id,
    name: prod.name,
    model: prod.category?.name || "Nothing Accessories",
    price,
    oldPrice: oldPrice || price,
    discount,
    tag: prod.is_new ? "New" : prod.is_best_seller ? "Bestseller" : prod.is_deal ? "Hot Deal" : undefined,
    visual,
  };
}

export function ModelSelector() {
  const [deviceConfig, setDeviceConfig] = useState<DeviceModelsSettings | null>(() => {
    return settingsApi.getCachedSettings()?.device_models_settings || null;
  });
  const [selectedModel, setSelectedModel] = useState<DeviceModelItem | null>(null);
  const [modelProducts, setModelProducts] = useState<LegacyProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const productsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    settingsApi
      .getSettings()
      .then((data) => {
        if (isMounted && data?.device_models_settings) {
          setDeviceConfig(data.device_models_settings);
        }
      })
      .catch((err) => console.error("Failed to load device model settings:", err));

    const handleSettingsUpdate = (e: any) => {
      if (isMounted && e.detail?.device_models_settings) {
        setDeviceConfig(e.detail.device_models_settings);
      }
    };

    window.addEventListener("settings-updated", handleSettingsUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener("settings-updated", handleSettingsUpdate);
    };
  }, []);

  const rawItems = deviceConfig?.items;
  const activeModels: DeviceModelItem[] = Array.isArray(rawItems) && rawItems.length > 0
    ? rawItems.filter((item) => item.is_active !== false)
    : DEFAULT_MODELS;

  // Set default selected model once activeModels are available
  useEffect(() => {
    if (!selectedModel && activeModels.length > 0) {
      handleSelectModel(activeModels[0]);
    }
  }, [activeModels.length]);

  const handleSelectModel = async (model: DeviceModelItem) => {
    setSelectedModel(model);
    setLoadingProducts(true);

    try {
      // First try filtering specifically by model, or search fallback
      const res = await productsApi.getProducts({
        model: model.name,
        per_page: 8,
      });

      let items = (res.data || []).map(mapBackendProductToUI);

      // If backend exact match returned 0, try searching by general keyword (e.g. Phone 2)
      if (items.length === 0) {
        const fallbackRes = await productsApi.getProducts({
          search: model.name.replace(/[()]/g, "").trim(),
          per_page: 8,
        });
        items = (fallbackRes.data || []).map(mapBackendProductToUI);
      }

      setModelProducts(items);
    } catch (err) {
      console.error("Failed to fetch products for model:", err);
      setModelProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  if (deviceConfig && deviceConfig.show === false) {
    return null;
  }

  const badgeText = deviceConfig?.badge || "Device Lineup";
  const titleText = deviceConfig?.title || "Choose Your Model";
  const subtitleText = deviceConfig?.subtitle || "Find accessories perfectly matched to your Nothing or CMF device.";

  return (
    <section id="models" className="py-24" style={{ background: "#F7F7F5" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <NothingPixelMark size={14} color="#E53528" />
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: "#E53528", fontFamily: "Instrument Sans, sans-serif" }}
            >
              {badgeText}
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight"
            style={{ fontFamily: "Instrument Sans, sans-serif", color: "#0A0A0A" }}
          >
            {titleText}
          </h2>
          <p className="mt-3 text-base max-w-xl mx-auto" style={{ color: "#6B6B6B" }}>
            {subtitleText}
          </p>
        </div>

        {/* Dynamic Model Selector Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {activeModels.map((model) => {
            const isSelected = selectedModel?.id === model.id || selectedModel?.name === model.name;
            const isCMF = model.brand?.toUpperCase() === "CMF" || model.color === "#E53528";

            return (
              <button
                key={model.id || model.name}
                type="button"
                onClick={() => handleSelectModel(model)}
                className="group flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 cursor-pointer text-left w-full"
                style={{
                  background: isSelected ? "#0A0A0A" : "white",
                  border: `1px solid ${isSelected ? "#0A0A0A" : "#E2E2E0"}`,
                  transform: isSelected ? "scale(1.03)" : "scale(1)",
                  boxShadow: isSelected ? "0 8px 32px rgba(0,0,0,0.15)" : "0 1px 3px rgba(0,0,0,0.02)",
                }}
              >
                {/* Device SVG Graphic */}
                <div style={{ width: "56px", height: "92px" }}>
                  <svg viewBox="0 0 60 100" fill="none" className="w-full h-full">
                    <rect
                      x="4"
                      y="4"
                      width="52"
                      height="92"
                      rx="10"
                      fill={isSelected ? "#333333" : "#F0F0EE"}
                    />
                    <rect
                      x="8"
                      y="8"
                      width="44"
                      height="84"
                      rx="8"
                      fill={isSelected ? "#222222" : "#E8E8E8"}
                    />
                    {isCMF ? (
                      <>
                        <rect
                          x="12"
                          y="15"
                          width="36"
                          height="54"
                          rx="4"
                          fill={isSelected ? "#1A1A1A" : "#DDDDDD"}
                        />
                        <rect
                          x="20"
                          y="22"
                          width="20"
                          height="20"
                          rx="10"
                          fill={model.color || "#E53528"}
                          opacity="0.6"
                        />
                      </>
                    ) : (
                      <>
                        <line x1="20" y1="20" x2="20" y2="65" stroke="#E53528" strokeWidth="0.8" opacity="0.5" />
                        <line x1="30" y1="20" x2="30" y2="65" stroke="#E53528" strokeWidth="0.8" opacity="0.5" />
                        <line x1="40" y1="20" x2="40" y2="65" stroke="#E53528" strokeWidth="0.8" opacity="0.5" />
                        <circle
                          cx="30"
                          cy="43"
                          r="8"
                          fill="#E53528"
                          opacity={isSelected ? "0.6" : "0.35"}
                        />
                      </>
                    )}
                  </svg>
                </div>

                {/* Model Name & Year */}
                <div className="text-center w-full">
                  <div
                    className="text-xs font-semibold leading-tight truncate"
                    style={{
                      fontFamily: "Instrument Sans, sans-serif",
                      color: isSelected ? "white" : "#0A0A0A",
                    }}
                  >
                    {model.brand ? `${model.brand} ` : ""}
                    {model.name}
                  </div>
                  <div
                    className="text-[11px] mt-0.5"
                    style={{ color: isSelected ? "#888888" : "#6B6B6B" }}
                  >
                    {model.year}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════════════════════
            DYNAMIC MATCHING PRODUCTS FOR SELECTED MODEL
        ══════════════════════════════════════════════════════════ */}
        {selectedModel && (
          <div ref={productsSectionRef} className="mt-14 pt-10 border-t border-neutral-200">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider">
                  Compatible Accessories
                </p>
                <h3
                  className="text-2xl font-bold text-neutral-900 mt-0.5"
                  style={{ fontFamily: "Instrument Sans, sans-serif" }}
                >
                  Featured Gear for {selectedModel.brand ? `${selectedModel.brand} ` : ""}{selectedModel.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigateTo(
                    `/shop?search=${encodeURIComponent(
                      selectedModel.name.replace(/[()]/g, "").trim()
                    )}`
                  )
                }
                className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition cursor-pointer shadow-xs"
              >
                <span>View All {selectedModel.name} Accessories</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {loadingProducts ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 py-8">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="bg-white rounded-2xl p-4 border border-neutral-200 animate-pulse space-y-3">
                    <div className="h-44 bg-neutral-100 rounded-xl" />
                    <div className="h-3 bg-neutral-200 rounded w-1/2" />
                    <div className="h-4 bg-neutral-200 rounded w-3/4" />
                    <div className="h-4 bg-neutral-200 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : modelProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {modelProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-neutral-300 py-14 text-center bg-white/60">
                <div className="text-3xl mb-2">📱</div>
                <h4 className="text-base font-bold text-neutral-800">
                  Accessories for {selectedModel.name}
                </h4>
                <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
                  New official cases, screen protectors, and power accessories for {selectedModel.name} are arriving soon!
                </p>
                <button
                  type="button"
                  onClick={() => navigateTo("/shop")}
                  className="mt-4 px-5 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs"
                >
                  Browse Full Catalog →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default ModelSelector;
