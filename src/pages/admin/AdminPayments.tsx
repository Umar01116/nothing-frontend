import React, { useEffect, useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { adminApi, PaymentRecord } from "../../api/admin";
import { DataTable, Column } from "../../components/admin/common/DataTable";
import { StatusBadge } from "../../components/admin/common/StatusBadge";
import { Pagination } from "../../components/admin/common/Pagination";
import { money } from "../../utils/store";

export const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchPayments = async (page = 1) => {
    setLoading(true);
    try {
      const res = await adminApi.getPayments({
        page,
        status: statusFilter || undefined,
      });
      setPayments(res.data || []);
      if (res.meta) {
        setCurrentPage(res.meta.current_page);
        setLastPage(res.meta.last_page);
        setTotal(res.meta.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(1);
  }, [statusFilter]);

  const handleUpdatePayment = async (paymentId: number, status: string) => {
    try {
      await adminApi.updatePaymentStatus(paymentId, { status });
      await fetchPayments(currentPage);
      alert("Payment status updated.");
    } catch (err: any) {
      alert(err.message || "Failed to update payment");
    }
  };

  const columns: Column<PaymentRecord>[] = [
    {
      header: "Transaction ID",
      accessor: (p) => (
        <div>
          <span className="font-mono font-bold text-xs text-neutral-900">{p.transaction_id}</span>
          <p className="text-[11px] text-neutral-400">Order: #{p.order?.order_number || p.order_id}</p>
        </div>
      ),
    },
    {
      header: "Customer",
      accessor: (p) => <span className="font-semibold text-neutral-800">{p.order?.customer_name || "Guest"}</span>,
    },
    {
      header: "Method",
      accessor: (p) => <span className="uppercase text-xs font-semibold text-neutral-600">{p.payment_method}</span>,
    },
    {
      header: "Amount",
      accessor: (p) => <span className="font-bold text-neutral-900">{money(Number(p.amount))}</span>,
    },
    {
      header: "Status",
      accessor: (p) => <StatusBadge status={p.status} />,
    },
    {
      header: "Date",
      accessor: (p) => <span className="text-xs text-neutral-500">{new Date(p.created_at).toLocaleString()}</span>,
    },
    {
      header: "Actions",
      align: "right",
      accessor: (p) => (
        <div className="space-x-1">
          {p.status !== "paid" && (
            <button
              onClick={() => handleUpdatePayment(p.id, "paid")}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded"
            >
              Mark Paid
            </button>
          )}
          {p.status !== "failed" && (
            <button
              onClick={() => handleUpdatePayment(p.id, "failed")}
              className="px-2 py-1 text-neutral-500 hover:text-red-600 text-xs font-semibold"
            >
              Failed
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      activeTab="payments"
      title="Payment Transactions"
      subtitle="Monitor gateway and COD transaction logs & bank payment receipts"
    >
      <div className="space-y-4">
        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-neutral-600">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs border rounded-lg bg-neutral-50"
            >
              <option value="">All Transactions</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <button
            onClick={() => fetchPayments(currentPage)}
            className="px-3 py-1.5 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 rounded-lg"
          >
            ↻ Refresh
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <DataTable
            columns={columns}
            data={payments}
            loading={loading}
            keyExtractor={(p) => p.id}
            emptyMessage="No payment transactions found."
          />
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            total={total}
            onPageChange={(page) => fetchPayments(page)}
          />
        </div>
      </div>
    </AdminLayout>
  );
};
