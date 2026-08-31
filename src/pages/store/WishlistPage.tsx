import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { ProductCard } from "../../components/product/ProductCard";
import { StorePageShell } from "../../components/store/StorePageShell";
import { navigateTo } from "../../utils/store";
import { CaseVisual, ChargerVisual, EarbudsVisual, CableVisual, PowerBankVisual } from "../../components/common/ProductVisuals";
import type { Product as LegacyProduct } from "../../types/product";

function mapBackendProductToUI(prod: any): LegacyProduct {
  const price = Number(prod.sale_price ?? prod.price ?? 0);
  const oldPrice = prod.sale_price ? Number(prod.price ?? 0) : 0;
  const discount = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  let visual = <CaseVisual color="#E53528" />;
  const catSlug = prod.category?.slug?.toLowerCase() || "";
  const nameLower = (prod.name || "").toLowerCase();

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

export function WishlistPage() {
  const { user } = useAuth();
  const { wishlistItems, loading } = useWishlist();

  const mappedProducts: LegacyProduct[] = (wishlistItems || []).map((w: any) =>
    mapBackendProductToUI(w.product || w)
  );

  return (
    <StorePageShell eyebrow="Saved for later" title="My Wishlist">
      {/* Optional prompt for guests */}
      {!user && mappedProducts.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-600">
          <span>
            💡 <strong>Saved locally on this device.</strong> Sign in to sync your wishlist across your phone and PC.
          </span>
          <button
            onClick={() => navigateTo("/login")}
            className="font-bold text-neutral-900 underline hover:text-red-600 cursor-pointer"
          >
            Sign in now →
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-red-600" />
        </div>
      ) : mappedProducts.length > 0 ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              {mappedProducts.length} {mappedProducts.length === 1 ? "Item" : "Items"} Saved
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-5 xl:gap-5">
            {mappedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#E5E5E2] py-20 text-center bg-neutral-50 max-w-xl mx-auto">
          <div className="text-4xl mb-3">🤍</div>
          <h2 className="text-xl font-bold text-neutral-900">Your wishlist is empty</h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
            Browse our catalog and tap the heart icon on any accessory to save it for later.
          </p>
          <button
            onClick={() => navigateTo("/shop")}
            className="mt-6 rounded-xl bg-black px-6 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-neutral-800 transition cursor-pointer shadow-sm"
          >
            Explore Catalog →
          </button>
        </div>
      )}
    </StorePageShell>
  );
}

export default WishlistPage;