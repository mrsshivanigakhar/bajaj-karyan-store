import React from 'react';
import { OrderStatus, PaymentStatus } from '@/types/database';

export function OrderStatusBadge({ status }: { status: OrderStatus | string }) {
  const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-amber-100 border-amber-200', text: 'text-amber-800', label: 'Pending Review' },
    confirmed: { bg: 'bg-blue-100 border-blue-200', text: 'text-blue-800', label: 'Order Confirmed' },
    preparing: { bg: 'bg-purple-100 border-purple-200', text: 'text-purple-800', label: 'Preparing' },
    ready: { bg: 'bg-indigo-100 border-indigo-200', text: 'text-indigo-800', label: 'Ready for Pickup' },
    out_for_delivery: { bg: 'bg-cyan-100 border-cyan-200', text: 'text-cyan-800', label: 'Out for Delivery' },
    delivered: { bg: 'bg-green-100 border-green-200', text: 'text-green-800', label: 'Delivered' },
    cancelled: { bg: 'bg-red-100 border-red-200', text: 'text-red-800', label: 'Cancelled' },
  };

  const style = statusStyles[status] || {
    bg: 'bg-gray-100 border-gray-200',
    text: 'text-gray-800',
    label: status,
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus | string }) {
  const isPaid = status === 'paid';
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${
        isPaid
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-orange-50 text-orange-700 border-orange-200'
      }`}
    >
      {isPaid ? 'Paid' : 'Payment Pending'}
    </span>
  );
}
