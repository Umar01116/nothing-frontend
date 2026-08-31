const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

export const AUTH_TOKEN_KEY = "nothing_auth_token";
export const GUEST_TOKEN_KEY = "nothing_guest_token";

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

export function getGuestToken(): string {
  let token = localStorage.getItem(GUEST_TOKEN_KEY);
  if (!token) {
    token = "guest_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem(GUEST_TOKEN_KEY, token);
  }
  return token;
}

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data: T;
  meta?: any;
  links?: any;
  errors?: Record<string, string[]>;
}

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Guest-Token": getGuestToken(),
    ...(options.headers as Record<string, string>),
  };

  const authToken = getAuthToken();
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let data: any = {};
  try {
    data = await response.json();
  } catch (e) {
    data = {};
  }

  if (!response.ok) {
    const errorMessage =
      data?.message ||
      (data?.errors ? Object.values(data.errors).flat().join(", ") : "An error occurred");
    const error: any = new Error(errorMessage);
    error.status = response.status;
    error.errors = data?.errors;
    error.data = data;
    throw error;
  }

  return data;
}
