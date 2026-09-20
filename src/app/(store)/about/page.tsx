import React from "react";
import Link from "next/link";
import {
  Store,
  ShieldCheck,
  HeartHandshake,
  Truck,
  Award,
  Users,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { getStoreSettings } from "@/services/store-service";

export const metadata = {
  title: "About Us — Bajaj karyana Store Firozpur",
  description:
    "Learn about Bajaj karyana Store, our 25+ years of heritage in Firozpur, our commitment to pure groceries, and doorstep delivery.",
};

export default async function AboutPage() {
  const storeSettings = await getStoreSettings();

  return (
    <div className="flex flex-col gap-12 sm:gap-16 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-bordeaux text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-900/70 border border-pink-400/30 text-xs sm:text-sm font-medium text-pink-200">
            <Store className="w-4 h-4 text-pink-300" />
            <span>Serving {storeSettings.city || "Firozpur"} Since 1987</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif tracking-tight leading-tight">
            Our Heritage of Quality, <br />
            <span className="text-pink-300">Trust & Community Care</span>
          </h1>

          <p className="text-sm sm:text-base text-rose-100/90 max-w-2xl mx-auto font-normal leading-relaxed">
            For over two decades,{" "}
            {storeSettings.store_name || "Bajaj karyana Store"} has been a
            beloved neighborhood landmark in {storeSettings.city || "Firozpur"},
            delivering pure staples, authentic spices, and celebratory
            confectionery.
          </p>
        </div>
      </section>

      {/* Our Story & Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-bold text-[#a4133c] uppercase tracking-wider">
              A Family Tradition
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">
              Bringing Pure Kitchen Essentials Directly To Your Home
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              What started as a humble neighborhood kiryana shop in Firozpur has
              grown into a trusted household name across the city. Through every
              generation, our guiding principle has remained steadfast: never
              compromise on purity, freshness, and honest weights.
            </p>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Unlike impersonal mega-warehouses, we know our patrons by name,
              understand specific preferences for daily staples (whether you
              prefer fine-milled wheat flour, aged Basmati rice, or unpolished
              dals), and pack every single packet with personalized attention.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50/60 border border-rose-100">
                <ShieldCheck className="w-6 h-6 text-[#800f2f] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-gray-900">
                    Uncompromised Purity
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    100% genuine brands, clean grains, and fresh confectionery
                    batches.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50/60 border border-rose-100">
                <HeartHandshake className="w-6 h-6 text-[#800f2f] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-gray-900">
                    Neighborhood Trust
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    No hidden charges, fair market rates, and zero online
                    payment risks.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-rose-100 aspect-4/3">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                alt="Bajaj karyana Store Firozpur"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Excellence */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-rose-50/60 rounded-3xl p-8 sm:p-12 border border-rose-100">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#a4133c] uppercase tracking-wider">
              Why Firozpur Chooses Us
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif mt-1">
              The Four Pillars of Bajaj karyana Store
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-xs text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#590d22] text-white flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Flexible Weights</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Whether you need 250 grams of cardamom or 10 kg of wheat flour,
                we weigh and pack to your exact requirement.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-xs text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#800f2f] text-white flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h3 className="font-bold text-gray-900 mb-2">
                Mandi-Transparent Rates
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                We pass on daily wholesale market benefits directly to our
                customers with printed bills on every delivery.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-xs text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#a4133c] text-white flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h3 className="font-bold text-gray-900 mb-2">
                Doorstep Verification
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Inspect your items before paying. If anything doesn&apos;t meet
                your standards, return it right at your door.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-xs text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#c9184a] text-white flex items-center justify-center font-bold text-lg mb-4">
                4
              </div>
              <h3 className="font-bold text-gray-900 mb-2">
                Offline Convenience
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Pay via cash or UPI only upon receipt. No credit cards, OTP
                hassles, or failed online transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        <div className="bg-gradient-bordeaux text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-bold font-serif">
              Ready to Experience Authentic Grocery Shopping?
            </h2>
            <p className="text-rose-100 text-sm sm:text-base leading-relaxed">
              Explore our catalog of 1,100+ items, build your custom list in
              minutes, and let us bring the store to your doorstep.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 bg-[#ff4d6d] hover:bg-[#ff758f] text-white px-8 py-3.5 rounded-full font-semibold shadow-lg transition"
              >
                <span>Browse Full Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-rose-900/60 hover:bg-rose-900 text-rose-100 px-6 py-3.5 rounded-full font-semibold border border-rose-700/80 transition"
              >
                <span>Visit Or Contact Us</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
