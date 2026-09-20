import React from 'react';
import Link from 'next/link';
import { getCategories } from '@/services/store-service';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'All Categories — Bajaj Karyan Store',
  description: 'Explore all confectionery, sweets, bakery, and kiryana categories at Bajaj Karyan Store Firozpur.',
};

export default async function CategoriesPage() {
  const allCategories = await getCategories();
  const mainCategories = allCategories.filter((c) => !c.slug.includes('--'));
  const subCategories = allCategories.filter((c) => c.slug.includes('--'));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#590d22] font-serif tracking-tight">
          Product Categories & Departments
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Browse through our distinct confectionery, snack, and daily household grocery departments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mainCategories.map((main) => {
          const children = subCategories.filter((s) => s.slug.startsWith(`${main.slug}--`));

          return (
            <div
              key={main.id}
              className="group flex flex-col bg-white rounded-3xl border border-rose-100 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
            >
              <div className="aspect-16/9 w-full bg-rose-50 overflow-hidden relative">
                {main.image_url ? (
                  <img
                    src={main.image_url}
                    alt={main.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-rose-300">
                    <ShoppingBag className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-5">
                  <div>
                    <span className="text-[11px] font-bold text-pink-200 uppercase tracking-wider">
                      Department
                    </span>
                    <h3 className="text-xl font-extrabold text-white font-serif">{main.name}</h3>
                  </div>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                <div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {main.description || 'Quality items handpicked for your family.'}
                  </p>

                  {/* Sub-Category Chips */}
                  {children.length > 0 && (
                    <div className="mt-3.5 space-y-1.5">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                        Sub-Categories
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {children.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/shop?category=${sub.slug}`}
                            className="inline-flex items-center text-xs font-medium bg-rose-50/70 hover:bg-rose-100 text-[#800f2f] px-2.5 py-1 rounded-lg border border-rose-100 transition"
                          >
                            <span>{sub.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-rose-100 flex items-center justify-between">
                  <Link
                    href={`/shop?category=${main.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#800f2f] hover:text-[#590d22] transition"
                  >
                    <span>Browse All in {main.name}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
