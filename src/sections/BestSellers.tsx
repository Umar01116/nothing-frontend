import { useEffect, useState } from "react";
import { productsApi, Product } from "../api/products";
import { useCart } from "../context/CartContext";
import { money, navigateTo, resolveImageUrl } from "../utils/store";
import { CaseVisual, ChargerVisual, EarbudsVisual, CableVisual, PowerBankVisual, NothingPixelMark } from "../components/common/ProductVisuals";

export function BestSellers() {
  const { addToCart } = useCart();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<number | null>(null);

  useEffect(() => {
    productsApi
      .getProducts({ best_seller: true, per_page: 3 })
      .then((res) => {
        setItems(res.data || []);
      })
      .catch((err) => console.error("Best sellers error:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e: React.MouseEvent, prod: Product) => {
    e.stopPropagation();
    try {
      await addToCart(prod.id, undefined, 1);
      setAddedId(prod.id);
      setTimeout(() => setAddedId(null), 1500);
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  if (!loading && items.length === 0) {
    return null;
  }

  return (
    <section className="py-24" style={{ background: "#FFFFFF" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-14 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <NothingPixelMark size={14} color="#E53528" />
              <span
                className="text-xs font-semibold tracking-[0.2em] uppercase"
                style={{ color: "#E53528", fontFamily: "Instrument Sans, sans-serif" }}
              >
                Top Sellers
              </span>
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight"
              style={{ fontFamily: "Instrument Sans, sans-serif", color: "#0A0A0A" }}
            >
              Best Sellers
            </h2>
          </div>
          <button
            onClick={() => navigateTo("/shop")}
            className="text-sm font-semibold underline-hover cursor-pointer"
          >
            Explore Catalog →
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-red-600" />
          </div>
        ) : (
          <div className="space-y-4 stagger">
            {items.map((item, idx) => {
              const price = Number(item.sale_price ?? item.price);
              const oldPrice = item.sale_price ? Number(item.price) : 0;

              let visual = <CaseVisual color="#3A3A3A" />;
              const catSlug = item.category?.slug?.toLowerCase() || "";
              if (item.images?.[0]?.image) {
                visual = <img src={resolveImageUrl(item.images[0].image)} alt={item.name} className="w-full h-full object-cover rounded-xl" />;
              } else if (catSlug.includes("charger") || item.name.toLowerCase().includes("charger")) {
                visual = <ChargerVisual color="#E53528" />;
              } else if (catSlug.includes("audio") || item.name.toLowerCase().includes("ear")) {
                visual = <EarbudsVisual color="#0A0A0A" />;
              } else if (catSlug.includes("cable")) {
                visual = <CableVisual color="#E53528" />;
              }

              return (
                <div
                  key={item.id}
                  onClick={() => navigateTo(`/product/${item.id}`)}
                  className="reveal group grid grid-cols-1 md:grid-cols-5 items-center gap-6 p-6 rounded-2xl transition-all duration-400 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                  style={{ background: "#F7F7F5", border: "1px solid #F0F0EE" }}
                >
                  <div
                    className="text-5xl font-bold opacity-10"
                    style={{ fontFamily: "Instrument Sans, sans-serif" }}
                  >
                    0{idx + 1}
                  </div>
                  <div className="col-span-1 flex items-center justify-center" style={{ height: "100px" }}>
                    {visual}
                  </div>
                  <div className="col-span-2">
                    <h3
                      className="font-bold text-lg mb-1"
                      style={{ fontFamily: "Instrument Sans, sans-serif", color: "#0A0A0A" }}
                    >
                      {item.name}
                    </h3>
                    <p className="text-sm line-clamp-1" style={{ color: "#6B6B6B" }}>
                      {item.short_description || item.description || "Authentic official accessory."}
                    </p>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-3">
                    <div>
                      <div
                        className="text-xl font-bold"
                        style={{ fontFamily: "Instrument Sans, sans-serif", color: "#E53528" }}
                      >
                        {money(price)}
                      </div>
                      {oldPrice > price && (
                        <div className="text-sm line-through" style={{ color: "#AEAEAE" }}>
                          {money(oldPrice)}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleAdd(e, item)}
                      className="px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 cursor-pointer"
                      style={{
                        background: addedId === item.id ? "#10B981" : "#0A0A0A",
                        borderRadius: "8px",
                        fontFamily: "Instrument Sans, sans-serif",
                      }}
                    >
                      {addedId === item.id ? "Added ✓" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
