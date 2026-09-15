import type { Metadata } from 'next';
import './globals.css';
import { ShoppingListProvider } from '@/context/shopping-list-context';
import { ShoppingListDrawer } from '@/components/cart/ShoppingListDrawer';
import { ShoppingListNotification } from '@/components/cart/ShoppingListNotification';

export const metadata: Metadata = {
  title: 'Bajaj Karyan Store — Confectionery & Grocery Ordering',
  description:
    'Order premium confectionery, biscuits, bakery, dry fruits, and everyday grocery essentials from Bajaj Karyan Store. Fast local delivery across Amritsar.',
  keywords: [
    'Bajaj Karyan Store',
    'Amritsar grocery',
    'confectionery Amritsar',
    'kiryana store',
    'dry fruits',
    'bakery biscuits',
  ],
  openGraph: {
    title: 'Bajaj Karyan Store — Quality Confectionery & Daily Essentials',
    description: 'Browse our catalog, create your shopping list, and order with easy offline payment.',
    siteName: 'Bajaj Karyan Store',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#fdfafb] text-[#220911]">
        <ShoppingListProvider>
          {children}
          <ShoppingListDrawer />
          <ShoppingListNotification />
        </ShoppingListProvider>
      </body>
    </html>
  );
}
