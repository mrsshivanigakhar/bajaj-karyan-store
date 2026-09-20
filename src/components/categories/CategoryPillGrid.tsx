import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { Category } from '@/types/database';
import { getProductTheme } from '@/lib/product-themes';

interface CategoryPillGridProps {
  categories: Category[];
}

export function CategoryPillGrid({ categories }: CategoryPillGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 animate-in fade-in-50 duration-200">
      {categories.map((category, idx) => {
        const theme = getProductTheme(idx);
        return (
          <Link
            key={category.id}
            href={`/shop?category=${category.slug}`}
            className={`group flex items-center p-2.5 sm:p-3 rounded-2xl bg-white border ${theme.border} shadow-xs hover:shadow-md transition-all duration-200 gap-3`}
          >
            {/* Circular Thumbnail Avatar */}
            <div className={`relative shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden ${theme.imageBg} border ${theme.border} group-hover:scale-105 transition-transform duration-300`}>
              {category.image_url ? (
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-rose-300">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              )}
            </div>

            {/* Department Name & Subtitle */}
            <div className="flex-1 min-w-0">
              <h3 className={`text-xs sm:text-sm font-bold text-gray-900 ${theme.accentHover} transition line-clamp-1`}>
                {category.name}
              </h3>
              <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                {category.description || 'Explore collection'}
              </p>
            </div>

            {/* Arrow Indicator */}
            <div className="shrink-0 text-gray-400 group-hover:translate-x-0.5 transition-all">
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
