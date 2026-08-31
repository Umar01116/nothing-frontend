import { useEffect } from "react";
import { money, navigateTo } from "../../utils/store";
import { useCart } from "../../context/CartContext";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, updateQuantity, removeItem, subtotal } = useCart();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const handleViewCart = () => {
    onClose();
    navigateTo("/cart");
  };

  const handleCheckout = () => {
    if (!cart?.items || cart.items.length === 0) return;
    onClose();
    navigateTo("/checkout");
  };

  if (!open) return null;

  const items = cart?.items || [];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[998] bg-black/35 backdrop-blur-[3px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className="fixed right-0 top-0 z-[999] flex h-screen w-full max-w-[520px] flex-col bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#E5E5E5] px-8 py-7 sm:px-10">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#999]">
              Your Selection
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#111]">
              Cart ({cart?.total_items || 0})
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center text-4xl font-light leading-none text-[#666] transition hover:text-black"
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="flex h-36 w-36 items-center justify-center rounded-full bg-[#F7F7F5]">
              <svg
                width="58"
                height="58"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="text-[#111]"
              >
                <path d="M3 4h2l2.5 11.5a2 2 0 0 0 2 1.5h7.8a2 2 0 0 0 1.9-1.5L21 8H6" />
                <circle cx="10" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
            </div>

            <h3 className="mt-12 text-3xl font-semibold tracking-tight text-[#111]">
              Your cart is empty
            </h3>

            <p className="mt-5 max-w-md text-lg leading-8 text-[#999]">
              Add something you love and it will appear here.
            </p>

            <button
              type="button"
              onClick={() => {
                onClose();
                navigateTo("/shop");
              }}
              className="mt-14 h-14 w-full max-w-[400px] rounded-2xl bg-black px-8 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[#222]"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Products List */}
            <div className="flex-1 overflow-y-auto px-8 py-7 sm:px-10">
              {items.map((item) => (
                <div key={item.id} className="border-b border-[#E5E5E5] pb-7 pt-2">
                  <div className="flex gap-5">
                    {/* Product image */}
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        navigateTo(`/product/${item.product_id}`);
                      }}
                      className="flex h-28 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F7F7F5]"
                    >
                      {item.product_image ? (
                        <img src={item.product_image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="text-xs text-[#999]">Product</div>
                      )}
                    </button>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          navigateTo(`/product/${item.product_id}`);
                        }}
                        className="text-left"
                      >
                        <h3 className="text-base font-medium leading-7 text-[#222]">
                          {item.product_name}
                        </h3>
                      </button>

                      {item.variant_sku && (
                        <p className="mt-1 text-xs text-[#888]">SKU: {item.variant_sku}</p>
                      )}

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="text-sm text-[#999]">
                          {item.quantity} × {money(Number(item.unit_price))}
                        </span>
                        <span className="text-sm font-semibold text-[#111]">
                          {money(Number(item.subtotal))}
                        </span>
                      </div>

                      {/* Quantity Selector */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center overflow-hidden rounded-lg border border-[#DCDCDC]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center text-[#555] transition hover:bg-[#F5F5F5]"
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="flex h-8 min-w-8 items-center justify-center border-x border-[#DCDCDC] text-xs font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center text-[#555] transition hover:bg-[#F5F5F5]"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-[#999] underline underline-offset-4 transition hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Panel */}
            <div className="shrink-0 border-t border-[#E5E5E5] bg-white px-8 py-7 sm:px-10">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-[#555]">Subtotal</span>
                <span className="text-2xl font-semibold text-[#111]">
                  {money(Number(subtotal))}
                </span>
              </div>

              <p className="mt-2 text-xs text-[#999]">
                Shipping and discounts calculated at checkout.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleViewCart}
                  className="h-14 rounded-xl border border-neutral-300 bg-neutral-100 text-sm font-semibold tracking-wide text-neutral-800 transition hover:bg-neutral-200"
                >
                  VIEW CART
                </button>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="h-14 rounded-xl bg-black text-sm font-semibold tracking-wide text-white transition hover:bg-red-600"
                >
                  CHECKOUT
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}