import React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ArrowRight,
  CheckCircle,
  Clock,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  Store,
} from "lucide-react";
import {
  getCategories,
  getProducts,
  getStoreSettings,
} from "@/services/store-service";
import { ProductGrid } from "@/components/products/ProductGrid";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CategorySection } from "@/components/home/CategorySection";

export default async function HomePage() {
  const [categories, featuredProducts, storeSettings] = await Promise.all([
    getCategories(),
    getProducts({ featuredOnly: true, limit: 8 }),
    getStoreSettings(),
  ]);

  return (
    <div className="flex flex-col gap-12 sm:gap-16 pb-12">
      {/* Animated Hero Banner Carousel */}
      <HeroCarousel
        storeName={storeSettings.store_name || undefined}
        city={storeSettings.city || undefined}
      />

      {/* Categories Section with 2-Style Switcher (Cards vs Compact Pills) */}
      <CategorySection categories={categories} />

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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6">
        <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-rose-100 p-8 sm:p-12 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#a4133c] uppercase tracking-wider">
              Simple & Straightforward
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif mt-1">
              How Ordering Works
            </h2>
            <p className="text-sm text-gray-700 mt-2">
              No complicated online payment gateway. Place your request, and our
              store team handles the rest.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1: Bordeaux & Rose */}
            <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-rose-50/50 shadow-xs border border-rose-200/80 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-[#800f2f] text-white flex items-center justify-center font-bold text-lg mb-3 shadow-xs">
                1
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Browse Catalog</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Explore sweets, biscuits, bakery, and grocery staples with
                flexible selling units.
              </p>
            </div>

            {/* Step 2: Warm Amber & Saffron */}
            <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-amber-50/50 shadow-xs border border-amber-200/80 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold text-lg mb-3 shadow-xs">
                2
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Create Your List</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Specify exact weights (e.g. 500g, 2kg) or packet counts and add
                special notes.
              </p>
            </div>

            {/* Step 3: Pistachio & Emerald */}
            <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-emerald-50/50 shadow-xs border border-emerald-200/80 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-lg mb-3 shadow-xs">
                3
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Place Your Order</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Submit delivery address and phone number with zero upfront
                online payment required.
              </p>
            </div>

            {/* Step 4: Royal Plum & Festive Berry */}
            <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-pink-50/50 shadow-xs border border-pink-200/80 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-[#a4133c] text-white flex items-center justify-center font-bold text-lg mb-3 shadow-xs">
                4
              </div>
              <h3 className="font-bold text-gray-900 mb-1">
                We Confirm & Deliver
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Store confirms market prices, packs your items, and delivers to
                your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6">
        <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-rose-100 p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#a4133c] uppercase tracking-wider">
                Local Heritage & Trust
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">
                Why {storeSettings.city || "Firozpur"} Prefers{" "}
                {storeSettings.store_name || "Bajaj karyana Store"}
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                For over two decades,{" "}
                {storeSettings.store_name || "Bajaj karyana Store"} has served{" "}
                {storeSettings.city || "Firozpur"} households with highest
                quality groceries, festive confectionery, and personalized
                neighborhood care.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#800f2f] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      Custom Weights & Packaging
                    </h4>
                    <p className="text-xs text-gray-600">
                      Need 250 grams or 5 kg? We pack exactly what you require.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      Transparent Pricing
                    </h4>
                    <p className="text-xs text-gray-600">
                      Market-rate items confirmed before delivery, with printed
                      invoice receipts.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      Pay After Verification
                    </h4>
                    <p className="text-xs text-gray-600">
                      Inspect your goods at delivery and pay via cash or UPI.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-md aspect-4/3 border-2 border-rose-100">
              <img
                src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80"
                alt="Store Interior"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <TestimonialsSection />
    </div>
  );
}
