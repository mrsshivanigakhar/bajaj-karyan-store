'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Check, Plus, Minus, Info } from 'lucide-react';
import { Product } from '@/types/database';
import { formatCurrency, formatUnit } from '@/lib/utils';
import { useShoppingList } from '@/context/shopping-list-context';
import { FavoriteButton } from '@/components/products/FavoriteButton';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useShoppingList();
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);

  const isWeightBased = product.unit_type === 'kg' || product.unit_type === 'gram';

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      imageUrl: product.image_url,
      price: product.price,
      unitType: product.unit_type,
      unitValue: product.unit_value,
      quantity: quantity,
      requestedWeight: isWeightBased ? `${quantity} ${product.unit_type}` : undefined,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleQtyChange = (delta: number) => {
    const step = isWeightBased ? 0.5 : 1;
    const min = isWeightBased ? 0.5 : 1;
    const newQty = Number((quantity + delta * step).toFixed(2));
    if (newQty >= min) {
      setQuantity(newQty);
    }
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-rose-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      {/* Product Image & Badges */}
      <div className="relative w-full aspect-square bg-rose-50/50 overflow-hidden">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/images/categories/staples-grocery.jpg';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-rose-300">
              <ShoppingBag className="w-12 h-12" />
            </div>
          )}
        </Link>

        {/* Favorite Heart Button */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <FavoriteButton product={product} size="sm" />
        </div>

        {/* Featured / Availability Badge */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {product.is_featured && (
            <span className="bg-[#800f2f] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              Featured
            </span>
          )}
          {product.price === null && (
            <span className="bg-[#590d22] text-pink-200 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-pink-300/30">
              Market Rate
            </span>
          )}
        </div>

        {/* Category Pill */}
        {product.category && (
          <span className="absolute bottom-2 left-2.5 bg-white/90 backdrop-blur-xs text-[#800f2f] text-[11px] font-medium px-2 py-0.5 rounded-md shadow-xs">
            {product.category.name}
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 group-hover:text-[#800f2f] transition line-clamp-1 text-base">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-gray-500 line-clamp-2 mt-1 min-h-[32px]">
          {product.description || 'Pure quality store essential, packaged hygienically.'}
        </p>

        {/* Pricing / Unit info */}
        <div className="mt-3 pt-2 border-t border-rose-100/70 flex items-baseline justify-between">
          <div>
            {product.price !== null ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-[#590d22]">
                  {formatCurrency(product.sale_price || product.price)}
                </span>
                {product.sale_price && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatCurrency(product.price)}
                  </span>
                )}
                <span className="text-xs text-gray-500 font-medium">
                  / {formatUnit(product.unit_type, product.unit_value)}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-[#800f2f]">
                <Info className="w-3.5 h-3.5 text-pink-500" />
                <span className="text-xs font-semibold">Price on Request</span>
              </div>
            )}
          </div>
        </div>

        {/* Quantity Controls & Add to List Button */}
        <div className="mt-4 pt-2 flex items-center gap-2">
          {/* Quantity Selector */}
          <div className="flex items-center border border-rose-200 rounded-lg overflow-hidden bg-rose-50/50">
            <button
              type="button"
              onClick={() => handleQtyChange(-1)}
              className="p-1.5 text-gray-600 hover:text-[#590d22] hover:bg-rose-100 transition"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-9 text-center text-xs font-semibold text-gray-800">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => handleQtyChange(1)}
              className="p-1.5 text-gray-600 hover:text-[#590d22] hover:bg-rose-100 transition"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add Button */}
          <button
            type="button"
            onClick={handleAdd}
            disabled={!product.is_available}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition shadow-xs ${
              !product.is_available
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : isAdded
                ? 'bg-green-600 text-white'
                : 'bg-[#800f2f] hover:bg-[#a4133c] text-white active:scale-[0.98]'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to List</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
