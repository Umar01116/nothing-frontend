import React from "react";

interface StatusBadgeProps {
  status: string;
  type?: "order" | "payment" | "stock" | "review" | "general";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = "general" }) => {
  const s = status.toLowerCase();

  let color = "bg-neutral-100 text-neutral-700 border-neutral-200";

  if (s === "delivered" || s === "paid" || s === "approved" || s === "active" || s === "in_stock") {
    color = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (s === "pending" || s === "processing" || s === "packed" || s === "low_stock") {
    color = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (s === "shipped" || s === "confirmed") {
    color = "bg-blue-50 text-blue-700 border-blue-200";
  } else if (s === "cancelled" || s === "failed" || s === "rejected" || s === "out_of_stock") {
    color = "bg-red-50 text-red-700 border-red-200";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${color}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
};
