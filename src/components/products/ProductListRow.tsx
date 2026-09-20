'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Check, Plus, Minus, Percent } from 'lucide-react';
import { Product } from '@/types/database';
import { formatCurrency, formatUnit } from '@/lib/utils';
import { useShoppingList } from '@/context/shopping-list-context';
import { FavoriteButton } from '@/components/products/FavoriteButton';
import { getProductTheme } from '@/lib/product-themes';
import { DietaryBadge } from '@/components/products/DietaryBadge';

interface ProductListRowProps {
  product: Product;
  index?: number;
}

export function ProductListRow({ product, index }: ProductListRowProps) {
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
    <div className={`group flex items-center justify-between p-3 sm:p-4 bg-white rounded-2xl border ${theme.border} shadow-xs hover:shadow-md transition-all duration-200 gap-3 sm:gap-4`}>
      {/* Left: Thumbnail & Favorite */}
      <div className={`relative shrink-0 w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden ${theme.imageBg} border border-black/5`}>
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/images/categories/staples-grocery.jpg';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-rose-300">
              <ShoppingBag className="w-8 h-8" />
            </div>
          )}
        </Link>
        <div className="absolute top-1 right-1">
          <FavoriteButton product={product} size="sm" />
        </div>
      </div>

      {/* Middle: Details */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-1.5 flex-wrap mb-1">
          <DietaryBadge dietaryType={product.dietary_preference} size="xs" />
          {discountPercent > 0 && (
            <span className="bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-0.5 shadow-2xs">
              <Percent className="w-2.5 h-2.5" />
              {discountPercent}% OFF
            </span>
          )}
          {product.category && (
            <span className={`text-[10px] font-semibold ${theme.categoryTag} px-2 py-0.5 rounded-md`}>
              {product.category.name}
            </span>
          )}
          {product.is_featured && (
            <span className={`${theme.badge} text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider`}>
              Featured
            </span>
          )}
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className={`text-xs sm:text-sm font-bold text-gray-900 ${theme.accentHover} transition line-clamp-1`}>
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-1.5 mt-1 flex-wrap">
          {product.price !== null ? (
            <>
              <span className={`text-sm sm:text-base font-extrabold ${theme.price}`}>
                {formatCurrency(product.sale_price || product.price)}
              </span>
              {product.sale_price && (
                <>
                  <span className="text-xs text-gray-400 line-through">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.2 rounded-md">
                    SAVE {discountPercent}%
                  </span>
                </>
              )}
              <span className="text-[11px] text-gray-500">
                / {formatUnit(product.unit_type, product.unit_value)}
              </span>
            </>
          ) : (
            <span className="text-xs font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200">
              Market Rate
            </span>
          )}
        </div>
      </div>

      {/* Right: Quantity Stepper & Add Button */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Compact Stepper */}
        <div className={`flex items-center rounded-lg p-0.5 border ${theme.stepper}`}>
          <button
            type="button"
            onClick={() => handleQtyChange(-1)}
            disabled={quantity <= (isWeightBased ? 0.5 : 1)}
            className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="px-1.5 text-xs font-bold text-gray-800 min-w-[32px] text-center">
            {quantity}
            {isWeightBased && (
              <span className="text-[10px] font-normal text-gray-500 ml-0.5">
                {product.unit_type}
              </span>
            )}
          </span>
          <button
            type="button"
            onClick={() => handleQtyChange(1)}
            className="p-1 text-gray-600 hover:text-gray-900 transition"
            aria-label="Increase quantity"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Add to List Button */}
        <button
          type="button"
          onClick={handleAdd}
          className={`flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all ${
            isAdded
              ? 'bg-green-600 text-white'
              : `${theme.button} active:scale-95`
          }`}
          aria-label={`Add ${product.name} to list`}
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Added</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
