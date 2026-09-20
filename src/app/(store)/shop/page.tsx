import React from 'react';
import { getCategories, getPaginatedProducts } from '@/services/store-service';
import { ShopCatalogClient } from '@/components/shop/ShopCatalogClient';

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    priceType?: string;
    dietary?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const currentCategory = params.category || '';
  const currentSearch = params.search || '';
  const currentPriceType = params.priceType || 'all';
  const currentDietary = params.dietary || 'all';
  const currentMinPrice = params.minPrice || '';
  const currentMaxPrice = params.maxPrice || '';
  const currentPage = Math.max(1, parseInt(params.page || '1') || 1);

  const parsedMinPrice = currentMinPrice !== '' && !isNaN(Number(currentMinPrice)) ? Number(currentMinPrice) : undefined;
  const parsedMaxPrice = currentMaxPrice !== '' && !isNaN(Number(currentMaxPrice)) ? Number(currentMaxPrice) : undefined;

  const [categories, paginatedResult] = await Promise.all([
    getCategories(),
    getPaginatedProducts({
      categorySlug: currentCategory || undefined,
      search: currentSearch || undefined,
      priceType: currentPriceType !== 'all' ? currentPriceType : undefined,
      dietary: currentDietary !== 'all' ? currentDietary : undefined,
      minPrice: parsedMinPrice,
      maxPrice: parsedMaxPrice,
      page: currentPage,
      pageSize: 20,
    }),
  ]);

  const { products, total, totalPages } = paginatedResult;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#590d22] font-serif tracking-tight">
          Store Catalog
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Explore our complete selection of fresh grocery and confectionery items.
        </p>
      </div>

      {/* Interactive Catalog View with Top Toolbar and Perfectly Aligned Grid */}
      <ShopCatalogClient
        categories={categories}
        products={products}
        total={total}
        totalPages={totalPages}
        currentPage={currentPage}
        currentCategory={currentCategory}
        currentSearch={currentSearch}
        currentPriceType={currentPriceType}
        currentDietary={currentDietary}
        currentMinPrice={currentMinPrice}
        currentMaxPrice={currentMaxPrice}
      />
    </div>
  );
}
