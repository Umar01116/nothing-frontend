import { apiClient } from "./client";
import { Product } from "./products";

export interface WishlistItem {
  id: number;
  product: Product;
  added_at: string;
}

export interface Wishlist {
  id: number;
  user_id: number;
  items: WishlistItem[];
  count: number;
}

export const wishlistApi = {
  async getWishlist() {
    const res = await apiClient<Wishlist>("/wishlist");
    return res.data;
  },

  async toggleWishlist(productId: number) {
    const res = await apiClient<{ is_wishlisted: boolean; wishlist: Wishlist }>("/wishlist/toggle", {
      method: "POST",
      body: JSON.stringify({ product_id: productId }),
    });
    return res.data;
  },

  async removeFromWishlist(productId: number) {
    const res = await apiClient<Wishlist>(`/wishlist/${productId}`, {
      method: "DELETE",
    });
    return res.data;
  },
};
