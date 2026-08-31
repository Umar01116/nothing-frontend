import { apiClient } from "./client";

export interface ShippingMethod {
  id: number;
  name: string;
  code: string;
  description: string | null;
  price: number;
  free_shipping_threshold: number | null;
  estimated_days: string | null;
  status: boolean;
}

export interface CouponValidation {
  coupon: {
    id: number;
    code: string;
    description: string | null;
    type: "fixed" | "percentage";
    value: number;
  };
  discount: number;
  new_subtotal: number;
}

export interface OrderItem {
  id: number;
  product_name: string;
  product_sku: string;
  variant_name: string | null;
  unit_price: number;
  quantity: number;
  subtotal: number;
  discount_amount: number;
  total: number;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: string;
  payment_status: string;
  payment_method: string;
  subtotal: number;
  discount_amount: number;
  shipping_amount: number;
  tax_amount: number;
  grand_total: number;
  coupon_code: string | null;
  shipping_method_name: string | null;
  shipping_address: any;
  billing_address?: any;
  notes: string | null;
  items: OrderItem[];
  created_at: string;
}

export const checkoutApi = {
  async getShippingMethods() {
    const res = await apiClient<ShippingMethod[]>("/shipping-methods");
    return res.data;
  },

  async validateCoupon(code: string, subtotal: number) {
    const res = await apiClient<CouponValidation>("/coupons/validate", {
      method: "POST",
      body: JSON.stringify({ code, subtotal }),
    });
    return res.data;
  },

  async placeOrder(data: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: {
      full_name: string;
      phone: string;
      address_line_1: string;
      address_line_2?: string;
      city: string;
      state?: string;
      postal_code: string;
      country?: string;
    };
    shipping_method_id: number;
    payment_method: string;
    coupon_code?: string | null;
    notes?: string | null;
  }) {
    const res = await apiClient<Order>("/checkout", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async getOrder(identifier: string | number) {
    const res = await apiClient<Order>(`/orders/${identifier}`);
    return res.data;
  },

  async getMyOrders() {
    const res = await apiClient<Order[]>("/orders");
    return res.data;
  },

  async cancelOrder(orderId: number) {
    const res = await apiClient<Order>(`/orders/${orderId}/cancel`, {
      method: "POST",
    });
    return res.data;
  },
};
