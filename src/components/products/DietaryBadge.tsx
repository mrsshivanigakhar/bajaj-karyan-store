import React from 'react';

export type DietaryType = 'veg' | 'non-veg' | 'egg';

interface DietaryBadgeProps {
  dietaryType?: DietaryType | string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function DietaryBadge({
  dietaryType,
  size = 'sm',
  showLabel = false,
  className = '',
}: DietaryBadgeProps) {
  // In traditional Indian Kiryana/grocery stores, products default to vegetarian unless marked non-veg/egg
  const isNonVeg = dietaryType === 'non-veg';
  const isEgg = dietaryType === 'egg';
  const isVeg = !isNonVeg && !isEgg;

  const sizeConfig = {
    xs: {
      box: 'w-3 h-3 border-[1.2px] p-[1.5px]',
      dot: 'w-1.5 h-1.5',
      text: 'text-[9px] px-1.5 py-0.5',
    },
    sm: {
      box: 'w-3.5 h-3.5 border-[1.5px] p-[2px]',
      dot: 'w-1.5 h-1.5',
      text: 'text-[10px] px-2 py-0.5',
    },
    md: {
      box: 'w-4 h-4 border-[1.5px] p-[2px]',
      dot: 'w-2 h-2',
      text: 'text-xs px-2.5 py-1',
    },
    lg: {
      box: 'w-5 h-5 border-2 p-[2.5px]',
      dot: 'w-2.5 h-2.5',
      text: 'text-xs px-3 py-1',
    },
  };

  const config = sizeConfig[size] || sizeConfig.sm;

  if (isNonVeg) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 ${
          showLabel ? `bg-red-50 text-red-700 border border-red-200/80 rounded-md ${config.text} font-bold shadow-2xs` : ''
        } ${className}`}
        title="Non-Vegetarian Product"
      >
        <span
          className={`inline-flex items-center justify-center bg-white border-red-700 rounded-xs shrink-0 shadow-2xs ${config.box}`}
          aria-label="Non-Vegetarian"
        >
          <span className={`bg-red-700 rounded-full shrink-0 ${config.dot}`} />
        </span>
        {showLabel && <span>Non-Veg</span>}
      </div>
    );
  }

  if (isEgg) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 ${
          showLabel ? `bg-amber-50 text-amber-800 border border-amber-200/80 rounded-md ${config.text} font-bold shadow-2xs` : ''
        } ${className}`}
        title="Contains Egg"
      >
        <span
          className={`inline-flex items-center justify-center bg-white border-amber-600 rounded-xs shrink-0 shadow-2xs ${config.box}`}
          aria-label="Contains Egg"
        >
          <span className={`bg-amber-500 rounded-full shrink-0 ${config.dot}`} />
        </span>
        {showLabel && <span>Contains Egg</span>}
      </div>
    );
  }

  // Pure Vegetarian
  return (
    <div
      className={`inline-flex items-center gap-1.5 ${
        showLabel ? `bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-md ${config.text} font-bold shadow-2xs` : ''
      } ${className}`}
      title="100% Vegetarian Product"
    >
      <span
        className={`inline-flex items-center justify-center bg-white border-emerald-600 rounded-xs shrink-0 shadow-2xs ${config.box}`}
        aria-label="100% Vegetarian"
      >
        <span className={`bg-emerald-600 rounded-full shrink-0 ${config.dot}`} />
      </span>
      {showLabel && <span>100% Pure Veg</span>}
    </div>
  );
}
