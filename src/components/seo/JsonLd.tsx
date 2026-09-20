import React from "react";

interface StoreJsonLdProps {
  storeName?: string | null;
  city?: string | null;
  address?: string | null;
  state?: string | null;
  pincode?: string | null;
  phone?: string | null;
  email?: string | null;
  openingHours?: string | null;
  url?: string;
}

export function StoreJsonLd(props: StoreJsonLdProps) {
  const storeName = props.storeName || "Bajaj karyana Store";
  const city = props.city || "Firozpur";
  const address = props.address || "Shop No. 14, Main Market, Near Clock Tower";
  const state = props.state || "Punjab";
  const pincode = props.pincode || "152002";
  const phone = props.phone || "+91 98765 43210";
  const email = props.email || "contact@bajajkaryan.com";
  const url = props.url || "https://bajajkaryan.com";
  const schema = {
    "@context": "https://schema.org",
    "@type": ["GroceryStore", "LocalBusiness"],
    "@id": `${url}/#store`,
    name: storeName,
    description: `Premier confectionery, kiryana, and daily grocery store in ${city}, Punjab. Offering fresh staples, spices, dry fruits, and household essentials with doorstep delivery across a 20 km radius.`,
    url: url,
    telephone: phone,
    email: email,
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, UPI, Offline Payment on Delivery",
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressLocality: city,
      addressRegion: state,
      postalCode: pincode,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 30.9237,
      longitude: 74.6133,
    },
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 30.9237,
        longitude: 74.6133,
      },
      geoRadius: 20000, // 20 km radius
      description:
        "Firozpur city and surrounding localities within a 20km radius",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "08:00",
        closes: "21:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday"],
        opens: "09:00",
        closes: "19:00",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Karyana & Confectionery Essentials",
      itemListElement: [
        { "@type": "OfferCatalog", name: "Staples & Grains" },
        { "@type": "OfferCatalog", name: "Dals & Pulses" },
        { "@type": "OfferCatalog", name: "Cooking Oils & Pure Desi Ghee" },
        { "@type": "OfferCatalog", name: "Spices & Masalas" },
        { "@type": "OfferCatalog", name: "Biscuits, Cookies & Bakery" },
        { "@type": "OfferCatalog", name: "Dry Fruits & Nuts" },
        { "@type": "OfferCatalog", name: "Beverages & Soft Drinks" },
        { "@type": "OfferCatalog", name: "Personal Care & Household Cleaning" },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteJsonLd({
  url = "https://bajajkaryan.com",
  name,
}: {
  url?: string;
  name?: string | null;
}) {
  const websiteName = name || "Bajaj karyana Store";
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    url: url,
    name: websiteName,
    description:
      "Online catalog and shopping list for Bajaj karyana Store — local grocery delivery in Firozpur (20km radius).",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/shop?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "en-IN",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ProductJsonLdProps {
  name: string;
  description?: string | null;
  image?: string | null;
  price?: number | null;
  salePrice?: number | null;
  sku?: string | null;
  category?: string | null;
  inStock?: boolean;
  url: string;
}

export function ProductJsonLd({
  name,
  description,
  image,
  price,
  salePrice,
  sku,
  category,
  inStock = true,
  url,
}: ProductJsonLdProps) {
  const effectivePrice =
    salePrice !== null && salePrice !== undefined ? salePrice : price;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: name,
    image: image ? [image] : [],
    description:
      description ||
      `${name} available at Bajaj karyana Store with local delivery across Firozpur (within 20km).`,
    sku: sku || undefined,
    category: category || undefined,
    brand: {
      "@type": "Brand",
      name: "Bajaj karyana Store",
    },
    offers: {
      "@type": "Offer",
      url: url,
      priceCurrency: "INR",
      price:
        effectivePrice !== null && effectivePrice !== undefined
          ? effectivePrice
          : undefined,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      priceValidUntil: "2027-12-31",
      seller: {
        "@type": "GroceryStore",
        name: "Bajaj karyana Store",
      },
      areaServed: {
        "@type": "AdministrativeArea",
        name: "Firozpur (20km Radius)",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
