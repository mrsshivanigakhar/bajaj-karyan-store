'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, LayoutGrid, Tag } from 'lucide-react';
import { Category } from '@/types/database';
import { CategoryPillGrid } from '@/components/categories/CategoryPillGrid';
import { getProductTheme } from '@/lib/product-themes';

interface CategorySectionProps {
  categories: Category[];
}

export function CategorySection({ categories }: CategorySectionProps) {
  const [viewMode, setViewMode] = useState<'cards' | 'pills'>('cards');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bajaj_preferred_category_view') as 'cards' | 'pills' | null;
      if (saved && (saved === 'cards' || saved === 'pills')) {
        setViewMode(saved);
      }
    } catch {
      // Ignore in SSR / privacy mode
    }
  }, []);

  const handleToggle = (mode: 'cards' | 'pills') => {
    setViewMode(mode);
    try {
      localStorage.setItem('bajaj_preferred_category_view', mode);
    } catch {
      // Ignore
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
        <div>
          <span className="text-xs font-bold text-[#a4133c] uppercase tracking-wider">
            Browse Collections
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">
            Shop by Category
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* 2-Style View Switcher */}
          <div className="inline-flex items-center bg-white border border-rose-200/80 rounded-xl p-1 shadow-xs gap-1">
            <button
              type="button"
              onClick={() => handleToggle('cards')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                viewMode === 'cards'
                  ? 'bg-[#800f2f] text-white shadow-xs'
                  : 'text-gray-600 hover:text-[#800f2f] hover:bg-rose-50'
              }`}
              aria-label="Cards view"
              title="Showcase Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              type="button"
              onClick={() => handleToggle('pills')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                viewMode === 'pills'
                  ? 'bg-[#800f2f] text-white shadow-xs'
                  : 'text-gray-600 hover:text-[#800f2f] hover:bg-rose-50'
              }`}
              aria-label="Pills view"
              title="Compact Department Pills"
            >
              <Tag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Compact</span>
            </button>
          </div>

          <Link
            href="/categories"
            className="text-sm font-semibold text-[#800f2f] hover:text-[#c9184a] inline-flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Style 1: Showcase Cards View */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 animate-in fade-in-50 duration-200">
          {categories.map((category, idx) => {
            const theme = getProductTheme(idx);
            return (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className={`group relative rounded-2xl overflow-hidden bg-white border ${theme.border} shadow-xs hover:shadow-md transition-all duration-300`}
              >
                <div className={`aspect-4/3 w-full overflow-hidden ${theme.imageBg}`}>
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-rose-300">
                      <ShoppingBag className="w-10 h-10" />
                    </div>
                  )}
                </div>
                <div className="p-3.5 text-center">
                  <h3 className={`font-semibold text-gray-900 ${theme.accentHover} transition text-sm sm:text-base`}>
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                    {category.description || 'Explore products'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* Style 2: Compact Department Pills View */
        <CategoryPillGrid categories={categories} />
      )}
    </section>
  );
}
