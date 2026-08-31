import {
  getDeliveryFee,
  money,
  navigateTo,
} from "../../utils/store";

interface OrderSummaryProps {
  subtotal: number;
  checkout?: boolean;
}

export function OrderSummary({
  subtotal,
  checkout = false,
}: OrderSummaryProps) {
  const delivery =
    getDeliveryFee(subtotal);

  const total = subtotal + delivery;

  return (
    <aside className="h-fit rounded-2xl bg-[#F7F7F5] p-5 sm:p-7 lg:sticky lg:top-24">
      <h2 className="mb-6 text-xl font-bold">
        Order summary
      </h2>

      <div className="mb-3 flex justify-between text-sm">
        <span>Subtotal</span>
        <span>{money(subtotal)}</span>
      </div>

      <div className="mb-5 flex justify-between text-sm">
        <span>Delivery</span>

        <span>
          {delivery
            ? money(delivery)
            : "Free"}
        </span>
      </div>

      <div className="flex justify-between border-t border-[#DCDCD8] pt-5 text-lg font-bold">
        <span>Total</span>
        <span>{money(total)}</span>
      </div>

      {!checkout && (
        <>
          <button
            type="button"
            onClick={() =>
              navigateTo("/checkout")
            }
            className="mt-6 h-12 w-full rounded-xl bg-black text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Proceed to Checkout
          </button>

          <button
            type="button"
            onClick={() =>
              navigateTo("/shop")
            }
            className="mt-3 h-12 w-full rounded-xl border border-[#DCDCD8] bg-white text-sm font-semibold transition hover:border-black"
          >
            Continue Shopping
          </button>
        </>
      )}
    </aside>
  );
}