import { useEffect, useState, useMemo } from "react";
import { productsApi, Product } from "../../api/products";
import { categoriesApi, Category } from "../../api/categories";
import { adminApi, Brand } from "../../api/admin";
import { StorePageShell } from "../../components/store/StorePageShell";
import ProductGrid from "../../components/product/ProductGrid";
import { CaseVisual, ChargerVisual, EarbudsVisual, CableVisual, PowerBankVisual } from "../../components/common/ProductVisuals";
import type { Product as LegacyProduct } from "../../types/product";

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
  } else if (nameLower.includes("powerbank") || nameLower.includes("battery")) {
    visual = <PowerBankVisual color="#E53528" />;
  }

  return {
    id: prod.id,
    name: prod.name,
    model: prod.category?.name || "Nothing Accessories",
    price,
    oldPrice: oldPrice || price,
    discount,
    tag: prod.is_new ? "New" : prod.is_best_seller ? "Bestseller" : prod.is_deal ? "Deal" : undefined,
    image: prod.images?.[0]?.image || (prod as any).image || null,
    visual,
  };
}

export function ShopPage() {
  const [products, setProducts] = useState<LegacyProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter States initialized from URL
  const queryParams = useMemo(() => new URLSearchParams(window.location.search), [window.location.search]);
  const [search, setSearch] = useState<string>(queryParams.get("search") || queryParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(queryParams.get("category") || "");
  const [selectedBrand, setSelectedBrand] = useState<string>(queryParams.get("brand") || "");
  const [minPrice, setMinPrice] = useState<string>(queryParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState<string>(queryParams.get("max_price") || "");
  const [inStockOnly, setInStockOnly] = useState<boolean>(queryParams.get("in_stock") === "true");
  const [sort, setSort] = useState<string>(queryParams.get("sort") || "featured");

  // Load initial Categories and Brands
  useEffect(() => {
    Promise.all([
      categoriesApi.getCategories().catch(() => []),
      adminApi.getBrands().catch(() => []),
    ]).then(([catData, brandData]) => {
      setCategories(Array.isArray(catData) ? catData : (catData as any)?.data || []);
      setBrands(Array.isArray(brandData) ? brandData : (brandData as any)?.data || []);
    });
  }, []);

  // Fetch filtered products from server
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = {
        per_page: 60,
      };

      if (search.trim()) params.search = search.trim();
      if (selectedCategory) {
        const matchedCat = categories.find(
          (c) => c.slug.toLowerCase() === selectedCategory.toLowerCase() || c.name.toLowerCase() === selectedCategory.toLowerCase()
        );
        if (matchedCat) {
          params.category_id = matchedCat.id;
        } else {
          params.search = selectedCategory;
        }
      }
      if (selectedBrand) {
        const matchedBrand = brands.find(
          (b) => b.slug.toLowerCase() === selectedBrand.toLowerCase() || b.name.toLowerCase() === selectedBrand.toLowerCase()
        );
        if (matchedBrand) {
          params.brand_id = matchedBrand.id;
        }
      }
      if (minPrice) params.min_price = Number(minPrice);
      if (maxPrice) params.max_price = Number(maxPrice);
      if (inStockOnly) params.in_stock = true;

      if (sort === "low") params.sort = "price_low";
      else if (sort === "high") params.sort = "price_high";
      else if (sort === "newest") params.sort = "latest";
      else params.sort = "featured";

      const res = await productsApi.getProducts(params);
      let list = (res.data || []).map(mapBackendProductToUI);

      // Client-side fallback filter if model name is requested (e.g. "Phone (2)")
      if (selectedCategory && !params.category_id) {
        list = list.filter((p) =>
          p.name.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          p.model.toLowerCase().includes(selectedCategory.toLowerCase())
        );
      }

      // Sort guarantee
      if (sort === "low") {
        list.sort((a, b) => a.price - b.price);
      } else if (sort === "high") {
        list.sort((a, b) => b.price - a.price);
      }

      setProducts(list);
    } catch (err) {
      console.error("Failed to load shop products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Sync state on filter change
  useEffect(() => {
    fetchProducts();

    // Update URL without page reload
    const newParams = new URLSearchParams();
    if (search) newParams.set("search", search);
    if (selectedCategory) newParams.set("category", selectedCategory);
    if (selectedBrand) newParams.set("brand", selectedBrand);
    if (minPrice) newParams.set("min_price", minPrice);
    if (maxPrice) newParams.set("max_price", maxPrice);
    if (inStockOnly) newParams.set("in_stock", "true");
    if (sort !== "featured") newParams.set("sort", sort);

    const newUrl = `${window.location.pathname}${newParams.toString() ? `?${newParams.toString()}` : ""}`;
    window.history.replaceState({}, "", newUrl);
  }, [search, selectedCategory, selectedBrand, minPrice, maxPrice, inStockOnly, sort, categories, brands]);

  const resetAllFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedBrand("");
    setMinPrice("");
    setMaxPrice("");
    setInStockOnly(false);
    setSort("featured");
  };

  const hasActiveFilters = Boolean(
    search || selectedCategory || selectedBrand || minPrice || maxPrice || inStockOnly || sort !== "featured"
  );

  return (
    <StorePageShell eyebrow="Catalog" title="Nothing & CMF Accessories">
      {/* ══════════════════════════════════════════
          TOP CONTROLS & SEARCH BAR
      ══════════════════════════════════════════ */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <input
            type="text"
            placeholder="Search cases, chargers, cables, models..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#DCDCD8] bg-white text-sm outline-none transition focus:border-black font-medium"
          />
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700"
            >
              ✕
            </button>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Sorting Dropdown */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-11 rounded-xl border border-[#DCDCD8] bg-white px-3 text-xs font-semibold outline-none transition hover:border-black"
          >
            <option value="featured">Featured First</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden inline-flex h-11 items-center gap-2 rounded-xl border border-[#DCDCD8] bg-white px-4 text-xs font-semibold"
          >
            <span>Filters</span>
            {hasActiveFilters && <span className="h-2 w-2 rounded-full bg-red-600" />}
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          ACTIVE FILTER CHIPS
      ══════════════════════════════════════════ */}
      {hasActiveFilters && (
        <div className="mb-6 flex flex-wrap items-center gap-2 pt-1 pb-2">
          <span className="text-xs font-semibold text-neutral-500 mr-1">Active:</span>

          {search && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-900 text-white rounded-full text-xs font-medium">
              Search: &ldquo;{search}&rdquo;
              <button onClick={() => setSearch("")} className="hover:opacity-75 font-bold">×</button>
            </span>
          )}

          {selectedCategory && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-semibold">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory("")} className="hover:opacity-75 font-bold">×</button>
            </span>
          )}

          {selectedBrand && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 text-neutral-800 rounded-full text-xs font-semibold">
              Brand: {selectedBrand}
              <button onClick={() => setSelectedBrand("")} className="hover:opacity-75 font-bold">×</button>
            </span>
          )}

          {(minPrice || maxPrice) && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 text-neutral-800 rounded-full text-xs font-semibold">
              Price: ₨{minPrice || "0"} - ₨{maxPrice || "Max"}
              <button onClick={() => { setMinPrice(""); setMaxPrice(""); }} className="hover:opacity-75 font-bold">×</button>
            </span>
          )}

          {inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
              In Stock Only
              <button onClick={() => setInStockOnly(false)} className="hover:opacity-75 font-bold">×</button>
            </span>
          )}

          <button
            onClick={resetAllFilters}
            className="text-xs font-bold text-red-600 hover:underline ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════
          MAIN LAYOUT (SIDEBAR + GRID)
      ══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Sidebar Filters (Desktop & Collapsible Mobile) */}
        <aside className={`${mobileFilterOpen ? "block" : "hidden"} md:block space-y-6 bg-[#F8F8F6] p-5 rounded-2xl border border-[#E5E5E2]`}>
          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">Categories</h4>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => setSelectedCategory("")}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === ""
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-700 hover:bg-white"
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                    selectedCategory.toLowerCase() === cat.name.toLowerCase()
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-700 hover:bg-white"
                  }`}
                >
                  <span>{cat.name}</span>
                  {cat.products_count !== undefined && (
                    <span className="text-[10px] opacity-60">({cat.products_count})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Device Model Shortcuts */}
          <div className="pt-4 border-t border-[#E2E2E0]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">Device Compatibility</h4>
            <div className="flex flex-wrap gap-1.5">
              {["Phone (2)", "Phone (2a)", "Phone (1)", "CMF Phone 1", "Universal"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedCategory(selectedCategory === m ? "" : m)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
                    selectedCategory === m
                      ? "bg-neutral-900 text-white border-neutral-900"
                      : "bg-white text-neutral-700 border-[#DCDCD8] hover:border-black"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Brands */}
          {brands.length > 0 && (
            <div className="pt-4 border-t border-[#E2E2E0]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">Brand</h4>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedBrand("")}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedBrand === "" ? "text-red-600 font-bold" : "text-neutral-700 hover:text-black"
                  }`}
                >
                  • All Brands
                </button>
                {brands.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBrand(selectedBrand === b.name ? "" : b.name)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      selectedBrand === b.name ? "text-red-600 font-bold" : "text-neutral-700 hover:text-black"
                    }`}
                  >
                    • {b.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price Range */}
          <div className="pt-4 border-t border-[#E2E2E0]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">Price (PKR)</h4>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-[#DCDCD8] rounded-lg text-xs outline-none"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-[#DCDCD8] rounded-lg text-xs outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "< ₨2.5K", min: "", max: "2500" },
                { label: "₨2.5K - ₨5K", min: "2500", max: "5000" },
                { label: "> ₨5K", min: "5000", max: "" },
              ].map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setMinPrice(p.min);
                    setMaxPrice(p.max);
                  }}
                  className="px-2 py-1 text-[11px] bg-white border border-[#DCDCD8] rounded hover:border-black"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="pt-4 border-t border-[#E2E2E0]">
            <label className="flex items-center gap-2.5 text-xs font-bold text-neutral-900 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="h-4 w-4 rounded text-red-600 focus:ring-red-500"
              />
              In Stock Only
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="md:col-span-3">
          {/* Header Count */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-semibold text-neutral-500">
              Showing <span className="text-neutral-900 font-bold">{products.length}</span> items
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24 bg-white rounded-2xl border border-neutral-100">
              <div className="h-9 w-9 animate-spin rounded-full border-2 border-neutral-300 border-t-red-600" />
            </div>
          ) : products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="rounded-2xl border border-[#E5E5E2] py-20 text-center bg-white p-6 shadow-xs">
              <div className="text-3xl mb-2">🔍</div>
              <h2 className="text-xl font-bold text-neutral-900">No products match your criteria</h2>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                Try loosening your filters or resetting the search keywords.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="mt-5 rounded-xl bg-neutral-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-black transition"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </StorePageShell>
  );
}

export default ShopPage;