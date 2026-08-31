import React, { useEffect, useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { adminApi } from "../../api/admin";
import { DataTable, Column } from "../../components/admin/common/DataTable";
import { Pagination } from "../../components/admin/common/Pagination";
import { money } from "../../utils/store";

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  const fetchCustomers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await adminApi.getCustomers({
        page,
        search: search || undefined,
      });
      setCustomers(res.data || []);
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
    fetchCustomers(1);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers(1);
  };

  const columns: Column<any>[] = [
    {
      header: "Customer",
      accessor: (c) => (
        <div>
          <p className="font-bold text-neutral-900">{c.name}</p>
          <p className="text-xs text-neutral-500">{c.email}</p>
        </div>
      ),
    },
    {
      header: "Orders Placed",
      accessor: (c) => <span className="font-semibold text-neutral-800">{c.orders_count || 0}</span>,
    },
    {
      header: "Total Lifetime Spend",
      accessor: (c) => (
        <span className="font-bold text-neutral-900">
          {money(Number(c.orders_sum_grand_total || 0))}
        </span>
      ),
    },
    {
      header: "Registered Date",
      accessor: (c) => <span className="text-xs text-neutral-500">{new Date(c.created_at).toLocaleDateString()}</span>,
    },
  ];

  return (
    <AdminLayout
      activeTab="customers"
      title="Customer Accounts"
      subtitle="View registered customer directory and lifetime shopping activity"
    >
      <div className="space-y-4">
        <form onSubmit={handleSearch} className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs border rounded-lg"
          />
          <button
            type="submit"
            className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-lg"
          >
            Search
          </button>
        </form>

        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <DataTable
            columns={columns}
            data={customers}
            loading={loading}
            keyExtractor={(c) => c.id}
            emptyMessage="No customers found."
          />
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            total={total}
            onPageChange={(page) => fetchCustomers(page)}
          />
        </div>
      </div>
    </AdminLayout>
  );
};
