import { apiClient, getAuthToken } from "./client";
import { Product } from "./products";
import { Order } from "./checkout";
import { Category } from "./categories";

export interface DashboardStats {
  total_sales: number;
  total_orders: number;
  pending_orders: number;
  processing_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  total_customers: number;
  total_products: number;
  low_stock_count: number;
  low_stock_items: Array<{
    id: number;
    product_name?: string;
    variant_sku?: string;
    quantity: number;
    low_stock_threshold: number;
  }>;
  recent_orders: Order[];
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  website?: string | null;
  status: boolean;
  sort_order: number;
  products_count?: number;
}

export interface AttributeValue {
  id: number;
  attribute_id: number;
  value: string;
  code?: string | null;
  sort_order?: number;
}

export interface Attribute {
  id: number;
  name: string;
  code: string;
  type: string;
  is_filterable: boolean;
  sort_order: number;
  values?: AttributeValue[];
}

export interface PaymentRecord {
  id: number;
  order_id: number;
  transaction_id: string;
  payment_method: string;
  amount: number;
  currency: string;
  status: string;
  paid_at: string | null;
  created_at: string;
  order?: Order;
}

export interface InventoryHistoryRecord {
  id: number;
  inventory_id: number;
  product_id: number;
  product_variant_id?: number | null;
  quantity_before: number;
  quantity_change: number;
  quantity_after: number;
  adjustment_type: string;
  reason: string | null;
  admin_user_id?: number | null;
  order_id?: number | null;
  created_at: string;
  product?: Product;
  variant?: any;
  admin?: { id: number; name: string };
  order?: { id: number; order_number: string };
}

export interface RoleRecord {
  id: number;
  name: string;
  guard_name: string;
  permissions?: Array<{ id: number; name: string }>;
}

function cleanQuery(params: Record<string, any> = {}): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "undefined" && value !== "null") {
      searchParams.append(key, String(value));
    }
  });
  const str = searchParams.toString();
  return str ? `?${str}` : "";
}

export const adminApi = {
  // Dashboard & Reports
  async getDashboardStats() {
    const res = await apiClient<DashboardStats>("/admin/dashboard");
    return res.data;
  },

  async getSalesReport(days = 30) {
    const res = await apiClient<any>(`/admin/reports/sales?days=${days}`);
    return res.data;
  },

  // Orders
  async getOrders(params: Record<string, any> = {}) {
    return await apiClient<Order[]>(`/admin/orders${cleanQuery(params)}`);
  },

  async getOrder(id: number) {
    const res = await apiClient<Order>(`/admin/orders/${id}`);
    return res.data;
  },

  async updateOrderStatus(id: number, data: { status: string; payment_status?: string; comment?: string }) {
    const res = await apiClient<Order>(`/admin/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  // Inventory & Audits
  async getInventory(params: Record<string, any> = {}) {
    return await apiClient<any[]>(`/admin/inventory${cleanQuery(params)}`);
  },

  async updateInventory(id: number, data: { quantity: number; reserved_quantity?: number; low_stock_threshold?: number; reason?: string }) {
    const res = await apiClient<any>(`/admin/inventory/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async adjustInventory(id: number, data: { adjustment_type: string; quantity_change: number; reason: string }) {
    const res = await apiClient<any>(`/admin/inventory/${id}/adjust`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async getInventoryHistory(params: Record<string, any> = {}) {
    return await apiClient<InventoryHistoryRecord[]>(`/admin/inventory/history${cleanQuery(params)}`);
  },

  // Products
  async createProduct(data: any) {
    const res = await apiClient<Product>("/admin/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async updateProduct(id: number, data: any) {
    const res = await apiClient<Product>(`/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async deleteProduct(id: number) {
    return await apiClient(`/admin/products/${id}`, {
      method: "DELETE",
    });
  },

  // Categories
  async createCategory(data: any) {
    const res = await apiClient<Category>("/admin/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async updateCategory(id: number, data: any) {
    const res = await apiClient<Category>(`/admin/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async deleteCategory(id: number) {
    return await apiClient(`/admin/categories/${id}`, {
      method: "DELETE",
    });
  },

  // Brands
  async getBrands() {
    const res = await apiClient<Brand[]>("/admin/brands");
    return res.data;
  },

  async createBrand(data: Partial<Brand>) {
    const res = await apiClient<Brand>("/admin/brands", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async updateBrand(id: number, data: Partial<Brand>) {
    const res = await apiClient<Brand>(`/admin/brands/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async deleteBrand(id: number) {
    return await apiClient(`/admin/brands/${id}`, {
      method: "DELETE",
    });
  },

  // Attributes
  async getAttributes() {
    const res = await apiClient<Attribute[]>("/admin/attributes");
    return res.data;
  },

  async createAttribute(data: any) {
    const res = await apiClient<Attribute>("/admin/attributes", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async updateAttribute(id: number, data: any) {
    const res = await apiClient<Attribute>(`/admin/attributes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async deleteAttribute(id: number) {
    return await apiClient(`/admin/attributes/${id}`, {
      method: "DELETE",
    });
  },

  async addAttributeValue(attributeId: number, data: { value: string; code?: string; sort_order?: number }) {
    const res = await apiClient<AttributeValue>(`/admin/attributes/${attributeId}/values`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async deleteAttributeValue(valueId: number) {
    return await apiClient(`/admin/attribute-values/${valueId}`, {
      method: "DELETE",
    });
  },

  // Payments
  async getPayments(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiClient<PaymentRecord[]>(`/admin/payments${query ? `?${query}` : ""}`);
  },

  async updatePaymentStatus(id: number, data: { status: string; note?: string }) {
    const res = await apiClient<PaymentRecord>(`/admin/payments/${id}/status`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  // Coupons
  async getCoupons() {
    return await apiClient<any[]>("/admin/coupons");
  },

  async createCoupon(data: any) {
    const res = await apiClient<any>("/admin/coupons", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async updateCoupon(id: number, data: any) {
    const res = await apiClient<any>(`/admin/coupons/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async deleteCoupon(id: number) {
    return await apiClient(`/admin/coupons/${id}`, {
      method: "DELETE",
    });
  },

  // Shipping Methods
  async getShippingMethods() {
    return await apiClient<any[]>("/admin/shipping-methods");
  },

  async createShippingMethod(data: any) {
    const res = await apiClient<any>("/admin/shipping-methods", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async updateShippingMethod(id: number, data: any) {
    const res = await apiClient<any>(`/admin/shipping-methods/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async deleteShippingMethod(id: number) {
    return await apiClient(`/admin/shipping-methods/${id}`, {
      method: "DELETE",
    });
  },

  // Reviews
  async getReviews(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiClient<any[]>(`/admin/reviews${query ? `?${query}` : ""}`);
  },

  async updateReviewStatus(id: number, status: string) {
    const res = await apiClient<any>(`/admin/reviews/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
    return res.data;
  },

  async deleteReview(id: number) {
    return await apiClient(`/admin/reviews/${id}`, {
      method: "DELETE",
    });
  },

  // Settings
  async getSettings() {
    const res = await apiClient<any[]>("/admin/settings");
    return res.data;
  },

  async updateSettings(settings: Array<{ key: string; value: any; group?: string }>) {
    const res = await apiClient<any>("/admin/settings", {
      method: "POST",
      body: JSON.stringify({ settings }),
    });
    return res.data;
  },

  // Customers & Users
  async getCustomers(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiClient<any[]>(`/admin/customers${query ? `?${query}` : ""}`);
  },

  async getUsers(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiClient<any[]>(`/admin/users${query ? `?${query}` : ""}`);
  },

  async getRoles() {
    const res = await apiClient<RoleRecord[]>("/admin/roles");
    return res.data;
  },

  async getPermissions() {
    return await apiClient<any>("/admin/permissions");
  },

  async createRole(data: { name: string; permissions: string[] }) {
    const res = await apiClient<RoleRecord>("/admin/roles", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async updateRole(id: number, data: { name?: string; permissions: string[] }) {
    const res = await apiClient<RoleRecord>(`/admin/roles/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async deleteRole(id: number) {
    return await apiClient(`/admin/roles/${id}`, {
      method: "DELETE",
    });
  },

  async updateUserRoles(userId: number, roles: string[]) {
    const res = await apiClient<any>(`/admin/users/${userId}/roles`, {
      method: "PUT",
      body: JSON.stringify({ roles }),
    });
    return res.data;
  },

  async uploadMedia(file: File, folder: string = "uploads"): Promise<{ success: boolean; url: string; path: string }> {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", folder);

    const token = getAuthToken();
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

    const response = await fetch(`${baseUrl}/admin/upload`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    let data: any = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      const errMsg =
        data?.message ||
        (data?.errors ? Object.values(data.errors).flat().join(", ") : "Failed to upload image from PC");
      throw new Error(errMsg);
    }
    return data;
  },

  // Blogs Management
  async getBlogs(params: { search?: string; category?: string; is_published?: boolean; page?: number; per_page?: number } = {}) {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.category) query.set("category", params.category);
    if (params.is_published !== undefined) query.set("is_published", String(params.is_published));
    if (params.page) query.set("page", String(params.page));
    if (params.per_page) query.set("per_page", String(params.per_page));

    const url = `/admin/blogs${query.toString() ? `?${query.toString()}` : ""}`;
    const res = await apiClient<any>(url);
    return res;
  },

  async getBlog(id: number) {
    const res = await apiClient<{ success: boolean; data: any }>(`/admin/blogs/${id}`);
    return res.data?.data;
  },

  async createBlog(data: any) {
    const res = await apiClient<{ success: boolean; data: any }>("/admin/blogs", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async updateBlog(id: number, data: any) {
    const res = await apiClient<{ success: boolean; data: any }>(`/admin/blogs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async deleteBlog(id: number) {
    return await apiClient(`/admin/blogs/${id}`, {
      method: "DELETE",
    });
  },

  async togglePublishBlog(id: number) {
    const res = await apiClient<any>(`/admin/blogs/${id}/toggle-publish`, {
      method: "POST",
    });
    return res;
  },
};
