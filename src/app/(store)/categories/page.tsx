import React from "react";
import { getCategories } from "@/services/store-service";
import { CategoriesView } from "@/components/categories/CategoriesView";

export const metadata = {
  title: "All Categories — Bajaj karyana Store",
  description:
    "Explore all confectionery, sweets, bakery, and kiryana categories at Bajaj karyana Store Firozpur.",
};

export default async function CategoriesPage() {
  const allCategories = await getCategories();
  const mainCategories = allCategories.filter((c) => !c.slug.includes("--"));
  const subCategories = allCategories.filter((c) => c.slug.includes("--"));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#590d22] font-serif tracking-tight">
          Product Categories & Departments
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Browse through our distinct confectionery, snack, and daily household
          grocery departments.
        </p>
      </div>

      <CategoriesView
        mainCategories={mainCategories}
        subCategories={subCategories}
      />
    </div>
  );
}
