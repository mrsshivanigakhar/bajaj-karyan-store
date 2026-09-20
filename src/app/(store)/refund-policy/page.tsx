import React from 'react';
import Link from 'next/link';
import { RotateCcw, CheckCircle2, AlertCircle, HelpCircle, Phone, PackageCheck } from 'lucide-react';
import { getStoreSettings } from '@/services/store-service';

export const metadata = {
  title: 'Refund & Return Policy — Bajaj Karyan Store',
  description: 'Understand the return, refund, and doorstep verification policy of Bajaj Karyan Store Firozpur.',
};

export default async function RefundPolicyPage() {
  const settings = await getStoreSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-rose-100 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-[#800f2f] text-xs font-semibold">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Customer Satisfaction First</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-serif tracking-tight">
          Refund & Return Policy
        </h1>
        <p className="text-xs text-gray-500">
          Last updated: September 2026 • {settings.store_name || 'Bajaj Karyan Store'}, {settings.city || 'Firozpur'}
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-rose max-w-none text-gray-700 space-y-6 text-sm sm:text-base leading-relaxed">
        {/* Doorstep Verification Guarantee */}
        <section className="p-6 rounded-3xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-emerald-900 text-lg">
            <PackageCheck className="w-6 h-6 text-emerald-600" />
            <span>Our 100% Doorstep Verification Guarantee</span>
          </div>
          <p className="text-sm text-emerald-900/90 leading-relaxed">
            At {settings.store_name || 'Bajaj Karyan Store'}, we believe in complete transparency. When our delivery partner arrives, you are warmly invited to inspect every package, packet, and weighed item before paying. If any item is not up to your expectation, simply hand it back on the spot with zero questions asked!
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 font-serif">
            <CheckCircle2 className="w-5 h-5 text-[#800f2f]" />
            1. Return Window for Packaged Goods
          </h2>
          <p>
            For sealed manufacturer-packaged goods (such as biscuits, bottled oils, confectionery, detergents, and personal care products):
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-600">
            <li>You may request a return or replacement within <strong>48 hours</strong> of delivery.</li>
            <li>The item must be unused, unopened, and in its original manufacturer packaging with seals intact.</li>
            <li>The original store invoice receipt must be presented.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 font-serif">
            <AlertCircle className="w-5 h-5 text-[#800f2f]" />
            2. Custom-Weighed Staples & Perishables
          </h2>
          <p>
            For customized weight items (such as loose dals, whole spices, dry fruits, sugar, or fresh bakery/dairy items packed specifically to your requested quantity):
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-600">
            <li>These items should be inspected at the time of delivery verification.</li>
            <li>If you discover any quality defect or weight discrepancy post-delivery, please notify us within <strong>24 hours</strong> so our store team can arrange an immediate replacement or refund.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 font-serif">
            <RotateCcw className="w-5 h-5 text-[#800f2f]" />
            3. How Refunds Are Processed
          </h2>
          <p>
            Since all orders operate under offline payment:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-600">
            <li>
              <strong>Doorstep Rejection:</strong> Your bill total is instantly adjusted before you make payment. You only pay for what you accept.
            </li>
            <li>
              <strong>Post-Delivery Return:</strong> If a return is accepted after payment, our delivery executive will collect the item and provide a spot refund in <strong>Cash</strong> or via instant <strong>UPI transfer</strong> to your mobile number.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 font-serif">
            <Phone className="w-5 h-5 text-[#800f2f]" />
            4. How to Request a Return
          </h2>
          <p>
            To initiate a return or replacement, simply reach out to our store team with your Order Number:
          </p>
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-sm space-y-1">
            <p className="font-semibold text-gray-900">{settings.store_name || 'Bajaj Karyan Store'}</p>
            {settings.phone && <p className="text-gray-600">Call / WhatsApp: {settings.phone}</p>}
            {settings.email && <p className="text-gray-600">Email: {settings.email}</p>}
            <p className="text-xs text-gray-500 mt-2">
              Store Timings: {settings.opening_hours || 'Mon - Sat: 8:00 AM - 9:30 PM'}
            </p>
          </div>
        </section>
      </div>

      <div className="pt-6 border-t border-rose-100 flex justify-between items-center text-xs text-gray-500">
        <Link href="/" className="text-[#800f2f] hover:underline font-semibold">
          ← Return to Home
        </Link>
        <Link href="/price-change-policy" className="text-[#800f2f] hover:underline font-semibold">
          Read Price Change Policy →
        </Link>
      </div>
    </div>
  );
}
