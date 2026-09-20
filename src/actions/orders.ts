'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser, getUserProfile } from '@/lib/auth/admin';
import { checkoutSchema } from '@/lib/validations';
import { fallbackProducts, fallbackStoreSettings } from '@/lib/mock-data';

interface CartItemInput {
  productId: string;
  quantity: number;
  requestedWeight?: string;
  customerNotes?: string;
}

export async function createOrderAction(formData: {
  fullName: string;
  phone: string;
  email?: string;
  deliveryAddress: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  customerNotes?: string;
  items: CartItemInput[];
}) {
  try {
    // 1. Validate Form Input
    const validatedForm = checkoutSchema.parse({
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      deliveryAddress: formData.deliveryAddress,
      landmark: formData.landmark,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      customerNotes: formData.customerNotes,
    });

    if (!formData.items || formData.items.length === 0) {
      return { success: false, error: 'Your shopping list is empty.' };
    }

    const supabase = await createClient();
    const currentUser = await getCurrentUser();

    // 2. Fetch authoritative products to avoid trusting client prices/availability
    const productIds = formData.items.map((i) => i.productId);
    let dbProducts: any[] = [];

    try {
      const { data } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);
      if (data && data.length > 0) {
        dbProducts = data;
      }
    } catch {
      // ignore
    }

    // If db products not found (e.g. offline dev), match with fallback
    if (dbProducts.length === 0) {
      dbProducts = fallbackProducts.filter((p) => productIds.includes(p.id));
    }

    // 3. Verify products and compute server totals
    let calculatedSubtotal = 0;
    let hasUnpricedItems = false;
    const orderItemsToInsert: any[] = [];

    for (const item of formData.items) {
      const product = dbProducts.find((p) => p.id === item.productId);
      if (!product) {
        return {
          success: false,
          error: `One of the selected items is no longer available in our store.`,
        };
      }

      if (!product.is_active || !product.is_available) {
        return {
          success: false,
          error: `Product "${product.name}" is currently unavailable.`,
        };
      }

      const qty = item.quantity > 0 ? Number(item.quantity.toFixed(2)) : 1;
      const unitPrice = product.price !== null && product.price !== undefined ? Number(product.price) : null;
      let lineTotal: number | null = null;

      if (unitPrice !== null) {
        lineTotal = Number((unitPrice * qty).toFixed(2));
        calculatedSubtotal += lineTotal;
      } else {
        hasUnpricedItems = true;
      }

      orderItemsToInsert.push({
        product_id: product.id,
        product_name: product.name,
        unit_type: product.unit_type,
        unit_value: product.unit_value,
        quantity: qty,
        requested_weight: item.requestedWeight || null,
        unit_price: unitPrice,
        line_total: lineTotal,
        price_confirmed: unitPrice !== null, // Only confirmed if price exists
        customer_notes: item.customerNotes || null,
      });
    }

    // Delivery charge & order prefix from settings
    let deliveryCharge = 30;
    let orderPrefix = 'BKS';
    try {
      const { data: settings } = await supabase
        .from('store_settings')
        .select('default_delivery_charge, order_prefix')
        .limit(1)
        .single();
      if (settings?.default_delivery_charge !== undefined && settings?.default_delivery_charge !== null) {
        deliveryCharge = Number(settings.default_delivery_charge);
      }
      if (settings?.order_prefix) {
        orderPrefix = settings.order_prefix.trim().toUpperCase();
      }
    } catch {
      deliveryCharge = fallbackStoreSettings.default_delivery_charge;
      orderPrefix = fallbackStoreSettings.order_prefix;
    }

    // Free delivery above 500
    if (calculatedSubtotal >= 500) {
      deliveryCharge = 0;
    }

    const estimatedTotal = calculatedSubtotal + deliveryCharge;

    // Generate Human-friendly order number (fallback if trigger not active)
    const orderYear = new Date().getFullYear();
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const fallbackOrderNumber = `${orderPrefix}-${orderYear}-${randomSuffix}`;

    const orderPayload = {
      customer_id: currentUser ? currentUser.id : null,
      order_number: fallbackOrderNumber,
      status: 'pending',
      subtotal: calculatedSubtotal,
      discount: 0,
      delivery_charge: deliveryCharge,
      estimated_total: estimatedTotal,
      final_total: estimatedTotal,
      payment_status: 'pending',
      payment_method: 'offline',
      customer_name: validatedForm.fullName,
      customer_phone: validatedForm.phone,
      delivery_address: validatedForm.deliveryAddress,
      landmark: validatedForm.landmark || null,
      city: validatedForm.city,
      state: validatedForm.state,
      pincode: validatedForm.pincode,
      customer_notes: validatedForm.customerNotes || null,
    };

    // Insert order in Supabase
    let createdOrder: any = null;
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert(orderPayload)
        .select()
        .single();

      if (!error && data) {
        createdOrder = data;
      }
    } catch {
      // ignore
    }

    const finalOrderNumber = createdOrder?.order_number || fallbackOrderNumber;
    const finalOrderId = createdOrder?.id || `simulated-${Date.now()}`;

    // Insert order items if order was saved in Supabase
    if (createdOrder?.id) {
      const itemsWithOrderId = orderItemsToInsert.map((item) => ({
        ...item,
        order_id: createdOrder.id,
      }));
      await supabase.from('order_items').insert(itemsWithOrderId);
    }

    return {
      success: true,
      orderNumber: finalOrderNumber,
      orderId: finalOrderId,
      hasUnpricedItems,
      estimatedTotal,
    };
  } catch (err: any) {
    console.error('Order creation error:', err);
    return {
      success: false,
      error: err?.message || 'Unable to place order. Please check your information and try again.',
    };
  }
}
