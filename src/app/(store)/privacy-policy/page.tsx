import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, Database, Phone, Mail } from "lucide-react";
import { getStoreSettings } from "@/services/store-service";

export const metadata = {
  title: "Privacy Policy — Bajaj karyana Store",
  description:
    "Learn how Bajaj karyana Store protects your personal data and handles information with utmost care.",
};

export default async function PrivacyPolicyPage() {
  const settings = await getStoreSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-rose-100 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-[#800f2f] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Your Privacy Matters</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-serif tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-gray-500">
          Last updated: September 2026 •{" "}
          {settings.store_name || "Bajaj karyana Store"},{" "}
          {settings.city || "Firozpur"}
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-rose max-w-none text-gray-700 space-y-6 text-sm sm:text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 font-serif">
            <Lock className="w-5 h-5 text-[#800f2f]" />
            1. Overview & Our Commitment
          </h2>
          <p>
            At {settings.store_name || "Bajaj karyana Store"}, we value your
            trust and are committed to protecting your personal information.
            This Privacy Policy explains what details we collect when you browse
            our website, create a shopping list, or place an order for doorstep
            delivery in {settings.city || "Firozpur"}, and how that data is
            safeguarded.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 font-serif">
            <Database className="w-5 h-5 text-[#800f2f]" />
            2. Information We Collect
          </h2>
          <p>
            When you use our services, we may collect the following limited
            information:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-600">
            <li>
              <strong>Contact Details:</strong> Your name, mobile phone number,
              and email address (if provided) to confirm orders and notify you
              of delivery status.
            </li>
            <li>
              <strong>Delivery Address:</strong> Your house number, street
              address, locality, and landmark in {settings.city || "Firozpur"}{" "}
              strictly for delivering your groceries.
            </li>
            <li>
              <strong>Order Details:</strong> The list of items, custom weights
              (e.g. 500g, 2kg), and special notes you specify for the store
              team.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 font-serif">
            <ShieldCheck className="w-5 h-5 text-[#800f2f]" />
            3. Zero Financial Data Storage (Offline Payment)
          </h2>
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 text-sm space-y-1.5">
            <p className="font-semibold text-gray-900">
              We never collect or store your banking, debit card, or credit card
              information.
            </p>
            <p className="text-gray-600">
              All transactions at {settings.store_name || "Bajaj karyana Store"}{" "}
              operate via offline payment (Cash on Delivery or direct UPI scan
              upon doorstep delivery). Our website does not process, transmit,
              or store any sensitive financial credentials.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 font-serif">
            <Eye className="w-5 h-5 text-[#800f2f]" />
            4. Local Storage & Cookies
          </h2>
          <p>
            We use browser <code>localStorage</code> solely to preserve your
            active shopping list and saved favourite items so that you do not
            lose your selections when refreshing the page. We do not use
            third-party tracking cookies or sell user browsing data to
            advertisers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 font-serif">
            <Phone className="w-5 h-5 text-[#800f2f]" />
            5. Contact Us Regarding Your Privacy
          </h2>
          <p>
            If you have any questions or wish to request deletion of your order
            records from our store system, please contact us directly:
          </p>
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-sm space-y-1">
            <p className="font-semibold text-gray-900">
              {settings.store_name || "Bajaj karyana Store"}
            </p>
            <p className="text-gray-600">
              {settings.address || "Shop No. 14, Main Market"},{" "}
              {settings.city || "Firozpur"}, {settings.state || "Punjab"}
            </p>
            {settings.phone && (
              <p className="text-gray-600">Phone: {settings.phone}</p>
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
          href="/refund-policy"
          className="text-[#800f2f] hover:underline font-semibold"
        >
          Read Refund Policy →
        </Link>
      </div>
    </div>
  );
}
