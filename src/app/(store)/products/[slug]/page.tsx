import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/services/store-service";
import { formatCurrency, formatUnit } from "@/lib/utils";
import { RelatedProductsCarousel } from "@/components/products/RelatedProductsCarousel";
import {
  ArrowLeft,
  CheckCircle2,
  Info,
  Package,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { ProductDetailClient } from "./ProductDetailClient";
import { ProductDetailImage } from "@/components/products/ProductDetailImage";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { DietaryBadge } from "@/components/products/DietaryBadge";

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bajajkaryan.com";

  if (!product) {
    return { title: "Product Not Found — Bajaj karyana Store" };
  }

  const effectivePrice =
    product.sale_price !== null && product.sale_price !== undefined
      ? product.sale_price
      : product.price;
  const description =
    product.description ||
    `Order ${product.name} online from Bajaj karyana Store. Doorstep delivery across a 20km radius of Firozpur, Punjab.`;
  const productUrl = `${siteUrl}/products/${product.slug}`;
  const imageUrl =
    product.image_url || `${siteUrl}/images/categories/staples-grocery.jpg`;

  return {
    title: `${product.name} — Order Online in Firozpur`,
    description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${product.name} | Bajaj karyana Store Firozpur`,
      description,
      url: productUrl,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — Bajaj karyana Store Firozpur`,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bajajkaryan.com";

  if (!product) {
    notFound();
  }

  const breadcrumbs = [
    { name: "Home", url: siteUrl },
    { name: "Shop All", url: `${siteUrl}/shop` },
    ...(product.category
      ? [
          {
            name: product.category.name,
            url: `${siteUrl}/shop?category=${product.category.slug}`,
          },
        ]
      : []),
    { name: product.name, url: `${siteUrl}/products/${product.slug}` },
  ];

  const relatedProducts = await getRelatedProducts(
    product.id,
    product.category?.slug,
    24,
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <ProductJsonLd
        name={product.name}
        description={product.description}
        image={product.image_url}
        price={product.price}
        salePrice={product.sale_price}
        sku={product.sku}
        category={product.category?.name}
        inStock={product.stock_quantity > 0}
        url={`${siteUrl}/products/${product.slug}`}
      />
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-[#800f2f]">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#800f2f]">
          Shop
        </Link>
        {product.category && (
          <>
            <span>/</span>
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="hover:text-[#800f2f]"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-xs">
        {/* Product Image */}
        <div className="flex flex-col items-center">
          <ProductDetailImage
            imageUrl={product.image_url}
            name={product.name}
            isFeatured={product.is_featured}
          />
        </div>

        {/* Product Information & Interaction */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              {product.category && (
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#800f2f] bg-rose-50 px-2.5 py-1 rounded-md">
                  {product.category.name}
                </span>
              )}
              <DietaryBadge
                dietaryType={product.dietary_preference}
                size="sm"
                showLabel={true}
              />
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#590d22] font-serif tracking-tight">
              {product.name}
            </h1>

            {product.sku && (
              <p className="text-xs text-gray-400 font-mono">
                SKU: {product.sku}
              </p>
            )}

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100/80">
              {product.price !== null ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-[#590d22]">
                    {formatCurrency(product.sale_price || product.price)}
                  </span>
                  {product.sale_price && (
                    <span className="text-base text-gray-400 line-through">
                      {formatCurrency(product.price)}
                    </span>
                  )}
                  <span className="text-sm font-medium text-gray-600">
                    / {formatUnit(product.unit_type, product.unit_value)}
                  </span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[#800f2f]">
                    <Info className="w-4 h-4 text-pink-600" />
                    <span className="text-lg font-bold">Price on Request</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Market prices for this item are confirmed by Bajaj karyana
                    Store prior to order preparation. You can add it to your
                    shopping list right now.
                  </p>
                </div>
              )}
            </div>

            <div className="text-sm text-gray-600 leading-relaxed pt-2">
              <p>
                {product.description ||
                  "Premium quality kiryana essential, stocked fresh for you."}
              </p>
            </div>
          </div>

          {/* Interactive Client Component for Qty & Add to List */}
          <ProductDetailClient product={product} />

          {/* Assurance bullets */}
          <div className="pt-4 border-t border-rose-100 grid grid-cols-2 gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#800f2f]" />
              <span>Doorstep Delivery in Firozpur</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#800f2f]" />
              <span>Fresh & Hygienically Handled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Horizontal Carousel (6 visible on desktop) */}
      <RelatedProductsCarousel
        products={relatedProducts}
        title="Related Products You May Like"
        subtitle={`Discover more ${product.category?.name || "store"} essentials and popular picks.`}
      />
    </div>
  );
}
