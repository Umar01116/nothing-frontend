import React, { useEffect, useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { adminApi, DashboardStats } from "../../api/admin";
import { money, navigateTo } from "../../utils/store";

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .getDashboardStats()
      .then((data) => setStats(data))
      .catch((err) => setError(err.message || "Failed to load dashboard metrics"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminLayout activeTab="dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-red-600" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout activeTab="dashboard">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab="dashboard">
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Total Sales</p>
            <p className="text-2xl font-bold text-neutral-900 mt-2">{money(stats?.total_sales || 0)}</p>
            <p className="text-xs text-green-600 mt-1">Paid / Delivered revenue</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Total Orders</p>
            <p className="text-2xl font-bold text-neutral-900 mt-2">{stats?.total_orders || 0}</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
              <span className="text-amber-600 font-medium">{stats?.pending_orders || 0} Pending</span>
              <span>•</span>
              <span className="text-blue-600 font-medium">{stats?.processing_orders || 0} Processing</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Catalog Products</p>
            <p className="text-2xl font-bold text-neutral-900 mt-2">{stats?.total_products || 0}</p>
            <p className="text-xs text-neutral-500 mt-1">Active items in store</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Low Stock Alerts</p>
            <p className="text-2xl font-bold text-red-600 mt-2">{stats?.low_stock_count || 0}</p>
            <p className="text-xs text-red-500 mt-1">Needs replenishment</p>
          </div>
        </div>

        {/* Low Stock Items & Recent Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h2 className="text-base font-bold text-neutral-900">Recent Orders</h2>
              <button
                onClick={() => navigateTo("/admin/orders")}
                className="text-xs font-semibold text-red-600 hover:text-red-700"
              >
                View all →
              </button>
            </div>
            <div className="divide-y divide-neutral-100 mt-2">
              {stats?.recent_orders && stats.recent_orders.length > 0 ? (
                stats.recent_orders.map((order) => (
                  <div key={order.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-neutral-900">{order.order_number}</p>
                      <p className="text-xs text-neutral-500">{order.customer_name} • {order.items?.length || 0} items</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-neutral-900">{money(Number(order.grand_total))}</p>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        order.status === "delivered" ? "bg-green-100 text-green-800" :
                        order.status === "cancelled" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-6 text-sm text-center text-neutral-400">No orders placed yet.</p>
              )}
            </div>
          </div>

          {/* Low Stock Warning List */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h2 className="text-base font-bold text-neutral-900">Low Stock Inventory</h2>
              <button
                onClick={() => navigateTo("/admin/inventory")}
                className="text-xs font-semibold text-red-600 hover:text-red-700"
              >
                Manage stock →
              </button>
            </div>
            <div className="divide-y divide-neutral-100 mt-2">
              {stats?.low_stock_items && stats.low_stock_items.length > 0 ? (
                stats.low_stock_items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-neutral-900">{item.product_name || "Product"}</p>
                      <p className="text-xs text-neutral-500 font-mono">SKU: {item.variant_sku}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700">
                        {item.quantity} in stock
                      </span>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Threshold: {item.low_stock_threshold}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-6 text-sm text-center text-neutral-400">All products adequately stocked.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
