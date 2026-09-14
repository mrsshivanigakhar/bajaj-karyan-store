import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/admin';
import { getOrdersForUser } from '@/services/store-service';
import { formatCurrency, formatDate } from '@/lib/utils';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/admin/OrderStatusBadge';
import { ShoppingBag, ArrowRight, Package, Clock } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';

export const metadata = {
  title: 'My Orders — Bajaj Karyan Store',
  description: 'View your order history and track order delivery status.',
};

export default async function CustomerOrdersPage() {
  const user = await getCurrentUser();
  const orders = user ? await getOrdersForUser(user.id) : [];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#590d22] font-serif">
            My Orders
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Track previous orders, view receipt details, and monitor delivery progress.
          </p>
        </div>

        {!user ? (
          <div className="bg-white p-8 rounded-3xl border border-rose-100 text-center shadow-xs">
            <Package className="w-12 h-12 text-rose-300 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-gray-900 mb-1">Sign In to View Orders</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
              Please log in with your registered account to view your past orders and status.
            </p>
            <Link
              href="/auth/login?redirect=/account/orders"
              className="inline-block bg-[#800f2f] hover:bg-[#a4133c] text-white px-6 py-2.5 rounded-full text-sm font-semibold transition"
            >
              Sign In to Account
            </Link>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-rose-100 text-center shadow-xs">
            <ShoppingBag className="w-12 h-12 text-rose-300 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-gray-900 mb-1">No orders yet</h2>
            <p className="text-sm text-gray-500 mb-6">
              You haven't placed any orders with Bajaj Karyan Store yet.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#800f2f] hover:bg-[#a4133c] text-white px-6 py-2.5 rounded-full text-sm font-semibold transition"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-rose-100 p-5 shadow-xs hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm sm:text-base text-[#590d22]">
                      {order.order_number}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {formatDate(order.created_at)}
                    </span>
                    <span>
                      {order.order_items?.length || 0} {order.order_items?.length === 1 ? 'item' : 'items'}
                    </span>
                    <PaymentStatusBadge status={order.payment_status} />
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-rose-100">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
                      Total
                    </span>
                    <span className="text-base font-extrabold text-[#590d22]">
                      {formatCurrency(order.final_total || order.estimated_total)}
                    </span>
                  </div>

                  <Link
                    href={`/account/orders/${order.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#800f2f] hover:text-[#c9184a] bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-xl transition"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
