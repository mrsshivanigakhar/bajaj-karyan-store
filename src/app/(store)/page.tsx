import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, CheckCircle, Clock, ShieldCheck, HeartHandshake, Sparkles, Store } from 'lucide-react';
import { getCategories, getProducts, getStoreSettings } from '@/services/store-service';
import { ProductGrid } from '@/components/products/ProductGrid';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';

export default async function HomePage() {
  const [categories, featuredProducts, storeSettings] = await Promise.all([
    getCategories(),
    getProducts({ featuredOnly: true, limit: 8 }),
    getStoreSettings(),
  ]);

  return (
    <div className="flex flex-col gap-12 sm:gap-16 pb-12">
      {/* Animated Hero Banner Carousel */}
      <HeroCarousel storeName={storeSettings.store_name || undefined} city={storeSettings.city || undefined} />

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <span className="text-xs font-bold text-[#a4133c] uppercase tracking-wider">
              Browse Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/categories"
            className="text-sm font-semibold text-[#800f2f] hover:text-[#c9184a] inline-flex items-center gap-1 transition"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-white border border-rose-100 shadow-xs hover:shadow-md transition-all duration-300"
            >
              <div className="aspect-4/3 w-full overflow-hidden bg-rose-50">
                {category.image_url ? (
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-rose-300">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                )}
              </div>
              <div className="p-3.5 text-center">
                <h3 className="font-semibold text-gray-900 group-hover:text-[#800f2f] transition text-sm sm:text-base">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                  {category.description || 'Explore products'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <span className="text-xs font-bold text-[#a4133c] uppercase tracking-wider">
              Popular & Trending
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">
              Featured Items
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-sm font-semibold text-[#800f2f] hover:text-[#c9184a] inline-flex items-center gap-1 transition"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} />
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
        <div className="rounded-3xl bg-rose-50/70 border border-rose-100 p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#a4133c] uppercase tracking-wider">
              Simple & Straightforward
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif mt-1">
              How Ordering Works
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              No complicated online payment gateway. Place your request, and our store team handles the rest.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white shadow-xs border border-rose-100">
              <div className="w-12 h-12 rounded-full bg-[#590d22] text-white flex items-center justify-center font-bold text-lg mb-3">
                1
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Browse Catalog</h3>
              <p className="text-xs text-gray-500">
                Explore sweets, biscuits, bakery, and grocery staples with flexible selling units.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white shadow-xs border border-rose-100">
              <div className="w-12 h-12 rounded-full bg-[#800f2f] text-white flex items-center justify-center font-bold text-lg mb-3">
                2
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Create Your List</h3>
              <p className="text-xs text-gray-500">
                Specify exact weights (e.g. 500g, 2kg) or packet counts and add special notes.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white shadow-xs border border-rose-100">
              <div className="w-12 h-12 rounded-full bg-[#a4133c] text-white flex items-center justify-center font-bold text-lg mb-3">
                3
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Place Your Order</h3>
              <p className="text-xs text-gray-500">
                Submit delivery address and phone number with zero upfront online payment required.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white shadow-xs border border-rose-100">
              <div className="w-12 h-12 rounded-full bg-[#c9184a] text-white flex items-center justify-center font-bold text-lg mb-3">
                4
              </div>
              <h3 className="font-bold text-gray-900 mb-1">We Confirm & Deliver</h3>
              <p className="text-xs text-gray-500">
                Store confirms market prices, packs your items, and delivers to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-[#a4133c] uppercase tracking-wider">
              Local Heritage & Trust
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">
              Why {storeSettings.city || 'Firozpur'} Prefers {storeSettings.store_name || 'Bajaj Karyan Store'}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              For over two decades, {storeSettings.store_name || 'Bajaj Karyan Store'} has served {storeSettings.city || 'Firozpur'} households with highest quality groceries, festive confectionery, and personalized neighborhood care.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#800f2f] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Custom Weights & Packaging</h4>
                  <p className="text-xs text-gray-500">Need 250 grams or 5 kg? We pack exactly what you require.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#800f2f] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Transparent Pricing</h4>
                  <p className="text-xs text-gray-500">Market-rate items confirmed before delivery, with printed invoice receipts.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#800f2f] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Pay After Verification</h4>
                  <p className="text-xs text-gray-500">Inspect your goods at delivery and pay via cash or UPI.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-4/3 border-2 border-rose-100">
            <img
              src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80"
              alt="Store Interior"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <TestimonialsSection />
    </div>
  );
}
