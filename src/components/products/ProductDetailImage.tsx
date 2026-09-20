'use client';

import React, { useState } from 'react';
import { Package } from 'lucide-react';

interface ProductDetailImageProps {
  imageUrl?: string | null;
  name: string;
  isFeatured?: boolean;
}

export function ProductDetailImage({
  imageUrl,
  name,
  isFeatured = false,
}: ProductDetailImageProps) {
  const [imgSrc, setImgSrc] = useState(imageUrl || '/images/categories/staples-grocery.jpg');
  const [hasError, setHasError] = useState(!imageUrl);

  return (
    <div className="w-full aspect-square rounded-2xl overflow-hidden bg-rose-50 border border-rose-100 flex items-center justify-center relative">
      {!hasError && imgSrc ? (
        <img
          src={imgSrc}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => {
            setHasError(true);
            setImgSrc('/images/categories/staples-grocery.jpg');
          }}
        />
      ) : (
        <Package className="w-20 h-20 text-rose-300" />
      )}

      {isFeatured && (
        <span className="absolute top-4 left-4 bg-[#800f2f] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
          Featured
        </span>
      )}
    </div>
  );
}
