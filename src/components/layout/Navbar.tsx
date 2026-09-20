'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, User, Menu, X, Phone, Store, Heart, ChevronRight } from 'lucide-react';
import { useShoppingList } from '@/context/shopping-list-context';
import { useFavorites } from '@/context/favorites-context';
import { useStoreSettings } from '@/context/store-settings-context';
import { createClient } from '@/lib/supabase/client';
import { SearchWithSuggestions } from '@/components/search/SearchWithSuggestions';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItemsCount, setIsDrawerOpen } = useShoppingList();
  const { totalFavoritesCount } = useFavorites();
  const { settings } = useStoreSettings();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const departmentLinks = [
    { name: 'Shop All', href: '/shop' },
    { name: 'All Categories', href: '/categories' },
    { name: 'Staples & Grains', href: '/shop?category=staples-grains' },
    { name: 'Snacks & Sweets', href: '/shop?category=packaged-snacks' },
    { name: 'Oils & Ghee', href: '/shop?category=cooking-oils-ghee' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const mobileNavLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop All Items', href: '/shop' },
    { name: 'All Categories', href: '/categories' },
    { name: 'Staples & Grains', href: '/shop?category=staples-grains' },
    { name: 'Snacks & Confectionery', href: '/shop?category=packaged-snacks' },
    { name: 'Cooking Oils & Ghee', href: '/shop?category=cooking-oils-ghee' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact & Support', href: '/contact' },
    { name: 'My Orders', href: '/account/orders' },
    { name: 'Saved Favourites', href: '/favorites' },
  ];

  const phoneLink = settings.phone ? settings.phone.replace(/[^+\d]/g, '') : '+919876543210';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#590d22] text-white shadow-md">
      {/* Top Utility Banner */}
      <div className="bg-[#480a1b] px-4 py-1.5 text-xs text-rose-100 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Store className="w-3.5 h-3.5 text-pink-300 shrink-0" />
          <span className="truncate">
            {settings.delivery_info || `Local Grocery & Confectionery in ${settings.city || 'Firozpur'}`}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 shrink-0">
          {settings.phone && (
            <a href={`tel:${phoneLink}`} className="flex items-center gap-1 hover:text-white transition">
              <Phone className="w-3 h-3 text-pink-300" />
              <span>Order by Phone: {settings.phone}</span>
            </a>
          )}
        </div>
      </div>

      {/* Main Navbar Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Brand Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              className="md:hidden p-1.5 -ml-1 rounded-lg hover:bg-[#800f2f] text-rose-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/" className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl md:text-2xl tracking-wider text-white font-serif uppercase leading-tight">
                {settings.store_name || 'BAJAJ KARYAN STORE'}
              </span>
              <span className="text-[9px] sm:text-[11px] text-pink-200 uppercase tracking-widest font-medium leading-tight">
                Confectionery & Daily Kiryana • {settings.city || 'Firozpur'}
              </span>
            </Link>
          </div>

          {/* Desktop Expansive Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-2 lg:mx-6 min-w-[240px]">
            <SearchWithSuggestions />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Account / Sign In */}
            {user ? (
              <Link
                href="/account/profile"
                className="flex items-center gap-1.5 text-rose-200 hover:text-white text-xs sm:text-sm bg-rose-900/50 hover:bg-rose-900 px-3 py-2 rounded-full border border-rose-800/80 transition"
              >
                <User className="w-4 h-4 text-pink-300" />
                <span className="hidden sm:inline">Account</span>
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 text-rose-200 hover:text-white text-xs sm:text-sm bg-rose-900/50 hover:bg-rose-900 px-3 py-2 rounded-full border border-rose-800/80 transition"
              >
                <User className="w-4 h-4 text-pink-300" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}

            {/* Saved / Wishlist Button */}
            <Link
              href="/favorites"
              className="flex items-center gap-1.5 text-rose-200 hover:text-white text-xs sm:text-sm bg-rose-900/50 hover:bg-rose-900 px-3 py-2 rounded-full border border-rose-800/80 transition relative"
              aria-label="View saved favorites"
              title="My Saved Favourites"
            >
              <Heart
                className={`w-4 h-4 ${
                  totalFavoritesCount > 0 ? 'fill-pink-400 text-pink-400' : 'text-pink-300'
                }`}
              />
              <span className="hidden sm:inline">Saved</span>
              {totalFavoritesCount > 0 && (
                <span className="bg-[#ff4d6d] text-white font-bold text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-xs">
                  {totalFavoritesCount}
                </span>
              )}
            </Link>

            {/* Shopping List Trigger Button */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-2 bg-[#ff4d6d] hover:bg-[#ff758f] text-white px-3.5 sm:px-4 py-2 rounded-full shadow-md transition relative font-bold text-xs sm:text-sm"
              aria-label="Open shopping list"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">My List</span>
              {totalItemsCount > 0 && (
                <span
                  key={totalItemsCount}
                  className="bg-white text-[#590d22] font-bold text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-xs animate-in zoom-in-75 duration-200"
                >
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pt-2.5 pb-0.5">
          <SearchWithSuggestions isMobile={true} />
        </div>
      </div>

      {/* Sub-Navigation Department Bar (Desktop) */}
      <div className="hidden md:block bg-[#480a1b] border-t border-rose-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <nav className="flex items-center gap-1 overflow-x-auto py-2 text-xs sm:text-sm font-medium scrollbar-none">
            {departmentLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1 rounded-full transition shrink-0 ${
                    isActive
                      ? 'bg-[#ff4d6d] text-white font-semibold shadow-xs'
                      : 'text-rose-100 hover:text-white hover:bg-rose-900/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-4 text-xs text-rose-200 shrink-0">
            <Link href="/account/orders" className="hover:text-white transition">
              Track Orders
            </Link>
            <span className="text-rose-400/50">•</span>
            <Link href="/contact" className="hover:text-white transition">
              Help & Support
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#480a1b] border-t border-rose-900/60 px-4 py-3 space-y-1.5 animate-in slide-in-from-top-2 duration-200">
          {mobileNavLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-rose-100 hover:bg-[#800f2f] hover:text-white transition"
            >
              <span>{link.name}</span>
              <ChevronRight className="w-4 h-4 text-rose-300/60" />
            </Link>
          ))}
          <div className="pt-2 border-t border-rose-900/50">
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-semibold text-pink-300 hover:bg-[#800f2f] transition"
            >
              Store Administration Panel
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
