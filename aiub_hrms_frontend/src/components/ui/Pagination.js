"use client";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

export default function Pagination({ currentPage, lastPage, onPageChange }) {
  if (lastPage <= 1) return null;

  const pages = Array.from({ length: Math.min(lastPage, 7) }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-1">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2 rounded-lg border border-border hover:bg-base-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <RiArrowLeftSLine size={16} />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors
            ${p === currentPage
              ? "bg-primary text-white shadow-sm"
              : "border border-border hover:bg-base-200 text-text-muted hover:text-text"
            }`}
        >
          {p}
        </button>
      ))}

      <button
        disabled={currentPage === lastPage}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 rounded-lg border border-border hover:bg-base-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <RiArrowRightSLine size={16} />
      </button>
    </div>
  );
}
