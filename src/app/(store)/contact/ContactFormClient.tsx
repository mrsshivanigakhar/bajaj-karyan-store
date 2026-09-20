"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

export function ContactFormClient() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate sending message
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 800);
  };

  if (isSuccess) {
    return (
      <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
        <h3 className="text-lg font-bold text-emerald-950 font-serif">
          Message Received!
        </h3>
        <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
          Thank you for reaching out to Bajaj karyana Store. Our store team will
          contact you shortly on your phone or email.
        </p>
        <button
          type="button"
          onClick={() => setIsSuccess(false)}
          className="mt-4 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full transition"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
            Your Full Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Ramesh Kumar"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full text-xs sm:text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] bg-white text-gray-800"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
            Mobile / WhatsApp *
          </label>
          <input
            type="tel"
            required
            placeholder="e.g. +91 98765 43210"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full text-xs sm:text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] bg-white text-gray-800"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
            Email Address (Optional)
          </label>
          <input
            type="email"
            placeholder="e.g. ramesh@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full text-xs sm:text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] bg-white text-gray-800"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
            Subject / Inquiry Type *
          </label>
          <select
            required
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            className="w-full text-xs sm:text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] bg-white text-gray-800"
          >
            <option value="">Select subject...</option>
            <option value="Order Status">Check Order Status</option>
            <option value="Bulk Order">Bulk / Wedding / Festive Order</option>
            <option value="Product Availability">
              Product Availability / Custom Weight
            </option>
            <option value="Feedback / Return">Return or Feedback</option>
            <option value="Other">Other Inquiry</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
          Your Message *
        </label>
        <textarea
          required
          rows={4}
          placeholder="Tell us what you need, order details, or specific brand requests..."
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className="w-full text-xs sm:text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] bg-white text-gray-800"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#800f2f] hover:bg-[#a4133c] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sending Message...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Send Message to Store</span>
          </>
        )}
      </button>
    </form>
  );
}
