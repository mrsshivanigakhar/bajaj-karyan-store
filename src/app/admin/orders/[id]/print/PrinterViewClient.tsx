'use client';

import React from 'react';
import { Order, StoreSettings } from '@/types/database';
import { formatCurrency, formatDate, formatUnit } from '@/lib/utils';
import { Printer, ArrowLeft } from 'lucide-react';

export function PrinterViewClient({
  order,
  settings,
}: {
  order: Order;
  settings: StoreSettings;
}) {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Print Controls (hidden when printed) */}
      <div className="no-print bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
        <button
          type="button"
          onClick={() => window.close()}
          className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 bg-[#590d22] hover:bg-[#800f2f] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition"
        >
          <Printer className="w-4 h-4" />
          <span>Print Document / Save PDF</span>
        </button>
      </div>

      {/* Printable Receipt Paper Container */}
      <div className="border border-gray-300 p-8 sm:p-12 rounded-lg bg-white shadow-xs space-y-6">
        {/* Receipt Header */}
        <div className="text-center pb-6 border-b-2 border-gray-900 space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider font-serif">
            {settings.store_name || 'BAJAJ KARYAN STORE'}
          </h1>
          <p className="text-xs text-gray-700">
            {settings.address}, {settings.city}, {settings.state} - {settings.pincode}
          </p>
          <p className="text-xs text-gray-700">
            Phone: {settings.phone} | Email: {settings.email}
          </p>
          <div className="pt-2">
            <span className="inline-block border border-black px-4 py-0.5 text-xs font-bold uppercase tracking-widest">
              OFFICIAL ORDER INVOICE & RECEIPT
            </span>
          </div>
        </div>

        {/* Order & Customer Metadata */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <p>
              <strong className="text-gray-900">Order Number:</strong>{' '}
              <span className="font-mono font-bold text-sm">{order.order_number}</span>
            </p>
            <p>
              <strong className="text-gray-900">Order Date:</strong>{' '}
              {formatDate(order.created_at)}
            </p>
            <p>
              <strong className="text-gray-900">Status:</strong>{' '}
              <span className="uppercase font-semibold">{order.status.replace('_', ' ')}</span>
            </p>
            <p>
              <strong className="text-gray-900">Payment:</strong>{' '}
              <span className="uppercase font-semibold">
                {order.payment_status} ({order.payment_method})
              </span>
            </p>
          </div>

          <div className="space-y-1 text-right sm:text-left">
            <p>
              <strong className="text-gray-900">Customer Name:</strong> {order.customer_name}
            </p>
            <p>
              <strong className="text-gray-900">Mobile Phone:</strong> {order.customer_phone}
            </p>
            <p className="leading-snug">
              <strong className="text-gray-900">Delivery Address:</strong> {order.delivery_address}
              {order.landmark ? `, ${order.landmark}` : ''}, {order.city} - {order.pincode}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="pt-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-y-2 border-gray-900 font-bold uppercase">
                <th className="py-2 px-2">Item Description</th>
                <th className="py-2 px-2 text-center">Unit / Size</th>
                <th className="py-2 px-2 text-center">Qty / Weight</th>
                <th className="py-2 px-2 text-right">Price</th>
                <th className="py-2 px-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.order_items?.map((item, idx) => (
                <tr key={item.id} className="py-2">
                  <td className="py-2 px-2">
                    <span className="font-bold">{item.product_name}</span>
                    {item.customer_notes && (
                      <span className="block text-[11px] text-gray-600 italic">
                        Note: {item.customer_notes}
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-2 text-center text-gray-700">
                    {formatUnit(item.unit_type, item.unit_value)}
                  </td>
                  <td className="py-2 px-2 text-center font-bold">
                    {item.quantity}{' '}
                    {item.requested_weight ? `(${item.requested_weight})` : ''}
                  </td>
                  <td className="py-2 px-2 text-right">
                    {item.unit_price !== null ? formatCurrency(item.unit_price) : 'N/A'}
                  </td>
                  <td className="py-2 px-2 text-right font-bold">
                    {item.line_total !== null ? formatCurrency(item.line_total) : 'Pending'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pricing Summary */}
        <div className="pt-4 border-t-2 border-gray-900 flex justify-end">
          <div className="w-64 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold">{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-gray-700">
                <span>Discount:</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Charge:</span>
              <span>{order.delivery_charge === 0 ? 'Free' : formatCurrency(order.delivery_charge)}</span>
            </div>
            <div className="pt-2 border-t-2 border-gray-900 flex justify-between text-base font-black">
              <span>Grand Total:</span>
              <span>{formatCurrency(order.final_total || order.estimated_total)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {(order.customer_notes || order.admin_notes) && (
          <div className="pt-4 border-t border-gray-200 text-xs space-y-1 text-gray-700">
            {order.customer_notes && (
              <p>
                <strong>Customer Notes:</strong> {order.customer_notes}
              </p>
            )}
            {order.admin_notes && (
              <p>
                <strong>Store Remarks:</strong> {order.admin_notes}
              </p>
            )}
          </div>
        )}

        {/* Footer Guarantee */}
        <div className="pt-8 border-t-2 border-gray-900 text-center text-xs space-y-1">
          <p className="font-bold uppercase tracking-wider">
            Thank you for shopping with Bajaj Karyan Store!
          </p>
          <p className="text-[11px] text-gray-600">
            For returns or quality queries, please contact our store helpline: {settings.phone}
          </p>
        </div>
      </div>
    </div>
  );
}
