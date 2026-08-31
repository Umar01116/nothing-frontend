import { useEffect, useState } from "react";
import { categoriesApi, Category } from "../api/categories";
import { CaseVisual, ChargerVisual, EarbudsVisual, CableVisual, PowerBankVisual, NothingPixelMark } from "../components/common/ProductVisuals";
import { navigateTo, resolveImageUrl } from "../utils/store";

export function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    categoriesApi
      .getCategories()
      .then((data) => setCategories(data || []))
      .catch((err) => console.error("Categories fetch error:", err));
  }, []);

  const defaultCategoryDesigns: Record<string, { visual: any; bg: string; accent: string }> = {
    "phone-cases": {
      visual: <CaseVisual color="#E53528" />,
      bg: "#FFF5F4",
      accent: "#E53528",
    },
    "chargers": {
      visual: <ChargerVisual color="#0A0A0A" />,
      bg: "#F5F5F5",
      accent: "#0A0A0A",
    },
    "cables": {
      visual: <CableVisual color="#E53528" />,
      bg: "#FFF5F4",
      accent: "#E53528",
    },
    "audio": {
      visual: <EarbudsVisual color="#0A0A0A" />,
      bg: "#F5F5F5",
      accent: "#0A0A0A",
    },
    "power-banks": {
      visual: <PowerBankVisual color="#E53528" />,
      bg: "#FFF5F4",
      accent: "#E53528",
    },
  };

  const displayList = categories.length > 0
    ? categories.slice(0, 6)
    : [
        { id: 1, name: "Cases & Covers", slug: "phone-cases", products_count: 12 },
        { id: 2, name: "Fast Chargers", slug: "chargers", products_count: 8 },
        { id: 3, name: "Braided Cables", slug: "cables", products_count: 6 },
        { id: 4, name: "Earbuds & Audio", slug: "audio", products_count: 5 },
        { id: 5, name: "Power Banks", slug: "power-banks", products_count: 4 },
        { id: 6, name: "Mobile Accessories", slug: "mobile-accessories", products_count: 15 },
      ];

  return (
    <section id="shop" className="py-24" style={{ background: "#FFFFFF" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14">
          <div className="reveal">
            <div className="flex items-center gap-2 mb-3">
              <NothingPixelMark size={14} color="#E53528" />
              <span
                className="text-xs font-semibold tracking-[0.2em] uppercase"
                style={{ color: "#E53528", fontFamily: "Instrument Sans, sans-serif" }}
              >
                Collections
              </span>
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight"
              style={{ fontFamily: "Instrument Sans, sans-serif", color: "#0A0A0A" }}
            >
              Shop by Category
            </h2>
          </div>
          <button
            onClick={() => navigateTo("/shop")}
            className="mt-4 sm:mt-0 text-sm font-semibold underline-hover reveal cursor-pointer"
            style={{ color: "#0A0A0A", fontFamily: "Instrument Sans, sans-serif" }}
          >
            View All Categories →
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 stagger">
          {displayList.map((cat, i) => {
            const hasCustomImage = Boolean(cat.image);
            const design = defaultCategoryDesigns[cat.slug] || {
              visual: i % 2 === 0 ? <CaseVisual color="#E53528" /> : <ChargerVisual color="#0A0A0A" />,
              bg: i % 2 === 0 ? "#FFF5F4" : "#F5F5F5",
              accent: i % 2 === 0 ? "#E53528" : "#0A0A0A",
            };

            if (hasCustomImage) {
              return (
                <div
                  key={cat.id || cat.slug}
                  onClick={() => navigateTo(`/shop?category=${cat.name}`)}
                  className="product-card reveal group relative overflow-hidden rounded-2xl transition-all duration-400 hover:shadow-xl hover:-translate-y-1 cursor-pointer h-[240px] flex flex-col justify-between"
                  style={{ border: "1px solid transparent" }}
                >
                  {/* Full Card Background Cover Image */}
                  <img
                    src={resolveImageUrl(cat.image)}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Dark Gradient Overlay for Crisp Text Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25" />

                  {/* Header Content on Top of Image */}
                  <div className="relative z-10 p-6 pb-2">
                    <div className="flex justify-between items-start mb-4">
                      <h3
                        className="font-bold text-base leading-tight text-white drop-shadow-sm"
                        style={{ fontFamily: "Instrument Sans, sans-serif" }}
                      >
                        {cat.name}
                      </h3>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: "#E53528", color: "white" }}
                      >
                        {cat.products_count ?? "Live"}
                      </span>
                    </div>
                  </div>

                  {/* Footer Content on Top of Image */}
                  <div className="relative z-10 p-6 pt-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-white/90 group-hover:text-white transition-colors">
                      Explore Collection
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#E53528"
                      strokeWidth="2.5"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={cat.id || cat.slug}
                onClick={() => navigateTo(`/shop?category=${cat.name}`)}
                className="product-card reveal group relative overflow-hidden rounded-2xl transition-all duration-400 hover:shadow-xl hover:-translate-y-1 cursor-pointer h-[240px] flex flex-col justify-between"
                style={{ background: design.bg, border: "1px solid transparent" }}
              >
                <div className="p-6 pb-2">
                  <div className="flex justify-between items-start mb-4">
                    <h3
                      className="font-bold text-base leading-tight"
                      style={{ fontFamily: "Instrument Sans, sans-serif", color: "#0A0A0A" }}
                    >
                      {cat.name}
                    </h3>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: design.accent, color: "white" }}
                    >
                      {cat.products_count ?? "Live"}
                    </span>
                  </div>
                </div>

                <div className="product-image px-6 flex items-center justify-center overflow-hidden flex-1" style={{ height: "130px" }}>
                  {design.visual}
                </div>

                <div className="p-6 pt-2 flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: "#6B6B6B" }}>
                    Explore Collection
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={design.accent}
                    strokeWidth="2.5"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
