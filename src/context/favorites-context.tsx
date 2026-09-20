'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useShoppingList } from '@/context/shopping-list-context';

export interface FavoriteItem {
  productId: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  price: number | null;
  salePrice?: number | null;
  unitType: string;
  unitValue: number;
  categoryName?: string | null;
  addedAt: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: {
    id: string;
    name: string;
    slug: string;
    image_url?: string | null;
    price?: number | null;
    sale_price?: number | null;
    unit_type?: string;
    unit_value?: number;
    category?: { name?: string } | null;
  }) => void;
  addToFavorites: (product: {
    id: string;
    name: string;
    slug: string;
    image_url?: string | null;
    price?: number | null;
    sale_price?: number | null;
    unit_type?: string;
    unit_value?: number;
    category?: { name?: string } | null;
  }) => void;
  removeFromFavorites: (productId: string) => void;
  moveToCart: (productId: string) => void;
  clearFavorites: () => void;
  totalFavoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = 'bajaj_karyan_favorites_v1';

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { addItem, setIsDrawerOpen } = useShoppingList();

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load favorites from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Persist favorites to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  }, [favorites, isLoaded]);

  const isFavorite = (productId: string) => {
    return favorites.some((f) => f.productId === productId);
  };

  const addToFavorites = (product: {
    id: string;
    name: string;
    slug: string;
    image_url?: string | null;
    price?: number | null;
    sale_price?: number | null;
    unit_type?: string;
    unit_value?: number;
    category?: { name?: string } | null;
  }) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.productId === product.id)) return prev;
      return [
        {
          productId: product.id,
          name: product.name,
          slug: product.slug,
          imageUrl: product.image_url || null,
          price: product.price ?? null,
          salePrice: product.sale_price ?? null,
          unitType: product.unit_type || 'packet',
          unitValue: product.unit_value || 1,
          categoryName: product.category?.name || null,
          addedAt: new Date().toISOString(),
        },
        ...prev,
      ];
    });
  };

  const removeFromFavorites = (productId: string) => {
    setFavorites((prev) => prev.filter((f) => f.productId !== productId));
  };

  const toggleFavorite = (product: {
    id: string;
    name: string;
    slug: string;
    image_url?: string | null;
    price?: number | null;
    sale_price?: number | null;
    unit_type?: string;
    unit_value?: number;
    category?: { name?: string } | null;
  }) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const moveToCart = (productId: string) => {
    const item = favorites.find((f) => f.productId === productId);
    if (item) {
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
      removeFromFavorites(productId);
      setIsDrawerOpen(true);
    }
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        addToFavorites,
        removeFromFavorites,
        moveToCart,
        clearFavorites,
        totalFavoritesCount: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
