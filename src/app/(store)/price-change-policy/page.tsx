import React from "react";
import Link from "next/link";
import {
  Tag,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Phone,
  Receipt,
} from "lucide-react";
import { getStoreSettings } from "@/services/store-service";

export const metadata = {
  title: "Price Change & Market Rate Policy — Bajaj karyana Store",
  description:
    "Understand how market prices and wholesale commodity rates are handled transparently at Bajaj karyana Store Firozpur.",
};

export default async function PriceChangePolicyPage() {
  const settings = await getStoreSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-rose-100 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-[#800f2f] text-xs font-semibold">
          <Tag className="w-3.5 h-3.5" />
          <span>Fair & Transparent Pricing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-serif tracking-tight">
          Price Change & Market Rate Policy
        </h1>
        <p className="text-xs text-gray-500">
          Last updated: September 2026 •{" "}
          {settings.store_name || "Bajaj karyana Store"},{" "}
          {settings.city || "Firozpur"}
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-rose max-w-none text-gray-700 space-y-6 text-sm sm:text-base leading-relaxed">
        {/* Core Policy Highlight */}
        <section className="p-6 rounded-3xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-900 text-lg">
            <TrendingUp className="w-6 h-6 text-amber-700" />
            <span>Why Do Some Commodity Prices Change?</span>
          </div>
          <p className="text-sm text-amber-950/90 leading-relaxed">
            In traditional kiryana grocery retail, prices for primary
            agricultural commodities (such as pulses/dals, edible cooking oils,
            whole spices, dry fruits, sugar, and grains) fluctuate based on
            daily wholesale mandi auctions and agricultural market supplies. At{" "}
            {settings.store_name || "Bajaj karyana Store"}, we never
            artificially inflate commodity prices with fixed high markups.
            Instead, we pass wholesale price drops and current market rates
            directly to you!
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 font-serif">
            <Receipt className="w-5 h-5 text-[#800f2f]" />
            1. Packaged Goods vs. Market-Rate Staples
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-rose-100 shadow-xs">
              <h3 className="font-bold text-gray-900 text-sm mb-1">
                Packaged Branded Goods
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Items with fixed Maximum Retail Price (MRP) set by manufacturers
                (e.g. Britannia biscuits, Cadbury chocolates, Dettol soaps,
                shampoos) are sold at or below printed MRP. These prices do not
                fluctuate daily.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-rose-100 shadow-xs">
              <h3 className="font-bold text-gray-900 text-sm mb-1">
                Loose & Weighed Staples
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Items marked as <strong>&ldquo;Market Rate&rdquo;</strong> (e.g.
                loose dals, khada masala, loose sugar, ghee by weight) follow
                the current day&apos;s prevailing market price in Firozpur at
                the time of order packing.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 font-serif">
            <CheckCircle2 className="w-5 h-5 text-[#800f2f]" />
            2. Transparent Confirmation Before Dispatch
          </h2>
          <p>
            We respect your budget. Before any order containing market-rate
            commodities leaves our store:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-600">
            <li>
              Our store team calculates the exact final bill based on the
              weighed amount and current day&apos;s market price.
            </li>
            <li>
              If any commodity price differs significantly from the catalog
              estimate, our store will call or WhatsApp you for confirmation
              before finalizing the order.
            </li>
            <li>
              A printed itemized invoice receipt detailing the exact weight and
              unit rate is provided with every delivery.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 font-serif">
            <AlertCircle className="w-5 h-5 text-[#800f2f]" />
            3. Customer&apos;s Right to Adjust or Cancel
          </h2>
          <p>If a confirmed market price does not meet your approval:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-600">
            <li>You may reduce the requested quantity of that item.</li>
            <li>
              You may remove the item entirely from your order with zero
              cancellation fee.
            </li>
            <li>
              You may choose an alternative brand or variant recommended by our
              store team.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 font-serif">
            <Phone className="w-5 h-5 text-[#800f2f]" />
            4. Have Questions on Today&apos;s Market Rates?
          </h2>
          <p>
            Feel free to call our store counter directly to enquire about daily
            wholesale prices for dry fruits, ghee, oils, or pulses:
          </p>
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-sm space-y-1">
            <p className="font-semibold text-gray-900">
              {settings.store_name || "Bajaj karyana Store"}
            </p>
            {settings.phone && (
              <p className="text-gray-600">Call: {settings.phone}</p>
            )}
            {settings.email && (
              <p className="text-gray-600">Email: {settings.email}</p>
            )}
          </div>
        </section>
      </div>

      <div className="pt-6 border-t border-rose-100 flex justify-between items-center text-xs text-gray-500">
        <Link href="/" className="text-[#800f2f] hover:underline font-semibold">
          ← Return to Home
        </Link>
        <Link
          href="/contact"
          className="text-[#800f2f] hover:underline font-semibold"
        >
          Contact Store Team →
        </Link>
      </div>
    </div>
  );
}
