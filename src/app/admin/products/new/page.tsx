import React from "react";
import { getCategories } from "@/services/store-service";
import { ProductForm } from "../ProductForm";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#590d22] font-serif">
          Add New Product
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Add an item to the Bajaj karyana Store inventory with flexible units
          and pricing.
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
