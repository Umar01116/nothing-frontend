import React from "react";

export interface Column<T> {
  header: string;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  className?: string;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data?: T[];
  loading?: boolean;
  emptyMessage?: string;
  keyExtractor?: (row: T, index: number) => string | number;
}

export function DataTable<T>({
  columns,
  data = [],
  loading = false,
  emptyMessage = "No records found.",
  keyExtractor = (row: any, idx: number) => row?.id ?? idx,
}: DataTableProps<T>) {
  const safeData = Array.isArray(data) ? data : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-red-600" />
      </div>
    );
  }

  if (safeData.length === 0) {
    return (
      <div className="text-center py-16 text-neutral-400 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-200">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`px-6 py-3.5 ${
                  col.align === "right"
                    ? "text-right"
                    : col.align === "center"
                    ? "text-center"
                    : "text-left"
                } ${col.className || ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {safeData.map((row, rowIdx) => (
            <tr key={keyExtractor(row, rowIdx)} className="hover:bg-neutral-50/80 transition-colors">
              {columns.map((col, idx) => {
                let content: React.ReactNode = null;
                if (typeof col.accessor === "function") {
                  content = col.accessor(row);
                } else if (col.accessor) {
                  content = String(row[col.accessor] ?? "");
                }

                return (
                  <td
                    key={idx}
                    className={`px-6 py-4 ${
                      col.align === "right"
                        ? "text-right"
                        : col.align === "center"
                        ? "text-center"
                        : "text-left"
                    } ${col.className || ""}`}
                  >
                    {content}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
