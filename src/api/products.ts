import { apiClient } from "./client";

export interface ProductVariantValue {
  attribute: { id: number; name: string } | null;
  value: { id: number; value: string } | null;
}

export interface ProductVariant {
  id: number;
  sku: string;
  price: number | string;
  sale_price: number | string | null;
  cost_price: number | string | null;
  stock_status: string;
  status: boolean;
  attributes: ProductVariantValue[];
  inventory: {
    quantity: number;
    reserved_quantity: number;
    available_quantity: number;
    low_stock_threshold: number;
  } | null;
}

export interface ProductImage {
  id: number;
  image: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  short_description: string | null;
  description: string | null;
  price: number | string;
  sale_price: number | string | null;
  cost_price: number | string | null;
  stock_status: string;
  status: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new: boolean;
  is_deal: boolean;
  weight: number | null;
  seo_title?: string | null;
  seo_description?: string | null;
  schema_markup?: string | null;
  seo?: {
    title: string | null;
    description: string | null;
    schema_markup?: string | null;
  };
  category?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  brand?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  images?: ProductImage[];
  variants?: ProductVariant[];
  inventory?: {
    quantity: number;
    available_quantity: number;
  } | null;
}

export interface Review {
  id: number;
  product_id: number;
  product_name?: string;
  user: {
    id: number;
    name: string;
  };
  rating: number;
  title: string | null;
  comment: string;
  status: string;
  is_verified_purchase: boolean;
  created_at: string;
}

export const productsApi = {
  async getProducts(params: Record<string, any> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        query.append(key, String(val));
      }
    });
    const endpoint = `/products${query.toString() ? `?${query.toString()}` : ""}`;
    return await apiClient<Product[]>(endpoint);
  },

  async getProduct(idOrSlug: string | number) {
    const res = await apiClient<Product>(`/products/${idOrSlug}`);
    return res.data;
  },

  async getProductReviews(idOrSlug: string | number) {
    return await apiClient<Review[]>(`/products/${idOrSlug}/reviews`);
  },

  async submitReview(idOrSlug: string | number, data: { rating: number; title?: string; comment: string }) {
    const res = await apiClient<Review>(`/products/${idOrSlug}/reviews`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },
};
