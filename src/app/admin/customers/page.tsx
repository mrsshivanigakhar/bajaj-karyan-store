import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { CustomersClient } from './CustomersClient';

export default async function AdminCustomersPage() {
  const supabase = await createClient();
  let usersWithOrders: any[] = [];

  try {
    const [profilesRes, ordersRes] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('id, customer_id, order_number, final_total, created_at'),
    ]);

    const profiles = profilesRes.data || [];
    const orders = ordersRes.data || [];

    usersWithOrders = profiles.map((p) => ({
      ...p,
      orders: orders.filter((o) => o.customer_id === p.id),
    }));
  } catch (err) {
    console.error('Failed to load customers:', err);
  }

  return (
    <div className="space-y-6 w-full">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#590d22] font-serif">
          Store Customers & Accounts
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Directory of registered customer profiles, delivery addresses, and ordering volume.
        </p>
      </div>

      <CustomersClient initialUsers={usersWithOrders} />
    </div>
  );
}
