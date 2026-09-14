import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, CheckCircle, Clock, ShieldCheck, HeartHandshake, Sparkles, Store } from 'lucide-react';
import { getCategories, getProducts, getStoreSettings } from '@/services/store-service';
import { ProductGrid } from '@/components/products/ProductGrid';

export default async function HomePage() {
  const [categories, featuredProducts, storeSettings] = await Promise.all([
    getCategories(),
    getProducts({ featuredOnly: true, limit: 8 }),
    getStoreSettings(),
  ]);

  return (
    <div className="flex flex-col gap-12 sm:gap-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-bordeaux text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        {/* Decorative circle accents */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-900/60 border border-pink-400/30 text-xs sm:text-sm font-medium text-pink-200">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>{storeSettings.store_name} — Amritsar</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-serif tracking-tight leading-tight sm:leading-tight">
              Everything You Need, <br className="hidden sm:inline" />
              <span className="text-pink-300">From Our Store to Your Door.</span>
            </h1>

            <p className="text-base sm:text-lg text-rose-100/90 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Browse our confectionery and grocery collection, build your custom shopping list with piece, packet, or weight-based items, and place your order effortlessly with offline payment.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#ff4d6d] hover:bg-[#ff758f] text-white px-7 py-3.5 rounded-full font-semibold shadow-lg hover:shadow-pink-500/25 transition transform hover:-translate-y-0.5"
              >
                <span>Shop All Items</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/categories"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-rose-900/60 hover:bg-rose-900 text-rose-100 px-6 py-3.5 rounded-full font-semibold border border-rose-700/80 transition"
              >
                <Store className="w-4 h-4 text-pink-300" />
                <span>Explore Categories</span>
              </Link>
            </div>

            {/* Quick highlight bar */}
            <div className="pt-6 border-t border-rose-800/40 grid grid-cols-3 gap-2 sm:gap-4 text-center">
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-white">500+</span>
                <span className="text-[11px] sm:text-xs text-rose-200">Fresh Products</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-white">₹0 Online Fee</span>
                <span className="text-[11px] sm:text-xs text-rose-200">Pay on Delivery</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-white">100%</span>
                <span className="text-[11px] sm:text-xs text-rose-200">Quality Assured</span>
              </div>
            </div>
          </div>

          {/* Hero visual showcase */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-rose-800/40 aspect-4/3">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                alt="Bajaj Karyan Store Grocery Showcase"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#590d22]/80 via-transparent to-transparent flex items-end p-6">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 text-[#590d22] shadow-lg w-full flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Featured Today
                    </p>
                    <p className="font-bold text-sm sm:text-base text-gray-900">
                      Handpicked Dry Fruits & Premium Biscuits
                    </p>
                  </div>
                  <span className="bg-[#800f2f] text-white text-xs px-3 py-1.5 rounded-full font-medium">
                    In Stock
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
              Why Amritsar Prefers Bajaj Karyan Store
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              For over two decades, Bajaj Karyan Store has served Amritsar households with highest quality groceries, festive confectionery, and personalized neighborhood care.
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
    </div>
  );
}
