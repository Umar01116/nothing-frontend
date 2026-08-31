import { useMemo, useState } from "react";

import { findProduct, products } from "../../data/products";
import { StorePageShell } from "../../components/store/StorePageShell";
import { QuantitySelector } from "../../components/store/QuantitySelector";
import { money, navigateTo } from "../../utils/store";

export function ProductPage({
  id,
}: {
  id: number;
}) {
  const product = findProduct(id);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeInfo, setActiveInfo] = useState<
    "description" | "shipping" | "warranty"
  >("description");

  const relatedProducts = useMemo(
    () =>
      products
        .filter((item) => item.id !== id)
        .slice(0, 4),
    [id],
  );

  if (!product) {
    return (
      <StorePageShell>
        <section className="mx-auto max-w-2xl rounded-3xl border border-[#E7E7E4] bg-[#F7F7F5] px-6 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-xl shadow-sm">
            !
          </div>

          <h1 className="mt-6 text-2xl font-bold tracking-tight text-[#111] sm:text-3xl">
            Product not found
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#777]">
            The product you're looking for is no
            longer available or the link may be
            incorrect.
          </p>

          <button
            type="button"
            onClick={() => navigateTo("/shop")}
            className="mt-7 h-12 rounded-xl bg-black px-7 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Back to Shop
          </button>
        </section>
      </StorePageShell>
    );
  }

  const handleAddToCart = () => {
    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1800);
  };

  return (
    <StorePageShell
      eyebrow={product.model}
      title={product.name}
    >
      {/* Product */}
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.95fr)] lg:gap-14">
        {/* Visual */}
        <div className="min-w-0">
          <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-[28px] bg-[#F7F7F5] p-8 sm:min-h-[560px] sm:p-12">
            {product.tag && (
              <span className="absolute left-5 top-5 z-10 rounded-full bg-red-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">
                {product.tag}
              </span>
            )}

            {product.discount > 0 && (
              <span className="absolute right-5 top-5 z-10 rounded-full bg-black px-3 py-1.5 text-[10px] font-bold text-white">
                -{product.discount}%
              </span>
            )}

            <div className="h-[340px] w-full max-w-lg sm:h-[460px]">
              {product.visual}
            </div>
          </div>

          {/* Trust points */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              ["✓", "Genuine"],
              ["↗", "Fast Delivery"],
              ["◈", "Secure Pay"],
            ].map(([icon, text]) => (
              <div
                key={text}
                className="rounded-xl border border-[#E8E8E5] bg-white px-2 py-3 text-center"
              >
                <span className="text-sm font-bold text-[#111]">
                  {icon}
                </span>

                <p className="mt-1 text-[10px] font-semibold text-[#777] sm:text-xs">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              In Stock
            </span>

            {product.tag && (
              <span className="rounded-full bg-red-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-600">
                {product.tag}
              </span>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-end gap-3">
            <span className="text-3xl font-bold tracking-tight text-red-600 sm:text-4xl">
              {money(product.price)}
            </span>

            {product.oldPrice > product.price && (
              <span className="pb-1 text-sm text-[#AAA] line-through">
                {money(product.oldPrice)}
              </span>
            )}
          </div>

          {product.oldPrice > product.price && (
            <p className="mt-2 text-xs font-semibold text-emerald-600">
              You save{" "}
              {money(product.oldPrice - product.price)}
            </p>
          )}

          <div className="my-7 h-px bg-[#E8E8E5]" />

          <p className="max-w-xl text-sm leading-7 text-[#666] sm:text-base">
            Premium protection and everyday
            functionality designed around the Nothing
            ecosystem. Built for a clean fit,
            dependable use and a seamless everyday
            experience.
          </p>

          {/* Quantity + cart */}
          <div className="mt-7">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#777]">
              Quantity
            </p>

            <div className="flex gap-3">
              <QuantitySelector
                value={qty}
                onChange={setQty}
              />

              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 rounded-xl text-sm font-semibold text-white transition ${
                  added
                    ? "bg-emerald-600"
                    : "bg-black hover:bg-red-600"
                }`}
              >
                {added
                  ? "Added to Cart ✓"
                  : "Add to Cart"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => navigateTo("/checkout")}
              className="mt-3 h-12 w-full rounded-xl bg-red-600 text-sm font-semibold text-white transition hover:bg-black"
            >
              Buy Now
            </button>
          </div>

          {/* Product information */}
          <div className="mt-8 divide-y divide-[#E8E8E5] border-y border-[#E8E8E5]">
            {[
              {
                id: "description" as const,
                title: "Product Details",
              },
              {
                id: "shipping" as const,
                title: "Delivery Information",
              },
              {
                id: "warranty" as const,
                title: "Warranty & Support",
              },
            ].map((item) => (
              <div key={item.id}>
                <button
                  type="button"
                  onClick={() =>
                    setActiveInfo(
                      activeInfo === item.id
                        ? item.id
                        : item.id,
                    )
                  }
                  className="flex w-full items-center justify-between py-4 text-left"
                >
                  <span className="text-sm font-semibold text-[#111]">
                    {item.title}
                  </span>

                  <span className="text-lg text-[#777]">
                    {activeInfo === item.id
                      ? "−"
                      : "+"}
                  </span>
                </button>

                {activeInfo === item.id && (
                  <div className="pb-4 text-sm leading-6 text-[#777]">
                    {item.id ===
                      "description" &&
                      "Designed to complement your device while providing reliable everyday protection and a clean, premium finish."}

                    {item.id === "shipping" &&
                      "Fast delivery across Pakistan. Delivery charges and estimated timelines are calculated during checkout."}

                    {item.id === "warranty" &&
                      "Need help with your purchase? Our support team can assist with product and order-related questions."}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-[#E8E8E5] pt-12 sm:mt-20 sm:pt-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600">
                You may also like
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#111] sm:text-3xl">
                Related Products
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigateTo("/shop")}
              className="hidden text-sm font-semibold text-[#111] underline decoration-[#CCC] underline-offset-4 hover:decoration-black sm:block"
            >
              View all
            </button>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  navigateTo(
                    `/product/${item.id}`,
                  )
                }
                className="group overflow-hidden rounded-2xl border border-[#E8E8E5] bg-white text-left transition hover:-translate-y-1 hover:border-[#D5D5D2] hover:shadow-lg"
              >
                <div className="h-40 overflow-hidden bg-[#F7F7F5] p-4 sm:h-48">
                  {item.visual}
                </div>

                <div className="p-4">
                  <p className="truncate text-[10px] font-bold uppercase tracking-wider text-[#999]">
                    {item.model}
                  </p>

                  <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-5 text-[#111]">
                    {item.name}
                  </h3>

                  <p className="mt-3 text-sm font-bold text-red-600">
                    {money(item.price)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </StorePageShell>
  );
}

export default ProductPage;