import { apiClient } from "./client";

export interface Address {
  id: number;
  user_id: number;
  type: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string | null;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export const addressesApi = {
  async getAddresses() {
    const res = await apiClient<Address[]>("/addresses");
    return res.data;
  },

  async createAddress(data: Omit<Address, "id" | "user_id">) {
    const res = await apiClient<Address>("/addresses", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async updateAddress(id: number, data: Partial<Address>) {
    const res = await apiClient<Address>(`/addresses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async deleteAddress(id: number) {
    return await apiClient(`/addresses/${id}`, {
      method: "DELETE",
    });
  },

  async setDefaultAddress(id: number) {
    const res = await apiClient<Address>(`/addresses/${id}/default`, {
      method: "POST",
    });
    return res.data;
  },
};
