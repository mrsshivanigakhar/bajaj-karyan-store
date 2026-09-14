import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/admin/OrderStatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Search, Filter, ArrowRight, ShoppingBag, Eye, Printer } from 'lucide-react';

interface AdminOrdersPageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
  }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const params = await searchParams;
  const currentStatus = params.status || 'all';
  const currentSearch = params.search || '';

  const supabase = await createClient();
  let orders: any[] = [];

  try {
    let query = supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (currentStatus !== 'all') {
      query = query.eq('status', currentStatus);
    }

    if (currentSearch) {
      query = query.or(
        `order_number.ilike.%${currentSearch}%,customer_name.ilike.%${currentSearch}%,customer_phone.ilike.%${currentSearch}%`
      );
    }

    const { data } = await query;
    if (data) {
      orders = data;
    }
  } catch {
    // ignore
  }

  const statusFilters = [
    { key: 'all', label: 'All Orders' },
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#590d22] font-serif">
            Order Management
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review incoming requests, confirm prices, and update fulfillment progress.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-rose-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search input */}
          <form method="GET" action="/admin/orders" className="relative w-full sm:max-w-md">
            {currentStatus !== 'all' && (
              <input type="hidden" name="status" value={currentStatus} />
            )}
            <input
              type="text"
              name="search"
              defaultValue={currentSearch}
              placeholder="Search by order #, customer name or phone..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
            />
            <Search className="w-4 h-4 text-rose-400 absolute left-3.5 top-3" />
          </form>

          <span className="text-xs text-gray-500 font-medium self-start sm:self-auto">
            Showing <strong>{orders.length}</strong> orders
          </span>
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {statusFilters.map((tab) => {
            const isActive = currentStatus === tab.key;
            return (
              <Link
                key={tab.key}
                href={`/admin/orders?${new URLSearchParams({
                  status: tab.key,
                  ...(currentSearch ? { search: currentSearch } : {}),
                }).toString()}`}
                className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-[#590d22] text-white shadow-xs'
                    : 'bg-rose-50 text-gray-700 hover:bg-rose-100'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-rose-100 shadow-xs overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <ShoppingBag className="w-12 h-12 text-rose-300 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 text-base mb-1">No orders found</h3>
            <p className="text-xs text-gray-400">
              Try adjusting your search keywords or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-rose-50/50 text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-rose-100">
                <tr>
                  <th className="py-3.5 px-6">Order Number</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Items</th>
                  <th className="py-3.5 px-6">Total Amount</th>
                  <th className="py-3.5 px-6">Order Status</th>
                  <th className="py-3.5 px-6">Payment</th>
                  <th className="py-3.5 px-6">Placed On</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50 text-xs sm:text-sm">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-rose-50/20 transition">
                    <td className="py-4 px-6 font-mono font-bold text-[#590d22]">
                      {order.order_number}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-gray-900 block">{order.customer_name}</span>
                      <span className="text-xs text-gray-500">{order.customer_phone}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {order.order_items?.length || 0} items
                    </td>
                    <td className="py-4 px-6 font-black text-[#590d22]">
                      {formatCurrency(order.final_total || order.estimated_total)}
                    </td>
                    <td className="py-4 px-6">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="py-4 px-6">
                      <PaymentStatusBadge status={order.payment_status} />
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/orders/${order.id}/print`}
                          target="_blank"
                          title="Print Receipt / Invoice"
                          className="p-1.5 text-gray-500 hover:text-[#800f2f] hover:bg-rose-50 rounded-lg transition"
                        >
                          <Printer className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1 bg-[#800f2f] hover:bg-[#a4133c] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </Link>
                      </div>
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
