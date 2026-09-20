import React from 'react';
import { getCategories } from '@/services/store-service';
import { CategoriesClient } from './CategoriesClient';

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6 w-full">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#590d22] font-serif">
          Store Categories
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Organize confectionery, bakery, dry fruits, and kiryana sections.
        </p>
      </div>

      <CategoriesClient initialCategories={categories} />
    </div>
  );
}
