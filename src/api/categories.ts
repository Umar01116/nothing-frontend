import { apiClient } from "./client";

export interface Category {
  id: number;
  parent_id?: number | null;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  status: boolean;
  sort_order: number;
  products_count?: number;
  children?: Category[];
}

export const categoriesApi = {
  async getCategories() {
    const res = await apiClient<Category[]>("/categories");
    return res.data;
  },

  async getCategoryTree() {
    const res = await apiClient<Category[]>("/categories/tree");
    return res.data;
  },
};
