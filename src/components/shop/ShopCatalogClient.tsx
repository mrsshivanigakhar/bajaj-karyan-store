'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, Filter, LayoutGrid, List, X, Leaf, IndianRupee } from 'lucide-react';
import { Category, Product } from '@/types/database';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Pagination } from '@/components/ui/Pagination';
import { DietaryBadge } from '@/components/products/DietaryBadge';

interface ShopCatalogClientProps {
  categories: Category[];
  products: Product[];
  total: number;
  totalPages: number;
  currentPage: number;
  currentCategory: string;
  currentSearch: string;
  currentPriceType: string;
  currentDietary?: string;
  currentMinPrice?: string;
  currentMaxPrice?: string;
}

const PRESET_PRICE_RANGES = [
  { label: 'Under ₹50', min: undefined, max: '50' },
  { label: '₹50 – ₹100', min: '50', max: '100' },
  { label: '₹100 – ₹250', min: '100', max: '250' },
  { label: '₹250 – ₹500', min: '250', max: '500' },
  { label: 'Above ₹500', min: '500', max: undefined },
];

export function ShopCatalogClient({
  categories,
  products,
  total,
  totalPages,
  currentPage,
  currentCategory,
  currentSearch,
  currentPriceType,
  currentDietary = 'all',
  currentMinPrice = '',
  currentMaxPrice = '',
}: ShopCatalogClientProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [minInput, setMinInput] = useState(currentMinPrice);
  const [maxInput, setMaxInput] = useState(currentMaxPrice);

  useEffect(() => {
    setMinInput(currentMinPrice);
    setMaxInput(currentMaxPrice);
  }, [currentMinPrice, currentMaxPrice]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bajaj_preferred_product_view') as 'grid' | 'list' | null;
      if (saved && (saved === 'grid' || saved === 'list')) {
        setViewMode(saved);
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    try {
      localStorage.setItem('bajaj_preferred_product_view', mode);
    } catch {
      // Ignore
    }
  };

  const buildQuery = (overrides: Record<string, string | undefined>) => {
    const params: Record<string, string> = {};
    if (currentCategory) params.category = currentCategory;
    if (currentSearch) params.search = currentSearch;
    if (currentPriceType && currentPriceType !== 'all') params.priceType = currentPriceType;
    if (currentDietary && currentDietary !== 'all') params.dietary = currentDietary;
    if (currentMinPrice) params.minPrice = currentMinPrice;
    if (currentMaxPrice) params.maxPrice = currentMaxPrice;

    Object.entries(overrides).forEach(([k, v]) => {
      if (v === undefined || v === '') {
        delete params[k];
      } else {
        params[k] = v;
      }
    });

    const qs = new URLSearchParams(params).toString();
    return qs ? `/shop?${qs}` : '/shop';
  };

  const handleCustomPriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      buildQuery({
        minPrice: minInput.trim() || undefined,
        maxPrice: maxInput.trim() || undefined,
        page: undefined,
      })
    );
  };

  const isPresetActive = (min?: string, max?: string) =>
    (min || '') === (currentMinPrice || '') && (max || '') === (currentMaxPrice || '');

  const hasActiveFilters = Boolean(
    currentCategory ||
      currentSearch ||
      currentPriceType !== 'all' ||
      currentDietary !== 'all' ||
      currentMinPrice ||
      currentMaxPrice ||
      currentPage > 1
  );

  const mainCategories = categories.filter((c) => !c.slug.includes('--'));
  const subCategories = categories.filter((c) => c.slug.includes('--'));

  // Find active category name for chip
  const activeCategoryObj = categories.find((c) => c.slug === currentCategory);

  return (
    <div className="space-y-6">
      {/* Top Header Information & View Switcher Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-rose-100 shadow-xs space-y-4">
        {/* Upper Information Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rose-100/70">
          <div className="flex items-center gap-2.5 flex-wrap text-xs sm:text-sm">
            <span className="font-medium text-gray-500">
              Showing <strong className="text-gray-900">{total}</strong> products
              {totalPages > 1 && (
                <span className="text-xs text-gray-400 ml-1">
                  (Page {currentPage} of {totalPages})
                </span>
              )}
            </span>

            {/* Active Filter Chips */}
            {activeCategoryObj && (
              <span className="inline-flex items-center gap-1 bg-rose-50 text-[#800f2f] text-xs font-semibold px-2.5 py-1 rounded-lg border border-rose-200">
                <span>{activeCategoryObj.name}</span>
                <Link
                  href={buildQuery({ category: undefined, page: undefined })}
                  className="hover:text-red-600"
                  aria-label="Remove category filter"
                >
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}

            {currentSearch && (
              <span className="inline-flex items-center gap-1 bg-rose-50 text-[#800f2f] text-xs font-semibold px-2.5 py-1 rounded-lg border border-rose-200">
                <span>&ldquo;{currentSearch}&rdquo;</span>
                <Link
                  href={buildQuery({ search: undefined, page: undefined })}
                  className="hover:text-red-600"
                  aria-label="Remove search filter"
                >
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}

            {currentDietary && currentDietary !== 'all' && (
              <span className="inline-flex items-center gap-1.5 bg-rose-50 text-[#800f2f] text-xs font-semibold px-2.5 py-1 rounded-lg border border-rose-200">
                <DietaryBadge dietaryType={currentDietary} size="xs" />
                <span>{currentDietary === 'veg' ? 'Vegetarian' : currentDietary === 'non-veg' ? 'Non-Veg' : 'Egg'}</span>
                <Link
                  href={buildQuery({ dietary: undefined, page: undefined })}
                  className="hover:text-red-600"
                  aria-label="Remove dietary filter"
                >
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}

            {currentPriceType && currentPriceType !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-rose-50 text-[#800f2f] text-xs font-semibold px-2.5 py-1 rounded-lg border border-rose-200">
                <span>{currentPriceType === 'fixed' ? 'Fixed Price' : 'Price on Request'}</span>
                <Link
                  href={buildQuery({ priceType: undefined, page: undefined })}
                  className="hover:text-red-600"
                  aria-label="Remove pricing type filter"
                >
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}

            {(currentMinPrice || currentMaxPrice) && (
              <span className="inline-flex items-center gap-1.5 bg-rose-50 text-[#800f2f] text-xs font-semibold px-2.5 py-1 rounded-lg border border-rose-200">
                <IndianRupee className="w-3 h-3 text-rose-600" />
                <span>
                  {currentMinPrice && currentMaxPrice
                    ? `₹${currentMinPrice} – ₹${currentMaxPrice}`
                    : currentMinPrice
                    ? `Above ₹${currentMinPrice}`
                    : `Under ₹${currentMaxPrice}`}
                </span>
                <Link
                  href={buildQuery({ minPrice: undefined, maxPrice: undefined, page: undefined })}
                  className="hover:text-red-600"
                  aria-label="Remove price range filter"
                >
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}

            {hasActiveFilters && (
              <Link
                href="/shop"
                className="text-xs text-[#800f2f] hover:underline font-semibold ml-1"
              >
                Clear all filters
              </Link>
            )}
          </div>

          {/* View Switcher Toggle Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-gray-500 font-medium hidden sm:inline">View:</span>
            <div className="inline-flex items-center bg-rose-50/70 border border-rose-200/80 rounded-xl p-1 shadow-xs gap-1">
              <button
                type="button"
                onClick={() => handleViewModeChange('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  viewMode === 'grid'
                    ? 'bg-[#800f2f] text-white shadow-xs'
                    : 'text-gray-600 hover:text-[#800f2f] hover:bg-white'
                }`}
                aria-label="Grid view"
                title="Card Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
              <button
                type="button"
                onClick={() => handleViewModeChange('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  viewMode === 'list'
                    ? 'bg-[#800f2f] text-white shadow-xs'
                    : 'text-gray-600 hover:text-[#800f2f] hover:bg-white'
                }`}
                aria-label="Compact list view"
                title="Compact Quick-Order List"
              >
                <List className="w-3.5 h-3.5" />
                <span>Compact List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search & Dietary/Pricing Filters Row */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="flex-1 max-w-md">
            <form method="GET" action="/shop" className="relative">
              {currentCategory && (
                <input type="hidden" name="category" value={currentCategory} />
              )}
              {currentPriceType && currentPriceType !== 'all' && (
                <input type="hidden" name="priceType" value={currentPriceType} />
              )}
              {currentDietary && currentDietary !== 'all' && (
                <input type="hidden" name="dietary" value={currentDietary} />
              )}
              {currentMinPrice && (
                <input type="hidden" name="minPrice" value={currentMinPrice} />
              )}
              {currentMaxPrice && (
                <input type="hidden" name="maxPrice" value={currentMaxPrice} />
              )}
              <input
                type="text"
                name="search"
                defaultValue={currentSearch}
                placeholder="Search products, brands, or 'veg' / 'non veg'..."
                className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] bg-rose-50/30 text-gray-800 placeholder:text-gray-400"
              />
              <Search className="w-4 h-4 text-rose-400 absolute left-3.5 top-3" />
            </form>
          </div>

          {/* Filter Pills: Dietary & Pricing */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Dietary Filter Pills */}
            <div className="flex items-center gap-1 bg-gray-50/90 p-1 rounded-xl border border-rose-100/90 shadow-2xs">
              <span className="text-gray-500 font-medium px-1.5 flex items-center gap-1">
                <Leaf className="w-3 h-3 text-emerald-600" />
                Diet:
              </span>

              <Link
                href={buildQuery({ dietary: 'all', page: undefined })}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  currentDietary === 'all'
                    ? 'bg-[#800f2f] text-white shadow-xs'
                    : 'text-gray-700 hover:bg-white'
                }`}
              >
                All
              </Link>

              <Link
                href={buildQuery({ dietary: 'veg', page: undefined })}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
                  currentDietary === 'veg'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-gray-700 hover:bg-white'
                }`}
              >
                <DietaryBadge dietaryType="veg" size="xs" />
                <span>Pure Veg</span>
              </Link>

              <Link
                href={buildQuery({ dietary: 'non-veg', page: undefined })}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
                  currentDietary === 'non-veg'
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'text-gray-700 hover:bg-white'
                }`}
              >
                <DietaryBadge dietaryType="non-veg" size="xs" />
                <span>Non-Veg</span>
              </Link>
            </div>

            {/* Pricing Filter Pills */}
            <div className="flex items-center gap-1 bg-gray-50/90 p-1 rounded-xl border border-rose-100/90 shadow-2xs">
              <span className="text-gray-500 font-medium px-1.5 flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3 text-rose-700" />
                Type:
              </span>

              <Link
                href={buildQuery({ priceType: 'all', page: undefined })}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  currentPriceType === 'all'
                    ? 'bg-[#800f2f] text-white shadow-xs'
                    : 'text-gray-700 hover:bg-white'
                }`}
              >
                All Items
              </Link>

              <Link
                href={buildQuery({ priceType: 'fixed', page: undefined })}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  currentPriceType === 'fixed'
                    ? 'bg-[#800f2f] text-white shadow-xs'
                    : 'text-gray-700 hover:bg-white'
                }`}
              >
                Fixed Price
              </Link>

              <Link
                href={buildQuery({ priceType: 'request', page: undefined })}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  currentPriceType === 'request'
                    ? 'bg-[#800f2f] text-white shadow-xs'
                    : 'text-gray-700 hover:bg-white'
                }`}
              >
                Price on Request
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout: Perfectly Aligned Categories Sidebar & Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Column: Categories Sidebar starting at y=0 */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs">
            <h3 className="font-bold text-[#590d22] text-sm uppercase tracking-wider mb-4 pb-2 border-b border-rose-100 flex items-center justify-between">
              <span>Categories</span>
              <Filter className="w-4 h-4 text-pink-500" />
            </h3>

            <div className="space-y-1">
              <Link
                href={buildQuery({ category: undefined, page: undefined })}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition ${
                  !currentCategory
                    ? 'bg-[#800f2f] text-white font-bold shadow-xs'
                    : 'text-gray-700 hover:bg-rose-50 hover:text-[#800f2f]'
                }`}
              >
                <span>All Departments</span>
              </Link>

              {mainCategories.map((main) => {
                const children = subCategories.filter((s) => s.slug.startsWith(`${main.slug}--`));
                const isMainActive = currentCategory === main.slug;
                const isParentOfActive = currentCategory.startsWith(`${main.slug}--`);

                return (
                  <div key={main.id} className="space-y-0.5">
                    <Link
                      href={buildQuery({ category: main.slug, page: undefined })}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition ${
                        isMainActive
                          ? 'bg-[#800f2f] text-white font-bold shadow-xs'
                          : isParentOfActive
                          ? 'bg-rose-100/70 text-[#800f2f] font-semibold'
                          : 'text-gray-700 hover:bg-rose-50 hover:text-[#800f2f]'
                      }`}
                    >
                      <span>{main.name}</span>
                      {children.length > 0 && (
                        <span className={`text-xs ${isMainActive ? 'text-white/80' : 'text-gray-400'}`}>
                          ({children.length})
                        </span>
                      )}
                    </Link>

                    {/* Nested Sub-Categories */}
                    {(isMainActive || isParentOfActive) && children.length > 0 && (
                      <div className="pl-4 pr-1 py-1 space-y-0.5 border-l-2 border-rose-200 ml-3">
                        {children.map((sub) => {
                          const isSubActive = currentCategory === sub.slug;
                          return (
                            <Link
                              key={sub.id}
                              href={buildQuery({ category: sub.slug, page: undefined })}
                              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                                isSubActive
                                  ? 'bg-[#800f2f] text-white font-bold'
                                  : 'text-gray-600 hover:bg-rose-50 hover:text-[#800f2f]'
                              }`}
                            >
                              <span>↳ {sub.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dedicated Price Range Filter Card in Sidebar */}
          <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-rose-100">
              <h3 className="font-bold text-[#590d22] text-sm uppercase tracking-wider flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-rose-700" />
                <span>Price Range</span>
              </h3>
              {(currentMinPrice || currentMaxPrice) && (
                <Link
                  href={buildQuery({ minPrice: undefined, maxPrice: undefined, page: undefined })}
                  className="text-xs text-[#800f2f] hover:underline font-semibold"
                >
                  Reset
                </Link>
              )}
            </div>

            {/* Presets List */}
            <div className="space-y-1.5">
              <Link
                href={buildQuery({ minPrice: undefined, maxPrice: undefined, page: undefined })}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                  !currentMinPrice && !currentMaxPrice
                    ? 'bg-[#800f2f] text-white font-bold shadow-xs'
                    : 'text-gray-700 hover:bg-rose-50 hover:text-[#800f2f]'
                }`}
              >
                <span>All Prices</span>
                <span className="text-2xs opacity-70">Any</span>
              </Link>

              {PRESET_PRICE_RANGES.map((preset) => {
                const active = isPresetActive(preset.min, preset.max);
                return (
                  <Link
                    key={preset.label}
                    href={
                      active
                        ? buildQuery({ minPrice: undefined, maxPrice: undefined, page: undefined })
                        : buildQuery({ minPrice: preset.min, maxPrice: preset.max, page: undefined })
                    }
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                      active
                        ? 'bg-[#800f2f] text-white font-bold shadow-xs'
                        : 'text-gray-700 hover:bg-rose-50 hover:text-[#800f2f]'
                    }`}
                  >
                    <span>{preset.label}</span>
                    {active && <span className="text-2xs bg-white/20 px-1.5 py-0.5 rounded">Active</span>}
                  </Link>
                );
              })}
            </div>

            {/* Custom Min/Max Input Form */}
            <form onSubmit={handleCustomPriceSubmit} className="pt-3 border-t border-rose-100/70 space-y-2">
              <span className="text-2xs font-semibold uppercase tracking-wider text-gray-500 block">
                Custom Range (₹)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-gray-400 text-xs">₹</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Min"
                    value={minInput}
                    onChange={(e) => setMinInput(e.target.value)}
                    className="w-full pl-6 pr-2 py-1.5 text-xs rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] bg-rose-50/20 text-gray-800"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-gray-400 text-xs">₹</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Max"
                    value={maxInput}
                    onChange={(e) => setMaxInput(e.target.value)}
                    className="w-full pl-6 pr-2 py-1.5 text-xs rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] bg-rose-50/20 text-gray-800"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#800f2f] hover:bg-[#590d22] text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1"
              >
                <span>Apply Price Filter</span>
              </button>
            </form>
          </div>

          {/* Price on request notice */}
          <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 text-xs text-rose-900 space-y-2">
            <span className="font-bold block text-sm text-[#800f2f]">
              About Market-Rate Items
            </span>
            <p className="leading-relaxed">
              Some fresh confectionery, seasonal dry fruits, and spices fluctuate with daily market rates. You can freely add them to your shopping list, and our store will confirm the exact price before dispatching your order.
            </p>
          </div>
        </aside>

        {/* Right Column: Products Grid starting at y=0, perfectly aligned with Categories Sidebar */}
        <main className="lg:col-span-3 space-y-6">
          <ProductGrid
            products={products}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            showViewSwitcher={false}
            emptyMessage="No items match your search or filter criteria. Try clearing filters or searching for something else."
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={total}
            pageSize={20}
            baseUrl="/shop"
            queryParams={{
              category: currentCategory || undefined,
              search: currentSearch || undefined,
              priceType: currentPriceType !== 'all' ? currentPriceType : undefined,
              dietary: currentDietary !== 'all' ? currentDietary : undefined,
              minPrice: currentMinPrice || undefined,
              maxPrice: currentMaxPrice || undefined,
            }}
          />
        </main>
      </div>
    </div>
  );
}
