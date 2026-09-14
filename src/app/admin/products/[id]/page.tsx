import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCategories } from '@/services/store-service';
import { fallbackProducts } from '@/lib/mock-data';
import { ProductForm } from '../ProductForm';
import { Product } from '@/types/database';

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const categories = await getCategories();

  const supabase = await createClient();
  let product: Product | null = null;

  try {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (data) {
      product = data as Product;
    }
  } catch {
    // ignore
  }

  if (!product) {
    product = fallbackProducts.find((p) => p.id === id) || null;
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#590d22] font-serif">
          Edit Product
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Modify product details, selling units, availability, or market rates.
        </p>
      </div>

      <ProductForm categories={categories} initialProduct={product} />
    </div>
  );
}
