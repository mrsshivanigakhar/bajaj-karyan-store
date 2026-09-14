import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import { Users, Phone, Mail, MapPin, ShoppingBag } from 'lucide-react';

export default async function AdminCustomersPage() {
  const supabase = await createClient();
  let customers: any[] = [];

  try {
    const { data } = await supabase
      .from('profiles')
      .select('*, orders(id, order_number, final_total, created_at)')
      .order('created_at', { ascending: false });

    if (data) {
      customers = data;
    }
  } catch {
    // ignore
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#590d22] font-serif">
          Store Customers
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Directory of registered customer profiles, delivery addresses, and ordering volume.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-rose-100 shadow-xs overflow-hidden">
        {customers.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <Users className="w-12 h-12 text-rose-300 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 text-base mb-1">No customers registered yet</h3>
            <p className="text-xs text-gray-400">
              When users register online or place an order, they will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-rose-50/50 text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-rose-100">
                <tr>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Phone Number</th>
                  <th className="py-3.5 px-6">Delivery City / Address</th>
                  <th className="py-3.5 px-6">Total Orders</th>
                  <th className="py-3.5 px-6">Account Role</th>
                  <th className="py-3.5 px-6 text-right">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50 text-xs sm:text-sm">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-rose-50/20 transition">
                    <td className="py-4 px-6">
                      <span className="font-bold text-gray-900 block">
                        {c.full_name || 'Guest User'}
                      </span>
                      <span className="text-xs text-gray-500">{c.email}</span>
                    </td>

                    <td className="py-4 px-6 text-gray-700">
                      {c.phone ? (
                        <a href={`tel:${c.phone}`} className="hover:underline text-[#800f2f] font-medium">
                          {c.phone}
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>

                    <td className="py-4 px-6 text-xs text-gray-600 max-w-xs truncate">
                      {c.address ? `${c.address}, ${c.city || ''}` : c.city || '—'}
                    </td>

                    <td className="py-4 px-6 font-bold text-gray-800">
                      {c.orders?.length || 0} orders
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          c.role === 'admin'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : 'bg-rose-50 text-gray-700 border border-rose-200'
                        }`}
                      >
                        {c.role}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right text-xs text-gray-500">
                      {formatDate(c.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
