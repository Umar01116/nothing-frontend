import { StorePageShell } from "../../components/store/StorePageShell";
import { money, navigateTo } from "../../utils/store";
import { useCart } from "../../context/CartContext";

const FREE_DELIVERY_LIMIT = 5000;
const DELIVERY_FEE = 250;

export function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart, subtotal } = useCart();
  const items = cart?.items || [];

  const delivery =
    subtotal === 0 ? 0 : subtotal >= FREE_DELIVERY_LIMIT ? 0 : DELIVERY_FEE;

  const total = subtotal + delivery;

  const amountForFreeDelivery = Math.max(FREE_DELIVERY_LIMIT - subtotal, 0);

  if (items.length === 0) {
    return (
      <StorePageShell eyebrow="Shopping cart" title="Your cart is empty">
        <section className="mx-auto max-w-2xl rounded-[28px] border border-[#E7E7E4] bg-[#F7F7F5] px-6 py-16 text-center sm:px-10 sm:py-20">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.5h7.8a2 2 0 0 0 1.9-1.5L21 8H6" />
            </svg>
          </div>

          <h2 className="mt-6 text-2xl font-bold tracking-tight text-[#111] sm:text-3xl">
            Nothing here yet
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#777] sm:text-base">
            Your selected products will appear here. Explore the store and find something you love.
          </p>

          <button
            type="button"
            onClick={() => navigateTo("/shop")}
            className="mt-7 h-12 rounded-xl bg-black px-7 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Continue Shopping
          </button>
        </section>
      </StorePageShell>
    );
  }

  return (
    <StorePageShell eyebrow="Shopping cart" title="Your cart">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* Cart items */}
        <section className="min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-[#777]">
              {items.length} {items.length === 1 ? "product" : "products"} in your cart
            </p>

            <button
              type="button"
              onClick={() => clearCart()}
              className="text-xs font-semibold text-[#777] transition hover:text-red-600"
            >
              Clear cart
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-[#E7E7E4] bg-white p-4 transition hover:border-[#D7D7D4] sm:p-5"
              >
                <div className="flex gap-4 sm:gap-5">
                  {/* Product visual */}
                  <button
                    type="button"
                    onClick={() => navigateTo(`/product/${item.product_id}`)}
                    className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-[#F7F7F5] p-3 sm:h-36 sm:w-36 flex items-center justify-center"
                    aria-label={`View ${item.product_name}`}
                  >
                    {item.product_image ? (
                      <img src={item.product_image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="text-xs text-[#999]">Product</div>
                    )}
                  </button>

                  {/* Product details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => navigateTo(`/product/${item.product_id}`)}
                          className="mt-1 text-left text-sm font-bold leading-5 text-[#111] transition hover:text-red-600 sm:text-base"
                        >
                          {item.product_name}
                        </button>
                        {item.variant_sku && (
                          <p className="text-xs text-[#888] mt-0.5">SKU: {item.variant_sku}</p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="shrink-0 rounded-lg p-1.5 text-[#999] transition hover:bg-red-50 hover:text-red-600"
                        aria-label={`Remove ${item.product_name}`}
                      >
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          aria-hidden="true"
                        >
                          <path d="M3 6h18" />
                          <path d="M8 6V4h8v2" />
                          <path d="M19 6l-1 15H6L5 6" />
                          <path d="M10 11v6M14 11v6" />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-bold text-red-600">
                        {money(Number(item.unit_price))}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3">
                      {/* Quantity */}
                      <div className="flex h-10 items-center rounded-xl border border-[#E2E2E0] bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-full w-9 items-center justify-center text-[#666] transition hover:text-black"
                          aria-label="Decrease quantity"
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>

                        <span className="w-8 text-center text-sm font-semibold text-[#111]">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-full w-9 items-center justify-center text-[#666] transition hover:text-black"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <p className="text-sm font-bold text-[#111]">
                        {money(Number(item.subtotal))}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Summary */}
        <aside className="h-fit rounded-[24px] bg-[#F7F7F5] p-5 sm:p-7 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-[#111]">
              Order summary
            </h2>

            <span className="text-xs font-medium text-[#888]">
              {items.length} items
            </span>
          </div>

          {/* Free delivery progress */}
          {amountForFreeDelivery > 0 && (
            <div className="mt-5 rounded-xl border border-[#E6E6E2] bg-white p-4">
              <p className="text-xs leading-5 text-[#666]">
                Add <strong className="text-[#111]">{money(amountForFreeDelivery)}</strong> more to unlock free delivery.
              </p>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E8E8E5]">
                <div
                  className="h-full rounded-full bg-red-600 transition-all"
                  style={{
                    width: `${Math.min((subtotal / FREE_DELIVERY_LIMIT) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          {amountForFreeDelivery === 0 && (
            <div className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">
              ✓ You've unlocked free delivery.
            </div>
          )}

          <div className="mt-6 space-y-3 border-t border-[#DEDED9] pt-5 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-[#666]">Subtotal</span>
              <span className="font-semibold text-[#111]">{money(Number(subtotal))}</span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-[#666]">Delivery</span>
              <span className="font-semibold text-[#111]">
                {delivery === 0 ? "Free" : money(delivery)}
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-[#DEDED9] pt-5">
            <span className="font-bold text-[#111]">Total</span>
            <span className="text-xl font-bold tracking-tight text-[#111]">
              {money(Number(total))}
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigateTo("/checkout")}
            className="mt-6 h-12 w-full rounded-xl bg-black text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Proceed to Checkout
          </button>

          <button
            type="button"
            onClick={() => navigateTo("/shop")}
            className="mt-3 h-11 w-full rounded-xl border border-[#DCDCD8] bg-white text-sm font-semibold text-[#111] transition hover:border-black"
          >
            Continue Shopping
          </button>
        </aside>
      </div>
    </StorePageShell>
  );
}

export default CartPage;