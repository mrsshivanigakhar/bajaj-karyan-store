import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getCategories, getProducts } from '@/services/store-service';
import { formatCurrency, formatUnit } from '@/lib/utils';
import { Plus, Search, Edit2, Trash2, Package, Check, X, Info } from 'lucide-react';
import { AdminProductDeleteBtn } from './AdminProductDeleteBtn';

interface AdminProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const params = await searchParams;
  const currentSearch = params.search || '';
  const currentCategory = params.category || '';

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({
      search: currentSearch || undefined,
      categorySlug: currentCategory || undefined,
    }),
  ]);

  return (
    <div className="space-y-6">
      {/* Header with New Product CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#590d22] font-serif">
            Products Catalog
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage store items, units, stock quantities, and market-rate pricing.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-[#800f2f] hover:bg-[#a4133c] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-rose-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <form method="GET" action="/admin/products" className="relative w-full sm:max-w-md">
          {currentCategory && (
            <input type="hidden" name="category" value={currentCategory} />
          )}
          <input
            type="text"
            name="search"
            defaultValue={currentSearch}
            placeholder="Search by name, SKU..."
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
          />
          <Search className="w-4 h-4 text-rose-400 absolute left-3.5 top-3" />
        </form>

        <div className="flex items-center gap-2 text-xs w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Link
            href={`/admin/products${currentSearch ? `?search=${currentSearch}` : ''}`}
            className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition ${
              !currentCategory
                ? 'bg-[#590d22] text-white'
                : 'bg-rose-50 text-gray-700 hover:bg-rose-100'
            }`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/admin/products?category=${c.slug}${
                currentSearch ? `&search=${currentSearch}` : ''
              }`}
              className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition ${
                currentCategory === c.slug
                  ? 'bg-[#590d22] text-white'
                  : 'bg-rose-50 text-gray-700 hover:bg-rose-100'
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-rose-100 shadow-xs overflow-hidden">
        {products.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <Package className="w-12 h-12 text-rose-300 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 text-base mb-1">No products found</h3>
            <p className="text-xs text-gray-400">
              Try adjusting your search or add a new product.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-rose-50/50 text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-rose-100">
                <tr>
                  <th className="py-3.5 px-6">Product</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Unit / Measurement</th>
                  <th className="py-3.5 px-6">Price</th>
                  <th className="py-3.5 px-6">Stock</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50 text-xs sm:text-sm">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-rose-50/20 transition">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 overflow-hidden border border-rose-100 shrink-0">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-rose-300">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 block">{product.name}</span>
                        {product.sku && (
                          <span className="text-[11px] text-gray-400 font-mono">
                            {product.sku}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-gray-600">
                      {product.category?.name || '—'}
                    </td>

                    <td className="py-4 px-6 text-gray-700 font-medium">
                      {formatUnit(product.unit_type, product.unit_value)}
                    </td>

                    <td className="py-4 px-6 font-bold text-[#590d22]">
                      {product.price !== null ? (
                        formatCurrency(product.sale_price || product.price)
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#800f2f] text-xs font-semibold">
                          <Info className="w-3 h-3 text-pink-500" />
                          <span>Price on Request</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                          product.stock_quantity <= 10
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {product.stock_quantity}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      {product.is_available && product.is_active ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-semibold">
                          <Check className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-gray-400 text-xs font-semibold">
                          <X className="w-3.5 h-3.5" />
                          <span>Inactive</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-1.5 text-gray-600 hover:text-[#800f2f] hover:bg-rose-100 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <AdminProductDeleteBtn productId={product.id} productName={product.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
