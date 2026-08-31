import { StorePageShell } from "../../components/store/StorePageShell";
import { navigateTo } from "../../utils/store";

export function OrderSuccessPage() {
  const query = new URLSearchParams(window.location.search);
  const orderNumber = query.get("order_number") || "#NP-28491";

  return (
    <StorePageShell>
      <div className="mx-auto max-w-5xl">
        {/* Confirmation Header */}
        <section className="relative overflow-hidden rounded-[28px] border border-[#E8E8E5] bg-white">
          {/* Top accent */}
          <div className="h-1.5 w-full bg-[#E53528]" />

          <div className="px-5 py-10 text-center sm:px-10 sm:py-14 lg:px-16 lg:py-16">
            {/* Success Icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F4F4F2]">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0A0A0A]">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12.5 9.5 17 19 7" />
                </svg>
              </div>
            </div>

            <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.24em] text-[#E53528]">
              Order confirmed
            </p>

            <h1
              className="mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-[-0.045em] text-[#0A0A0A] sm:text-4xl lg:text-5xl"
              style={{
                fontFamily: "Instrument Sans, sans-serif",
              }}
            >
              Thank you for your order.
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#6B6B6B] sm:text-base">
              Your order has been successfully placed. We&apos;ll
              keep you updated as it moves through processing and
              delivery.
            </p>

            {/* Order Number */}
            <div className="mx-auto mt-8 inline-flex items-center gap-3 rounded-full border border-[#E5E5E2] bg-[#FAFAF9] px-5 py-2.5">
              <span className="text-xs text-[#777]">
                Order number
              </span>

              <span className="text-sm font-bold text-[#0A0A0A]">
                {orderNumber}
              </span>
            </div>
          </div>
        </section>

        {/* Order Progress */}
        <section className="mt-5 rounded-[24px] border border-[#E8E8E5] bg-white p-5 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#888]">
                Order status
              </p>

              <h2 className="mt-1 text-lg font-bold text-[#0A0A0A]">
                We&apos;ve received your order
              </h2>
            </div>

            <span className="rounded-full bg-[#F0FDF4] px-3 py-1.5 text-xs font-semibold text-[#15803D]">
              Confirmed
            </span>
          </div>

          <div className="mt-8 flex items-start">
            {/* Step 1 */}
            <div className="flex flex-1 flex-col items-center text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0A0A0A] text-white">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12.5 9.5 17 19 7" />
                </svg>
              </div>

              <p className="mt-3 text-xs font-semibold text-[#0A0A0A] sm:text-sm">
                Confirmed
              </p>
            </div>

            <div className="mt-5 h-px flex-1 bg-[#D9D9D6]" />

            {/* Step 2 */}
            <div className="flex flex-1 flex-col items-center text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DCDCD8] bg-white text-[#999]">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 7h18" />
                  <path d="M6 7V4h12v3" />
                  <path d="M5 7l1 13h12l1-13" />
                </svg>
              </div>

              <p className="mt-3 text-xs font-medium text-[#777] sm:text-sm">
                Processing
              </p>
            </div>

            <div className="mt-5 h-px flex-1 bg-[#D9D9D6]" />

            {/* Step 3 */}
            <div className="flex flex-1 flex-col items-center text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DCDCD8] bg-white text-[#999]">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 7h13v10H3z" />
                  <path d="M16 10h3l2 3v4h-5z" />
                  <circle cx="7" cy="19" r="1.5" />
                  <circle cx="18" cy="19" r="1.5" />
                </svg>
              </div>

              <p className="mt-3 text-xs font-medium text-[#777] sm:text-sm">
                Shipped
              </p>
            </div>

            <div className="mt-5 h-px flex-1 bg-[#D9D9D6]" />

            {/* Step 4 */}
            <div className="flex flex-1 flex-col items-center text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DCDCD8] bg-white text-[#999]">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 11a8 8 0 1 1-2.34-5.66" />
                  <path d="M20 4v7h-7" />
                  <path d="M8 12h8" />
                </svg>
              </div>

              <p className="mt-3 text-xs font-medium text-[#777] sm:text-sm">
                Delivered
              </p>
            </div>
          </div>
        </section>

        {/* Details Grid */}
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          {/* Delivery */}
          <section className="rounded-[24px] border border-[#E8E8E5] bg-white p-5 sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#0A0A0A]">
                Delivery details
              </h2>

              <span className="text-xs font-medium text-[#777]">
                Estimated delivery
              </span>
            </div>

            <div className="mt-6 flex gap-4 rounded-2xl bg-[#F7F7F5] p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0A0A0A"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 10.5 12 3l9 7.5" />
                  <path d="M5 9v11h14V9" />
                  <path d="M9 20v-6h6v6" />
                </svg>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#0A0A0A]">
                  Your order is being prepared
                </p>

                <p className="mt-1 text-xs leading-6 text-[#6B6B6B]">
                  Delivery information and tracking updates
                  will appear here once your order is processed.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-[#888]">
                  Delivery method
                </p>

                <p className="mt-1 text-sm font-semibold text-[#0A0A0A]">
                  Standard delivery
                </p>
              </div>

              <div>
                <p className="text-xs text-[#888]">
                  Payment method
                </p>

                <p className="mt-1 text-sm font-semibold text-[#0A0A0A]">
                  Cash on Delivery
                </p>
              </div>
            </div>
          </section>

          {/* Need Help */}
          <section className="rounded-[24px] bg-[#0A0A0A] p-5 text-white sm:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8A8A8]">
              Need help?
            </p>

            <h2 className="mt-3 text-xl font-bold tracking-tight">
              We&apos;re here for you.
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#AFAFAF]">
              If you have any questions about your order,
              our support team is ready to help.
            </p>

            <button
              type="button"
              onClick={() => navigateTo("/contact")}
              className="mt-7 w-full rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#0A0A0A] transition hover:bg-[#E53528] hover:text-white"
            >
              Contact Support
            </button>
          </section>
        </div>

        {/* Actions */}
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => navigateTo("/")}
            className="rounded-xl border border-[#DCDCD8] px-7 py-3.5 text-sm font-semibold text-[#0A0A0A] transition hover:border-[#0A0A0A]"
          >
            Back to Home
          </button>

          <button
            type="button"
            onClick={() => navigateTo("/shop")}
            className="rounded-xl bg-[#0A0A0A] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#E53528]"
          >
            Continue Shopping
          </button>
        </div>

        {/* Footer note */}
        <p className="mt-7 pb-4 text-center text-xs text-[#999]">
          You&apos;ll receive order updates as soon as your order
          status changes.
        </p>
      </div>
    </StorePageShell>
  );
}