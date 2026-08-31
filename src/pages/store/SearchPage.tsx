import { useEffect, useState } from "react";
import { productsApi, Product } from "../../api/products";
import { ProductCard } from "../../components/product/ProductCard";
import { StorePageShell } from "../../components/store/StorePageShell";
import { CaseVisual, ChargerVisual, EarbudsVisual, CableVisual, PowerBankVisual } from "../../components/common/ProductVisuals";
import type { Product as LegacyProduct } from "../../types/product";

function mapBackendProductToUI(prod: Product): LegacyProduct {
  const price = Number(prod.sale_price ?? prod.price);
  const oldPrice = prod.sale_price ? Number(prod.price) : 0;
  const discount = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  let visual = <CaseVisual color="#E53528" />;
  const catSlug = prod.category?.slug?.toLowerCase() || "";
  const nameLower = prod.name.toLowerCase();

  if (catSlug.includes("charger") || nameLower.includes("charger")) {
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
    tag: prod.is_new ? "New" : prod.is_best_seller ? "Bestseller" : undefined,
    image: prod.images?.[0]?.image || (prod as any).image || null,
    visual,
  };
}

export function SearchPage({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<LegacyProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await productsApi.getProducts({
          search: query.trim() || undefined,
          per_page: 30,
        });
        setResults((res.data || []).map(mapBackendProductToUI));
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  return (
    <StorePageShell eyebrow="Search" title="Find your product">
      <div className="mb-8 max-w-3xl">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoFocus
          placeholder="Search products, models, cases, chargers..."
          className="h-14 w-full rounded-xl border border-[#E2E2E0] px-4 text-base outline-none transition focus:border-black focus:ring-1 focus:ring-black"
        />

        <p className="mt-3 text-sm text-gray-500">
          {loading ? "Searching catalog..." : `${results.length} ${results.length === 1 ? "result" : "results"}`}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-red-600" />
        </div>
      ) : results.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-5 xl:gap-5">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#E5E5E2] py-20 text-center bg-neutral-50">
          <h2 className="text-2xl font-bold text-neutral-900">Nothing matched your search</h2>
          <p className="mt-2 text-sm text-gray-500">
            Try searching for "Phone Case", "Charger", "Earbuds", or "Cable".
          </p>
        </div>
      )}
    </StorePageShell>
  );
}

export default SearchPage;