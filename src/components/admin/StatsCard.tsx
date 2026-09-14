import React from 'react';

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
