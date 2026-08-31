import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi, User } from "../api/auth";
import { getAuthToken } from "../api/client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string; password_confirmation: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    if (!getAuthToken()) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userData = await authApi.getUser();
      setUser(userData);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await authApi.login(credentials);
    setUser(res.user);
    window.dispatchEvent(new CustomEvent("cart-updated"));
  };

  const register = async (data: { name: string; email: string; password: string; password_confirmation: string }) => {
    const res = await authApi.register(data);
    setUser(res.user);
    window.dispatchEvent(new CustomEvent("cart-updated"));
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    window.dispatchEvent(new CustomEvent("cart-updated"));
  };

  const isAdmin = Boolean(
    user?.roles?.some((r) => ["Super Admin", "Admin", "Product Manager", "Order Manager"].includes(r))
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
