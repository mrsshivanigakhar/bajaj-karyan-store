import type { Metadata } from "next";
import "./globals.css";
import { ShoppingListProvider } from "@/context/shopping-list-context";
import { FavoritesProvider } from "@/context/favorites-context";
import { StoreSettingsProvider } from "@/context/store-settings-context";
import { ShoppingListDrawer } from "@/components/cart/ShoppingListDrawer";
import { ShoppingListNotification } from "@/components/cart/ShoppingListNotification";
import { AnimatedKaryanaBackground } from "@/components/layout/AnimatedKaryanaBackground";
import { StoreJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
import { getStoreSettings } from "@/services/store-service";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();
  const storeName = settings.store_name || "Bajaj karyana Store";
  const city = settings.city || "Firozpur";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bajajkaryan.com";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${storeName} — Confectionery & Grocery Delivery in ${city}`,
      template: `%s — ${storeName}`,
    },
    description: `Order fresh groceries, pure desi ghee, pulses, spices, dry fruits, and confectionery essentials online from ${storeName}. Doorstep delivery across a 20 km radius of ${city}, Punjab.`,
    keywords: [
      storeName,
      `${city} grocery store`,
      `online grocery ${city}`,
      `confectionery ${city}`,
      "kiryana store delivery",
      "dry fruits",
      "pure desi ghee",
      "bakery biscuits",
      "daily essentials delivery",
    ],
    authors: [{ name: storeName }],
    creator: storeName,
    publisher: storeName,
    formatDetection: {
      telephone: true,
      email: true,
      address: true,
    },
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: `${storeName} — Quality Confectionery & Daily Essentials in ${city}`,
      description:
        settings.footer_text ||
        `Browse our catalog, create your shopping list, and enjoy convenient doorstep delivery across ${city} (20km radius).`,
      url: "/",
      siteName: storeName,
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: "/images/categories/staples-grocery.jpg",
          width: 1200,
          height: 630,
          alt: `${storeName} — ${city}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${storeName} — Confectionery & Grocery Delivery in ${city}`,
      description: `Fast doorstep delivery of daily groceries, confectionery, and staples within a 20 km radius of ${city}.`,
      images: ["/images/categories/staples-grocery.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getStoreSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bajajkaryan.com";

  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <StoreJsonLd
          storeName={settings.store_name}
          city={settings.city}
          address={settings.address}
          state={settings.state}
          pincode={settings.pincode}
          phone={settings.phone}
          email={settings.email}
          openingHours={settings.opening_hours || undefined}
          url={siteUrl}
        />
        <WebSiteJsonLd url={siteUrl} name={settings.store_name} />
      </head>
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
