'use client';

import React, { useState } from 'react';
import { Product } from '@/types/database';
import { useShoppingList } from '@/context/shopping-list-context';
import { Minus, Plus, ShoppingBag, Check, Zap } from 'lucide-react';
import { FavoriteButton } from '@/components/products/FavoriteButton';

export function ProductDetailClient({ product }: { product: Product }) {
  const { addItem, setIsDrawerOpen } = useShoppingList();
  const isWeight = product.unit_type === 'kg' || product.unit_type === 'gram';
  const step = isWeight ? 0.5 : 1;
  const initialQty = isWeight ? 0.5 : 1;

  const [quantity, setQuantity] = useState<number>(initialQty);
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [isAdded, setIsAdded] = useState(false);

  const handleQtyChange = (delta: number) => {
    const nextVal = Number((quantity + delta * step).toFixed(2));
    if (nextVal >= step) {
      setQuantity(nextVal);
    }
  };

  const handleAddToList = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      imageUrl: product.image_url,
      price: product.price,
      unitType: product.unit_type,
      unitValue: product.unit_value,
      quantity: quantity,
      requestedWeight: isWeight ? `${quantity} ${product.unit_type}` : undefined,
      customerNotes: customerNotes.trim() || undefined,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Quantity & Weight Controls */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
          Choose {isWeight ? 'Weight' : 'Quantity'}
        </label>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center border-2 border-rose-200 rounded-xl overflow-hidden bg-rose-50/40">
            <button
              type="button"
              onClick={() => handleQtyChange(-1)}
              className="p-3 text-gray-700 hover:text-[#590d22] hover:bg-rose-100 transition"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-16 text-center text-sm font-bold text-gray-900">
              {quantity} {isWeight ? product.unit_type : ''}
            </span>
            <button
              type="button"
              onClick={() => handleQtyChange(1)}
              className="p-3 text-gray-700 hover:text-[#590d22] hover:bg-rose-100 transition"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <span className="text-xs text-gray-500">
            {isWeight ? 'Available in increments of 0.5 kg' : `Unit: ${product.unit_type}`}
          </span>
        </div>
      </div>

      {/* Special Request Notes */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
          Special Notes for Store (Optional)
        </label>
        <input
          type="text"
          placeholder="e.g. Fine crystal sugar, split into 2 packets, soft rusks..."
          value={customerNotes}
          onChange={(e) => setCustomerNotes(e.target.value)}
          className="w-full text-xs sm:text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] bg-white text-gray-800"
        />
      </div>

      {/* Action Buttons: Add to List, Buy Now, and Save to Favourites */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleAddToList}
          disabled={!product.is_available}
          className={`flex-1 w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm shadow-md transition transform active:scale-[0.99] ${
            !product.is_available
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : isAdded
              ? 'bg-green-600 text-white'
              : 'bg-[#800f2f] hover:bg-[#a4133c] text-white hover:shadow-lg'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-5 h-5" />
              <span>Added to List!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              <span>Add to Shopping List</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            handleAddToList();
            setIsDrawerOpen(true);
          }}
          disabled={!product.is_available}
          className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition transform active:scale-[0.99] disabled:bg-gray-200 disabled:text-gray-400"
        >
          <Zap className="w-4 h-4" />
          <span>Buy Now</span>
        </button>

        <FavoriteButton
          product={product}
          size="md"
          showLabel={true}
          className="w-full sm:w-auto py-3.5 justify-center"
        />
      </div>
    </div>
  );
}
