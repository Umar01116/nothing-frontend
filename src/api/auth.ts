import { apiClient, setAuthToken } from "./client";

export interface User {
  id: number;
  name: string;
  email: string;
  roles?: string[];
  permissions?: string[];
  created_at?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  async register(data: { name: string; email: string; password: string; password_confirmation: string }) {
    const res = await apiClient<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.data?.token) {
      setAuthToken(res.data.token);
    }
    return res.data;
  },

  async login(credentials: { email: string; password: string }) {
    const res = await apiClient<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (res.data?.token) {
      setAuthToken(res.data.token);
    }
    return res.data;
  },

  async logout() {
    try {
      await apiClient("/auth/logout", { method: "POST" });
    } finally {
      setAuthToken(null);
    }
  },

  async getUser() {
    const res = await apiClient<User>("/auth/user");
    return res.data;
  },

  async updateProfile(data: { name: string; email: string }) {
    const res = await apiClient<User>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async changePassword(data: { current_password: string; password: string; password_confirmation: string }) {
    return await apiClient("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};
