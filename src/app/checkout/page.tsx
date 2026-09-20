"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useShoppingList } from "@/context/shopping-list-context";
import { useStoreSettings } from "@/context/store-settings-context";
import { createOrderAction } from "@/actions/orders";
import { formatCurrency, formatUnit } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  isDeliverableFirozpurPincode,
  FIROZPUR_DELIVERY_PINCODES,
} from "@/lib/validations";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  ShoppingBag,
  ArrowLeft,
  Truck,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, estimatedSubtotal, hasPriceOnRequestItems, clearList } =
    useShoppingList();
  const { settings } = useStoreSettings();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    deliveryAddress: "",
    landmark: "",
    city: settings.city || "Firozpur",
    state: settings.state || "Punjab",
    pincode: settings.pincode || "152002",
    customerNotes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pre-fill user profile if logged in
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile) {
          setFormData((prev) => ({
            ...prev,
            fullName: profile.full_name || prev.fullName,
            phone: profile.phone || prev.phone,
            email: user.email || prev.email,
            deliveryAddress: profile.address || prev.deliveryAddress,
            city: profile.city || prev.city,
            state: profile.state || prev.state,
            pincode: profile.pincode || prev.pincode,
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            email: user.email || prev.email,
          }));
        }
      }
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const defaultDelivery =
    settings.default_delivery_charge !== undefined
      ? settings.default_delivery_charge
      : 30;
  const deliveryCharge = estimatedSubtotal >= 500 ? 0 : defaultDelivery;
  const grandTotal = estimatedSubtotal + deliveryCharge;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMessage("Your shopping list is empty.");
      return;
    }

    if (!isDeliverableFirozpurPincode(formData.pincode)) {
      setErrorMessage(
        "Delivery is currently only available within a 20km radius of Firozpur (Pincodes: 152001, 152002, 152003, 152004, 152005, 152024, 152028, 152116, 152117).",
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await createOrderAction({
        ...formData,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          requestedWeight: i.requestedWeight,
          customerNotes: i.customerNotes,
        })),
      });

      if (response.success && response.orderNumber) {
        clearList();
        router.push(`/order-confirmation/${response.orderNumber}`);
      } else {
        setErrorMessage(
          response.error ||
            "Failed to place order. Please check your information.",
        );
      }
    } catch (err: any) {
      setErrorMessage(
        err?.message || "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 max-w-md mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            No items to checkout
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Please add grocery or confectionery products to your shopping list
            first.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#800f2f] hover:bg-[#a4133c] text-white px-6 py-3 rounded-full text-sm font-semibold transition"
          >
            Browse Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfafb]">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6 flex items-center gap-2">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#800f2f] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#590d22] font-serif mb-2">
          Order Placement & Delivery
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          Enter your delivery destination. No payment is required online; pay
          via Cash or UPI when the store delivers your order.
        </p>

        {/* 20km Delivery Zone Notice */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-sm flex items-start gap-3">
          <Truck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-amber-950">
              📍 Exclusive Local Delivery Zone: Firozpur & Surroundings (Within
              20 km)
            </p>
            <p className="text-xs text-amber-800 leading-relaxed">
              We deliver fresh groceries and confectionery exclusively to
              customers within a 20 km radius of Firozpur. Eligible pincodes:{" "}
              <span className="font-semibold">
                {FIROZPUR_DELIVERY_PINCODES.join(", ")}
              </span>
              .
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Customer Details Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-gray-900 border-b border-rose-100 pb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#800f2f]" />
                <span>Contact & Delivery Address</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] bg-white text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] bg-white text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] bg-white text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Complete Delivery Address *
                </label>
                <textarea
                  name="deliveryAddress"
                  required
                  rows={2}
                  placeholder="House / Flat No., Street, Building name..."
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  className="w-full text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] bg-white text-gray-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    placeholder="Near temple / school"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="w-full text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] bg-white text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    City (Within 20km) *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    readOnly
                    value={formData.city}
                    className="w-full text-sm p-3 rounded-xl border border-rose-200 bg-rose-50/50 text-gray-800 font-medium cursor-not-allowed"
                    title="Orders are accepted for Firozpur region within 20km"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    maxLength={6}
                    placeholder="152002"
                    value={formData.pincode}
                    onChange={handleChange}
                    className={`w-full text-sm p-3 rounded-xl border focus:outline-none focus:ring-2 bg-white text-gray-800 ${
                      formData.pincode.length === 6
                        ? isDeliverableFirozpurPincode(formData.pincode)
                          ? "border-emerald-300 focus:ring-emerald-500"
                          : "border-red-300 focus:ring-red-500"
                        : "border-rose-200 focus:ring-[#800f2f]"
                    }`}
                  />
                  {formData.pincode.length === 6 && (
                    <div className="mt-1 text-[11px] font-medium flex items-center gap-1">
                      {isDeliverableFirozpurPincode(formData.pincode) ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Deliverable within 20km zone
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Outside 20km Firozpur zone
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Delivery Notes / Time Preference
                </label>
                <input
                  type="text"
                  name="customerNotes"
                  placeholder="e.g. Please deliver between 4 PM and 7 PM, ring door bell"
                  value={formData.customerNotes}
                  onChange={handleChange}
                  className="w-full text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] bg-white text-gray-800"
                />
              </div>
            </div>

            {/* Offline Payment Confirmation Banner */}
            <div className="bg-rose-50/80 p-5 rounded-3xl border border-rose-200 space-y-2">
              <div className="flex items-center gap-2 text-[#590d22] font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-[#800f2f]" />
                <span>Offline / Cash / UPI on Delivery</span>
              </div>
              <p className="text-xs text-rose-900 leading-relaxed">
                No payment gateway needed. Our store receives your list,
                prepares fresh items, and accepts payment at your doorstep via
                cash or direct QR scan.
              </p>
            </div>
          </div>

          {/* Order Review & Submit Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-gray-900 border-b border-rose-100 pb-3 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#800f2f]" />
                <span>Order Summary ({items.length} items)</span>
              </h2>

              {/* Items Mini-list */}
              <div className="max-h-64 overflow-y-auto space-y-3 pr-1 divide-y divide-rose-100/60">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="pt-2.5 first:pt-0 flex justify-between gap-2 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-gray-900 block">
                        {item.name}
                      </span>
                      <span className="text-gray-500">
                        {item.quantity}{" "}
                        {item.unitType === "kg" || item.unitType === "gram"
                          ? item.unitType
                          : "units"}
                        {item.customerNotes
                          ? ` • Note: ${item.customerNotes}`
                          : ""}
                      </span>
                    </div>
                    <span className="font-bold text-gray-800 shrink-0">
                      {item.price !== null
                        ? formatCurrency(item.price * item.quantity)
                        : "Market Rate"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price on request alert */}
              {hasPriceOnRequestItems && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <span className="font-bold block">Market Rate Notice:</span>
                    <span>
                      Some items do not have listed prices. Final price will be
                      confirmed by{" "}
                      {settings.store_name || "Bajaj karyana Store"} before
                      delivery.
                    </span>
                  </div>
                </div>
              )}

              {/* Totals */}
              <div className="space-y-2 pt-3 border-t border-rose-100 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal (Priced Items)</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(estimatedSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-gray-900">
                    {deliveryCharge === 0 ? (
                      <span className="text-emerald-600">Free Delivery</span>
                    ) : (
                      formatCurrency(deliveryCharge)
                    )}
                  </span>
                </div>
                {deliveryCharge > 0 && (
                  <p className="text-[11px] text-gray-400 italic">
                    Add ₹{(500 - estimatedSubtotal).toFixed(0)} more for free
                    delivery
                  </p>
                )}
                <div className="pt-2 border-t border-rose-100 flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-gray-900 block">
                      Estimated Total
                    </span>
                    <span className="text-[10px] text-gray-500">
                      Final price confirmed by store
                    </span>
                  </div>
                  <span className="text-2xl font-black text-[#590d22]">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#ff4d6d] hover:bg-[#ff758f] text-white py-4 px-6 rounded-2xl font-bold shadow-lg shadow-pink-500/20 transition transform active:scale-[0.99] disabled:bg-gray-300 disabled:cursor-not-allowed text-base"
              >
                {isSubmitting ? (
                  <span>Submitting Order...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Place Order (Pay on Delivery)</span>
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-gray-400">
                By placing this order, you agree that Bajaj karyana Store will
                verify stock and deliver locally.
              </p>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
