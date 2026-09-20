'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useShoppingList } from '@/context/shopping-list-context';
import { useStoreSettings } from '@/context/store-settings-context';
import { formatCurrency, formatUnit } from '@/lib/utils';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, AlertCircle, Store } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { Pagination } from '@/components/ui/Pagination';

export default function ShoppingListPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    updateNotes,
    estimatedSubtotal,
    hasPriceOnRequestItems,
  } = useShoppingList();
  const { settings } = useStoreSettings();

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(items.length / PAGE_SIZE);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const displayedItems = items.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#590d22] font-serif">
              My Shopping List
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Review and adjust quantities or notes before requesting delivery.
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-rose-100 p-8 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Your shopping list is empty</h2>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
              Start adding biscuits, dry fruits, bakery items, or everyday groceries from our store catalog.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#800f2f] hover:bg-[#a4133c] text-white px-6 py-3 rounded-full text-sm font-semibold transition shadow-sm"
            >
              <Store className="w-4 h-4" />
              <span>Browse Catalog</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* List items */}
            <div className="lg:col-span-2 space-y-4">
              {displayedItems.map((item) => {
                const isWeight = item.unitType === 'kg' || item.unitType === 'gram';
                const step = isWeight ? 0.5 : 1;

                return (
                  <div
                    key={item.productId}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-2xl border border-rose-100 shadow-xs gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-16 h-16 rounded-xl bg-rose-50 overflow-hidden border border-rose-100 shrink-0">
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

                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Unit: {formatUnit(item.unitType, item.unitValue)}
                        </p>
                        <p className="text-xs font-semibold text-[#800f2f] mt-0.5">
                          {item.price !== null
                            ? formatCurrency(item.price) + ' each'
                            : 'Price on Request'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-rose-200 rounded-lg bg-rose-50/50">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity - step)}
                          className="p-1.5 text-gray-600 hover:text-[#590d22] transition cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-12 text-center text-xs font-bold text-gray-800">
                          {item.quantity} {isWeight ? item.unitType : ''}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + step)}
                          className="p-1.5 text-gray-600 hover:text-[#590d22] transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right min-w-[80px]">
                        <span className="block text-sm font-bold text-[#590d22]">
                          {item.price !== null
                            ? formatCurrency(item.price * item.quantity)
                            : 'Pending'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="text-gray-400 hover:text-red-600 p-1.5 transition cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Pagination controls for 10 items/page */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={items.length}
                pageSize={PAGE_SIZE}
                onPageChange={(p) => {
                  setCurrentPage(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>

            {/* Order Summary Box */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-xs space-y-4 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 border-b border-rose-100 pb-3">
                  Summary
                </h3>

                {hasPriceOnRequestItems && (
                  <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                    <span>
                      Items with unknown prices will be calculated by {settings.store_name || 'the store'} upon confirmation.
                    </span>
                  </div>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Estimated Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(estimatedSubtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className="text-xs font-medium text-emerald-600">
                      {estimatedSubtotal >= 500 ? 'Free Delivery' : 'Calculated at Checkout'}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-rose-100 flex justify-between items-baseline">
                  <span className="font-bold text-gray-900">Estimated Total</span>
                  <span className="text-xl font-extrabold text-[#590d22]">
                    {formatCurrency(estimatedSubtotal)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#800f2f] hover:bg-[#a4133c] text-white py-3.5 px-4 rounded-xl font-bold shadow-md transition"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
