import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { getCategories, getProducts, getStoreSettings } from '@/services/store-service';
import { ReportsHubClient } from './ReportsHubClient';

export const metadata = {
  title: 'Reports & Export Center — Bajaj Karyan Store Admin',
  description: 'Download business intelligence reports in PDF and Excel formats.',
};

export default async function AdminReportsPage() {
  const supabase = await createClient();

  const [categories, products, settings] = await Promise.all([
    getCategories(),
    getProducts(),
    getStoreSettings(),
  ]);

  let orders: any[] = [];
  let customersWithOrders: any[] = [];

  try {
    const [ordersRes, profilesRes] = await Promise.all([
      supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    ]);

    orders = ordersRes.data || [];
    const profiles = profilesRes.data || [];

    customersWithOrders = profiles.map((p) => ({
      ...p,
      orders: orders.filter((o) => o.customer_id === p.id),
    }));
  } catch (err) {
    console.error('Error fetching data for reports:', err);
  }

  return (
    <div className="space-y-6 w-full">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#590d22] font-serif">
          Reports & Export Center
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Generate, audit, and download comprehensive store metrics, inventory valuations, and order histories in PDF and Excel formats.
        </p>
      </div>

      <ReportsHubClient
        products={products}
        categories={categories}
        orders={orders}
        customers={customersWithOrders}
        lowStockThreshold={settings.low_stock_threshold || 10}
      />
    </div>
  );
}
