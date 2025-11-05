import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PagyInterface } from "@/pkg/types/interfaces/pagy";

interface PaginationProps {
  pagy: PagyInterface;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  pagy,
  onPageChange,
}) => {
  if (!pagy || !pagy.totalPages || pagy.totalPages <= 1) return null;

  const { currentPage = 1, totalPages = 1, nextPage, prevPage } = pagy;

  const getPageNumbers = () => {
    const pages: number[] = [];
    const delta = 2; // show 2 pages before & after current
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-6 select-none">
      {/* Prev button */}
      <button
        onClick={() => prevPage && onPageChange(prevPage)}
        disabled={currentPage === 1}
        className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border shadow-sm transition-all duration-200 active:scale-95 cursor-pointer
          ${
            currentPage === 1
              ? "text-gray-400 border-gray-200 cursor-not-allowed"
              : "text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-600"
          }`}
      >
        <ChevronLeft size={16} />
        Prev
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`px-3 py-1.5 text-sm rounded-md border transition-all duration-200 shadow-sm cursor-pointer
              ${
                num === currentPage
                  ? "bg-blue-500 text-white border-blue-500 shadow-md scale-105"
                  : "text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:scale-105"
              }`}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Next button */}
      <button
        onClick={() => nextPage && onPageChange(nextPage)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border shadow-sm transition-all duration-200 active:scale-95 cursor-pointer
          ${
            currentPage === totalPages
              ? "text-gray-400 border-gray-200 cursor-not-allowed"
              : "text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-600"
          }`}
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
