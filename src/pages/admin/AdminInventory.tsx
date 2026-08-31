import React, { useEffect, useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { adminApi, InventoryHistoryRecord } from "../../api/admin";
import { DataTable, Column } from "../../components/admin/common/DataTable";
import { StatusBadge } from "../../components/admin/common/StatusBadge";
import { Pagination } from "../../components/admin/common/Pagination";

export const AdminInventory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"stock" | "history">("stock");

  // Stock State
  const [inventories, setInventories] = useState<any[]>([]);
  const [loadingStock, setLoadingStock] = useState(true);

  // History State
  const [histories, setHistories] = useState<InventoryHistoryRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyLastPage, setHistoryLastPage] = useState(1);
  const [historyTotal, setHistoryTotal] = useState(0);

  // Adjustment Modal
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<any | null>(null);
  const [adjustmentType, setAdjustmentType] = useState("purchase");
  const [quantityChange, setQuantityChange] = useState<number>(10);
  const [reason, setReason] = useState("");
  const [savingAdjust, setSavingAdjust] = useState(false);

  const fetchInventory = async () => {
    setLoadingStock(true);
    try {
      const res = await adminApi.getInventory();
      setInventories(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStock(false);
    }
  };

  const fetchHistory = async (page = 1) => {
    setLoadingHistory(true);
    try {
      const res = await adminApi.getInventoryHistory({ page });
      setHistories(res.data || []);
      if (res.meta) {
        setHistoryPage(res.meta.current_page);
        setHistoryLastPage(res.meta.last_page);
        setHistoryTotal(res.meta.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === "stock") {
      fetchInventory();
    } else {
      fetchHistory(1);
    }
  }, [activeTab]);

  const openAdjustModal = (inv: any) => {
    setSelectedInventory(inv);
    setAdjustmentType("purchase");
    setQuantityChange(10);
    setReason("");
    setAdjustModalOpen(true);
  };

  const handleSaveAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInventory) return;
    setSavingAdjust(true);
    try {
      await adminApi.adjustInventory(selectedInventory.id, {
        adjustment_type: adjustmentType,
        quantity_change: Number(quantityChange),
        reason: reason || "Manual adjustment",
      });
      setAdjustModalOpen(false);
      await fetchInventory();
    } catch (err: any) {
      alert(err.message || "Failed to adjust stock");
    } finally {
      setSavingAdjust(false);
    }
  };

  const stockColumns: Column<any>[] = [
    {
      header: "Product & Variant Details",
      accessor: (inv) => {
        const variantAttributes = (inv.variant?.variant_values || inv.variant?.variantValues)
          ?.map((vv: any) => `${vv.attribute?.name || "Option"}: ${vv.attribute_value?.value || vv.attributeValue?.value || vv.value?.value || "—"}`)
          .filter(Boolean)
          .join(" • ");

        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold text-neutral-900">{inv.product?.name || "Product"}</p>
              {inv.product_variant_id && (
                <span className="px-1.5 py-0.5 bg-neutral-900 text-white text-[10px] font-bold rounded">
                  Variant
                </span>
              )}
            </div>
            {variantAttributes && (
              <span className="inline-block px-2 py-0.5 bg-neutral-100 text-neutral-800 text-[11px] font-medium rounded-md border border-neutral-200">
                {variantAttributes}
              </span>
            )}
            <p className="text-xs font-mono text-neutral-400">
              SKU: {inv.variant?.sku || inv.product?.sku || "—"}
            </p>
          </div>
        );
      },
    },
    {
      header: "Current Stock",
      accessor: (inv) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
            inv.quantity <= 0
              ? "bg-red-100 text-red-800 border border-red-300"
              : inv.quantity <= inv.low_stock_threshold
              ? "bg-amber-50 text-amber-700 border border-amber-200"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
          }`}
        >
          {inv.quantity <= 0 ? "Out of Stock (0)" : `${inv.quantity} units`}
        </span>
      ),
    },
    {
      header: "Reserved",
      accessor: (inv) => <span className="text-neutral-600 text-xs">{inv.reserved_quantity || 0}</span>,
    },
    {
      header: "Low Stock Alert At",
      accessor: (inv) => <span className="text-neutral-600 text-xs font-semibold">{inv.low_stock_threshold} units</span>,
    },
    {
      header: "Actions",
      align: "right",
      accessor: (inv) => (
        <button
          onClick={() => openAdjustModal(inv)}
          className="px-3 py-1.5 bg-neutral-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-2xs transition cursor-pointer"
        >
          Adjust Stock ⚙
        </button>
      ),
    },
  ];

  const historyColumns: Column<InventoryHistoryRecord>[] = [
    {
      header: "Date & Time",
      accessor: (h) => (
        <span className="text-xs font-mono text-neutral-600">
          {new Date(h.created_at).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Product",
      accessor: (h) => (
        <div>
          <p className="font-bold text-neutral-900">{h.product?.name || `Product #${h.product_id}`}</p>
          {h.order && <p className="text-[11px] text-neutral-400">Order: #{h.order.order_number}</p>}
        </div>
      ),
    },
    {
      header: "Type",
      accessor: (h) => <StatusBadge status={h.adjustment_type} />,
    },
    {
      header: "Change",
      accessor: (h) => (
        <span
          className={`font-mono font-bold text-xs ${
            h.quantity_change > 0 ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {h.quantity_change > 0 ? `+${h.quantity_change}` : h.quantity_change}
        </span>
      ),
    },
    {
      header: "After",
      accessor: (h) => <span className="font-mono text-xs font-semibold">{h.quantity_after}</span>,
    },
    {
      header: "Reason / Note",
      accessor: (h) => <span className="text-xs text-neutral-500">{h.reason || "—"}</span>,
    },
    {
      header: "Author",
      accessor: (h) => (
        <span className="text-xs font-medium text-neutral-700">
          {h.admin?.name || "System"}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout
      activeTab="inventory"
      title="Inventory Management & Audit Trail"
      subtitle="Monitor stock quantities, perform audited restocks, and inspect change logs"
    >
      <div className="space-y-6">
        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
          <button
            onClick={() => setActiveTab("stock")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === "stock"
                ? "bg-neutral-900 text-white shadow-sm"
                : "bg-white text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            📦 Live Stock Levels ({inventories.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === "history"
                ? "bg-neutral-900 text-white shadow-sm"
                : "bg-white text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            📜 Audit History Trail
          </button>
        </div>

        {activeTab === "stock" ? (
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
            <DataTable
              columns={stockColumns}
              data={inventories}
              loading={loadingStock}
              keyExtractor={(inv) => inv.id}
              emptyMessage="No inventory items found."
            />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
            <DataTable
              columns={historyColumns}
              data={histories}
              loading={loadingHistory}
              keyExtractor={(h) => h.id}
              emptyMessage="No inventory history audit records found."
            />
            <Pagination
              currentPage={historyPage}
              lastPage={historyLastPage}
              total={historyTotal}
              onPageChange={(page) => fetchHistory(page)}
            />
          </div>
        )}

        {/* Adjust Stock Modal */}
        {adjustModalOpen && selectedInventory && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="text-base font-bold text-neutral-900">Adjust Inventory Stock</h3>
                  <p className="text-xs text-neutral-500">
                    {selectedInventory.product?.name} (Current: {selectedInventory.quantity} units)
                  </p>
                </div>
                <button onClick={() => setAdjustModalOpen(false)} className="text-neutral-400 hover:text-black">✕</button>
              </div>

              <form onSubmit={handleSaveAdjustment} className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs font-semibold mb-1">Adjustment Type *</label>
                  <select
                    value={adjustmentType}
                    onChange={(e) => setAdjustmentType(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="purchase">Stock Purchase / Restock (+)</option>
                    <option value="correction">Manual Count Correction (+ / -)</option>
                    <option value="damaged">Damaged Stock (-)</option>
                    <option value="returned">Customer Return (+)</option>
                    <option value="lost">Lost / Missing (-)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Quantity Change (+ to add, - to subtract) *
                  </label>
                  <input
                    type="number"
                    required
                    value={quantityChange}
                    onChange={(e) => setQuantityChange(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">
                    New total will be: <strong>{Math.max(0, selectedInventory.quantity + Number(quantityChange))}</strong> units
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Reason / Audit Note *</label>
                  <textarea
                    rows={2}
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. PO #8491 shipment received from supplier"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setAdjustModalOpen(false)}
                    className="px-4 py-2 border rounded-lg text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingAdjust}
                    className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-lg disabled:opacity-50"
                  >
                    {savingAdjust ? "Recording..." : "Record Stock Adjustment"}
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
