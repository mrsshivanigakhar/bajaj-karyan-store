'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Store, ShoppingBag, ClipboardList, User } from 'lucide-react';
import { useShoppingList } from '@/context/shopping-list-context';

export function MobileNav() {
  const pathname = usePathname();
  const { totalItemsCount, setIsDrawerOpen } = useShoppingList();

  // Don't show mobile nav in admin portal or print view
  if (pathname.startsWith('/admin') || pathname.includes('/print')) {
    return null;
  }

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Shop', href: '/shop', icon: Store },
    {
      label: 'My List',
      action: () => setIsDrawerOpen(true),
      icon: ShoppingBag,
      badge: totalItemsCount > 0 ? totalItemsCount : null,
    },
    { label: 'Orders', href: '/account/orders', icon: ClipboardList },
    { label: 'Profile', href: '/account/profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#590d22] border-t border-[#800f2f] px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = item.href ? pathname === item.href : false;

          if (item.action) {
            return (
              <button
                key={idx}
                onClick={item.action}
                className="flex flex-col items-center justify-center py-1 px-3 text-rose-200 hover:text-white relative transition"
              >
                <div className="relative">
                  <Icon className="w-5 h-5 text-pink-300" />
                  {item.badge && (
                    <span
                      key={item.badge}
                      className="absolute -top-1.5 -right-2.5 bg-[#ff4d6d] text-white text-[10px] font-bold px-1 rounded-full min-w-[16px] text-center border border-[#590d22] animate-in zoom-in-75 duration-200"
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-medium mt-0.5">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={idx}
              href={item.href!}
              className={`flex flex-col items-center justify-center py-1 px-3 transition ${
                isActive ? 'text-white font-semibold' : 'text-rose-200/80 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-pink-400' : 'text-rose-200'}`} />
              <span className="text-[11px] font-medium mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
