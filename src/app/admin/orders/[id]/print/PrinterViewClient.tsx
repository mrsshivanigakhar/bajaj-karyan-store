'use client';

import React from 'react';
import { Order, StoreSettings } from '@/types/database';
import { formatCurrency, formatDate, formatUnit } from '@/lib/utils';
import { Printer, ArrowLeft, Download, FileText } from 'lucide-react';
import { generateOrderInvoicePdf } from '@/lib/reports/order-invoice-pdf';

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

  const handleDownloadPdf = () => {
    generateOrderInvoicePdf(order, settings);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Print Controls Bar (hidden during printing) */}
      <div className="no-print bg-white border border-rose-200/90 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <button
          type="button"
          onClick={() => window.close()}
          className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1.5 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Close & Return</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-rose-50 text-gray-700 border border-rose-200 px-4 py-2 rounded-xl font-semibold text-xs shadow-2xs transition cursor-pointer"
            title="Print via browser dialog"
          >
            <Printer className="w-3.5 h-3.5 text-rose-700" />
            <span>Browser Print</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2 bg-[#800f2f] hover:bg-[#590d22] text-white px-5 py-2 rounded-xl font-bold text-xs shadow-xs transition cursor-pointer"
            title="Download crisp, compact PDF document directly"
          >
            <Download className="w-4 h-4" />
            <span>Download Invoice PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Receipt Paper Container */}
      <div className="print-card border border-gray-200 p-6 sm:p-8 rounded-2xl bg-white shadow-xs space-y-4 text-xs">
        {/* Compact Header: Store details on left, Invoice Info on right (Uses ~70% less vertical space) */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-3 border-b-2 border-gray-900 gap-2">
          <div className="space-y-0.5">
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#590d22] font-serif">
              {settings.store_name || 'BAJAJ KARYANA STORE'}
            </h1>
            <p className="text-2xs sm:text-xs text-gray-600">
              {settings.address}, {settings.city}, {settings.state} - {settings.pincode}
            </p>
            <p className="text-2xs text-gray-500">
              Phone: {settings.phone} {settings.email ? `| Email: ${settings.email}` : ''}
            </p>
          </div>

          <div className="sm:text-right space-y-0.5">
            <span className="inline-block bg-[#800f2f] text-white px-2.5 py-0.5 text-2xs font-bold uppercase tracking-wider rounded">
              TAX INVOICE / RECEIPT
            </span>
            <p className="font-mono font-bold text-sm text-gray-900">
              Order #{order.order_number}
            </p>
            <p className="text-2xs text-gray-500">
              Date: {formatDate(order.created_at)}
            </p>
          </div>
        </div>

        {/* Compact Order & Customer Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Order Details Card */}
          <div className="bg-rose-50/40 p-3 rounded-xl border border-rose-100/80 space-y-1">
            <span className="text-2xs font-bold uppercase tracking-wider text-[#800f2f] block pb-0.5 border-b border-rose-200/60">
              Order & Payment Details
            </span>
            <div className="grid grid-cols-2 gap-1 text-2xs sm:text-xs pt-1">
              <div>
                <span className="text-gray-500">Status:</span>{' '}
                <strong className="uppercase text-gray-800 font-bold">{order.status.replace('_', ' ')}</strong>
              </div>
              <div>
                <span className="text-gray-500">Payment:</span>{' '}
                <strong className="uppercase text-gray-800 font-bold">{order.payment_status}</strong>
              </div>
              <div>
                <span className="text-gray-500">Method:</span>{' '}
                <span className="font-semibold text-gray-800 uppercase">{order.payment_method}</span>
              </div>
              <div>
                <span className="text-gray-500">Items:</span>{' '}
                <span className="font-semibold text-gray-800">{order.order_items?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Customer & Delivery Card */}
          <div className="bg-rose-50/40 p-3 rounded-xl border border-rose-100/80 space-y-1">
            <span className="text-2xs font-bold uppercase tracking-wider text-[#800f2f] block pb-0.5 border-b border-rose-200/60">
              Customer & Delivery
            </span>
            <div className="space-y-0.5 text-2xs sm:text-xs pt-1">
              <p>
                <strong className="text-gray-900">{order.customer_name}</strong>{' '}
                <span className="text-gray-600">({order.customer_phone})</span>
              </p>
              <p className="text-gray-600 leading-tight">
                {order.delivery_address}
                {order.landmark ? `, ${order.landmark}` : ''}, {order.city} - {order.pincode}
              </p>
            </div>
          </div>
        </div>

        {/* Compact Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#800f2f] text-white font-bold uppercase text-2xs sm:text-xs">
                <th className="py-2 px-2.5 text-center w-8">#</th>
                <th className="py-2 px-2.5">Item Description</th>
                <th className="py-2 px-2.5 text-center">Unit / Size</th>
                <th className="py-2 px-2.5 text-center">Qty / Wt</th>
                <th className="py-2 px-2.5 text-right">Price</th>
                <th className="py-2 px-2.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.order_items?.map((item, idx) => (
                <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="py-2 px-2.5 text-center text-gray-400 font-medium">{idx + 1}</td>
                  <td className="py-2 px-2.5">
                    <span className="font-bold text-gray-900">{item.product_name}</span>
                    {item.customer_notes && (
                      <span className="block text-2xs text-gray-500 italic">
                        Note: {item.customer_notes}
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-2.5 text-center text-gray-600">
                    {formatUnit(item.unit_type, item.unit_value)}
                  </td>
                  <td className="py-2 px-2.5 text-center font-bold text-gray-800">
                    {item.quantity}{' '}
                    {item.requested_weight ? `(${item.requested_weight})` : ''}
                  </td>
                  <td className="py-2 px-2.5 text-right text-gray-700">
                    {item.unit_price !== null ? formatCurrency(item.unit_price) : 'On Request'}
                  </td>
                  <td className="py-2 px-2.5 text-right font-bold text-gray-900">
                    {item.line_total !== null ? formatCurrency(item.line_total) : 'Pending'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pricing Summary & Instructions */}
        <div className="pt-3 border-t-2 border-gray-900 flex flex-col sm:flex-row justify-between gap-4 items-start">
          {/* Notes */}
          <div className="space-y-1 text-2xs text-gray-600 max-w-sm">
            {order.customer_notes && (
              <p>
                <strong className="text-gray-800">Customer Note:</strong> {order.customer_notes}
              </p>
            )}
            {order.admin_notes && (
              <p>
                <strong className="text-gray-800">Store Remark:</strong> {order.admin_notes}
              </p>
            )}
          </div>

          {/* Pricing Totals Box */}
          <div className="w-full sm:w-64 bg-rose-50/30 p-3 rounded-xl border border-rose-100 space-y-1.5 text-xs self-end">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-gray-800">{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-rose-700 font-medium">
                <span>Discount:</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Delivery Charge:</span>
              <span>{order.delivery_charge === 0 ? 'Free' : formatCurrency(order.delivery_charge)}</span>
            </div>
            <div className="pt-2 border-t border-gray-900 flex justify-between text-sm sm:text-base font-black text-[#590d22]">
              <span>Grand Total:</span>
              <span>{formatCurrency(order.final_total || order.estimated_total)}</span>
            </div>
          </div>
        </div>

        {/* Compact Footer */}
        <div className="pt-4 border-t border-gray-200 text-center text-2xs text-gray-500 space-y-0.5">
          <p className="font-bold uppercase tracking-wider text-gray-700">
            Thank you for shopping with Bajaj Karyana Store!
          </p>
          <p>
            For returns or quality queries, please contact our helpline: {settings.phone} | Official invoice.
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @page {
          size: A4 portrait;
          margin: 10mm;
        }
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-card {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
