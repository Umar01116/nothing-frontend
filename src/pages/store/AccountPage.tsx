import { useEffect, useState } from "react";
import { StorePageShell } from "../../components/store/StorePageShell";
import { navigateTo, money } from "../../utils/store";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { checkoutApi, Order } from "../../api/checkout";
import { addressesApi, Address } from "../../api/addresses";

type AccountTab =
  | "overview"
  | "orders"
  | "wishlist"
  | "addresses"
  | "settings";

const TABS: { id: AccountTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "orders", label: "My Orders" },
  { id: "wishlist", label: "Wishlist" },
  { id: "addresses", label: "Addresses" },
  { id: "settings", label: "Account Settings" },
];

const cardClass = "rounded-3xl border border-[#E7E7E4] bg-white";
const inputClass =
  "h-12 w-full rounded-xl border border-[#E2E2E0] bg-white px-4 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black";

export function AccountPage() {
  const { user, logout, isAdmin } = useAuth();
  const { wishlistItems, wishlistCount, removeFromWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState<AccountTab>("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  // Address modal state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [city, setCity] = useState("Lahore");
  const [postalCode, setPostalCode] = useState("");

  const fetchData = async () => {
    try {
      const [ordersData, addressesData] = await Promise.all([
        checkoutApi.getMyOrders().catch(() => []),
        addressesApi.getAddresses().catch(() => []),
      ]);
      setOrders(ordersData || []);
      setAddresses(addressesData || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      // not logged in
      navigateTo("/login");
      return;
    }
    fetchData();
  }, [user]);

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addressesApi.createAddress({
        type: "shipping",
        full_name: fullName,
        phone,
        address_line_1: address1,
        address_line_2: null,
        city,
        state: null,
        postal_code: postalCode || "54000",
        country: "PK",
        is_default: addresses.length === 0,
      });
      setShowAddAddress(false);
      setFullName("");
      setPhone("");
      setAddress1("");
      setPostalCode("");
      await fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to add address");
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      await addressesApi.deleteAddress(id);
      await fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to delete address");
    }
  };

  const handleSetDefaultAddress = async (id: number) => {
    try {
      await addressesApi.setDefaultAddress(id);
      await fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to set default address");
    }
  };

  const defaultAddress = addresses.find((a) => a.is_default) || addresses[0];

  return (
    <StorePageShell>
      <div className="mx-auto w-full max-w-6xl">
        {/* Profile Card */}
        <section className="relative min-h-[132px] overflow-hidden rounded-[28px] border border-[#E7E7E4] bg-[#F7F7F5] p-5 sm:p-7 lg:p-8">
          <div className="relative flex min-h-[84px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              <div className="relative h-16 w-16 shrink-0 sm:h-20 sm:w-20">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-black text-lg font-bold text-white sm:text-xl uppercase">
                  {user?.name ? user.name.slice(0, 2) : "NP"}
                </div>
                <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-[#F7F7F5] bg-emerald-500" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600">
                  Welcome back
                </p>
                <h1 className="mt-1 truncate text-xl font-bold tracking-tight text-[#111] sm:text-2xl">
                  {user?.name || "Customer"}
                </h1>
                <p className="mt-1 truncate text-sm text-[#777]">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => navigateTo("/admin")}
                  className="h-11 shrink-0 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-red-700 shadow-sm"
                >
                  ⚡ Admin Panel
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigateTo("/login");
                }}
                className="h-11 shrink-0 rounded-xl border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-100"
              >
                Sign out
              </button>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="mt-5 lg:hidden overflow-x-auto">
          <div className="flex min-w-max gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`h-10 rounded-xl px-4 text-sm font-semibold transition-colors ${
                  activeTab === tab.id ? "bg-black text-white" : "border border-[#E7E7E4] bg-white text-[#666]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          {/* Desktop Sidebar */}
          <aside className={`${cardClass} hidden h-fit p-2.5 lg:block`}>
            <nav className="space-y-1">
              {TABS.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex h-11 w-full items-center justify-between rounded-xl px-4 text-left text-sm font-semibold transition-colors ${
                      active ? "bg-black text-white" : "text-[#666] hover:bg-[#F7F7F5] hover:text-black"
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.id === "wishlist" && (
                      <span className="rounded-full px-2 py-0.5 text-[10px] bg-neutral-200 text-neutral-800">
                        {wishlistCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Tab Content */}
          <div className="min-w-0">
            {/* Overview */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className={`${cardClass} p-5`}>
                    <p className="text-xs font-medium text-[#888]">Total Orders</p>
                    <p className="mt-3 text-3xl font-bold text-[#111]">{orders.length}</p>
                  </div>
                  <div className={`${cardClass} p-5`}>
                    <p className="text-xs font-medium text-[#888]">Wishlist Items</p>
                    <p className="mt-3 text-3xl font-bold text-[#111]">{wishlistCount}</p>
                  </div>
                  <div className={`${cardClass} col-span-2 sm:col-span-1 p-5`}>
                    <p className="text-xs font-medium text-[#888]">Account Status</p>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <p className="text-base font-bold text-emerald-600">Active</p>
                    </div>
                  </div>
                </div>

                {/* Recent Orders Overview */}
                <section className={`${cardClass} p-6`}>
                  <h2 className="text-xl font-bold text-[#111] mb-4">Recent Orders</h2>
                  {orders.length === 0 ? (
                    <p className="text-sm text-neutral-500 py-4">You have not placed any orders yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="border rounded-2xl p-4 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-neutral-900">Order #{order.order_number}</p>
                            <p className="text-xs text-neutral-500">
                              {order.items?.length || 0} items • {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-neutral-900">{money(Number(order.grand_total))}</p>
                            <span className="text-xs uppercase font-semibold text-neutral-600">{order.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Default Delivery Address Overview */}
                {defaultAddress && (
                  <section className="rounded-3xl border border-[#E7E7E4] bg-[#F7F7F5] p-6">
                    <h2 className="text-xl font-bold text-[#111] mb-4">Default Delivery Address</h2>
                    <div className="rounded-2xl border border-[#E8E8E5] bg-white p-5">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-[#111]">{defaultAddress.full_name}</p>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                          DEFAULT
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[#666]">{defaultAddress.phone}</p>
                      <p className="mt-2 text-sm leading-6 text-[#555]">
                        {defaultAddress.address_line_1}, {defaultAddress.city}
                      </p>
                    </div>
                  </section>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <section className={`${cardClass} p-6 space-y-4`}>
                <h2 className="text-xl font-bold text-[#111]">My Orders</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-12 text-neutral-400">No orders placed yet.</div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-2xl p-5 space-y-3">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-3 gap-2">
                          <div>
                            <span className="font-mono font-bold text-base">#{order.order_number}</span>
                            <p className="text-xs text-neutral-500">Placed on {new Date(order.created_at).toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-neutral-100 rounded-full text-xs font-bold uppercase">
                              {order.status}
                            </span>
                            <span className="font-bold text-base">{money(Number(order.grand_total))}</span>
                          </div>
                        </div>

                        <div className="divide-y text-sm">
                          {order.items?.map((item) => (
                            <div key={item.id} className="py-2 flex justify-between">
                              <div>
                                <p className="font-medium text-neutral-900">{item.product_name}</p>
                                <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                              </div>
                              <p className="font-semibold text-neutral-900">{money(Number(item.total))}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <section className={`${cardClass} p-6`}>
                <h2 className="text-xl font-bold text-[#111] mb-4">Saved Wishlist</h2>
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-12 text-neutral-400">
                    <div className="text-3xl mb-2">🤍</div>
                    <p className="text-sm">Your wishlist is empty.</p>
                    <button
                      onClick={() => navigateTo("/shop")}
                      className="mt-4 px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:bg-neutral-800 cursor-pointer"
                    >
                      Browse Catalog →
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistItems.map((item) => {
                      const prod = (item.product || item) as any;
                      return (
                        <div key={item.id || prod.id} className="border rounded-2xl p-4 flex items-center gap-4 bg-white hover:border-neutral-400 transition">
                          {prod.images?.[0]?.image ? (
                            <img src={prod.images[0].image} alt="" className="w-16 h-16 object-contain rounded-lg bg-neutral-50 p-1 border" />
                          ) : (
                            <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center text-xl">📦</div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-neutral-900 truncate">{prod.name}</p>
                            <p className="text-sm font-semibold text-red-600 mt-0.5">{money(Number(prod.sale_price ?? prod.price ?? 0))}</p>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <button
                              onClick={() => navigateTo(`/product/${prod.id}`)}
                              className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-lg cursor-pointer text-center"
                            >
                              View
                            </button>
                            <button
                              onClick={() => removeFromWishlist(prod.id)}
                              className="text-[11px] text-neutral-400 hover:text-red-600 font-semibold cursor-pointer text-center"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <section className={`${cardClass} p-6 space-y-4`}>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[#111]">Saved Delivery Addresses</h2>
                  <button
                    onClick={() => setShowAddAddress(true)}
                    className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl"
                  >
                    + Add New Address
                  </button>
                </div>

                {showAddAddress && (
                  <form onSubmit={handleCreateAddress} className="border rounded-2xl p-5 bg-neutral-50 space-y-3">
                    <h3 className="text-sm font-bold text-neutral-900">Add Address</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold block mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1">Address Line</label>
                      <input
                        type="text"
                        required
                        value={address1}
                        onChange={(e) => setAddress1(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold block mb-1">City</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1">Postal Code</label>
                        <input
                          type="text"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg bg-white"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddAddress(false)}
                        className="px-3 py-1.5 border rounded-lg text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-black text-white rounded-lg text-xs font-bold"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="border rounded-2xl p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-neutral-900">{addr.full_name}</p>
                          {addr.is_default && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold rounded-full">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">{addr.phone}</p>
                        <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                          {addr.address_line_1}, {addr.city}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t mt-4 text-xs font-semibold">
                        {!addr.is_default && (
                          <button
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="text-neutral-700 hover:text-black"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-red-600 hover:text-red-700 ml-auto"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <section className={`${cardClass} p-6 space-y-4`}>
                <h2 className="text-xl font-bold text-[#111]">Account Settings</h2>
                <div className="space-y-4 max-w-md text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Name</label>
                    <input type="text" readOnly value={user?.name || ""} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Email</label>
                    <input type="email" readOnly value={user?.email || ""} className={inputClass} />
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </StorePageShell>
  );
}

export default AccountPage;