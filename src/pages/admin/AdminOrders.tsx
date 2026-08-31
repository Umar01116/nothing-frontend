import React, { useEffect, useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { adminApi } from "../../api/admin";
import { Order } from "../../api/checkout";
import { DataTable, Column } from "../../components/admin/common/DataTable";
import { StatusBadge } from "../../components/admin/common/StatusBadge";
import { Pagination } from "../../components/admin/common/Pagination";
import { money } from "../../utils/store";

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["packed", "cancelled"],
  packed: ["shipped", "cancelled"],
  shipped: ["delivered", "returned"],
  delivered: ["refunded"],
  cancelled: [],
  returned: ["refunded"],
  refunded: [],
};

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [targetStatus, setTargetStatus] = useState<string>("");
  const [targetPaymentStatus, setTargetPaymentStatus] = useState<string>("");
  const [statusComment, setStatusComment] = useState("");
  const [updating, setUpdating] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchOrders = async (page = 1, filterStatus = statusFilter, filterSearch = search) => {
    setLoading(true);
    try {
      const res = await adminApi.getOrders({
        page,
        status: filterStatus || undefined,
        search: filterSearch ? filterSearch.trim() : undefined,
      });

      setOrders(res.data || []);
      if (res.meta) {
        setCurrentPage(res.meta.current_page || 1);
        setLastPage(res.meta.last_page || 1);
        setTotal(res.meta.total || (res.data ? res.data.length : 0));
      } else {
        setTotal(res.data ? res.data.length : 0);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1, statusFilter, search);
  }, [statusFilter]);

  const openOrderModal = async (order: Order) => {
    setSelectedOrder(order);
    setTargetStatus(order.status);
    setTargetPaymentStatus(order.payment_status);
    setStatusComment("");

    // Fetch full order details with status histories
    setLoadingDetails(true);
    try {
      const fullOrder = await adminApi.getOrder(order.id);
      if (fullOrder) {
        setSelectedOrder(fullOrder);
        setTargetStatus(fullOrder.status);
        setTargetPaymentStatus(fullOrder.payment_status);
      }
    } catch (err) {
      console.error("Failed to fetch full order details:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      const updated = await adminApi.updateOrderStatus(selectedOrder.id, {
        status: targetStatus,
        payment_status: targetPaymentStatus,
        comment: statusComment || undefined,
      });
      setSelectedOrder(updated);
      await fetchOrders(currentPage, statusFilter, search);
      alert("Order status updated successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  const columns: Column<Order>[] = [
    {
      header: "Order #",
      accessor: (order) => (
        <div>
          <span className="font-mono font-bold text-xs text-neutral-900">{order.order_number}</span>
          <p className="text-[11px] text-neutral-400">
            {order.created_at ? new Date(order.created_at).toLocaleString() : "Recently"}
          </p>
        </div>
      ),
    },
    {
      header: "Customer",
      accessor: (order) => (
        <div>
          <p className="font-bold text-neutral-900 text-xs">{order.customer_name || "Guest Customer"}</p>
          <p className="text-[11px] text-neutral-500 font-mono">{order.customer_phone || order.customer_email || "—"}</p>
        </div>
      ),
    },
    {
      header: "Items",
      accessor: (order) => (
        <span className="text-xs font-semibold text-neutral-700">
          {order.items?.length || 0} {order.items?.length === 1 ? "item" : "items"}
        </span>
      ),
    },
    {
      header: "Total (PKR)",
      accessor: (order) => <span className="font-bold text-xs text-neutral-900">{money(Number(order.grand_total))}</span>,
    },
    {
      header: "Order Status",
      accessor: (order) => <StatusBadge status={order.status} />,
    },
    {
      header: "Payment",
      accessor: (order) => (
        <div className="flex flex-col gap-0.5">
          <StatusBadge status={order.payment_status} />
          <span className="text-[10px] uppercase font-bold text-neutral-400">{order.payment_method || "COD"}</span>
        </div>
      ),
    },
    {
      header: "Actions",
      align: "right",
      accessor: (order) => (
        <button
          onClick={() => openOrderModal(order)}
          className="px-3 py-1.5 text-xs font-bold text-neutral-900 bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded-lg transition cursor-pointer"
        >
          View Details →
        </button>
      ),
    },
  ];

  const allowedNextStatuses = selectedOrder ? ALLOWED_TRANSITIONS[selectedOrder.status] || [] : [];

  return (
    <AdminLayout
      activeTab="orders"
      title="Customer Orders"
      subtitle="Fulfill orders, track payments, and manage order lifecycle state transitions"
    >
      <div className="space-y-4">
        {/* Filters and Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold text-neutral-600">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 text-xs border rounded-lg bg-neutral-50 font-medium"
            >
              <option value="">All Statuses ({total})</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="packed">Packed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>

            <button
              onClick={() => fetchOrders(currentPage, statusFilter, search)}
              className="px-2.5 py-1.5 text-xs font-semibold text-neutral-600 hover:text-black border rounded-lg hover:bg-neutral-50 cursor-pointer"
              title="Refresh Orders"
            >
              ↻ Refresh
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchOrders(1, statusFilter, search);
            }}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <input
              type="text"
              placeholder="Search order #, name, phone, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1.5 text-xs border rounded-lg flex-1 sm:w-72"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-neutral-900 text-white font-bold text-xs rounded-lg hover:bg-neutral-800 cursor-pointer"
            >
              Search
            </button>
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  fetchOrders(1, statusFilter, "");
                }}
                className="px-2.5 py-1.5 text-xs text-neutral-500 hover:text-neutral-900 border rounded-lg"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <DataTable
            columns={columns}
            data={orders}
            loading={loading}
            keyExtractor={(order) => order.id}
            emptyMessage="No customer orders found."
          />
          {total > 0 && (
            <Pagination
              currentPage={currentPage}
              lastPage={lastPage}
              total={total}
              onPageChange={(page) => fetchOrders(page, statusFilter, search)}
            />
          )}
        </div>

        {/* Full Order Details & Management Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-neutral-900">Order #{selectedOrder.order_number}</h2>
                    <StatusBadge status={selectedOrder.status} />
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Placed on {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : "Recently"}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-neutral-400 hover:text-black rounded-lg cursor-pointer text-base"
                >
                  ✕
                </button>
              </div>

              {loadingDetails && (
                <div className="p-2 text-center text-xs text-neutral-500 bg-neutral-50 rounded-lg">
                  Loading fresh order details...
                </div>
              )}

              {/* Order Lifecycle Status Transition Controls */}
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">Update Order Lifecycle Status</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-neutral-600 font-semibold block mb-1">Order Status</label>
                    <select
                      value={targetStatus}
                      onChange={(e) => setTargetStatus(e.target.value)}
                      className="w-full px-3 py-2 text-xs border rounded-lg bg-white font-semibold"
                    >
                      <option value={selectedOrder.status}>Current: {selectedOrder.status.toUpperCase()}</option>
                      {allowedNextStatuses.map((st) => (
                        <option key={st} value={st}>
                          → Transition to {st.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-neutral-600 font-semibold block mb-1">Payment Status</label>
                    <select
                      value={targetPaymentStatus}
                      onChange={(e) => setTargetPaymentStatus(e.target.value)}
                      className="w-full px-3 py-2 text-xs border rounded-lg bg-white font-semibold"
                    >
                      <option value="pending">Pending (Unpaid)</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Status update audit note or courier tracking number (optional)..."
                    value={statusComment}
                    onChange={(e) => setStatusComment(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-lg bg-white"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleUpdateStatus}
                    disabled={
                      updating ||
                      (targetStatus === selectedOrder.status &&
                        targetPaymentStatus === selectedOrder.payment_status &&
                        !statusComment)
                    }
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-lg disabled:opacity-50 cursor-pointer"
                  >
                    {updating ? "Saving Status..." : "Apply Status Transition"}
                  </button>
                </div>
              </div>

              {/* Order Items List */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  Order Items ({selectedOrder.items?.length || 0})
                </h3>
                <div className="divide-y border rounded-xl overflow-hidden bg-white">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item) => (
                      <div key={item.id} className="p-3.5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-neutral-900 text-xs">{item.product_name}</p>
                          <p className="text-[11px] text-neutral-500 mt-0.5">
                            {item.variant_name ? `Variant: ${item.variant_name}` : `SKU: ${item.product_sku || "—"}`} • Qty: {item.quantity} × {money(Number(item.unit_price))}
                          </p>
                        </div>
                        <p className="font-bold text-neutral-900 text-xs">{money(Number(item.total))}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-neutral-400">No items listed.</div>
                  )}
                </div>
              </div>

              {/* Customer & Shipping Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Customer Information */}
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-xs space-y-1.5">
                  <h3 className="font-bold uppercase tracking-wider text-neutral-700 mb-2">Customer Info</h3>
                  <p className="font-bold text-neutral-900">{selectedOrder.customer_name || "—"}</p>
                  <p className="text-neutral-600">📞 {selectedOrder.customer_phone || "—"}</p>
                  <p className="text-neutral-600">✉️ {selectedOrder.customer_email || "—"}</p>
                  <p className="text-neutral-600">💳 Payment: <strong className="uppercase">{selectedOrder.payment_method || "COD"}</strong></p>
                </div>

                {/* Shipping Address */}
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-xs space-y-1.5">
                  <h3 className="font-bold uppercase tracking-wider text-neutral-700 mb-2">Delivery Address</h3>
                  <p className="font-bold text-neutral-900">
                    {selectedOrder.shipping_address?.full_name || selectedOrder.customer_name}
                  </p>
                  <p className="text-neutral-600">
                    {selectedOrder.shipping_address?.address_line_1 || "—"}
                    {selectedOrder.shipping_address?.address_line_2 ? `, ${selectedOrder.shipping_address.address_line_2}` : ""}
                  </p>
                  <p className="text-neutral-600">
                    {selectedOrder.shipping_address?.city || "Pakistan"}
                    {selectedOrder.shipping_address?.postal_code ? ` - ${selectedOrder.shipping_address.postal_code}` : ""}
                  </p>
                  {selectedOrder.notes && (
                    <p className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200 mt-2">
                      <strong>Customer Note:</strong> {selectedOrder.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Audit Status Timeline */}
              {selectedOrder.status_histories && selectedOrder.status_histories.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">Audit Status Timeline</h3>
                  <div className="space-y-2 border p-3 rounded-xl bg-neutral-50 text-xs">
                    {selectedOrder.status_histories.map((hist: any) => (
                      <div key={hist.id} className="flex items-start justify-between border-b border-neutral-200 pb-1.5 last:border-b-0">
                        <div>
                          <span className="font-bold uppercase text-[10px] px-1.5 py-0.5 bg-neutral-200 text-neutral-800 rounded">
                            {hist.status}
                          </span>
                          {hist.comment && <p className="text-neutral-600 mt-0.5 text-xs">{hist.comment}</p>}
                        </div>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {new Date(hist.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Financial Totals Breakdown */}
              <div className="border-t pt-4 space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal:</span>
                  <span>{money(Number(selectedOrder.subtotal))}</span>
                </div>
                {Number(selectedOrder.discount_amount) > 0 && (
                  <div className="flex justify-between text-red-600 font-semibold">
                    <span>Discount Coupon ({selectedOrder.coupon_code || "Special"}):</span>
                    <span>-{money(Number(selectedOrder.discount_amount))}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <span>Shipping Fee ({selectedOrder.shipping_method_name || "Standard Courier"}):</span>
                  <span>{money(Number(selectedOrder.shipping_amount))}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t">
                  <span>Grand Total:</span>
                  <span>{money(Number(selectedOrder.grand_total))}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
