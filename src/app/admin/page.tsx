import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { StatsCard } from '@/components/admin/StatsCard';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Users,
  Package,
  ArrowRight,
  Truck,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { fallbackProducts } from '@/lib/mock-data';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  let orders: any[] = [];
  let totalCustomersCount = 0;
  let activeProductsCount = fallbackProducts.length;

  try {
    const { data: dbOrders } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (dbOrders) {
      orders = dbOrders;
    }

    const { count: customerCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    if (customerCount !== null) {
      totalCustomersCount = customerCount;
    }

    const { count: prodCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);
    if (prodCount !== null) {
      activeProductsCount = prodCount;
    }
  } catch {
    // ignore
  }

  // Calculate stats
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter((o) => o.created_at.startsWith(todayDateStr));
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const confirmedOrders = orders.filter((o) => o.status === 'confirmed');
  const preparingOrders = orders.filter((o) => o.status === 'preparing');
  const deliveringOrders = orders.filter((o) => o.status === 'out_for_delivery');
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');

  const recentOrders = orders.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#590d22] font-serif">
          Store Overview
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Real-time order tracking, fulfillment pipeline, and catalog metrics.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Today's Orders"
          value={todayOrders.length}
          subtitle="Orders placed today"
          icon={ShoppingBag}
          color="bordeaux"
        />

        <StatsCard
          title="Pending Action"
          value={pendingOrders.length}
          subtitle="Awaiting review & pricing"
          icon={Clock}
          color="amber"
        />

        <StatsCard
          title="Active Products"
          value={activeProductsCount}
          subtitle="Listed in store catalog"
          icon={Package}
          color="amaranth"
        />

        <StatsCard
          title="Total Customers"
          value={totalCustomersCount > 0 ? totalCustomersCount : 'Active'}
          subtitle="Registered accounts"
          icon={Users}
          color="pink"
        />
      </div>

      {/* Order Status Pipeline Breakdown */}
      <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-xs space-y-4">
        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
          Order Processing Pipeline
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <Link
            href="/admin/orders?status=pending"
            className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 hover:bg-amber-100/70 transition text-center"
          >
            <span className="block text-2xl font-black text-amber-800">
              {pendingOrders.length}
            </span>
            <span className="text-xs font-semibold text-amber-900 mt-1 block">
              Pending
            </span>
          </Link>

          <Link
            href="/admin/orders?status=confirmed"
            className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 hover:bg-blue-100/70 transition text-center"
          >
            <span className="block text-2xl font-black text-blue-800">
              {confirmedOrders.length}
            </span>
            <span className="text-xs font-semibold text-blue-900 mt-1 block">
              Confirmed
            </span>
          </Link>

          <Link
            href="/admin/orders?status=preparing"
            className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 hover:bg-purple-100/70 transition text-center"
          >
            <span className="block text-2xl font-black text-purple-800">
              {preparingOrders.length}
            </span>
            <span className="text-xs font-semibold text-purple-900 mt-1 block">
              Preparing
            </span>
          </Link>

          <Link
            href="/admin/orders?status=out_for_delivery"
            className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200/80 hover:bg-cyan-100/70 transition text-center"
          >
            <span className="block text-2xl font-black text-cyan-800">
              {deliveringOrders.length}
            </span>
            <span className="text-xs font-semibold text-cyan-900 mt-1 block">
              Out for Delivery
            </span>
          </Link>

          <Link
            href="/admin/orders?status=delivered"
            className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 hover:bg-emerald-100/70 transition text-center"
          >
            <span className="block text-2xl font-black text-emerald-800">
              {deliveredOrders.length}
            </span>
            <span className="text-xs font-semibold text-emerald-900 mt-1 block">
              Delivered
            </span>
          </Link>

          <Link
            href="/admin/orders"
            className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 hover:bg-rose-100/70 transition text-center"
          >
            <span className="block text-2xl font-black text-[#590d22]">
              {orders.length}
            </span>
            <span className="text-xs font-semibold text-rose-900 mt-1 block">
              All Orders
            </span>
          </Link>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-rose-100 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-rose-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Recent Customer Orders</h3>
            <p className="text-xs text-gray-500">Latest orders awaiting action or fulfillment</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-[#800f2f] hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <ShoppingBag className="w-12 h-12 text-rose-300 mx-auto mb-3" />
            <p className="font-bold text-gray-800 text-sm">No orders received yet</p>
            <p className="text-xs text-gray-400 mt-1">
              New customer orders submitted online will appear here immediately.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-rose-50/40 text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-rose-100">
                <tr>
                  <th className="py-3 px-6">Order #</th>
                  <th className="py-3 px-6">Customer</th>
                  <th className="py-3 px-6">Items</th>
                  <th className="py-3 px-6">Total</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50 text-xs sm:text-sm">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-rose-50/20 transition">
                    <td className="py-3.5 px-6 font-mono font-bold text-[#590d22]">
                      {order.order_number}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="font-bold text-gray-900 block">{order.customer_name}</span>
                      <span className="text-xs text-gray-500">{order.customer_phone}</span>
                    </td>
                    <td className="py-3.5 px-6 text-gray-600">
                      {order.order_items?.length || 0} items
                    </td>
                    <td className="py-3.5 px-6 font-bold text-[#590d22]">
                      {formatCurrency(order.final_total || order.estimated_total)}
                    </td>
                    <td className="py-3.5 px-6">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="py-3.5 px-6 text-xs text-gray-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#800f2f] hover:bg-rose-100 px-3 py-1.5 rounded-lg transition"
                      >
                        <span>Manage</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
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
