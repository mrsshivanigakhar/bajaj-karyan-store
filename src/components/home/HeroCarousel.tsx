'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, ShieldCheck, Truck } from 'lucide-react';

interface Slide {
  id: string;
  badge: string;
  badgeIcon: React.ReactNode;
  headline: string;
  highlightedText: string;
  description: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  imageUrl: string;
  imageAlt: string;
  floatingBadge: {
    title: string;
    subtitle: string;
    tag: string;
  };
}

const slides: Slide[] = [
  {
    id: 'staples',
    badge: 'Firozpur’s Trusted Grocery Destination',
    badgeIcon: <Sparkles className="w-3.5 h-3.5 text-pink-300" />,
    headline: 'Pure Daily Staples,',
    highlightedText: 'From Our Store to Your Door.',
    description:
      'Aashirvaad Atta, India Gate Basmati, Farm-fresh Dals & 100% Pure Desi Ghee. Choose exact weights or packets with transparent market pricing.',
    primaryCtaText: 'Shop Daily Staples',
    primaryCtaHref: '/shop?category=staples-grains',
    secondaryCtaText: 'Explore Categories',
    secondaryCtaHref: '/categories',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Fresh Kiryana Staples and Groceries',
    floatingBadge: {
      title: 'Daily Essentials',
      subtitle: 'Atta, Rice, Dal & Desi Ghee',
      tag: 'In Stock',
    },
  },
  {
    id: 'confectionery',
    badge: 'Festive Confectionery & Dry Fruits',
    badgeIcon: <ShieldCheck className="w-3.5 h-3.5 text-pink-300" />,
    headline: 'Celebrate Every Moment',
    highlightedText: 'With Handpicked Sweets & Snacks.',
    description:
      'Premium California Almonds, Crunchy Cashews, Imported Chocolates, and fresh Bakery Rusks for your everyday cravings and festive gifting.',
    primaryCtaText: 'Explore Confectionery',
    primaryCtaHref: '/shop?category=packaged-snacks',
    secondaryCtaText: 'View Biscuits & Snacks',
    secondaryCtaHref: '/shop?category=packaged-snacks--biscuits-cookies-rusks',
    imageUrl: 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Premium Dry Fruits, Confectionery and Snacks',
    floatingBadge: {
      title: 'Premium Dry Fruits',
      subtitle: 'California Almonds & Cashews',
      tag: 'Best Seller',
    },
  },
  {
    id: 'delivery',
    badge: 'Zero Risk • Doorstep Verification',
    badgeIcon: <Truck className="w-3.5 h-3.5 text-pink-300" />,
    headline: 'Order Without Stress,',
    highlightedText: 'Inspect at Doorstep, Pay Offline.',
    description:
      'No upfront payment gateways. Add custom weights (250g, 1kg, 5kg), place your shopping list, and pay via Cash or UPI upon delivery verification.',
    primaryCtaText: 'Start Your Shopping List',
    primaryCtaHref: '/shop',
    secondaryCtaText: 'How It Works',
    secondaryCtaHref: '#how-it-works',
    imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Bajaj Karyan Store Doorstep Delivery',
    floatingBadge: {
      title: 'Offline Payment',
      subtitle: 'Cash or UPI on Delivery',
      tag: 'Zero Online Risk',
    },
  },
];

export function HeroCarousel({ storeName = 'Bajaj Karyan Store', city = 'Firozpur' }: { storeName?: string; city?: string }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, []);

  // Autoplay every 5.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const slide = slides[currentSlide];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 w-full">
      <div
        className="relative rounded-3xl overflow-hidden bg-gradient-bordeaux text-white shadow-xl border border-rose-900/40 min-h-[380px] sm:min-h-[440px] lg:min-h-[460px] flex items-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        aria-roledescription="carousel"
        aria-label="Promotional Banners"
      >
        {/* Decorative ambient lighting */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Slide Content */}
        <div className="w-full px-6 sm:px-12 lg:px-16 py-10 sm:py-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            {/* Left Text Content */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-900/80 border border-pink-400/30 text-xs font-medium text-pink-200 shadow-xs backdrop-blur-xs">
                {slide.badgeIcon}
                <span>
                  {storeName} • {slide.badge}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-serif tracking-tight leading-tight sm:leading-tight">
                {slide.headline} <br className="hidden sm:inline" />
                <span className="text-pink-300 bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text text-transparent">
                  {slide.highlightedText}
                </span>
              </h1>

              <p className="text-xs sm:text-sm lg:text-base text-rose-100/90 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                {slide.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
                <Link
                  href={slide.primaryCtaHref}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#ff4d6d] hover:bg-[#ff758f] text-white px-6 py-3 rounded-full font-semibold text-sm shadow-md hover:shadow-pink-500/25 transition transform hover:-translate-y-0.5"
                >
                  <span>{slide.primaryCtaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={slide.secondaryCtaHref}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-rose-900/60 hover:bg-rose-900 text-rose-100 px-5 py-3 rounded-full font-semibold text-sm border border-rose-700/80 transition"
                >
                  <span>{slide.secondaryCtaText}</span>
                </Link>
              </div>

              {/* Quick highlight bar */}
              <div className="pt-4 border-t border-rose-800/40 grid grid-cols-3 gap-2 text-center">
                <div className="p-1.5 rounded-xl bg-rose-950/40 border border-rose-900/30">
                  <span className="block text-lg sm:text-xl font-bold text-white">1,100+</span>
                  <span className="text-[10px] sm:text-xs text-rose-200">Fresh Products</span>
                </div>
                <div className="p-1.5 rounded-xl bg-rose-950/40 border border-rose-900/30">
                  <span className="block text-lg sm:text-xl font-bold text-white">₹0 Fee</span>
                  <span className="text-[10px] sm:text-xs text-rose-200">Pay on Delivery</span>
                </div>
                <div className="p-1.5 rounded-xl bg-rose-950/40 border border-rose-900/30">
                  <span className="block text-lg sm:text-xl font-bold text-white">100%</span>
                  <span className="text-[10px] sm:text-xs text-rose-200">Quality Assured</span>
                </div>
              </div>
            </div>

            {/* Right Visual Image Showcase */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-rose-800/50 aspect-4/3 group">
                <img
                  src={slide.imageUrl}
                  alt={slide.imageAlt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  fetchPriority={currentSlide === 0 ? 'high' : 'auto'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#590d22]/90 via-transparent to-transparent flex items-end p-4">
                  <div className="bg-white/95 backdrop-blur-md rounded-xl p-3 text-[#590d22] shadow-lg w-full flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        {slide.floatingBadge.title}
                      </p>
                      <p className="font-bold text-xs sm:text-sm text-gray-900">
                        {slide.floatingBadge.subtitle}
                      </p>
                    </div>
                    <span className="bg-[#800f2f] text-white text-[10px] px-2.5 py-1 rounded-full font-semibold">
                      {slide.floatingBadge.tag}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Left / Right Chevron Controls */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-black/30 hover:bg-[#800f2f] text-white backdrop-blur-xs border border-white/20 transition shadow-lg hover:scale-110 active:scale-95 z-20"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-black/30 hover:bg-[#800f2f] text-white backdrop-blur-xs border border-white/20 transition shadow-lg hover:scale-110 active:scale-95 z-20"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Centered Pagination Dots inside banner */}
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20"
          role="tablist"
          aria-label="Slide indicators"
        >
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={currentSlide === idx}
              aria-label={`Go to slide ${idx + 1}: ${s.headline}`}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all duration-300 rounded-full h-2 ${
                currentSlide === idx ? 'w-7 bg-[#ff4d6d]' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
