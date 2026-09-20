import type { Metadata } from 'next';
import './globals.css';
import { ShoppingListProvider } from '@/context/shopping-list-context';
import { FavoritesProvider } from '@/context/favorites-context';
import { StoreSettingsProvider } from '@/context/store-settings-context';
import { ShoppingListDrawer } from '@/components/cart/ShoppingListDrawer';
import { ShoppingListNotification } from '@/components/cart/ShoppingListNotification';
import { AnimatedKaryanaBackground } from '@/components/layout/AnimatedKaryanaBackground';
import { getStoreSettings } from '@/services/store-service';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();
  const storeName = settings.store_name || 'Bajaj Karyan Store';
  const city = settings.city || 'Firozpur';

  return {
    title: `${storeName} — Confectionery & Grocery Ordering`,
    description: `Order premium confectionery, biscuits, bakery, dry fruits, and everyday grocery essentials from ${storeName}. Fast local delivery across ${city}.`,
    keywords: [
      storeName,
      `${city} grocery`,
      `confectionery ${city}`,
      'kiryana store',
      'dry fruits',
      'bakery biscuits',
    ],
    openGraph: {
      title: `${storeName} — Quality Confectionery & Daily Essentials`,
      description:
        settings.footer_text ||
        'Browse our catalog, create your shopping list, and order with easy offline payment.',
      siteName: storeName,
      locale: 'en_IN',
      type: 'website',
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getStoreSettings();

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#fdfafb] text-[#220911]">
        <StoreSettingsProvider initialSettings={settings}>
          <ShoppingListProvider>
            <FavoritesProvider>
              <AnimatedKaryanaBackground />
              {children}
              <ShoppingListDrawer />
              <ShoppingListNotification />
            </FavoritesProvider>
          </ShoppingListProvider>
        </StoreSettingsProvider>
      </body>
    </html>
  );
}
