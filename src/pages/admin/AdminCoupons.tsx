import React, { useEffect, useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { adminApi } from "../../api/admin";

export const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("percentage");
  const [value, setValue] = useState<number | "">("");
  const [minOrder, setMinOrder] = useState<number | "">("");
  const [saving, setSaving] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getCoupons();
      setCoupons(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.createCoupon({
        code: code.toUpperCase().trim(),
        description,
        type,
        value: Number(value),
        min_order_amount: minOrder ? Number(minOrder) : null,
        status: true,
      });
      setModalOpen(false);
      setCode("");
      setDescription("");
      setValue("");
      setMinOrder("");
      await fetchCoupons();
      alert("Coupon created successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to create coupon");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await adminApi.deleteCoupon(id);
      await fetchCoupons();
    } catch (err: any) {
      alert(err.message || "Failed to delete coupon");
    }
  };

  return (
    <AdminLayout activeTab="coupons">
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Discount Coupons</h2>
            <p className="text-xs text-neutral-500">Manage promotional vouchers and checkout discount rules</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-sm"
          >
            + Create Coupon
          </button>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-red-600" />
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-16 text-neutral-400">No coupons active.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-3">Code</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Discount Value</th>
                    <th className="px-6 py-3">Min Order</th>
                    <th className="px-6 py-3">Times Used</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                          {coupon.code}
                        </span>
                        {coupon.description && <p className="text-xs text-neutral-500 mt-1">{coupon.description}</p>}
                      </td>
                      <td className="px-6 py-4 uppercase font-semibold text-xs text-neutral-600">{coupon.type}</td>
                      <td className="px-6 py-4 font-bold text-neutral-900">
                        {coupon.type === "percentage" ? `${coupon.value}% OFF` : `Rs. ${coupon.value} OFF`}
                      </td>
                      <td className="px-6 py-4 text-neutral-600">
                        {coupon.min_order_amount ? `Rs. ${coupon.min_order_amount}` : "None"}
                      </td>
                      <td className="px-6 py-4 font-medium text-neutral-700">{coupon.used_count || 0}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="text-xs font-semibold text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-base font-bold text-neutral-900">Create New Coupon</h3>
                <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-black">✕</button>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SUMMER20"
                    className="w-full px-3 py-2 border rounded-lg uppercase font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. 20% off on all accessories"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Type *</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg bg-white"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (Rs.)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Discount Value *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={value}
                      onChange={(e) => setValue(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Min Order Amount (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="Optional minimum spend"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border rounded-lg font-medium text-neutral-600 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-lg disabled:opacity-50"
                  >
                    {saving ? "Creating..." : "Create Coupon"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
