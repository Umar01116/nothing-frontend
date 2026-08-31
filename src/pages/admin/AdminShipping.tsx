import React, { useEffect, useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { adminApi } from "../../api/admin";
import { money } from "../../utils/store";

export const AdminShipping: React.FC = () => {
  const [methods, setMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [threshold, setThreshold] = useState<number | "">("");
  const [estimatedDays, setEstimatedDays] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchMethods = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getShippingMethods();
      setMethods(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleCreateMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.createShippingMethod({
        name,
        code: code.toLowerCase().trim(),
        description,
        price: Number(price),
        free_shipping_threshold: threshold ? Number(threshold) : null,
        estimated_days: estimatedDays,
        status: true,
      });
      setModalOpen(false);
      setName("");
      setCode("");
      setDescription("");
      setPrice("");
      setThreshold("");
      setEstimatedDays("");
      await fetchMethods();
      alert("Shipping method added!");
    } catch (err: any) {
      alert(err.message || "Failed to create method");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this shipping method?")) return;
    try {
      await adminApi.deleteShippingMethod(id);
      await fetchMethods();
    } catch (err: any) {
      alert(err.message || "Failed to delete method");
    }
  };

  return (
    <AdminLayout activeTab="shipping">
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Shipping & Courier Methods</h2>
            <p className="text-xs text-neutral-500">Configure delivery partners, shipping fees, and free delivery limits</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-sm"
          >
            + Add Shipping Method
          </button>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-red-600" />
            </div>
          ) : methods.length === 0 ? (
            <div className="text-center py-16 text-neutral-400">No shipping methods configured.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-3">Method Name</th>
                    <th className="px-6 py-3">Code</th>
                    <th className="px-6 py-3">Delivery Fee</th>
                    <th className="px-6 py-3">Free Delivery Threshold</th>
                    <th className="px-6 py-3">Estimated Time</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {methods.map((method) => (
                    <tr key={method.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-neutral-900">{method.name}</p>
                        {method.description && <p className="text-xs text-neutral-500">{method.description}</p>}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-neutral-600">{method.code}</td>
                      <td className="px-6 py-4 font-bold text-neutral-900">{money(Number(method.price))}</td>
                      <td className="px-6 py-4 text-green-700 font-medium">
                        {method.free_shipping_threshold ? `Free over ${money(Number(method.free_shipping_threshold))}` : "No free tier"}
                      </td>
                      <td className="px-6 py-4 text-neutral-600">{method.estimated_days || "2-4 Days"}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(method.id)}
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
                <h3 className="text-base font-bold text-neutral-900">Add Shipping Method</h3>
                <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-black">✕</button>
              </div>

              <form onSubmit={handleCreateMethod} className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Method Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Standard Courier (Trax / CallCourier)"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Code *</label>
                    <input
                      type="text"
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="e.g. standard"
                      className="w-full px-3 py-2 border rounded-lg font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Estimated Days</label>
                    <input
                      type="text"
                      value={estimatedDays}
                      onChange={(e) => setEstimatedDays(e.target.value)}
                      placeholder="e.g. 2-3 Days"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Price (PKR) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Free Delivery Above (PKR)</label>
                    <input
                      type="number"
                      min="0"
                      value={threshold}
                      onChange={(e) => setThreshold(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="e.g. 3000"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Courier coverage and delivery notes"
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
                    {saving ? "Saving..." : "Save Method"}
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
