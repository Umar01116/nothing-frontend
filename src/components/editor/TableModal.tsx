import React, { useState } from "react";
import { Table, X } from "lucide-react";

interface TableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (rows: number, cols: number, withHeaderRow: boolean) => void;
}

export const TableModal: React.FC<TableModalProps> = ({ isOpen, onClose, onInsert }) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [withHeaderRow, setWithHeaderRow] = useState(true);
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);

  if (!isOpen) return null;

  const handleGridClick = (r: number, c: number) => {
    onInsert(r, c, withHeaderRow);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rows > 0 && cols > 0) {
      onInsert(Math.min(rows, 30), Math.min(cols, 15), withHeaderRow);
      onClose();
    }
  };

  const maxPreviewRows = 6;
  const maxPreviewCols = 6;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fadeIn">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-200">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-100 bg-neutral-50/60">
          <div className="flex items-center gap-2 text-sm font-bold text-neutral-900">
            <Table className="w-4 h-4 text-red-600" />
            <span>Insert Table</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Visual Grid Picker */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 mb-2">
              <span>Quick Grid Selector</span>
              <span className="text-red-600 font-bold">
                {hoveredCell ? `${hoveredCell.r} × ${hoveredCell.c}` : `${rows} × ${cols}`}
              </span>
            </div>
            <div
              className="grid gap-1 p-2 bg-neutral-50 rounded-xl border border-neutral-200 inline-grid"
              style={{ gridTemplateColumns: `repeat(${maxPreviewCols}, minmax(0, 1fr))` }}
              onMouseLeave={() => setHoveredCell(null)}
            >
              {Array.from({ length: maxPreviewRows }).map((_, rIdx) => {
                const r = rIdx + 1;
                return Array.from({ length: maxPreviewCols }).map((_, cIdx) => {
                  const c = cIdx + 1;
                  const isHighlighted = hoveredCell ? r <= hoveredCell.r && c <= hoveredCell.c : r <= rows && c <= cols;
                  return (
                    <div
                      key={`${r}-${c}`}
                      onMouseEnter={() => setHoveredCell({ r, c })}
                      onClick={() => handleGridClick(r, c)}
                      className={`w-6 h-6 rounded-sm border cursor-pointer transition-all ${
                        isHighlighted
                          ? "bg-red-500 border-red-600 scale-95"
                          : "bg-white border-neutral-300 hover:border-neutral-400"
                      }`}
                    />
                  );
                });
              })}
            </div>
          </div>

          {/* Custom Dimension Inputs */}
          <form onSubmit={handleCustomSubmit} className="space-y-3 pt-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">Rows</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={rows}
                  onChange={(e) => setRows(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg text-sm text-center focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">Columns</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={cols}
                  onChange={(e) => setCols(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg text-sm text-center focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-neutral-700 font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={withHeaderRow}
                onChange={(e) => setWithHeaderRow(e.target.checked)}
                className="rounded border-neutral-300 text-red-600 focus:ring-red-500"
              />
              <span>Include Header Row</span>
            </label>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-black hover:bg-neutral-800 rounded-lg shadow-sm transition"
              >
                Create Table
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
