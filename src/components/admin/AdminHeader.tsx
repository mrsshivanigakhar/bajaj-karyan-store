'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, Store, Shield } from 'lucide-react';

export function AdminHeader({ title }: { title?: string }) {
  return (
    <header className="h-16 bg-white border-b border-rose-100 px-4 sm:px-8 flex items-center justify-between shadow-2xs">
      <div className="pl-12 lg:pl-0">
        <h1 className="text-lg sm:text-xl font-extrabold text-[#590d22] font-serif">
          {title || 'Store Administration'}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Store Open & Accepting Orders</span>
        </div>

        <Link
          href="/"
          target="_blank"
          className="text-xs font-semibold text-[#800f2f] hover:underline flex items-center gap-1"
        >
          <Store className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Storefront</span>
        </Link>
      </div>
    </header>
  );
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'bordeaux',
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: any;
  color?: 'bordeaux' | 'amaranth' | 'pink' | 'emerald' | 'amber';
}) {
  const colorMap = {
    bordeaux: 'bg-[#590d22] text-white',
    amaranth: 'bg-[#800f2f] text-white',
    pink: 'bg-[#ff4d6d] text-white',
    emerald: 'bg-emerald-600 text-white',
    amber: 'bg-amber-600 text-white',
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
          {title}
        </span>
        <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 block">
          {value}
        </span>
        {subtitle && <span className="text-xs text-gray-400 block">{subtitle}</span>}
      </div>

      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${colorMap[color]}`}
      >
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}
