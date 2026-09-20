'use client';

import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/context/favorites-context';
import { Product } from '@/types/database';

interface FavoriteButtonProps {
  product: Product | {
    id: string;
    name: string;
    slug: string;
    image_url?: string | null;
    price?: number | null;
    sale_price?: number | null;
    unit_type?: string;
    unit_value?: number;
    category?: { name?: string } | null;
  };
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function FavoriteButton({
  product,
  size = 'md',
  showLabel = false,
  className = '',
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [animating, setAnimating] = useState(false);

  const active = isFavorite(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAnimating(true);
    toggleFavorite(product);
    setTimeout(() => setAnimating(false), 300);
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? 'Remove from favorites' : 'Add to favorites / buy later'}
      title={active ? 'Remove from favorites' : 'Add to favorites / buy later'}
      className={`inline-flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
        animating ? 'scale-125' : 'hover:scale-105 active:scale-95'
      } ${
        showLabel
          ? `px-3.5 py-2 rounded-xl text-xs font-bold border ${
              active
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : 'bg-white border-rose-200 text-gray-700 hover:bg-rose-50 hover:text-rose-700'
            }`
          : `p-2 rounded-full backdrop-blur-xs transition shadow-xs ${
              active
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'bg-white/90 text-gray-400 hover:text-rose-600 border border-rose-100 hover:bg-white'
            }`
      } ${className}`}
    >
      <Heart
        className={`${iconSizes[size]} transition-colors ${
          active ? 'fill-rose-600 text-rose-600' : 'text-current'
        }`}
      />
      {showLabel && (
        <span>{active ? 'Saved in Favourites' : 'Save for Later'}</span>
      )}
    </button>
  );
}
