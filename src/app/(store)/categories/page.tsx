import React from 'react';
import Link from 'next/link';
import { getCategories } from '@/services/store-service';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'All Categories — Bajaj Karyan Store',
  description: 'Explore all confectionery, sweets, bakery, and kiryana categories at Bajaj Karyan Store Amritsar.',
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#590d22] font-serif tracking-tight">
          Product Categories
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Browse through our distinct confectionery, snack, and daily household grocery departments.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/shop?category=${category.slug}`}
            className="group flex flex-col bg-white rounded-2xl border border-rose-100 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
          >
            <div className="aspect-4/3 w-full bg-rose-50 overflow-hidden relative">
              {category.image_url ? (
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-rose-300">
                  <ShoppingBag className="w-12 h-12" />
                </div>
              )}
            </div>

            <div className="p-5 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#800f2f] transition">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">
                  {category.description || 'Quality items handpicked for your family.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-rose-100 flex items-center justify-between text-xs font-semibold text-[#800f2f]">
                <span>Browse Products</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
