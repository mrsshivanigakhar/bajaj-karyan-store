import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, MessageSquare, Store, Truck, ShieldCheck } from 'lucide-react';
import { getStoreSettings } from '@/services/store-service';
import { ContactFormClient } from './ContactFormClient';

export const metadata = {
  title: 'Contact Us — Bajaj Karyan Store Firozpur',
  description: 'Get in touch with Bajaj Karyan Store in Firozpur for store orders, bulk inquiries, delivery requests, or feedback.',
};

export default async function ContactPage() {
  const settings = await getStoreSettings();

  const phoneLink = settings.phone ? settings.phone.replace(/[^+\d]/g, '') : '+919876543210';
  const emailLink = settings.email || 'contact@bajajkaryan.com';
  const fullAddress = `${settings.address || 'Shop No. 14, Main Market, Near Clock Tower'}, ${settings.city || 'Firozpur'}, ${settings.state || 'Punjab'} - ${settings.pincode || '152002'}`;

  // WhatsApp clean link
  const rawDigits = settings.phone ? settings.phone.replace(/\D/g, '') : '919876543210';
  const waNumber = rawDigits.startsWith('91') ? rawDigits : `91${rawDigits}`;
  const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent('Hello Bajaj Karyan Store, I have an inquiry regarding grocery orders.')}`;

  return (
    <div className="flex flex-col gap-12 sm:gap-16 pb-16">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-bordeaux text-white py-14 sm:py-18 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-900/70 border border-pink-400/30 text-xs sm:text-sm font-medium text-pink-200">
            <Store className="w-4 h-4 text-pink-300" />
            <span>We&apos;re Here to Help</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif tracking-tight">
            Contact Bajaj Karyan Store
          </h1>

          <p className="text-sm sm:text-base text-rose-100/90 max-w-xl mx-auto leading-relaxed">
            Have questions about product availability, bulk wedding confectionery, or our doorstep delivery in Firozpur? Reach out directly!
          </p>
        </div>
      </section>

      {/* Main Grid: Store Info & Contact Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Store Information Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold text-[#a4133c] uppercase tracking-wider">
                Store Details
              </span>
              <h2 className="text-2xl font-bold text-gray-900 font-serif mt-1">
                Visit Our Store Counter
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Walk into our Firozpur store or contact us via phone, WhatsApp, or email.
              </p>
            </div>

            <div className="space-y-4">
              {/* Address Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-rose-100 shadow-xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#800f2f] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Store Address</h4>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5 leading-relaxed">{fullAddress}</p>
                </div>
              </div>

              {/* Phone & WhatsApp Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-rose-100 shadow-xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#800f2f] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-gray-900">Phone & WhatsApp</h4>
                  {settings.phone && (
                    <a
                      href={`tel:${phoneLink}`}
                      className="block text-xs sm:text-sm text-gray-700 hover:text-[#800f2f] font-semibold mt-0.5 transition"
                    >
                      {settings.phone}
                    </a>
                  )}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200 hover:bg-emerald-100 transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Email Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-rose-100 shadow-xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#800f2f] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Email Inquiries</h4>
                  <a
                    href={`mailto:${emailLink}`}
                    className="block text-xs sm:text-sm text-gray-600 hover:text-[#800f2f] mt-0.5 transition"
                  >
                    {emailLink}
                  </a>
                </div>
              </div>

              {/* Timings Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-rose-100 shadow-xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#800f2f] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Operating Hours</h4>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5 whitespace-pre-line leading-relaxed">
                    {settings.opening_hours || 'Mon - Sat: 8:00 AM - 9:30 PM\nSun: 9:00 AM - 7:00 PM'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold text-[#a4133c] uppercase tracking-wider">
                Send an Online Message
              </span>
              <h2 className="text-2xl font-bold text-gray-900 font-serif mt-1">
                Drop Us a Note
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Fill in the form below and our store management will get back to you promptly.
              </p>
            </div>

            <ContactFormClient />
          </div>
        </div>
      </section>
    </div>
  );
}
