import { useEffect, useState } from "react";
import { productsApi, Product } from "../api/products";
import type { Product as LegacyProduct } from "../types/product";
import { CaseVisual, ChargerVisual, EarbudsVisual, CableVisual, PowerBankVisual, NothingPixelMark } from "../components/common/ProductVisuals";
import { ProductCard } from "../components/product/ProductCard";
import { navigateTo } from "../utils/store";

function mapBackendProductToUI(prod: Product): LegacyProduct {
  const price = Number(prod.sale_price ?? prod.price);
  const oldPrice = prod.sale_price ? Number(prod.price) : 0;
  const discount = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  let visual = <CaseVisual color="#E53528" />;
  const catSlug = prod.category?.slug?.toLowerCase() || "";
  const nameLower = prod.name.toLowerCase();

  if (prod.images?.[0]?.image) {
    visual = <img src={prod.images[0].image} alt={prod.name} className="w-full h-full object-contain" />;
  } else if (catSlug.includes("charger") || nameLower.includes("charger") || nameLower.includes("power")) {
    visual = <ChargerVisual color="#0A0A0A" />;
  } else if (catSlug.includes("audio") || nameLower.includes("ear") || nameLower.includes("buds")) {
    visual = <EarbudsVisual color="#E53528" />;
  } else if (catSlug.includes("cable") || nameLower.includes("cable")) {
    visual = <CableVisual color="#E53528" />;
  } else if (nameLower.includes("powerbank")) {
    visual = <PowerBankVisual color="#E53528" />;
  }

  return {
    id: prod.id,
    name: prod.name,
    model: prod.category?.name || "Nothing Accessories",
    price,
    oldPrice: oldPrice || price,
    discount,
    tag: prod.is_new ? "New" : prod.is_best_seller ? "Bestseller" : prod.is_deal ? "Hot Deal" : undefined,
    image: prod.images?.[0]?.image || (prod as any).image || null,
    visual,
  };
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<LegacyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi
      .getProducts({ featured: true, per_page: 5 })
      .then((res) => {
        setProducts((res.data || []).map(mapBackendProductToUI));
      })
      .catch((err) => console.error("Featured products error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="py-24" style={{ background: "#F7F7F5" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between">
          <div className="reveal">
            <div className="mb-3 flex items-center gap-2">
              <NothingPixelMark size={14} color="#E53528" />
              <span
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: "#E53528",
                  fontFamily: "Instrument Sans, sans-serif",
                }}
              >
                Curated for You
              </span>
            </div>

            <h2
              className="text-4xl font-bold tracking-tight md:text-5xl"
              style={{
                fontFamily: "Instrument Sans, sans-serif",
                color: "#0A0A0A",
              }}
            >
              Featured Products
            </h2>
          </div>

          <button
            onClick={() => navigateTo("/shop")}
            className="mt-4 text-sm font-semibold underline-hover sm:mt-0 cursor-pointer"
            style={{
              color: "#0A0A0A",
              fontFamily: "Instrument Sans, sans-serif",
            }}
          >
            View All Products →
          </button>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-red-600" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 stagger">
            {products.map((p) => (
              <div key={p.id} className="reveal">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}