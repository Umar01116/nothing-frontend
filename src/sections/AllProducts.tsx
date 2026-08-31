import { useState, useEffect } from "react";
import { productsApi, Product } from "../api/products";
import { categoriesApi, Category } from "../api/categories";
import { ProductCard } from "../components/product/ProductCard";
import type { Product as LegacyProduct } from "../types/product";
import {
  CaseVisual,
  ChargerVisual,
  EarbudsVisual,
  CableVisual,
  PowerBankVisual,
  NothingPixelMark,
} from "../components/common/ProductVisuals";
import { navigateTo } from "../utils/store";

function mapBackendProductToUI(prod: Product): LegacyProduct {
  const price = Number(prod.sale_price ?? prod.price);
  const oldPrice = prod.sale_price ? Number(prod.price) : 0;
  const discount = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  let visual = <CaseVisual color="#E53528" />;
  const catSlug = prod.category?.slug?.toLowerCase() || "";
  const nameLower = (prod.name || "").toLowerCase();

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

export function AllProducts() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [products, setProducts] = useState<LegacyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);
  const [sortOption, setSortOption] = useState<string>("featured");

  // Fetch categories for the quick filter pill bar
  useEffect(() => {
    categoriesApi
      .getCategories()
      .then((res) => {
        const activeCats = (res || []).filter((c) => c.status !== false);
        setCategories(activeCats);
      })
      .catch((err) => console.error("Failed to load categories for all products:", err));
  }, []);

  // Fetch products based on active category & sort
  useEffect(() => {
    setLoading(true);
    const params: Record<string, any> = { per_page: 50 };

    if (activeCategory !== "all") {
      params.category = activeCategory;
    }

    if (sortOption === "price_asc") {
      params.sort = "price_asc";
    } else if (sortOption === "price_desc") {
      params.sort = "price_desc";
    } else if (sortOption === "latest") {
      params.sort = "latest";
    }

    productsApi
      .getProducts(params)
      .then((res) => {
        const mapped = (res.data || []).map(mapBackendProductToUI);
        setProducts(mapped);
      })
      .catch((err) => {
        console.error("Failed to fetch all products:", err);
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeCategory, sortOption]);

  const displayedProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  return (
    <section id="all-products" className="py-24 transition-colors duration-300" style={{ background: "#FFFFFF" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <NothingPixelMark size={14} color="#E53528" />
              <span
                className="text-xs font-semibold tracking-[0.2em] uppercase"
                style={{ color: "#E53528", fontFamily: "Instrument Sans, sans-serif" }}
              >
                Complete Collection
              </span>
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight"
              style={{ fontFamily: "Instrument Sans, sans-serif", color: "#0A0A0A" }}
            >
              All Products &amp; Gear
            </h2>
            <p className="mt-3 text-base text-neutral-500 max-w-xl">
              Engineered with transparent aesthetics, high-speed charging, and precision build quality for Nothing &amp; CMF devices.
            </p>
          </div>

          {/* Quick Sort Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              aria-label="Sort products by"
              className="px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 outline-none focus:border-black cursor-pointer hover:bg-neutral-100 transition"
            >
              <option value="featured">Featured Picks</option>
              <option value="latest">Latest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            type="button"
            onClick={() => {
              setActiveCategory("all");
              setVisibleCount(8);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === "all"
                ? "bg-neutral-900 text-white shadow-xs"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            All Gear ({products.length})
          </button>

          {categories.map((cat) => {
            const isSelected = activeCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.slug);
                  setVisibleCount(8);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 py-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 animate-pulse space-y-3">
                <div className="h-44 bg-neutral-200 rounded-xl" />
                <div className="h-3 bg-neutral-200 rounded w-1/2" />
                <div className="h-4 bg-neutral-200 rounded w-3/4" />
                <div className="h-4 bg-neutral-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : displayedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-300 py-16 text-center bg-neutral-50/50">
            <div className="text-3xl mb-2">📦</div>
            <h3 className="text-base font-bold text-neutral-800">No Products in this Category</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              We are constantly adding new accessories to this collection. Check back soon or browse other categories!
            </p>
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className="mt-4 px-4 py-2 bg-black text-white text-xs font-semibold rounded-xl cursor-pointer"
            >
              Show All Products
            </button>
          </div>
        )}

        {/* Footer Actions: Load More & Shop All CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-neutral-100">
          {hasMore && (
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 8)}
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 font-bold text-xs rounded-xl transition cursor-pointer shadow-2xs flex items-center justify-center gap-2"
            >
              <span>Load More Products (+{Math.min(8, products.length - visibleCount)})</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}

          <button
            type="button"
            onClick={() => navigateTo(activeCategory !== "all" ? `/shop?category=${activeCategory}` : "/shop")}
            className="w-full sm:w-auto px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-xs flex items-center justify-center gap-2"
          >
            <span>Explore Entire Store Catalog</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default AllProducts;
