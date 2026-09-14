import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts } from '@/services/store-service';
import { formatCurrency, formatUnit } from '@/lib/utils';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ArrowLeft, CheckCircle2, Info, Package, Truck, ShieldCheck } from 'lucide-react';
import { ProductDetailClient } from './ProductDetailClient';

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Product Not Found — Bajaj Karyan Store' };
  }

  return {
    title: `${product.name} — Bajaj Karyan Store`,
    description: product.description || `Order ${product.name} at Bajaj Karyan Store Amritsar.`,
    openGraph: {
      title: `${product.name} | Bajaj Karyan Store`,
      description: product.description || `Order ${product.name} from Bajaj Karyan Store.`,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getProducts({
    categorySlug: product.category?.slug,
    limit: 4,
  });

  const filteredRelated = relatedProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
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
        <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-xs">
        {/* Product Image */}
        <div className="flex flex-col items-center">
          <div className="w-full aspect-square rounded-2xl overflow-hidden bg-rose-50 border border-rose-100 flex items-center justify-center relative">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="w-20 h-20 text-rose-300" />
            )}

            {product.is_featured && (
              <span className="absolute top-4 left-4 bg-[#800f2f] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Product Information & Interaction */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            {product.category && (
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#800f2f] bg-rose-50 px-2.5 py-1 rounded-md">
                {product.category.name}
              </span>
            )}

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#590d22] font-serif tracking-tight">
              {product.name}
            </h1>

            {product.sku && (
              <p className="text-xs text-gray-400 font-mono">SKU: {product.sku}</p>
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
                    Market prices for this item are confirmed by Bajaj Karyan Store prior to order preparation. You can add it to your shopping list right now.
                  </p>
                </div>
              )}
            </div>

            <div className="text-sm text-gray-600 leading-relaxed pt-2">
              <p>{product.description || 'Premium quality kiryana essential, stocked fresh for you.'}</p>
            </div>
          </div>

          {/* Interactive Client Component for Qty & Add to List */}
          <ProductDetailClient product={product} />

          {/* Assurance bullets */}
          <div className="pt-4 border-t border-rose-100 grid grid-cols-2 gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#800f2f]" />
              <span>Doorstep Delivery in Amritsar</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#800f2f]" />
              <span>Fresh & Hygienically Handled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {filteredRelated.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-serif">
            Similar Items You May Like
          </h2>
          <ProductGrid products={filteredRelated} />
        </div>
      )}
    </div>
  );
}
