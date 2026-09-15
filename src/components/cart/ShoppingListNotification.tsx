'use client';

import React from 'react';
import { ShoppingBag, ArrowRight, X, CheckCircle2 } from 'lucide-react';
import { useShoppingList } from '@/context/shopping-list-context';

export function ShoppingListNotification() {
  const { notification, dismissNotification, setIsDrawerOpen } = useShoppingList();

  if (!notification) return null;

  const handleOpenList = () => {
    dismissNotification();
    setIsDrawerOpen(true);
  };

  return (
    <aside
      aria-label="Item added notification"
      aria-live="polite"
      className="fixed z-50 pointer-events-auto transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-4
        bottom-20 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-md sm:w-auto"
    >
      <div className="flex items-center gap-3 p-3 sm:p-3.5 bg-white/95 backdrop-blur-md border-2 border-rose-200 rounded-2xl shadow-2xl ring-1 ring-black/5">
        {/* Thumbnail or Icon */}
        <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-100 overflow-hidden shrink-0 flex items-center justify-center">
          {notification.imageUrl ? (
            <img
              src={notification.imageUrl}
              alt={notification.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-green-700">
              Added to List
            </span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
            {notification.name}
          </p>
          <p className="text-[11px] text-gray-500 font-medium">
            Qty: {notification.quantity} {notification.unitType || 'item'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleOpenList}
            className="flex items-center gap-1.5 bg-[#800f2f] hover:bg-[#a4133c] text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-xs transition active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>My List</span>
            <ArrowRight className="w-3 h-3 hidden sm:inline" />
          </button>
          <button
            type="button"
            onClick={dismissNotification}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
