import { apiClient } from "./client";

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  product_variant_id: number | null;
  product_name: string;
  product_slug: string;
  product_sku: string;
  product_image: string | null;
  variant_sku: string | null;
  variant_attributes: Array<{ attribute?: string; value?: string }>;
  unit_price: number;
  regular_price: number;
  quantity: number;
  subtotal: number;
  available_stock: number;
  in_stock: boolean;
}

export interface Cart {
  id: number;
  user_id: number | null;
  guest_token: string | null;
  items: CartItem[];
  total_items: number;
  subtotal: number;
  has_out_of_stock: boolean;
}

export const cartApi = {
  async getCart() {
    const res = await apiClient<Cart>("/cart");
    return res.data;
  },

  async addItem(data: { product_id: number; product_variant_id?: number | null; quantity: number }) {
    const res = await apiClient<Cart>("/cart/items", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async updateItem(itemId: number, quantity: number) {
    const res = await apiClient<Cart>(`/cart/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
    return res.data;
  },

  async removeItem(itemId: number) {
    const res = await apiClient<Cart>(`/cart/items/${itemId}`, {
      method: "DELETE",
    });
    return res.data;
  },

  async clearCart() {
    const res = await apiClient<Cart>("/cart", {
      method: "DELETE",
    });
    return res.data;
  },
};
