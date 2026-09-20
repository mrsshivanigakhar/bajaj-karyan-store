'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/types/database';
import { Search, Filter, X } from 'lucide-react';

interface AdminProductFilterProps {
  categories: Category[];
  currentCategory: string;
  currentSearch: string;
  totalProductsCount: number;
}

export function AdminProductFilter({
  categories,
  currentCategory,
  currentSearch,
  totalProductsCount,
}: AdminProductFilterProps) {
  const router = useRouter();

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    const params = new URLSearchParams();
    if (selected) params.set('category', selected);
    if (currentSearch) params.set('search', currentSearch);
    router.push(`/admin/products${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchVal = formData.get('search')?.toString() || '';
    const params = new URLSearchParams();
    if (currentCategory) params.set('category', currentCategory);
    if (searchVal.trim()) params.set('search', searchVal.trim());
    router.push(`/admin/products${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const handleClear = () => {
    router.push('/admin/products');
  };

  return (
    <div className="bg-white p-4 rounded-3xl border border-rose-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md">
        <input
          type="text"
          name="search"
          defaultValue={currentSearch}
          placeholder="Search by name, SKU..."
          className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
        />
        <Search className="w-4 h-4 text-rose-400 absolute left-3.5 top-3" />
      </form>

      {/* Category Dropdown List */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative w-full sm:w-72">
          <label htmlFor="category-select" className="sr-only">
            Filter by Category
          </label>
          <div className="absolute left-3.5 top-3 pointer-events-none text-rose-400">
            <Filter className="w-4 h-4" />
          </div>
          <select
            id="category-select"
            value={currentCategory}
            onChange={handleCategoryChange}
            className="w-full appearance-none bg-rose-50/60 hover:bg-rose-50 border border-rose-200 text-gray-800 text-xs sm:text-sm font-semibold rounded-xl pl-10 pr-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#800f2f] cursor-pointer transition shadow-2xs"
          >
            <option value="">
              All Categories ({categories.length})
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3.5 top-3 text-gray-400 text-xs">
            ▼
          </div>
        </div>

        {/* Reset button if any filter active */}
        {(currentCategory || currentSearch) && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-rose-700 hover:text-rose-900 font-semibold flex items-center gap-1 whitespace-nowrap px-3 py-2 rounded-xl hover:bg-rose-50 border border-rose-200/60 transition"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
