'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  baseUrl: string;
  queryParams?: Record<string, string | undefined>;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  baseUrl,
  queryParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([k, v]) => {
      if (v && k !== 'page') params.set(k, v);
    });
    if (page > 1) {
      params.set('page', page.toString());
    }
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-10 pt-6 border-t border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Item range summary */}
      <div className="text-xs sm:text-sm text-gray-500">
        Showing <span className="font-bold text-gray-900">{startItem}</span> to{' '}
        <span className="font-bold text-gray-900">{endItem}</span> of{' '}
        <span className="font-bold text-[#800f2f]">{totalItems}</span> items
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Previous Button */}
        {currentPage > 1 ? (
          <Link
            href={createPageUrl(currentPage - 1)}
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-xl border border-rose-200 bg-white text-gray-700 hover:bg-rose-50 hover:text-[#800f2f] transition shadow-xs"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </Link>
        ) : (
          <button
            disabled
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>
        )}

        {/* Numbered Page Buttons */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((p, idx) => {
            if (p === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-xs text-gray-400 font-bold"
                >
                  …
                </span>
              );
            }

            const pageNum = p as number;
            const isActive = pageNum === currentPage;

            return (
              <Link
                key={pageNum}
                href={createPageUrl(pageNum)}
                className={`min-w-9 h-9 flex items-center justify-center text-xs font-bold rounded-xl transition ${
                  isActive
                    ? 'bg-[#800f2f] text-white shadow-xs'
                    : 'bg-white border border-rose-200/80 text-gray-700 hover:bg-rose-50 hover:text-[#800f2f]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNum}
              </Link>
            );
          })}
        </div>

        {/* Next Button */}
        {currentPage < totalPages ? (
          <Link
            href={createPageUrl(currentPage + 1)}
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-xl border border-rose-200 bg-white text-gray-700 hover:bg-rose-50 hover:text-[#800f2f] transition shadow-xs"
            aria-label="Next page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <button
            disabled
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed"
            aria-label="Next page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
