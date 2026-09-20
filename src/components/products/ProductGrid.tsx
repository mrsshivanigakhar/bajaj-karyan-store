'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/types/database';
import { ProductCard } from './ProductCard';
import { ProductListRow } from './ProductListRow';
import { PackageOpen, LayoutGrid, List } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
  showViewSwitcher?: boolean;
  initialViewMode?: 'grid' | 'list';
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

export function ProductGrid({
  products,
  emptyMessage = 'No items found matching your criteria.',
  showViewSwitcher = true,
  initialViewMode = 'grid',
  viewMode: controlledViewMode,
  onViewModeChange,
}: ProductGridProps) {
  const [internalViewMode, setInternalViewMode] = useState<'grid' | 'list'>(initialViewMode);
  const currentViewMode = controlledViewMode !== undefined ? controlledViewMode : internalViewMode;

  useEffect(() => {
    if (controlledViewMode !== undefined) return;
    try {
      const saved = localStorage.getItem('bajaj_preferred_product_view') as 'grid' | 'list' | null;
      if (saved && (saved === 'grid' || saved === 'list')) {
        setInternalViewMode(saved);
      }
    } catch {
      // Ignore localStorage read errors in SSR/privacy mode
    }
  }, [controlledViewMode]);

  const handleToggle = (mode: 'grid' | 'list') => {
    if (onViewModeChange) {
      onViewModeChange(mode);
    } else {
      setInternalViewMode(mode);
    }
    try {
      localStorage.setItem('bajaj_preferred_product_view', mode);
    } catch {
      // Ignore
    }
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl bg-white border border-dashed border-rose-200 my-4 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 mb-4">
          <PackageOpen className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">No products available</h3>
        <p className="text-sm text-gray-600 max-w-md">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View Switcher Toolbar */}
      {showViewSwitcher && (
        <div className="flex items-center justify-end">
          <div className="inline-flex items-center bg-white border border-rose-200/80 rounded-xl p-1 shadow-xs gap-1">
            <button
              type="button"
              onClick={() => handleToggle('grid')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                currentViewMode === 'grid'
                  ? 'bg-[#800f2f] text-white shadow-xs'
                  : 'text-gray-600 hover:text-[#800f2f] hover:bg-rose-50'
              }`}
              aria-label="Grid view"
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => handleToggle('list')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                currentViewMode === 'list'
                  ? 'bg-[#800f2f] text-white shadow-xs'
                  : 'text-gray-600 hover:text-[#800f2f] hover:bg-rose-50'
              }`}
              aria-label="List view"
              title="Compact Quick-Order List"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Compact List</span>
            </button>
          </div>
        </div>
      )}

      {/* Grid or List Layout */}
      {currentViewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-in fade-in-50 duration-200">
          {products.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 animate-in fade-in-50 duration-200">
          {products.map((product, idx) => (
            <ProductListRow key={product.id} product={product} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
