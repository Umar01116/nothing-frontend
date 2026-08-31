import { apiClient } from "./client";

export interface Blog {
  id: number;
  title: string;
  slug: string;
  category: string;
  summary?: string | null;
  content: string;
  featured_image?: string | null;
  featured_image_alt?: string | null;
  read_time?: string | null;
  is_published: boolean;
  published_at?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface BlogDetailResponse {
  success: boolean;
  data: Blog;
  related?: Blog[];
}

export const blogsApi = {
  async getBlogs(params: { category?: string; search?: string; page?: number; per_page?: number } = {}) {
    const query = new URLSearchParams();
    if (params.category) query.set("category", params.category);
    if (params.search) query.set("search", params.search);
    if (params.page) query.set("page", String(params.page));
    if (params.per_page) query.set("per_page", String(params.per_page));

    const url = `/blogs${query.toString() ? `?${query.toString()}` : ""}`;
    const res = await apiClient<{ data: Blog[]; meta?: any; current_page?: number; last_page?: number; total?: number }>(url);
    return res;
  },

  async getBlogBySlug(identifier: string | number) {
    const res = await apiClient<BlogDetailResponse>(`/blogs/${identifier}`);
    return res.data;
  },

  async getCategories() {
    const res = await apiClient<{ success: boolean; data: string[] }>("/blogs/categories");
    return res.data?.data || [];
  },
};
