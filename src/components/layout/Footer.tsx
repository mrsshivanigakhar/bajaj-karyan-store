import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Truck, HeartHandshake } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#2a0610] text-rose-100/90 pt-12 pb-20 md:pb-12 border-t border-rose-950">
      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-rose-900/40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl bg-rose-950/40 border border-rose-900/30">
            <div className="w-12 h-12 rounded-full bg-rose-900/50 flex items-center justify-center text-pink-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Genuine Quality</h4>
              <p className="text-xs text-rose-300">100% authentic grocery & fresh confectionery</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl bg-rose-950/40 border border-rose-900/30">
            <div className="w-12 h-12 rounded-full bg-rose-900/50 flex items-center justify-center text-pink-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Doorstep Delivery</h4>
              <p className="text-xs text-rose-300">Fast local delivery across Amritsar</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl bg-rose-950/40 border border-rose-900/30">
            <div className="w-12 h-12 rounded-full bg-rose-900/50 flex items-center justify-center text-pink-400">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Offline Payment</h4>
              <p className="text-xs text-rose-300">Pay cash or UPI upon delivery / store pickup</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand column */}
        <div className="md:col-span-1 space-y-3">
          <h3 className="font-extrabold text-xl text-white font-serif tracking-wider uppercase">
            BAJAJ KARYAN STORE
          </h3>
          <p className="text-sm text-rose-200/80 leading-relaxed">
            Your trusted neighborhood confectionery and grocery destination. Fresh snacks, sweets, bakery, and premium kiryana essentials.
          </p>
          <div className="pt-2">
            <span className="inline-block bg-rose-900/60 text-pink-300 text-xs px-3 py-1 rounded-full border border-rose-800">
              Serving Amritsar Since 1998
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/shop" className="hover:text-pink-300 transition">
                Browse Catalog
              </Link>
            </li>
            <li>
              <Link href="/categories" className="hover:text-pink-300 transition">
                All Categories
              </Link>
            </li>
            <li>
              <Link href="/account/orders" className="hover:text-pink-300 transition">
                Track My Orders
              </Link>
            </li>
            <li>
              <Link href="/auth/login" className="hover:text-pink-300 transition">
                Customer Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Opening Hours */}
        <div>
          <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Store Timings</h4>
          <div className="space-y-2 text-sm text-rose-200/90">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-pink-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-white">Monday – Saturday</p>
                <p className="text-xs text-rose-300">8:00 AM – 9:30 PM</p>
              </div>
            </div>
            <div className="flex items-start gap-2 pt-2">
              <Clock className="w-4 h-4 text-pink-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-white">Sunday</p>
                <p className="text-xs text-rose-300">9:00 AM – 7:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Store Contact */}
        <div>
          <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Store Contact</h4>
          <div className="space-y-2.5 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-pink-400 mt-0.5 shrink-0" />
              <span className="text-xs sm:text-sm">Shop No. 14, Main Market, Near Clock Tower, Amritsar, Punjab 143001</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-pink-400 shrink-0" />
              <a href="tel:+919876543210" className="hover:text-pink-300 text-xs sm:text-sm">
                +91 98765 43210
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-pink-400 shrink-0" />
              <a href="mailto:contact@bajajkaryan.com" className="hover:text-pink-300 text-xs sm:text-sm">
                contact@bajajkaryan.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 mt-6 border-t border-rose-900/30 flex flex-col sm:flex-row justify-between items-center text-xs text-rose-300/80 gap-3">
        <p>© {new Date().getFullYear()} Bajaj Karyan Store. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-rose-400 hover:text-white transition">
            Store Administration
          </Link>
        </div>
      </div>
    </footer>
  );
}
