import React from 'react';
import { getProducts, getStoreSettings } from '@/services/store-service';
import { InventoryClient } from './InventoryClient';

export default async function AdminInventoryPage() {
  const [products, settings] = await Promise.all([
    getProducts(),
    getStoreSettings(),
  ]);

  return (
    <div className="space-y-6 w-full">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#590d22] font-serif">
          Inventory & Stock Levels
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Monitor warehouse stock, identify low inventory warnings, and adjust quantities inline.
        </p>
      </div>

      <InventoryClient
        initialProducts={products}
        lowStockThreshold={settings.low_stock_threshold || 10}
      />
    </div>
  );
}
