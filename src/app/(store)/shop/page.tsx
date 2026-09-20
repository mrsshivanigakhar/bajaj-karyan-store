import React from 'react';
import Link from 'next/link';
import { getCategories, getPaginatedProducts } from '@/services/store-service';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Pagination } from '@/components/ui/Pagination';
import { Search, Filter, SlidersHorizontal, Check } from 'lucide-react';

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    priceType?: string;
    page?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const currentCategory = params.category || '';
  const currentSearch = params.search || '';
  const currentPriceType = params.priceType || 'all';
  const currentPage = Math.max(1, parseInt(params.page || '1') || 1);

  const [categories, paginatedResult] = await Promise.all([
    getCategories(),
    getPaginatedProducts({
      categorySlug: currentCategory || undefined,
      search: currentSearch || undefined,
      priceType: currentPriceType !== 'all' ? currentPriceType : undefined,
      page: currentPage,
      pageSize: 20,
    }),
  ]);

  const { products, total, totalPages } = paginatedResult;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#590d22] font-serif tracking-tight">
          Store Catalog
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Explore our complete selection of fresh grocery and confectionery items.
        </p>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-rose-100 shadow-xs">
        {/* Search Input */}
        <div className="flex-1 max-w-md">
          <form method="GET" action="/shop" className="relative">
            {currentCategory && (
              <input type="hidden" name="category" value={currentCategory} />
            )}
            {currentPriceType && (
              <input type="hidden" name="priceType" value={currentPriceType} />
            )}
            <input
              type="text"
              name="search"
              defaultValue={currentSearch}
              placeholder="Search by product name, brand or SKU..."
              className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] bg-rose-50/30 text-gray-800"
            />
            <Search className="w-4 h-4 text-rose-400 absolute left-3.5 top-3" />
          </form>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-gray-500 font-medium flex items-center gap-1 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-rose-700" />
            Pricing:
          </span>

          <Link
            href={`/shop?${new URLSearchParams({
              ...(currentCategory ? { category: currentCategory } : {}),
              ...(currentSearch ? { search: currentSearch } : {}),
              priceType: 'all',
            }).toString()}`}
            className={`px-3 py-1.5 rounded-full font-medium transition ${
              currentPriceType === 'all'
                ? 'bg-[#800f2f] text-white shadow-xs'
                : 'bg-rose-50 text-gray-700 hover:bg-rose-100'
            }`}
          >
            All Items
          </Link>

          <Link
            href={`/shop?${new URLSearchParams({
              ...(currentCategory ? { category: currentCategory } : {}),
              ...(currentSearch ? { search: currentSearch } : {}),
              priceType: 'fixed',
            }).toString()}`}
            className={`px-3 py-1.5 rounded-full font-medium transition ${
              currentPriceType === 'fixed'
                ? 'bg-[#800f2f] text-white shadow-xs'
                : 'bg-rose-50 text-gray-700 hover:bg-rose-100'
            }`}
          >
            Fixed Price
          </Link>

          <Link
            href={`/shop?${new URLSearchParams({
              ...(currentCategory ? { category: currentCategory } : {}),
              ...(currentSearch ? { search: currentSearch } : {}),
              priceType: 'request',
            }).toString()}`}
            className={`px-3 py-1.5 rounded-full font-medium transition ${
              currentPriceType === 'request'
                ? 'bg-[#800f2f] text-white shadow-xs'
                : 'bg-rose-50 text-gray-700 hover:bg-rose-100'
            }`}
          >
            Price on Request
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Category Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs">
            <h3 className="font-bold text-[#590d22] text-sm uppercase tracking-wider mb-4 pb-2 border-b border-rose-100 flex items-center justify-between">
              <span>Categories</span>
              <Filter className="w-4 h-4 text-pink-500" />
            </h3>

            <div className="space-y-1">
              <Link
                href={`/shop?${new URLSearchParams({
                  ...(currentSearch ? { search: currentSearch } : {}),
                  ...(currentPriceType !== 'all' ? { priceType: currentPriceType } : {}),
                }).toString()}`}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition ${
                  !currentCategory
                    ? 'bg-[#590d22] text-white'
                    : 'text-gray-700 hover:bg-rose-50 hover:text-[#800f2f]'
                }`}
              >
                <span>All Categories</span>
              </Link>

              {(() => {
                const mainCats = categories.filter((c) => !c.slug.includes('--'));
                const subCats = categories.filter((c) => c.slug.includes('--'));

                return mainCats.map((main) => {
                  const isMainActive = currentCategory === main.slug;
                  const isParentOfActive = currentCategory.startsWith(`${main.slug}--`);
                  const children = subCats.filter((s) => s.slug.startsWith(`${main.slug}--`));

                  return (
                    <div key={main.id} className="space-y-1">
                      <Link
                        href={`/shop?${new URLSearchParams({
                          category: main.slug,
                          ...(currentSearch ? { search: currentSearch } : {}),
                          ...(currentPriceType !== 'all' ? { priceType: currentPriceType } : {}),
                        }).toString()}`}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition ${
                          isMainActive
                            ? 'bg-[#590d22] text-white font-bold'
                            : isParentOfActive
                            ? 'bg-rose-100 text-[#800f2f] font-semibold'
                            : 'text-gray-700 hover:bg-rose-50 hover:text-[#800f2f]'
                        }`}
                      >
                        <span>{main.name}</span>
                        {children.length > 0 && (
                          <span className="text-[11px] opacity-70">({children.length})</span>
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
                                href={`/shop?${new URLSearchParams({
                                  category: sub.slug,
                                  ...(currentSearch ? { search: currentSearch } : {}),
                                  ...(currentPriceType !== 'all' ? { priceType: currentPriceType } : {}),
                                }).toString()}`}
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
                });
              })()}
            </div>
          </div>

          {/* Price on request notice */}
          <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 text-xs text-rose-900 space-y-2">
            <span className="font-bold block text-sm text-[#800f2f]">
              About Market-Rate Items
            </span>
            <p>
              Some fresh confectionery, seasonal dry fruits, and spices fluctuate with daily market rates. You can freely add them to your shopping list, and our store will confirm the exact price before dispatching your order.
            </p>
          </div>
        </aside>

        {/* Product Catalog Grid */}
        <main className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500">
              Total <strong className="text-gray-900">{total}</strong> products
              {totalPages > 1 && (
                <span className="text-xs text-gray-400 ml-1.5">
                  (Page {currentPage} of {totalPages})
                </span>
              )}
            </span>
            {(currentCategory || currentSearch || currentPriceType !== 'all' || currentPage > 1) && (
              <Link
                href="/shop"
                className="text-xs text-[#800f2f] hover:underline font-semibold"
              >
                Clear all filters
              </Link>
            )}
          </div>

          <ProductGrid
            products={products}
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
            }}
          />
        </main>
      </div>
    </div>
  );
}
