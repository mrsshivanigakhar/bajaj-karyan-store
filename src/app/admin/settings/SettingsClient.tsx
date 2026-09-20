'use client';

import React, { useState } from 'react';
import { StoreSettings } from '@/types/database';
import { updateStoreSettingsAction } from '@/actions/settings';
import { useStoreSettings } from '@/context/store-settings-context';
import { Save, CheckCircle2, AlertCircle, Store, Truck, Tag } from 'lucide-react';

export function SettingsClient({
  initialSettings,
}: {
  initialSettings: StoreSettings;
}) {
  const { refreshSettings } = useStoreSettings();
  const [form, setForm] = useState({
    store_name: initialSettings.store_name,
    phone: initialSettings.phone || '',
    email: initialSettings.email || '',
    address: initialSettings.address || '',
    city: initialSettings.city || '',
    state: initialSettings.state || '',
    pincode: initialSettings.pincode || '',
    opening_hours: initialSettings.opening_hours || '',
    delivery_info: initialSettings.delivery_info || '',
    footer_text: initialSettings.footer_text || '',
    low_stock_threshold: initialSettings.low_stock_threshold,
    default_delivery_charge: initialSettings.default_delivery_charge,
    order_prefix: initialSettings.order_prefix,
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await updateStoreSettingsAction(initialSettings.id, form);
      if (res.success) {
        setFeedback({ type: 'success', text: 'Store settings updated successfully!' });
        await refreshSettings();
      } else {
        setFeedback({ type: 'error', text: res.error || 'Failed to update settings.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', text: err?.message || 'Error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Store Identity Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-xs space-y-5">
        <h3 className="text-base font-bold text-gray-900 border-b border-rose-100 pb-3 flex items-center gap-2">
          <Store className="w-5 h-5 text-[#800f2f]" />
          <span>Public Store Identity</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Store Name *
            </label>
            <input
              type="text"
              required
              name="store_name"
              value={form.store_name}
              onChange={handleChange}
              className="w-full text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Helpline Phone Number *
            </label>
            <input
              type="text"
              required
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Store Support Email *
          </label>
          <input
            type="email"
            required
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Street Address *
          </label>
          <input
            type="text"
            required
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              City *
            </label>
            <input
              type="text"
              required
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              State *
            </label>
            <input
              type="text"
              required
              name="state"
              value={form.state}
              onChange={handleChange}
              className="w-full text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Pincode *
            </label>
            <input
              type="text"
              required
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              className="w-full text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Opening Hours Display Text
            </label>
            <input
              type="text"
              name="opening_hours"
              value={form.opening_hours}
              onChange={handleChange}
              className="w-full text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Delivery Info Banner
            </label>
            <input
              type="text"
              name="delivery_info"
              value={form.delivery_info}
              onChange={handleChange}
              className="w-full text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Footer Tagline
          </label>
          <input
            type="text"
            name="footer_text"
            value={form.footer_text}
            onChange={handleChange}
            className="w-full text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
          />
        </div>
      </div>

      {/* System Settings Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-xs space-y-5">
        <h3 className="text-base font-bold text-gray-900 border-b border-rose-100 pb-3 flex items-center gap-2">
          <Truck className="w-5 h-5 text-[#800f2f]" />
          <span>Fulfillment & Inventory Thresholds</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Order Number Prefix *
            </label>
            <input
              type="text"
              required
              name="order_prefix"
              value={form.order_prefix}
              onChange={handleChange}
              placeholder="BKS"
              className="w-full text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800 font-mono font-bold"
            />
            <p className="text-[10px] text-gray-400 mt-1">Example: BKS-2026-000001</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Default Delivery Charge (₹) *
            </label>
            <input
              type="number"
              required
              name="default_delivery_charge"
              value={form.default_delivery_charge}
              onChange={handleChange}
              className="w-full text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800 font-bold"
            />
            <p className="text-[10px] text-gray-400 mt-1">Orders ≥ ₹500 get free delivery</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Low Stock Threshold *
            </label>
            <input
              type="number"
              required
              name="low_stock_threshold"
              value={form.low_stock_threshold}
              onChange={handleChange}
              className="w-full text-sm p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800 font-bold"
            />
            <p className="text-[10px] text-gray-400 mt-1">Triggers low inventory alert</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#800f2f] hover:bg-[#a4133c] text-white px-7 py-3 rounded-2xl font-bold text-sm shadow-md transition disabled:bg-gray-300"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Settings...' : 'Save All Settings'}</span>
        </button>
      </div>
    </form>
  );
}
