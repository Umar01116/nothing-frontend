import React from "react";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  lastPage,
  total,
  onPageChange,
}) => {
  if (lastPage <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-neutral-200 text-xs text-neutral-600">
      <p>
        Showing page <strong className="text-neutral-900">{currentPage}</strong> of{" "}
        <strong className="text-neutral-900">{lastPage}</strong> ({total} total)
      </p>
      <div className="flex items-center gap-1">
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1.5 rounded-lg border border-neutral-200 font-semibold disabled:opacity-40 hover:bg-neutral-50"
        >
          Previous
        </button>
        <button
          disabled={currentPage >= lastPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1.5 rounded-lg border border-neutral-200 font-semibold disabled:opacity-40 hover:bg-neutral-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};
