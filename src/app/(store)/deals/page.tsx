import React from "react";
import { Metadata } from "next";
import { Sparkles, Percent, Tag, ShieldCheck, Truck } from "lucide-react";
import { getDealsProducts, getStoreSettings } from "@/services/store-service";
import { DealsCatalogClient } from "@/components/deals/DealsCatalogClient";

export const metadata: Metadata = {
  title: "Special Deals & Discounts — Bajaj karyana Store",
  description:
    "Exclusive discounts on grocery staples, dry fruits, sweets, and daily essentials in Firozpur. Save up to 45% with doorstep delivery.",
};

export default async function DealsPage() {
  const [deals, settings] = await Promise.all([
    getDealsProducts(),
    getStoreSettings(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#590d22] via-[#800f2f] to-[#a4133c] text-white p-6 sm:p-10 shadow-lg">
        {/* Background glow & accents */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-pink-200 text-xs font-semibold border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Exclusive Savings & Offers</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif tracking-tight leading-tight">
            Special Deals & Discounts
          </h1>

          <p className="text-sm sm:text-base text-rose-100/90 leading-relaxed">
            Stock up on your monthly kiryana rations, festive dry fruits, and
            confectionery with verified market discounts. Enjoy doorstep
            delivery across {settings.city || "Firozpur"}.
          </p>

          {/* Quick Highlight Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-medium text-pink-100">
            <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/10">
              <Percent className="w-3.5 h-3.5 text-pink-300" />
              <span>Discounts up to 42% OFF</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/10">
              <Tag className="w-3.5 h-3.5 text-pink-300" />
              <span>4 Tier Categories</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/10">
              <Truck className="w-3.5 h-3.5 text-pink-300" />
              <span>Doorstep Delivery in {settings.city || "Firozpur"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Deals Catalog */}
      <DealsCatalogClient deals={deals} />
    </div>
  );
}
