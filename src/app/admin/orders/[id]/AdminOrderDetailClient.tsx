'use client';

import React, { useState } from 'react';
import { Order, OrderItem, OrderStatus, PaymentStatus, StoreSettings } from '@/types/database';
import {
  updateOrderStatusAction,
  updatePaymentStatusAction,
  confirmOrderItemPriceAction,
} from '@/actions/admin-orders';
import { formatCurrency, formatDate, formatUnit } from '@/lib/utils';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/admin/OrderStatusBadge';
import { OrderTimeline } from '@/components/admin/OrderTimeline';
import {
  User,
  Phone,
  MapPin,
  Clock,
  Check,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Save,
  ShoppingBag,
} from 'lucide-react';

interface AdminOrderDetailClientProps {
  initialOrder: Order;
  storeSettings: StoreSettings;
}

export function AdminOrderDetailClient({
  initialOrder,
  storeSettings,
}: AdminOrderDetailClientProps) {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status);
  const [adminNotes, setAdminNotes] = useState(order.admin_notes || '');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<PaymentStatus>(
    order.payment_status
  );

  const [savingStatus, setSavingStatus] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const [itemPriceInputs, setItemPriceInputs] = useState<Record<string, number>>(
    () => {
      const initial: Record<string, number> = {};
      order.order_items?.forEach((item) => {
        if (item.unit_price !== null) {
          initial[item.id] = item.unit_price;
        }
      });
      return initial;
    }
  );
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  const handleStatusUpdate = async () => {
    setSavingStatus(true);
    setFeedbackMsg(null);
    try {
      const res = await updateOrderStatusAction(order.id, selectedStatus);
      if (res.success) {
        setOrder((prev) => ({ ...prev, status: selectedStatus }));
        setFeedbackMsg({ type: 'success', text: 'Order status updated successfully!' });
      } else {
        setFeedbackMsg({ type: 'error', text: res.error || 'Failed to update status.' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err?.message || 'Error occurred.' });
    } finally {
      setSavingStatus(false);
    }
  };

  const handlePaymentUpdate = async () => {
    setSavingPayment(true);
    setFeedbackMsg(null);
    try {
      const res = await updatePaymentStatusAction(order.id, selectedPaymentStatus);
      if (res.success) {
        setOrder((prev) => ({ ...prev, payment_status: selectedPaymentStatus }));
        setFeedbackMsg({ type: 'success', text: 'Payment status updated!' });
      } else {
        setFeedbackMsg({ type: 'error', text: res.error || 'Failed to update payment status.' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err?.message || 'Error occurred.' });
    } finally {
      setSavingPayment(false);
    }
  };

  const handleNotesUpdate = async () => {
    setSavingNotes(true);
    setFeedbackMsg(null);
    try {
      const res = await updateOrderStatusAction(order.id, order.status, adminNotes);
      if (res.success) {
        setOrder((prev) => ({ ...prev, admin_notes: adminNotes }));
        setFeedbackMsg({ type: 'success', text: 'Admin notes saved!' });
      } else {
        setFeedbackMsg({ type: 'error', text: res.error || 'Failed to save notes.' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err?.message || 'Error occurred.' });
    } finally {
      setSavingNotes(false);
    }
  };

  const handleConfirmPrice = async (item: OrderItem) => {
    const inputPrice = itemPriceInputs[item.id];
    if (inputPrice === undefined || isNaN(inputPrice) || inputPrice < 0) {
      setFeedbackMsg({ type: 'error', text: 'Please enter a valid numeric unit price.' });
      return;
    }

    setUpdatingItemId(item.id);
    setFeedbackMsg(null);
    try {
      const res = await confirmOrderItemPriceAction(order.id, item.id, inputPrice);
      if (res.success) {
        const updatedItems = (order.order_items || []).map((i) =>
          i.id === item.id
            ? {
                ...i,
                unit_price: inputPrice,
                line_total: Number((inputPrice * i.quantity).toFixed(2)),
                price_confirmed: true,
              }
            : i
        );

        setOrder((prev) => ({
          ...prev,
          order_items: updatedItems,
          subtotal: res.newSubtotal ?? prev.subtotal,
          final_total: res.newFinalTotal ?? prev.final_total,
        }));

        setFeedbackMsg({
          type: 'success',
          text: `Price for "${item.product_name}" confirmed and grand total updated!`,
        });
      } else {
        setFeedbackMsg({ type: 'error', text: res.error || 'Failed to confirm price.' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err?.message || 'Error occurred.' });
    } finally {
      setUpdatingItemId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Feedback banner */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl text-sm flex items-center gap-2 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Main Order Header & Quick Action Row */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-rose-100 gap-4">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
              Customer Order
            </span>
            <h1 className="text-2xl sm:text-3xl font-mono font-black text-[#590d22]">
              {order.order_number}
            </h1>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Received on {formatDate(order.created_at)}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.payment_status} />
          </div>
        </div>

        {/* Visual Fulfillment Timeline */}
        <div className="py-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Delivery Status Workflow
          </h3>
          <OrderTimeline status={order.status} />
        </div>

        {/* Quick controls: Status update & Payment update */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-rose-100 bg-rose-50/40 p-5 rounded-2xl">
          {/* Status Changer */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Change Order Status
            </label>
            <div className="flex items-center gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                className="flex-1 text-xs sm:text-sm p-2.5 rounded-xl border border-rose-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready for Pickup</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                type="button"
                onClick={handleStatusUpdate}
                disabled={savingStatus || selectedStatus === order.status}
                className="bg-[#800f2f] hover:bg-[#a4133c] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {savingStatus ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>

          {/* Payment Status Changer */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Offline Payment Status
            </label>
            <div className="flex items-center gap-2">
              <select
                value={selectedPaymentStatus}
                onChange={(e) => setSelectedPaymentStatus(e.target.value as PaymentStatus)}
                className="flex-1 text-xs sm:text-sm p-2.5 rounded-xl border border-rose-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
              >
                <option value="pending">Payment Pending</option>
                <option value="paid">Payment Received (Paid)</option>
              </select>
              <button
                type="button"
                onClick={handlePaymentUpdate}
                disabled={savingPayment || selectedPaymentStatus === order.payment_status}
                className="bg-[#590d22] hover:bg-[#800f2f] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {savingPayment ? 'Saving...' : 'Set'}
              </button>
            </div>
          </div>
        </div>

        {/* Customer & Address details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-rose-100 text-sm">
          <div className="space-y-2 bg-white p-4 rounded-2xl border border-rose-100">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#800f2f]" />
              Customer Information
            </h4>
            <p className="font-bold text-gray-900 text-base">{order.customer_name}</p>
            <p className="text-xs text-gray-600 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              <a href={`tel:${order.customer_phone}`} className="hover:underline text-[#800f2f] font-semibold">
                {order.customer_phone}
              </a>
            </p>
            {order.customer_notes && (
              <div className="mt-2 text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                <span className="font-bold block mb-0.5">Customer Delivery Note:</span>
                {order.customer_notes}
              </div>
            )}
          </div>

          <div className="space-y-2 bg-white p-4 rounded-2xl border border-rose-100">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#800f2f]" />
              Delivery Destination
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

      {/* Ordered Items Table with Inline Price Confirmation */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-xs space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#800f2f]" />
            <span>Ordered Items & Price Confirmation</span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Admin can confirm or adjust market rates for each item before preparing the order. Grand totals recalculate automatically.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-rose-50/50 text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-rose-100">
              <tr>
                <th className="py-3 px-4">Item Details</th>
                <th className="py-3 px-4">Quantity / Weight</th>
                <th className="py-3 px-4">Price Status</th>
                <th className="py-3 px-4">Unit Price (₹)</th>
                <th className="py-3 px-4">Line Total</th>
                <th className="py-3 px-4 text-right">Confirm / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50">
              {order.order_items?.map((item) => {
                const currentInputPrice = itemPriceInputs[item.id] ?? (item.unit_price || 0);

                return (
                  <tr key={item.id} className="hover:bg-rose-50/20 transition">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-gray-900 block">{item.product_name}</span>
                      {item.customer_notes && (
                        <span className="text-[11px] text-gray-500 italic block">
                          Note: {item.customer_notes}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-gray-700">
                      <span className="font-semibold">
                        {item.quantity}{' '}
                        {item.unit_type === 'kg' || item.unit_type === 'gram'
                          ? item.unit_type
                          : formatUnit(item.unit_type, item.unit_value)}
                      </span>
                      {item.requested_weight && (
                        <span className="text-[11px] text-gray-500 block">
                          Req: {item.requested_weight}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.price_confirmed && item.unit_price !== null ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                          <Check className="w-3 h-3" />
                          <span>Confirmed</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-pink-800 bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                          <Clock className="w-3 h-3" />
                          <span>Needs Pricing</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 max-w-[120px]">
                        <span className="text-gray-400 text-xs">₹</span>
                        <input
                          type="number"
                          step="0.01"
                          value={itemPriceInputs[item.id] !== undefined ? itemPriceInputs[item.id] : ''}
                          placeholder="Set price"
                          onChange={(e) =>
                            setItemPriceInputs((prev) => ({
                              ...prev,
                              [item.id]: parseFloat(e.target.value) || 0,
                            }))
                          }
                          className="w-full text-xs p-1.5 rounded-lg border border-rose-200 focus:outline-none focus:ring-1 focus:ring-[#800f2f] bg-white font-semibold text-gray-900"
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {item.line_total !== null ? (
                        formatCurrency(item.line_total)
                      ) : (
                        <span className="text-pink-600 font-medium italic">Pending</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleConfirmPrice(item)}
                        disabled={updatingItemId === item.id}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition disabled:bg-gray-300"
                      >
                        {updatingItemId === item.id ? 'Saving...' : 'Confirm'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals Breakdown */}
        <div className="pt-4 border-t border-rose-100 max-w-sm ml-auto space-y-2 text-xs sm:text-sm">
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
              {order.delivery_charge === 0 ? 'Free' : formatCurrency(order.delivery_charge)}
            </span>
          </div>
          <div className="pt-2 border-t border-rose-100 flex justify-between items-baseline text-base font-bold text-gray-900">
            <span>Final Grand Total</span>
            <span className="text-2xl font-black text-[#590d22]">
              {formatCurrency(order.final_total || order.estimated_total)}
            </span>
          </div>
        </div>
      </div>

      {/* Internal Admin Notes */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
          Store Administrator Notes
        </h3>
        <p className="text-xs text-gray-500">
          Add packing notes, delivery instructions, or customer communication records.
        </p>

        <textarea
          rows={3}
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          placeholder="e.g. Customer called to confirm morning delivery. Added complimentary sample cookies."
          className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] bg-white text-gray-800"
        />

        <button
          type="button"
          onClick={handleNotesUpdate}
          disabled={savingNotes}
          className="bg-[#590d22] hover:bg-[#800f2f] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{savingNotes ? 'Saving Notes...' : 'Save Notes'}</span>
        </button>
      </div>
    </div>
  );
}
