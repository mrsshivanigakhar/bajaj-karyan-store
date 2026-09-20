'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Tag, Sparkles, Percent, ShoppingBag, LayoutGrid, List, Check, ArrowRight } from 'lucide-react';
import { Product } from '@/types/database';
import { DealsGroup } from '@/services/store-service';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductListRow } from '@/components/products/ProductListRow';
import { formatCurrency } from '@/lib/utils';

interface DealsCatalogClientProps {
  deals: DealsGroup;
}

type DealTierKey = 'all' | 'tier10to15' | 'tier16to25' | 'tier26to35' | 'tierAbove35';

export function DealsCatalogClient({ deals }: DealsCatalogClientProps) {
  const [activeTier, setActiveTier] = useState<DealTierKey>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const tiers: {
    key: DealTierKey;
    label: string;
    sublabel: string;
    badge: string;
    items: Product[];
  }[] = [
    {
      key: 'all',
      label: 'All Deals',
      sublabel: 'Complete selection',
      badge: 'bg-rose-900 text-white',
      items: deals.all,
    },
    {
      key: 'tier10to15',
      label: '10% – 15% OFF',
      sublabel: 'Everyday Savers',
      badge: 'bg-[#800f2f] text-white',
      items: deals.tier10to15,
    },
    {
      key: 'tier16to25',
      label: '16% – 25% OFF',
      sublabel: 'Super Value Deals',
      badge: 'bg-amber-700 text-white',
      items: deals.tier16to25,
    },
    {
      key: 'tier26to35',
      label: '26% – 35% OFF',
      sublabel: 'Mega Family Discounts',
      badge: 'bg-emerald-700 text-white',
      items: deals.tier26to35,
    },
    {
      key: 'tierAbove35',
      label: 'Above 35% OFF',
      sublabel: 'Bumper Clearance',
      badge: 'bg-[#a4133c] text-white',
      items: deals.tierAbove35,
    },
  ];

  const currentTierObj = tiers.find((t) => t.key === activeTier) || tiers[0];
  const displayedProducts = currentTierObj.items;

  return (
    <div className="space-y-8">
      {/* Tier Selector Navigation Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-3xl border border-rose-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {tiers.map((tier) => {
              const isActive = activeTier === tier.key;
              return (
                <button
                  key={tier.key}
                  type="button"
                  onClick={() => setActiveTier(tier.key)}
                  className={`flex flex-col items-start px-3.5 py-2 rounded-2xl text-left transition shrink-0 ${
                    isActive
                      ? 'bg-[#800f2f] text-white shadow-md shadow-rose-950/10'
                      : 'bg-rose-50/50 hover:bg-rose-100/70 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs sm:text-sm">{tier.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-rose-200/60 text-[#800f2f]'
                      }`}
                    >
                      {tier.items.length}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] line-clamp-1 ${
                      isActive ? 'text-pink-100' : 'text-gray-500'
                    }`}
                  >
                    {tier.sublabel}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Switcher Toggle */}
          <div className="inline-flex items-center bg-rose-50/70 border border-rose-200/80 rounded-xl p-1 shadow-xs gap-1 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'grid'
                  ? 'bg-[#800f2f] text-white shadow-xs'
                  : 'text-gray-600 hover:text-[#800f2f] hover:bg-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'list'
                  ? 'bg-[#800f2f] text-white shadow-xs'
                  : 'text-gray-600 hover:text-[#800f2f] hover:bg-white'
              }`}
              title="Compact List View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden md:inline">List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Tier Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${currentTierObj.badge}`}>
              {currentTierObj.label}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              {displayedProducts.length} deals available
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-serif mt-1">
            {currentTierObj.sublabel}
          </h2>
        </div>

        <Link
          href="/shop"
          className="text-xs sm:text-sm font-semibold text-[#800f2f] hover:text-[#c9184a] inline-flex items-center gap-1 transition"
        >
          <span>Explore All Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Products Display */}
      {displayedProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-rose-100 p-8 shadow-xs">
          <Percent className="w-12 h-12 text-rose-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-900">No deals in this tier right now</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Check back soon for festive clearance offers, or browse our other discount categories!
          </p>
          <button
            type="button"
            onClick={() => setActiveTier('all')}
            className="mt-4 px-4 py-2 rounded-xl bg-[#800f2f] text-white text-xs font-semibold hover:bg-[#590d22] transition"
          >
            View All Available Deals
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-in fade-in-50 duration-200">
          {displayedProducts.map((product, idx) => {
            const price = product.price || 0;
            const salePrice = product.sale_price || price;
            const discount = price > 0 ? Math.round(((price - salePrice) / price) * 100) : 0;
            const savings = price - salePrice;

            return (
              <div key={product.id} className="relative flex flex-col">
                {/* Prominent Discount Ribbon */}
                {discount > 0 && (
                  <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
                    <span className="bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow-md tracking-wider uppercase flex items-center gap-1">
                      <Percent className="w-3 h-3" />
                      SAVE {discount}%
                    </span>
                  </div>
                )}
                <ProductCard product={product} index={idx} />
                {savings > 0 && (
                  <div className="mt-1 px-2 text-center">
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 inline-block">
                      Instant Saving: {formatCurrency(savings)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3 animate-in fade-in-50 duration-200">
          {displayedProducts.map((product, idx) => {
            const price = product.price || 0;
            const salePrice = product.sale_price || price;
            const discount = price > 0 ? Math.round(((price - salePrice) / price) * 100) : 0;
            const savings = price - salePrice;

            return (
              <div key={product.id} className="relative flex flex-col">
                <ProductListRow product={product} index={idx} />
                {discount > 0 && (
                  <div className="px-4 py-1 bg-rose-50/60 rounded-b-xl -mt-2 mx-2 border-x border-b border-rose-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-red-700 flex items-center gap-1">
                      <Percent className="w-3 h-3" /> {discount}% Discount
                    </span>
                    <span className="font-semibold text-emerald-700">
                      You Save {formatCurrency(savings)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
