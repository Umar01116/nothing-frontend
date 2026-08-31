import React, { useEffect, useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { adminApi } from "../../api/admin";

export const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getReviews();
      setReviews(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await adminApi.updateReviewStatus(id, status);
      await fetchReviews();
    } catch (err: any) {
      alert(err.message || "Failed to update review status");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await adminApi.deleteReview(id);
      await fetchReviews();
    } catch (err: any) {
      alert(err.message || "Failed to delete review");
    }
  };

  return (
    <AdminLayout activeTab="reviews">
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Customer Reviews & Moderation</h2>
            <p className="text-xs text-neutral-500">Approve, reject, or delete user product ratings and reviews</p>
          </div>
          <button
            onClick={fetchReviews}
            className="px-3 py-1.5 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 rounded-lg"
          >
            ↻ Refresh
          </button>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-red-600" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-16 text-neutral-400">No reviews submitted yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-3">Product</th>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Rating</th>
                    <th className="px-6 py-3">Review</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {reviews.map((rev) => (
                    <tr key={rev.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 font-semibold text-neutral-900">{rev.product?.name || "Product"}</td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-neutral-800">{rev.user?.name || "Customer"}</p>
                        {rev.is_verified_purchase && (
                          <span className="text-[10px] text-green-700 font-bold">✓ Verified Purchase</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-amber-500 font-bold">{"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}</span>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        {rev.title && <p className="font-bold text-xs text-neutral-900">{rev.title}</p>}
                        <p className="text-xs text-neutral-600 line-clamp-2">{rev.comment}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                          rev.status === "approved" ? "bg-green-100 text-green-800" :
                          rev.status === "rejected" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {rev.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {rev.status !== "approved" && (
                          <button
                            onClick={() => handleUpdateStatus(rev.id, "approved")}
                            className="text-xs font-bold text-green-700 hover:text-green-800"
                          >
                            Approve
                          </button>
                        )}
                        {rev.status !== "rejected" && (
                          <button
                            onClick={() => handleUpdateStatus(rev.id, "rejected")}
                            className="text-xs font-bold text-amber-700 hover:text-amber-800"
                          >
                            Reject
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(rev.id)}
                          className="text-xs font-bold text-red-600 hover:text-red-700"
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
      </div>
    </AdminLayout>
  );
};
