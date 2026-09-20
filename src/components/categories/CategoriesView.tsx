'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowRight, LayoutGrid, Tag } from 'lucide-react';
import { Category } from '@/types/database';
import { CategoryPillGrid } from './CategoryPillGrid';

interface CategoriesViewProps {
  mainCategories: Category[];
  subCategories: Category[];
}

export function CategoriesView({ mainCategories, subCategories }: CategoriesViewProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'cards' | 'pills'>('cards');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bajaj_preferred_category_view') as 'cards' | 'pills' | null;
      if (saved && (saved === 'cards' || saved === 'pills')) {
        setViewMode(saved);
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleToggle = (mode: 'cards' | 'pills') => {
    setViewMode(mode);
    try {
      localStorage.setItem('bajaj_preferred_category_view', mode);
    } catch {
      // Ignore
    }
  };

  const handleCardClick = (e: React.MouseEvent, slug: string) => {
    const target = e.target as HTMLElement;
    // Do not trigger parent card navigation if clicking on a subcategory chip
    if (target.closest('[data-subcategory="true"]')) {
      return;
    }
    // If user clicked directly on an <a> element (e.g. image link or Browse All link), let Next.js Link handle it
    if (target.closest('a')) {
      return;
    }
    router.push(`/shop?category=${slug}`);
  };

  const handleCardKeyDown = (e: React.KeyboardEvent, slug: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target as HTMLElement;
      if (target.closest('[data-subcategory="true"]') || target.closest('a')) {
        return;
      }
      e.preventDefault();
      router.push(`/shop?category=${slug}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* View Switcher Controls */}
      <div className="flex items-center justify-end">
        <div className="inline-flex items-center bg-white border border-rose-200/80 rounded-xl p-1 shadow-xs gap-1">
          <button
            type="button"
            onClick={() => handleToggle('cards')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              viewMode === 'cards'
                ? 'bg-[#800f2f] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#800f2f] hover:bg-rose-50'
            }`}
            aria-label="Cards view"
            title="Showcase Cards View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cards View</span>
          </button>
          <button
            type="button"
            onClick={() => handleToggle('pills')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              viewMode === 'pills'
                ? 'bg-[#800f2f] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#800f2f] hover:bg-rose-50'
            }`}
            aria-label="Pills view"
            title="Compact Department Pills"
          >
            <Tag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Compact Pills</span>
          </button>
        </div>
      </div>

      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in-50 duration-200">
          {mainCategories.map((main) => {
            const children = subCategories.filter((s) => s.slug.startsWith(`${main.slug}--`));

            return (
              <div
                key={main.id}
                role="button"
                tabIndex={0}
                onClick={(e) => handleCardClick(e, main.slug)}
                onKeyDown={(e) => handleCardKeyDown(e, main.slug)}
                className="group flex flex-col bg-white rounded-3xl border border-rose-100 overflow-hidden shadow-xs hover:shadow-md hover:border-rose-300 transition-all duration-300 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#800f2f]/30"
              >
                {/* Clickable Image & Department Title Header */}
                <Link
                  href={`/shop?category=${main.slug}`}
                  className="aspect-16/9 w-full bg-rose-50 overflow-hidden relative block cursor-pointer select-none"
                  title={`Browse all ${main.name}`}
                  tabIndex={-1}
                >
                  {main.image_url ? (
                    <img
                      src={main.image_url}
                      alt={main.name}
                      draggable={false}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none select-none"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-rose-300 pointer-events-none">
                      <ShoppingBag className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-5 pointer-events-none select-none">
                    <div>
                      <span className="text-[11px] font-bold text-pink-200 uppercase tracking-wider block">
                        Department
                      </span>
                      <h3 className="text-xl font-extrabold text-white font-serif group-hover:text-rose-200 transition-colors">
                        {main.name}
                      </h3>
                    </div>
                  </div>
                </Link>

                <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 leading-relaxed block">
                      {main.description || 'Quality items handpicked for your family.'}
                    </p>

                    {/* Sub-Category Chips */}
                    {children.length > 0 && (
                      <div className="mt-3.5 space-y-1.5">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                          Sub-Categories
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {children.map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/shop?category=${sub.slug}`}
                              data-subcategory="true"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center text-xs font-medium bg-rose-50/70 hover:bg-[#800f2f] hover:text-white text-[#800f2f] px-2.5 py-1 rounded-lg border border-rose-100 transition shadow-2xs cursor-pointer z-10"
                            >
                              <span>{sub.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-rose-100 flex items-center justify-between">
                    <Link
                      href={`/shop?category=${main.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#800f2f] hover:text-[#590d22] transition group-hover:underline cursor-pointer"
                    >
                      <span>Browse All in {main.name}</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in-50 duration-200">
          <div>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
              Main Departments
            </h2>
            <CategoryPillGrid categories={mainCategories} />
          </div>

          {subCategories.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                Specialty Sub-Categories
              </h2>
              <CategoryPillGrid categories={subCategories} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
