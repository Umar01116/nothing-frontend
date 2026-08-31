import { useEffect, useState, type FormEvent } from "react";
import { StorePageShell } from "../../components/store/StorePageShell";
import { money, navigateTo } from "../../utils/store";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { checkoutApi, ShippingMethod, CouponValidation } from "../../api/checkout";
import { addressesApi, Address } from "../../api/addresses";

const inputClass =
  "h-12 w-full rounded-xl border border-[#E2E2E0] bg-white px-4 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black";

type PaymentMethod = "cod" | "online";

export function CheckoutPage() {
  const { cart, subtotal, refreshCart } = useCart();
  const { user } = useAuth();

  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShippingMethodId, setSelectedShippingMethodId] = useState<number | "">("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [addresses, setAddresses] = useState<Address[]>([]);

  // Contact info
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");

  // Address
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("Lahore");
  const [postalCode, setPostalCode] = useState("54000");
  const [notes, setNotes] = useState("");

  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidation | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (!name) setName(user.name);
      if (!email) setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    checkoutApi.getShippingMethods().then((res) => {
      const active = (res || []).filter((m) => m.status);
      setShippingMethods(active);
      if (active.length > 0) {
        setSelectedShippingMethodId(active[0].id);
      }
    });

    if (user) {
      addressesApi.getAddresses().then((res) => {
        setAddresses(res || []);
        const def = (res || []).find((a) => a.is_default) || res?.[0];
        if (def) {
          setName(def.full_name);
          setPhone(def.phone);
          setAddressLine1(def.address_line_1);
          setAddressLine2(def.address_line_2 || "");
          setCity(def.city);
          setPostalCode(def.postal_code || "54000");
        }
      });
    }
  }, [user]);

  const selectedShipping = shippingMethods.find((m) => m.id === selectedShippingMethodId);
  const shippingFee = selectedShipping
    ? selectedShipping.free_shipping_threshold && subtotal >= selectedShipping.free_shipping_threshold
      ? 0
      : Number(selectedShipping.price)
    : 0;

  const discountAmount = appliedCoupon ? Number(appliedCoupon.discount) : 0;
  const onlineDiscount = paymentMethod === "online" ? subtotal * 0.05 : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount - onlineDiscount + shippingFee);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    setCouponError(null);
    try {
      const res = await checkoutApi.validateCoupon(couponCode.trim(), subtotal);
      setAppliedCoupon(res);
    } catch (err: any) {
      setAppliedCoupon(null);
      setCouponError(err.message || "Invalid coupon code.");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handlePlaceOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cart?.items || cart.items.length === 0) {
      alert("Your cart is empty.");
      navigateTo("/shop");
      return;
    }
    if (!selectedShippingMethodId) {
      alert("Please select a shipping method.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const order = await checkoutApi.placeOrder({
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        shipping_address: {
          full_name: name,
          phone,
          address_line_1: addressLine1,
          address_line_2: addressLine2 || undefined,
          city,
          postal_code: postalCode,
          country: "PK",
        },
        shipping_method_id: Number(selectedShippingMethodId),
        payment_method: paymentMethod,
        coupon_code: appliedCoupon ? appliedCoupon.coupon.code : undefined,
        notes: notes || undefined,
      });

      await refreshCart();
      navigateTo(`/order-success?order_number=${order.order_number}`);
    } catch (err: any) {
      setError(err.message || "Failed to place order. Please check stock and details.");
    } finally {
      setLoading(false);
    }
  };

  const items = cart?.items || [];

  return (
    <StorePageShell eyebrow="Secure checkout" title="Complete your order">
      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-neutral-600 mb-4">Your cart is empty.</p>
          <button
            onClick={() => navigateTo("/shop")}
            className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-xl"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <form onSubmit={handlePlaceOrder} className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-700 text-sm font-semibold rounded-xl border border-red-200">
                {error}
              </div>
            )}

            {/* Contact Information */}
            <section className="rounded-2xl border border-[#E5E5E2] p-5 sm:p-8 bg-white">
              <h2 className="mb-5 text-xl font-bold">Contact information</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name *"
                  className={inputClass}
                />

                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number (e.g. 03001234567) *"
                  className={inputClass}
                />

                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address *"
                  className={`${inputClass} sm:col-span-2`}
                />
              </div>
            </section>

            {/* Delivery Address */}
            <section className="rounded-2xl border border-[#E5E5E2] p-5 sm:p-8 bg-white">
              <h2 className="mb-5 text-xl font-bold">Delivery address</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City *"
                  className={inputClass}
                />

                <input
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Postal Code"
                  className={inputClass}
                />

                <input
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="Complete street address *"
                  className={`${inputClass} sm:col-span-2`}
                />

                <input
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Apartment, suite, landmark (optional)"
                  className={`${inputClass} sm:col-span-2`}
                />

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Delivery notes / special instructions (optional)"
                  className={`${inputClass} min-h-24 resize-none py-3 sm:col-span-2`}
                />
              </div>
            </section>

            {/* Shipping Method */}
            <section className="rounded-2xl border border-[#E5E5E2] p-5 sm:p-8 bg-white space-y-3">
              <h2 className="text-xl font-bold mb-2">Shipping Method</h2>
              {shippingMethods.map((method) => {
                const isFree = method.free_shipping_threshold && subtotal >= method.free_shipping_threshold;
                const cost = isFree ? 0 : Number(method.price);
                return (
                  <label
                    key={method.id}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${
                      selectedShippingMethodId === method.id ? "border-black bg-neutral-50" : "border-neutral-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping_method"
                        checked={selectedShippingMethodId === method.id}
                        onChange={() => setSelectedShippingMethodId(method.id)}
                      />
                      <div>
                        <p className="font-bold text-sm">{method.name}</p>
                        <p className="text-xs text-neutral-500">{method.estimated_days || "2-4 Business Days"}</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm">{cost === 0 ? "FREE" : money(cost)}</span>
                  </label>
                );
              })}
            </section>

            {/* Payment Method */}
            <section className="rounded-2xl border border-[#E5E5E2] p-5 sm:p-8 bg-white">
              <h2 className="mb-5 text-xl font-bold">Payment method</h2>

              {/* COD */}
              <label
                className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${
                  paymentMethod === "cod" ? "border-black bg-neutral-50" : "border-[#E2E2E0]"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="mt-1"
                />
                <span>
                  <b className="text-sm">Cash on Delivery (COD)</b>
                  <span className="mt-1 block text-xs text-gray-500">
                    Pay securely in cash when your parcel is delivered at your doorstep.
                  </span>
                </span>
              </label>

              {/* Online Payment */}
              <label
                className={`mt-3 flex cursor-pointer gap-3 rounded-xl border p-4 transition ${
                  paymentMethod === "online" ? "border-black bg-neutral-50" : "border-[#E2E2E0]"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                  className="mt-1"
                />
                <span>
                  <b className="text-sm">Bank Transfer / EasyPaisa (Extra 5% Discount)</b>
                  <span className="mt-1 block text-xs text-gray-500">
                    Pay online and receive an instant 5% prepaid discount.
                  </span>
                </span>
              </label>

              {paymentMethod === "online" && (
                <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-5 text-sm">
                  <p className="text-[#333]">
                    Enjoy <strong>instant 5% discount</strong> on prepaid orders. Transfer to our account and share payment receipt with Order Number.
                  </p>
                  <div className="mt-3 p-3 bg-white rounded-lg border border-red-200 space-y-1 text-xs">
                    <p><strong>Account:</strong> EasyPaisa / JazzCash</p>
                    <p><strong>Account Title:</strong> Nothing Pakistan</p>
                    <p><strong>Account Number:</strong> 0300-1234567</p>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Order Summary & Coupon Sidebar */}
          <aside className="h-fit rounded-2xl bg-[#F7F7F5] p-5 sm:p-7 lg:sticky lg:top-24 space-y-5">
            <h2 className="text-xl font-bold">Your order</h2>

            {/* Items list */}
            <div className="divide-y divide-neutral-200 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="py-3 flex gap-3 items-center">
                  {item.product_image ? (
                    <img src={item.product_image} alt="" className="w-12 h-12 rounded object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded bg-neutral-200 flex items-center justify-center text-xs">📦</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-neutral-900 truncate">{item.product_name}</p>
                    <p className="text-[11px] text-neutral-500">Qty {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold">{money(Number(item.subtotal))}</span>
                </div>
              ))}
            </div>

            {/* Coupon input */}
            <div className="border-t border-[#DCDCD8] pt-4">
              <label className="block text-xs font-bold mb-1">Discount Coupon</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="PROMO CODE"
                  className="flex-1 px-3 py-2 text-xs border rounded-lg uppercase font-mono"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={validatingCoupon}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-lg disabled:opacity-50"
                >
                  {validatingCoupon ? "..." : "Apply"}
                </button>
              </div>
              {appliedCoupon && (
                <p className="text-xs text-green-700 font-bold mt-1.5">
                  ✓ Coupon {appliedCoupon.coupon.code} applied (-{money(discountAmount)})
                </p>
              )}
              {couponError && (
                <p className="text-xs text-red-600 font-semibold mt-1.5">{couponError}</p>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-2 border-t border-[#DCDCD8] pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-semibold">{money(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-red-600 font-medium">
                  <span>Coupon Discount</span>
                  <span>-{money(discountAmount)}</span>
                </div>
              )}

              {onlineDiscount > 0 && (
                <div className="flex justify-between text-green-700 font-medium">
                  <span>Online Discount (5%)</span>
                  <span>-{money(onlineDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-neutral-600">Shipping</span>
                <span className="font-semibold">{shippingFee === 0 ? "FREE" : money(shippingFee)}</span>
              </div>

              <div className="flex justify-between border-t border-[#DCDCD8] pt-3 text-lg font-bold text-neutral-900">
                <span>Grand Total</span>
                <span>{money(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 h-12 w-full rounded-xl bg-red-600 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </aside>
        </form>
      )}
    </StorePageShell>
  );
}

export default CheckoutPage;