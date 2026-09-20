'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2, ArrowRight, ShoppingBag } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency, formatUnit } from '@/lib/utils';

interface SuggestionProduct {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  unit_type: string;
  image_url: string | null;
  category?: {
    name: string;
    slug: string;
  } | null;
}

interface SuggestionCategory {
  id: string;
  name: string;
  slug: string;
}

interface SearchWithSuggestionsProps {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  onSearchSubmit?: () => void;
  isMobile?: boolean;
}

export function SearchWithSuggestions({
  placeholder = 'Search biscuits, ghee, dry fruits, atta...',
  className = '',
  inputClassName = '',
  onSearchSubmit,
  isMobile = false,
}: SearchWithSuggestionsProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [productSuggestions, setProductSuggestions] = useState<SuggestionProduct[]>([]);
  const [categorySuggestions, setCategorySuggestions] = useState<SuggestionCategory[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search query
  useEffect(() => {
    const trimmed = searchTerm.trim();
    if (trimmed.length < 2) {
      setProductSuggestions([]);
      setCategorySuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);
    setSelectedIndex(-1);

    const timer = setTimeout(async () => {
      try {
        const supabase = createClient();

        // Run parallel queries for products and categories
        const [prodRes, catRes] = await Promise.all([
          supabase
            .from('products')
            .select('id, name, slug, price, unit_type, image_url, category:categories(name, slug)')
            .ilike('name', `%${trimmed}%`)
            .limit(6),
          supabase
            .from('categories')
            .select('id, name, slug')
            .ilike('name', `%${trimmed}%`)
            .limit(4),
        ]);

        if (prodRes.data) {
          setProductSuggestions(prodRes.data as any);
        }
        if (catRes.data) {
          setCategorySuggestions(catRes.data as any);
        }
      } catch (err) {
        console.error('Search suggestions error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsOpen(false);
      if (onSearchSubmit) onSearchSubmit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const totalItems = categorySuggestions.length + productSuggestions.length;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen && searchTerm.trim().length >= 2) {
        setIsOpen(true);
        return;
      }
      setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0) {
        e.preventDefault();
        // Check if selected is a category
        if (selectedIndex < categorySuggestions.length) {
          const cat = categorySuggestions[selectedIndex];
          router.push(`/shop?category=${cat.slug}`);
        } else {
          // Selected is a product
          const prodIndex = selectedIndex - categorySuggestions.length;
          const prod = productSuggestions[prodIndex];
          if (prod) {
            router.push(`/products/${prod.slug}`);
          }
        }
        setIsOpen(false);
        if (onSearchSubmit) onSearchSubmit();
      } else {
        handleSubmit();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setProductSuggestions([]);
    setCategorySuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const popularSearches = ['Atta', 'Pure Ghee', 'Basmati Rice', 'Dry Fruits', 'Bourbon Biscuits', 'Moong Dal'];

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            if (searchTerm.trim().length >= 2) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          className={
            inputClassName ||
            `w-full bg-rose-950/60 text-white placeholder-rose-300/70 border border-rose-800 rounded-full py-2 pl-4 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-rose-950 transition ${
              isMobile ? 'py-1.5 text-xs' : ''
            }`
          }
        />

        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-rose-300">
          {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-pink-300" />}

          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="p-1 hover:text-white rounded-full hover:bg-rose-900/50 transition"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="submit"
            className="p-1 hover:text-white transition"
            aria-label="Submit search"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-rose-100 overflow-hidden z-50 text-gray-800 animate-in fade-in-50 slide-in-from-top-2 duration-150">
          {/* Categories matches */}
          {categorySuggestions.length > 0 && (
            <div className="p-3 border-b border-rose-50 bg-rose-50/40">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#800f2f] block mb-1.5">
                Categories
              </span>
              <div className="flex flex-wrap gap-1.5">
                {categorySuggestions.map((cat, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${cat.slug}`}
                      onClick={() => {
                        setIsOpen(false);
                        if (onSearchSubmit) onSearchSubmit();
                      }}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition ${
                        isSelected
                          ? 'bg-[#800f2f] text-white'
                          : 'bg-white text-gray-700 hover:bg-rose-100 border border-rose-200'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <ArrowRight className="w-3 h-3 text-rose-400" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Product matches */}
          {productSuggestions.length > 0 && (
            <div className="py-2 max-h-80 overflow-y-auto divide-y divide-rose-50">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-4 py-1 block">
                Products
              </span>
              {productSuggestions.map((product, idx) => {
                const itemIndex = categorySuggestions.length + idx;
                const isSelected = selectedIndex === itemIndex;
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={() => {
                      setIsOpen(false);
                      if (onSearchSubmit) onSearchSubmit();
                    }}
                    className={`flex items-center gap-3 px-4 py-2.5 transition ${
                      isSelected ? 'bg-rose-50 text-[#800f2f]' : 'hover:bg-rose-50/60'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-100 shrink-0 overflow-hidden flex items-center justify-center">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <ShoppingBag className="w-5 h-5 text-rose-300" />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {product.category && (
                          <span className="text-[10px] text-gray-500 truncate">
                            {product.category.name}
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400">•</span>
                        <span className="text-[11px] font-bold text-[#800f2f]">
                          {product.price !== null
                            ? `${formatCurrency(product.price)} / ${formatUnit(product.unit_type)}`
                            : 'Market Rate'}
                        </span>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-rose-300 shrink-0" />
                  </Link>
                );
              })}
            </div>
          )}

          {/* Empty state with popular searches */}
          {!isLoading && categorySuggestions.length === 0 && productSuggestions.length === 0 && (
            <div className="p-4 text-center">
              <p className="text-xs text-gray-500 mb-2">No direct matches for &quot;{searchTerm}&quot;</p>
              <div className="pt-2 border-t border-rose-100">
                <span className="text-[11px] font-semibold text-gray-600 block mb-1.5">
                  Popular Searches:
                </span>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setSearchTerm(term);
                        router.push(`/shop?search=${encodeURIComponent(term)}`);
                        setIsOpen(false);
                        if (onSearchSubmit) onSearchSubmit();
                      }}
                      className="text-[11px] bg-rose-50 hover:bg-rose-100 text-[#800f2f] px-2.5 py-1 rounded-full font-medium transition"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer: View all results */}
          {searchTerm.trim() && (
            <div className="p-2.5 bg-gray-50 border-t border-rose-100 text-center">
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="w-full text-xs font-bold text-[#800f2f] hover:text-[#a4133c] inline-flex items-center justify-center gap-1.5 py-1"
              >
                <span>View all search results for &quot;{searchTerm}&quot;</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
