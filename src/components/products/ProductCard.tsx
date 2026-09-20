'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Check, Plus, Minus, Info, Percent } from 'lucide-react';
import { Product } from '@/types/database';
import { formatCurrency, formatUnit } from '@/lib/utils';
import { useShoppingList } from '@/context/shopping-list-context';
import { FavoriteButton } from '@/components/products/FavoriteButton';
import { getProductTheme } from '@/lib/product-themes';
import { DietaryBadge } from '@/components/products/DietaryBadge';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const { addItem } = useShoppingList();
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);
  const theme = getProductTheme(index);

  const discountPercent =
    product.price !== null &&
    product.sale_price !== null &&
    product.sale_price < product.price &&
    product.price > 0
      ? Math.round(((product.price - product.sale_price) / product.price) * 100)
      : 0;

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
    <div className={`group flex flex-col bg-white rounded-2xl border ${theme.border} overflow-hidden shadow-xs hover:shadow-md transition-all duration-200`}>
      {/* Product Image & Badges */}
      <div className={`relative w-full aspect-square ${theme.imageBg} overflow-hidden`}>
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

        {/* Featured / Availability / Discount Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <span className="bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-xs tracking-wider uppercase flex items-center gap-0.5">
              <Percent className="w-2.5 h-2.5" />
              {discountPercent}% OFF
            </span>
          )}
          {product.is_featured && (
            <span className={`${theme.badge} text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs`}>
              Featured
            </span>
          )}
          {product.price === null && (
            <span className="bg-[#590d22] text-pink-200 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-pink-300/30">
              Market Rate
            </span>
          )}
        </div>

        {/* Category Pill & Dietary Badge */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {product.category ? (
            <span className={`${theme.categoryTag} text-[11px] font-semibold px-2 py-0.5 rounded-md shadow-xs backdrop-blur-xs`}>
              {product.category.name}
            </span>
          ) : <span />}
          <div className="pointer-events-auto bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded-md shadow-xs border border-gray-100 flex items-center">
            <DietaryBadge dietaryType={product.dietary_preference} size="xs" />
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center gap-1.5">
          <DietaryBadge dietaryType={product.dietary_preference} size="xs" className="shrink-0" />
          <Link href={`/products/${product.slug}`} className="flex-1 min-w-0">
            <h3 className={`font-semibold text-gray-900 ${theme.accentHover} transition line-clamp-1 text-base`}>
              {product.name}
            </h3>
          </Link>
        </div>

        <p className="text-xs text-gray-500 line-clamp-2 mt-1 min-h-[32px]">
          {product.description || 'Pure quality store essential, packaged hygienically.'}
        </p>

        {/* Pricing / Unit info */}
        <div className="mt-3 pt-2 border-t border-rose-100/70 flex items-baseline justify-between">
          <div>
            {product.price !== null ? (
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className={`text-lg font-bold ${theme.price}`}>
                  {formatCurrency(product.sale_price || product.price)}
                </span>
                {product.sale_price && (
                  <>
                    <span className="text-xs text-gray-400 line-through">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded-md">
                      SAVE {discountPercent}%
                    </span>
                  </>
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
          <div className={`flex items-center rounded-lg overflow-hidden border ${theme.stepper}`}>
            <button
              type="button"
              onClick={() => handleQtyChange(-1)}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-black/5 transition"
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
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-black/5 transition"
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
                : `${theme.button} active:scale-[0.98]`
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
