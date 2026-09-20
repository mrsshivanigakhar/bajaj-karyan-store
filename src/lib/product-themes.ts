export interface ProductTheme {
  border: string;
  imageBg: string;
  badge: string;
  categoryTag: string;
  price: string;
  button: string;
  stepper: string;
  accentHover: string;
}

export const PRODUCT_THEMES: ProductTheme[] = [
  // Theme 0: Bordeaux & Rose (Brand Signature)
  {
    border: 'border-rose-100 hover:border-rose-300',
    imageBg: 'bg-rose-50/50',
    badge: 'bg-[#800f2f] text-white',
    categoryTag: 'bg-rose-50 text-[#800f2f] border-rose-100/80',
    price: 'text-[#800f2f]',
    button: 'bg-[#800f2f] hover:bg-[#590d22] text-white',
    stepper: 'bg-rose-50/60 border-rose-200 text-gray-800',
    accentHover: 'group-hover:text-[#800f2f]',
  },
  // Theme 1: Warm Amber & Saffron
  {
    border: 'border-amber-200/80 hover:border-amber-400',
    imageBg: 'bg-amber-50/50',
    badge: 'bg-amber-700 text-white',
    categoryTag: 'bg-amber-50 text-amber-800 border-amber-200/80',
    price: 'text-amber-800',
    button: 'bg-amber-700 hover:bg-amber-800 text-white',
    stepper: 'bg-amber-50/60 border-amber-200 text-gray-800',
    accentHover: 'group-hover:text-amber-800',
  },
  // Theme 2: Pistachio & Emerald Sage
  {
    border: 'border-emerald-200/80 hover:border-emerald-400',
    imageBg: 'bg-emerald-50/50',
    badge: 'bg-emerald-700 text-white',
    categoryTag: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    price: 'text-emerald-800',
    button: 'bg-emerald-700 hover:bg-emerald-800 text-white',
    stepper: 'bg-emerald-50/60 border-emerald-200 text-gray-800',
    accentHover: 'group-hover:text-emerald-800',
  },
  // Theme 3: Royal Plum & Festive Berry
  {
    border: 'border-pink-200/80 hover:border-pink-400',
    imageBg: 'bg-pink-50/50',
    badge: 'bg-[#a4133c] text-white',
    categoryTag: 'bg-pink-50 text-[#a4133c] border-pink-200/80',
    price: 'text-[#a4133c]',
    button: 'bg-[#a4133c] hover:bg-[#800f2f] text-white',
    stepper: 'bg-pink-50/60 border-pink-200 text-gray-800',
    accentHover: 'group-hover:text-[#a4133c]',
  },
];

export function getProductTheme(index?: number): ProductTheme {
  if (typeof index !== 'number') return PRODUCT_THEMES[0];
  const idx = Math.abs(index) % PRODUCT_THEMES.length;
  return PRODUCT_THEMES[idx];
}
