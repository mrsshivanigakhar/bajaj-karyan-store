'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, AlertCircle, Edit3 } from 'lucide-react';
import { useShoppingList } from '@/context/shopping-list-context';
import { useStoreSettings } from '@/context/store-settings-context';
import { formatCurrency, formatUnit } from '@/lib/utils';

export function ShoppingListDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    updateNotes,
    updateRequestedWeight,
    clearList,
    estimatedSubtotal,
    hasPriceOnRequestItems,
    isDrawerOpen,
    setIsDrawerOpen,
  } = useShoppingList();
  const { settings } = useStoreSettings();

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 animate-in slide-in-from-right duration-300 ease-out">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 bg-[#590d22] text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-pink-300" />
              <div>
                <h2 className="text-lg font-bold">My Shopping List</h2>
                <p className="text-xs text-rose-200">
                  {items.length} {items.length === 1 ? 'item' : 'items'} in your list
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clearList}
                  className="text-xs text-rose-300 hover:text-white transition px-2 py-1 rounded-md"
                >
                  Clear All
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 text-rose-200 hover:text-white rounded-lg hover:bg-rose-900 transition"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-1">Your list is empty</h3>
                <p className="text-sm text-gray-500 max-w-xs mb-6">
                  Browse our grocery and confectionery collection to add items to your shopping list.
                </p>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="bg-[#800f2f] hover:bg-[#a4133c] text-white px-5 py-2.5 rounded-full text-sm font-medium transition shadow-sm"
                >
                  Start Browsing
                </button>
              </div>
            ) : (
              items.map((item) => {
                const isWeight = item.unitType === 'kg' || item.unitType === 'gram';
                const step = isWeight ? 0.5 : 1;

                return (
                  <div
                    key={item.productId}
                    className="flex flex-col p-3.5 bg-rose-50/40 rounded-xl border border-rose-100 hover:border-rose-200 transition"
                  >
                    <div className="flex items-start gap-3">
                      {/* Thumbnail */}
                      <div className="w-14 h-14 rounded-lg bg-white overflow-hidden border border-rose-100 shrink-0">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-rose-300">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {item.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            className="text-gray-400 hover:text-red-500 transition p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-xs text-gray-500">
                          {formatUnit(item.unitType, item.unitValue)}
                        </p>

                        <div className="mt-1 flex items-baseline justify-between">
                          <span className="text-xs font-semibold text-[#800f2f]">
                            {item.price !== null ? (
                              <>
                                {formatCurrency(item.price * item.quantity)}
                                <span className="text-[10px] text-gray-500 font-normal ml-1">
                                  ({formatCurrency(item.price)} each)
                                </span>
                              </>
                            ) : (
                              'Price to be confirmed'
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity & Notes Controls */}
                    <div className="mt-3 pt-2 border-t border-rose-200/60 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity - step)}
                          className="w-7 h-7 rounded-md bg-white border border-rose-200 text-gray-700 flex items-center justify-center hover:bg-rose-100 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-gray-800 min-w-[32px] text-center">
                          {item.quantity} {isWeight ? item.unitType : ''}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + step)}
                          className="w-7 h-7 rounded-md bg-white border border-rose-200 text-gray-700 flex items-center justify-center hover:bg-rose-100 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Add note toggle */}
                      <button
                        type="button"
                        onClick={() =>
                          setEditingNoteId(editingNoteId === item.productId ? null : item.productId)
                        }
                        className="text-xs text-rose-800 hover:text-[#590d22] flex items-center gap-1 font-medium"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{item.customerNotes ? 'Edit Note' : 'Add Note'}</span>
                      </button>
                    </div>

                    {/* Note input form */}
                    {editingNoteId === item.productId && (
                      <div className="mt-2 pt-2">
                        <input
                          type="text"
                          placeholder="e.g. Fine sugar, specific brand, ripe, etc."
                          value={item.customerNotes || ''}
                          onChange={(e) => updateNotes(item.productId, e.target.value)}
                          className="w-full text-xs p-2 rounded-md border border-rose-300 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                        />
                      </div>
                    )}

                    {item.customerNotes && editingNoteId !== item.productId && (
                      <div className="mt-1.5 text-[11px] text-gray-600 bg-rose-100/60 px-2 py-1 rounded-md italic">
                        Note: {item.customerNotes}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer / Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 bg-rose-50/70 border-t border-rose-200 space-y-3">
              {hasPriceOnRequestItems && (
                <div className="flex items-start gap-2 text-xs text-[#800f2f] bg-rose-100/70 p-2.5 rounded-lg border border-rose-200">
                  <AlertCircle className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                  <span>
                    Some items do not have fixed prices. The final total will be confirmed by {settings.store_name || 'Bajaj Karyan Store'} before delivery.
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Estimated Subtotal</span>
                <span className="font-bold text-[#590d22] text-base">
                  {formatCurrency(estimatedSubtotal)}
                </span>
              </div>

              <p className="text-[11px] text-gray-500">
                Delivery charges & offline payment details calculated at checkout.
              </p>

              <Link
                href="/checkout"
                onClick={() => setIsDrawerOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[#800f2f] hover:bg-[#a4133c] text-white py-3 px-4 rounded-xl font-semibold shadow-md transition active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="text-center pt-1">
                <Link
                  href="/account/shopping-list"
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-xs text-rose-800 hover:text-[#590d22] font-medium hover:underline transition inline-flex items-center gap-1"
                >
                  <span>Or view full shopping list page</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
