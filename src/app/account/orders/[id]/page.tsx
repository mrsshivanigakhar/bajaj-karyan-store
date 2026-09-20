import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/services/store-service";
import { formatCurrency, formatDate, formatUnit } from "@/lib/utils";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/admin/OrderStatusBadge";
import { OrderTimeline } from "@/components/admin/OrderTimeline";
import {
  ArrowLeft,
  MapPin,
  Phone,
  User,
  Clock,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CustomerOrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfafb]">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Back link */}
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#800f2f] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Orders</span>
        </Link>

        {/* Order Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-rose-100 gap-4">
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider block">
                Bajaj karyana Store Order
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#590d22] font-mono">
                {order.order_number}
              </h1>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Placed on {formatDate(order.created_at)}</span>
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-2">
              <OrderStatusBadge status={order.status} />
              <PaymentStatusBadge status={order.payment_status} />
            </div>
          </div>

          {/* Timeline */}
          <div className="py-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Order Delivery Status
            </h3>
            <OrderTimeline status={order.status} />
          </div>

          {/* Admin Notes if present */}
          {order.admin_notes && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                Message from Store Admin:
              </span>
              <p>{order.admin_notes}</p>
            </div>
          )}

          {/* Customer & Delivery Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-rose-100 text-sm">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#800f2f]" />
                Customer Contact
              </h4>
              <p className="font-bold text-gray-900">{order.customer_name}</p>
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <Phone className="w-3 h-3 text-gray-400" />
                {order.customer_phone}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#800f2f]" />
                Delivery Address
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                {order.delivery_address}
                {order.landmark && `, Landmark: ${order.landmark}`}
                <br />
                {order.city}, {order.state} - {order.pincode}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items Snapshot Table */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-xs space-y-4">
          <h3 className="text-lg font-bold text-gray-900 border-b border-rose-100 pb-3 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#800f2f]" />
            <span>Ordered Items</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-rose-100 text-gray-500 uppercase tracking-wider text-[11px]">
                  <th className="pb-3 font-semibold">Item</th>
                  <th className="pb-3 font-semibold">Quantity / Weight</th>
                  <th className="pb-3 font-semibold">Rate</th>
                  <th className="pb-3 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {order.order_items?.map((item) => (
                  <tr key={item.id} className="py-3">
                    <td className="py-3 pr-2">
                      <span className="font-bold text-gray-900 block">
                        {item.product_name}
                      </span>
                      {item.customer_notes && (
                        <span className="text-[11px] text-gray-500 italic block">
                          Note: {item.customer_notes}
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-gray-700">
                      {item.quantity}{" "}
                      {item.unit_type === "kg" || item.unit_type === "gram"
                        ? item.unit_type
                        : formatUnit(item.unit_type, item.unit_value)}
                      {item.requested_weight && (
                        <span className="text-[11px] text-gray-500 block">
                          ({item.requested_weight})
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-gray-700">
                      {item.unit_price !== null ? (
                        formatCurrency(item.unit_price)
                      ) : (
                        <span className="text-pink-700 font-medium">
                          To be confirmed
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right font-bold text-gray-900">
                      {item.line_total !== null ? (
                        formatCurrency(item.line_total)
                      ) : (
                        <span className="text-pink-700 font-medium">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Calculation Summary */}
          <div className="pt-4 border-t border-rose-100 max-w-xs ml-auto space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(order.subtotal)}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Delivery Charge</span>
              <span className="font-semibold text-gray-900">
                {order.delivery_charge === 0
                  ? "Free"
                  : formatCurrency(order.delivery_charge)}
              </span>
            </div>
            <div className="pt-2 border-t border-rose-100 flex justify-between items-baseline text-base font-bold text-gray-900">
              <span>Grand Total</span>
              <span className="text-xl font-extrabold text-[#590d22]">
                {formatCurrency(order.final_total || order.estimated_total)}
              </span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
