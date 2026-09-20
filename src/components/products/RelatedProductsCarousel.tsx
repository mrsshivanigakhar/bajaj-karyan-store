'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/types/database';
import { formatCurrency, formatUnit } from '@/lib/utils';
import { useShoppingList } from '@/context/shopping-list-context';
import { FavoriteButton } from '@/components/products/FavoriteButton';
import { ChevronLeft, ChevronRight, ShoppingBag, Check, Zap, Package } from 'lucide-react';

interface RelatedProductsCarouselProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export function RelatedProductsCarousel({
  products,
  title = 'Related Products You May Like',
  subtitle = 'Discover similar grocery essentials and popular confectionery picks.',
}: RelatedProductsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { addItem, setIsDrawerOpen } = useShoppingList();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [products]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const clientWidth = scrollRef.current.clientWidth;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      imageUrl: product.image_url,
      price: product.price,
      unitType: product.unit_type,
      unitValue: product.unit_value,
      quantity: 1,
    });

    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const handleBuyNow = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      imageUrl: product.image_url,
      price: product.price,
      unitType: product.unit_type,
      unitValue: product.unit_value,
      quantity: 1,
    });

    setIsDrawerOpen(true);
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="space-y-4 pt-8 border-t border-rose-100">
      {/* Header with Title & Navigation Arrows */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#590d22] font-serif tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className="p-2 rounded-xl border border-rose-200 bg-white text-gray-700 hover:bg-rose-50 hover:text-[#800f2f] transition shadow-xs disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className="p-2 rounded-xl border border-rose-200 bg-white text-gray-700 hover:bg-rose-50 hover:text-[#800f2f] transition shadow-xs disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track: Exactly 6 items visible on desktop (lg) */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 pt-1 px-1 -mx-1 scrollbar-thin scrollbar-thumb-rose-200"
      >
        {products.map((product) => {
          const isAdded = addedIds[product.id];

          return (
            <div
              key={product.id}
              className="snap-start shrink-0 flex flex-col justify-between bg-white rounded-2xl border border-rose-100 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 group
                w-[calc((100%-1*0.75rem)/2)] min-w-[155px]
                sm:w-[calc((100%-2*1rem)/3)] sm:min-w-[190px]
                md:w-[calc((100%-3*1rem)/4)] md:min-w-[190px]
                lg:w-[calc((100%-5*1rem)/6)] lg:min-w-[calc((100%-5*1rem)/6)]"
            >
              {/* Product Card Top: Image & Heart */}
              <div className="relative w-full aspect-square bg-rose-50/50 overflow-hidden">
                <Link href={`/products/${product.slug}`} className="block w-full h-full">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/categories/staples-grocery.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-rose-300">
                      <Package className="w-10 h-10" />
                    </div>
                  )}
                </Link>

                {/* Heart Button */}
                <div className="absolute top-2 right-2 z-10">
                  <FavoriteButton product={product} size="sm" />
                </div>

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.is_featured && (
                    <span className="bg-[#800f2f] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                      Featured
                    </span>
                  )}
                  {product.price === null && (
                    <span className="bg-[#590d22] text-pink-200 text-[9px] font-semibold px-1.5 py-0.5 rounded-full">
                      Market Rate
                    </span>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-3 flex flex-col flex-1 justify-between space-y-2">
                <div>
                  {product.category && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#800f2f] line-clamp-1">
                      {product.category.name}
                    </span>
                  )}
                  <Link href={`/products/${product.slug}`}>
                    <h3
                      className="font-bold text-gray-900 group-hover:text-[#800f2f] transition text-xs sm:text-sm line-clamp-2 mt-0.5"
                      title={product.name}
                    >
                      {product.name}
                    </h3>
                  </Link>
                </div>

                {/* Price */}
                <div className="pt-1 border-t border-rose-50">
                  {product.price !== null ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm sm:text-base font-extrabold text-[#590d22]">
                        {formatCurrency(product.sale_price || product.price)}
                      </span>
                      {product.sale_price && (
                        <span className="text-[10px] text-gray-400 line-through">
                          {formatCurrency(product.price)}
                        </span>
                      )}
                      <span className="text-[10px] text-gray-500 font-medium">
                        /{formatUnit(product.unit_type, product.unit_value)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] font-bold text-[#800f2f]">
                      Price on Request
                    </span>
                  )}
                </div>

                {/* Action Buttons: Add to Cart & Buy Now */}
                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={!product.is_available}
                    title="Add to Shopping List"
                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition shadow-xs ${
                      !product.is_available
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : isAdded
                        ? 'bg-green-600 text-white'
                        : 'bg-rose-50 hover:bg-rose-100 text-[#800f2f] active:scale-95'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleBuyNow(product, e)}
                    disabled={!product.is_available}
                    title="Buy Now"
                    className="flex items-center justify-center gap-0.5 py-1.5 px-2 rounded-lg text-[11px] font-bold bg-[#800f2f] hover:bg-[#a4133c] text-white transition shadow-xs active:scale-95 disabled:bg-gray-200 disabled:text-gray-400"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Buy</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
