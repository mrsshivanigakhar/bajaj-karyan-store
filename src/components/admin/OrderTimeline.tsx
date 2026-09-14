import React from 'react';
import { OrderStatus } from '@/types/database';
import { CheckCircle2, Clock, Package, Truck, Check, XCircle } from 'lucide-react';

export function OrderTimeline({ status }: { status: OrderStatus | string }) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
        <XCircle className="w-6 h-6 shrink-0 text-red-600" />
        <div>
          <h4 className="font-bold text-sm">Order Cancelled</h4>
          <p className="text-xs text-red-600">This order has been cancelled by the store or customer.</p>
        </div>
      </div>
    );
  }

  const steps = [
    { key: 'pending', label: 'Placed', icon: Clock },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
    { key: 'preparing', label: 'Preparing', icon: Package },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: Check },
  ];

  const orderIndexMap: Record<string, number> = {
    pending: 0,
    confirmed: 1,
    preparing: 2,
    ready: 2,
    out_for_delivery: 3,
    delivered: 4,
  };

  const currentStepIndex = orderIndexMap[status] ?? 0;

  return (
    <div className="py-4">
      <div className="relative flex items-center justify-between">
        {/* Progress connecting line */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-gray-200 z-0" />
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-[#800f2f] z-0 transition-all duration-500"
          style={{
            width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx <= currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? 'bg-[#800f2f] text-white ring-4 ring-rose-100 shadow-sm'
                    : 'bg-white border-2 border-gray-300 text-gray-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`mt-2 text-xs font-semibold whitespace-nowrap ${
                  isCurrent ? 'text-[#800f2f]' : isCompleted ? 'text-gray-800' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
