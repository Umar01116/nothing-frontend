import React, { useEffect, useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { adminApi } from "../../api/admin";
import { money } from "../../utils/store";

export const AdminReports: React.FC = () => {
  const [reportData, setReportData] = useState<any>(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getSalesReport(days);
      setReportData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [days]);

  return (
    <AdminLayout
      activeTab="reports"
      title="Analytics & Sales Reports"
      subtitle="Performance trends, revenue velocity, and sales distributions"
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDays(7)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
              days === 7 ? "bg-neutral-900 text-white" : "bg-white border text-neutral-700"
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setDays(30)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
              days === 30 ? "bg-neutral-900 text-white" : "bg-white border text-neutral-700"
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setDays(90)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
              days === 90 ? "bg-neutral-900 text-white" : "bg-white border text-neutral-700"
            }`}
          >
            Last 90 Days
          </button>
        </div>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-red-600" />
        </div>
      ) : !reportData ? (
        <div className="bg-white p-12 rounded-xl text-center text-neutral-400">Failed to load reports.</div>
      ) : (
        <div className="space-y-6">
          {/* Top Selling Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-sm text-neutral-900">Top Selling Products</h3>
              <div className="space-y-3">
                {reportData.top_products && reportData.top_products.length > 0 ? (
                  reportData.top_products.map((tp: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b last:border-b-0 text-xs">
                      <div>
                        <p className="font-bold text-neutral-900">{tp.product_name}</p>
                        <p className="text-[11px] text-neutral-400 font-mono">SKU: {tp.product_sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-neutral-900">{money(Number(tp.total_revenue))}</p>
                        <p className="text-[11px] text-neutral-500">{tp.total_qty} units sold</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-neutral-400 py-4">No order items recorded in this period.</p>
                )}
              </div>
            </div>

            {/* Payment Method Distribution */}
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-sm text-neutral-900">Payment Breakdown</h3>
              <div className="space-y-3">
                {reportData.payment_methods && reportData.payment_methods.length > 0 ? (
                  reportData.payment_methods.map((pm: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b last:border-b-0 text-xs">
                      <span className="font-bold uppercase text-neutral-800">{pm.payment_method}</span>
                      <div className="text-right">
                        <p className="font-bold text-neutral-900">{money(Number(pm.revenue))}</p>
                        <p className="text-[11px] text-neutral-500">{pm.count} orders</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-neutral-400 py-4">No payment data available.</p>
                )}
              </div>
            </div>
          </div>

          {/* Daily Sales Table */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-sm text-neutral-900">Daily Sales Timeline</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b text-neutral-500 font-semibold">
                  <tr>
                    <th className="px-4 py-2.5">Date</th>
                    <th className="px-4 py-2.5">Orders Count</th>
                    <th className="px-4 py-2.5 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {reportData.daily_sales && reportData.daily_sales.length > 0 ? (
                    reportData.daily_sales.map((ds: any, idx: number) => (
                      <tr key={idx} className="hover:bg-neutral-50">
                        <td className="px-4 py-2.5 font-mono">{ds.date}</td>
                        <td className="px-4 py-2.5 font-bold">{ds.orders_count}</td>
                        <td className="px-4 py-2.5 text-right font-bold text-neutral-900">
                          {money(Number(ds.total_revenue))}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-neutral-400">
                        No sales recorded in the selected date range.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
