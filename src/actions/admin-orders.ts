'use server';

import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/admin';
import { OrderStatus, PaymentStatus } from '@/types/database';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus,
  adminNotes?: string
) {
  try {
    await requireAdmin();
    const supabase = await createClient();

    const updatePayload: any = { status };
    if (adminNotes !== undefined) {
      updatePayload.admin_notes = adminNotes;
    }

    const { error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('id', orderId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/admin/orders`);
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update order status' };
  }
}

export async function updatePaymentStatusAction(
  orderId: string,
  paymentStatus: PaymentStatus
) {
  try {
    await requireAdmin();
    const supabase = await createClient();

    const { error } = await supabase
      .from('orders')
      .update({ payment_status: paymentStatus })
      .eq('id', orderId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/admin/orders`);
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update payment status' };
  }
}

export async function confirmOrderItemPriceAction(
  orderId: string,
  itemId: string,
  unitPrice: number
) {
  try {
    await requireAdmin();
    const supabase = await createClient();

    // 1. Fetch current order item to get quantity
    const { data: itemData, error: itemError } = await supabase
      .from('order_items')
      .select('quantity')
      .eq('id', itemId)
      .single();

    if (itemError || !itemData) {
      return { success: false, error: 'Order item not found' };
    }

    const lineTotal = Number((unitPrice * itemData.quantity).toFixed(2));

    // 2. Update item price
    const { error: updateItemError } = await supabase
      .from('order_items')
      .update({
        unit_price: unitPrice,
        line_total: lineTotal,
        price_confirmed: true,
      })
      .eq('id', itemId);

    if (updateItemError) {
      return { success: false, error: updateItemError.message };
    }

    // 3. Recalculate order subtotal and final_total
    const { data: allItems } = await supabase
      .from('order_items')
      .select('line_total')
      .eq('order_id', orderId);

    const newSubtotal = (allItems || []).reduce(
      (sum, item) => sum + (item.line_total || 0),
      0
    );

    const { data: orderData } = await supabase
      .from('orders')
      .select('delivery_charge, discount')
      .eq('id', orderId)
      .single();

    const delivery = orderData?.delivery_charge || 0;
    const discount = orderData?.discount || 0;
    const newFinalTotal = Math.max(0, newSubtotal + delivery - discount);

    await supabase
      .from('orders')
      .update({
        subtotal: newSubtotal,
        final_total: newFinalTotal,
      })
      .eq('id', orderId);

    revalidatePath(`/admin/orders`);
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true, newSubtotal, newFinalTotal };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update item price' };
  }
}
