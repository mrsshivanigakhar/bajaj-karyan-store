'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { CheckCircle2, Clock, Phone, ArrowRight, Store, FileText } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useStoreSettings } from '@/context/store-settings-context';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderNumber = (params?.orderNumber as string) || 'BKS-2026-ORDER';
  const { settings } = useStoreSettings();

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#590d22', '#800f2f', '#ff4d6d', '#ff758f', '#ffb3c1'],
      });
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfafb]">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full flex flex-col items-center text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6 shadow-inner ring-8 ring-emerald-50">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-[#a4133c] mb-1">
          Thank You
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#590d22] font-serif mb-3">
          Order Placed Successfully!
        </h1>

        <p className="text-base text-gray-600 max-w-lg mb-8 leading-relaxed">
          Thank you for shopping with{' '}
          <strong className="text-gray-900">{settings.store_name || 'Bajaj Karyan Store'}</strong>.
          Your order has been received and sent to our store desk.
        </p>

        {/* Order Reference Box */}
        <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-sm mb-8 text-left space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-rose-100 gap-2">
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider block">
                Order Reference Number
              </span>
              <span className="text-xl sm:text-2xl font-mono font-bold text-[#590d22]">
                {orderNumber}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 self-start sm:self-auto">
              <Clock className="w-3.5 h-3.5" />
              <span>Pending Store Review</span>
            </span>
          </div>

          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center text-[#800f2f] shrink-0 mt-0.5 font-bold text-xs">
                1
              </div>
              <p>
                Our store staff will review your requested items and weights, and confirm any market-rate item pricing.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center text-[#800f2f] shrink-0 mt-0.5 font-bold text-xs">
                2
              </div>
              <p>
                Your package will be carefully prepared and dispatched with a printed receipt.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center text-[#800f2f] shrink-0 mt-0.5 font-bold text-xs">
                3
              </div>
              <p>
                You can inspect the items at your door and pay via Cash or UPI on delivery.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-rose-100 flex items-center justify-between text-xs text-rose-900 bg-rose-50/60 p-3 rounded-xl">
            <span>Questions regarding this order?</span>
            {settings.phone && (
              <a
                href={`tel:${settings.phone.replace(/[^+\d]/g, '')}`}
                className="font-bold text-[#590d22] hover:underline flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{settings.phone}</span>
              </a>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/account/orders"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#800f2f] hover:bg-[#a4133c] text-white px-7 py-3.5 rounded-full font-bold shadow-md transition"
          >
            <FileText className="w-4 h-4" />
            <span>View My Orders</span>
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-rose-50 text-gray-800 px-7 py-3.5 rounded-full font-bold border border-rose-200 transition"
          >
            <Store className="w-4 h-4 text-pink-600" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
