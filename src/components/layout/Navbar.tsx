'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, Search, User, Menu, X, Phone, Store } from 'lucide-react';
import { useShoppingList } from '@/context/shopping-list-context';
import { createClient } from '@/lib/supabase/client';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItemsCount, setIsDrawerOpen } = useShoppingList();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop All', href: '/shop' },
    { name: 'Categories', href: '/categories' },
    { name: 'My Orders', href: '/account/orders' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#590d22] text-white shadow-md">
      {/* Top Banner */}
      <div className="bg-[#480a1b] px-4 py-1.5 text-xs text-rose-100 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Store className="w-3.5 h-3.5 text-pink-300" />
          <span>Local Grocery & Confectionery in Amritsar</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <a href="tel:+919876543210" className="flex items-center gap-1 hover:text-white transition">
            <Phone className="w-3 h-3 text-pink-300" />
            <span>Order by Phone: +91 98765 43210</span>
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="md:hidden p-2 rounded-lg hover:bg-[#800f2f] text-rose-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link href="/" className="flex flex-col">
              <span className="font-extrabold text-xl sm:text-2xl tracking-wider text-white font-serif uppercase">
                BAJAJ KARYAN STORE
              </span>
              <span className="text-[10px] sm:text-xs text-pink-200 uppercase tracking-widest -mt-1 font-medium">
                Confectionery & Daily Kiryana
              </span>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search biscuits, ghee, dry fruits, atta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-rose-950/60 text-white placeholder-rose-300/70 border border-rose-800 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-rose-950"
              />
              <button
                type="submit"
                className="absolute right-3 top-2.5 text-rose-300 hover:text-white"
                aria-label="Submit search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition py-1 border-b-2 ${
                    isActive
                      ? 'border-pink-400 text-white font-semibold'
                      : 'border-transparent text-rose-200 hover:text-white hover:border-pink-300'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/account/profile"
                className="flex items-center gap-1.5 text-rose-200 hover:text-white text-sm bg-rose-900/50 hover:bg-rose-900 px-3 py-1.5 rounded-full border border-rose-800/80 transition"
              >
                <User className="w-4 h-4 text-pink-300" />
                <span className="hidden sm:inline">Account</span>
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 text-rose-200 hover:text-white text-sm bg-rose-900/50 hover:bg-rose-900 px-3 py-1.5 rounded-full border border-rose-800/80 transition"
              >
                <User className="w-4 h-4 text-pink-300" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}

            {/* Shopping List Trigger Button */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-2 bg-[#ff4d6d] hover:bg-[#ff758f] text-white px-3.5 py-1.5 rounded-full shadow transition relative font-medium text-sm"
              aria-label="Open shopping list"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">My List</span>
              {totalItemsCount > 0 && (
                <span
                  key={totalItemsCount}
                  className="bg-white text-[#590d22] font-bold text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-sm animate-in zoom-in-75 duration-200"
                >
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3 pt-1">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              placeholder="Search store items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-rose-950/60 text-white placeholder-rose-300/70 border border-rose-800 rounded-full py-1.5 pl-4 pr-10 text-xs focus:outline-none focus:ring-1 focus:ring-pink-400"
            />
            <button type="submit" className="absolute right-3 top-2 text-rose-300" aria-label="Submit search">
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#480a1b] border-t border-rose-900/60 px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-rose-100 hover:bg-[#800f2f] hover:text-white"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/admin"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-pink-300 hover:bg-[#800f2f]"
          >
            Admin Panel
          </Link>
        </div>
      )}
    </header>
  );
}
