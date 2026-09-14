'use client';

import React, { useState } from 'react';
import { Product } from '@/types/database';
import { updateStockAction } from '@/actions/products';
import { formatUnit } from '@/lib/utils';
import { Search, AlertTriangle, CheckCircle2, XCircle, Plus, Minus, Save, Package } from 'lucide-react';

export function InventoryClient({
  initialProducts,
  lowStockThreshold,
}: {
  initialProducts: Product[];
  lowStockThreshold: number;
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
  const [search, setSearch] = useState('');
  const [stockInputs, setStockInputs] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    initialProducts.forEach((p) => {
      map[p.id] = p.stock_quantity;
    });
    return map;
  });
  const [savingId, setSavingId] = useState<string | null>(null);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (filter === 'low') {
      return p.stock_quantity > 0 && p.stock_quantity <= lowStockThreshold;
    }
    if (filter === 'out') {
      return p.stock_quantity <= 0;
    }
    return true;
  });

  const handleStockSave = async (id: string) => {
    const newStock = stockInputs[id];
    if (newStock === undefined || isNaN(newStock)) return;

    setSavingId(id);
    try {
      const res = await updateStockAction(id, newStock);
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === id
              ? { ...p, stock_quantity: newStock, is_available: newStock > 0 }
              : p
          )
        );
      }
    } catch {
      alert('Failed to update stock.');
    } finally {
      setSavingId(null);
    }
  };

  const handleAdjust = (id: string, delta: number) => {
    setStockInputs((prev) => {
      const cur = prev[id] !== undefined ? prev[id] : 0;
      const next = Math.max(0, Number((cur + delta).toFixed(2)));
      return { ...prev, [id]: next };
    });
  };

  const lowCount = products.filter(
    (p) => p.stock_quantity > 0 && p.stock_quantity <= lowStockThreshold
  ).length;
  const outCount = products.filter((p) => p.stock_quantity <= 0).length;

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`p-4 rounded-2xl border text-left transition ${
            filter === 'all'
              ? 'bg-rose-50/80 border-[#800f2f] shadow-xs'
              : 'bg-white border-rose-100 hover:bg-rose-50/30'
          }`}
        >
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
            All Tracked Items
          </span>
          <span className="text-2xl font-black text-gray-900 block mt-1">
            {products.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilter('low')}
          className={`p-4 rounded-2xl border text-left transition ${
            filter === 'low'
              ? 'bg-amber-50 border-amber-400 shadow-xs'
              : 'bg-white border-rose-100 hover:bg-amber-50/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider block">
              Low Stock (≤ {lowStockThreshold})
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-black text-amber-900 block mt-1">
            {lowCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilter('out')}
          className={`p-4 rounded-2xl border text-left transition ${
            filter === 'out'
              ? 'bg-red-50 border-red-400 shadow-xs'
              : 'bg-white border-rose-100 hover:bg-red-50/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-800 uppercase tracking-wider block">
              Out of Stock
            </span>
            <XCircle className="w-4 h-4 text-red-600" />
          </div>
          <span className="text-2xl font-black text-red-900 block mt-1">
            {outCount}
          </span>
        </button>
      </div>

      {/* Search toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-rose-100 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title or SKU..."
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
          />
          <Search className="w-4 h-4 text-rose-400 absolute left-3.5 top-3" />
        </div>

        <span className="text-xs text-gray-500 font-medium hidden sm:inline">
          Showing <strong>{filteredProducts.length}</strong> items
        </span>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-rose-100 shadow-xs overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <Package className="w-12 h-12 text-rose-300 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 text-base mb-1">No items found</h3>
            <p className="text-xs text-gray-400">Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-rose-50/50 text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-rose-100">
                <tr>
                  <th className="py-3.5 px-6">Product</th>
                  <th className="py-3.5 px-6">Unit</th>
                  <th className="py-3.5 px-6">Stock Status</th>
                  <th className="py-3.5 px-6">Current Stock</th>
                  <th className="py-3.5 px-6">Quick Adjust</th>
                  <th className="py-3.5 px-6 text-right">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50 text-xs sm:text-sm">
                {filteredProducts.map((product) => {
                  const isOut = product.stock_quantity <= 0;
                  const isLow = product.stock_quantity > 0 && product.stock_quantity <= lowStockThreshold;
                  const inputValue = stockInputs[product.id] ?? product.stock_quantity;
                  const hasChanged = inputValue !== product.stock_quantity;

                  return (
                    <tr key={product.id} className="hover:bg-rose-50/20 transition">
                      <td className="py-4 px-6">
                        <span className="font-bold text-gray-900 block">{product.name}</span>
                        {product.sku && (
                          <span className="text-[11px] text-gray-400 font-mono">{product.sku}</span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-gray-600">
                        {formatUnit(product.unit_type, product.unit_value)}
                      </td>

                      <td className="py-4 px-6">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Out of Stock</span>
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Low Stock</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>In Stock</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1 max-w-[120px]">
                          <input
                            type="number"
                            step="0.1"
                            value={inputValue}
                            onChange={(e) =>
                              setStockInputs((prev) => ({
                                ...prev,
                                [product.id]: parseFloat(e.target.value) || 0,
                              }))
                            }
                            className="w-full text-xs p-1.5 rounded-lg border border-rose-200 font-bold text-gray-900 text-center"
                          />
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleAdjust(product.id, -5)}
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-[11px] font-bold text-gray-700"
                          >
                            -5
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAdjust(product.id, 5)}
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-[11px] font-bold text-gray-700"
                          >
                            +5
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAdjust(product.id, 20)}
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-[11px] font-bold text-gray-700"
                          >
                            +20
                          </button>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => handleStockSave(product.id)}
                          disabled={savingId === product.id || !hasChanged}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            hasChanged
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{savingId === product.id ? 'Saving...' : 'Save'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
