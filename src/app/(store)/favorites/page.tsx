'use client';

import React from 'react';
import Link from 'next/link';
import { useFavorites } from '@/context/favorites-context';
import { useShoppingList } from '@/context/shopping-list-context';
import { formatCurrency, formatUnit } from '@/lib/utils';
import { Heart, ShoppingBag, Trash2, ArrowRight, Package, Sparkles } from 'lucide-react';

export default function FavoritesPage() {
  const { favorites, removeFromFavorites, moveToCart, clearFavorites } = useFavorites();
  const { addItem, setIsDrawerOpen } = useShoppingList();

  const handleAddAllToCart = () => {
    favorites.forEach((item) => {
      addItem({
        productId: item.productId,
        name: item.name,
        slug: item.slug,
        imageUrl: item.imageUrl,
        price: item.price,
        unitType: item.unitType,
        unitValue: item.unitValue,
        quantity: 1,
      });
    });
    clearFavorites();
    setIsDrawerOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#800f2f]">
            <Heart className="w-4 h-4 fill-rose-600 text-rose-600" />
            <span>Saved For Later</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#590d22] font-serif tracking-tight mt-1">
            My Favourites & Wishlist
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Keep track of items you love and easily transfer them to your active shopping list whenever you are ready.
          </p>
        </div>

        {favorites.length > 0 && (
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleAddAllToCart}
              className="inline-flex items-center gap-2 bg-[#800f2f] hover:bg-[#a4133c] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Move All to Shopping List</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to clear all your saved items?')) {
                  clearFavorites();
                }
              }}
              className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
              title="Clear all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {favorites.length === 0 ? (
        <div className="bg-white rounded-3xl border border-rose-100 p-12 sm:p-16 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-400">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-gray-900">Your favourites list is empty</h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
              Save products by tapping the heart icon on any item while browsing our catalog to buy them later.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#800f2f] hover:bg-[#a4133c] text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl shadow-sm transition"
            >
              <span>Explore Grocery Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        /* Favorites Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((item) => (
            <div
              key={item.productId}
              className="flex flex-col justify-between bg-white rounded-2xl border border-rose-100 overflow-hidden shadow-xs hover:shadow-md transition group"
            >
              {/* Product Top: Image & Remove */}
              <div className="relative w-full aspect-square bg-rose-50/50 overflow-hidden">
                <Link href={`/products/${item.slug}`} className="block w-full h-full">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-rose-300">
                      <Package className="w-12 h-12" />
                    </div>
                  )}
                </Link>

                <button
                  type="button"
                  onClick={() => removeFromFavorites(item.productId)}
                  aria-label="Remove from favorites"
                  className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 hover:bg-red-50 text-gray-400 hover:text-red-600 shadow-xs transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {item.categoryName && (
                  <span className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-[#800f2f] text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                    {item.categoryName}
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                <div>
                  <Link href={`/products/${item.slug}`}>
                    <h3 className="font-bold text-gray-900 group-hover:text-[#800f2f] transition text-sm sm:text-base line-clamp-2">
                      {item.name}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="mt-2">
                    {item.price !== null ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base sm:text-lg font-extrabold text-[#590d22]">
                          {formatCurrency(item.salePrice || item.price)}
                        </span>
                        {item.salePrice && (
                          <span className="text-xs text-gray-400 line-through">
                            {formatCurrency(item.price)}
                          </span>
                        )}
                        <span className="text-xs text-gray-500 font-medium">
                          / {formatUnit(item.unitType, item.unitValue)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-[#800f2f]">
                        Price on Request
                      </span>
                    )}
                  </div>
                </div>

                {/* Move to Cart Action Button */}
                <button
                  type="button"
                  onClick={() => moveToCart(item.productId)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#800f2f] hover:bg-[#a4133c] text-white transition shadow-xs active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Move to Shopping List</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
