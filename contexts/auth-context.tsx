"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  emailVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.user);
    } catch (error) {
      Cookies.remove("token");
      delete api.defaults.headers.common["Authorization"];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      Cookies.set("token", token, { expires: 7 });
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(user);

      toast.success("Вход выполнен успешно!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Ошибка входа");
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await api.post("/auth/register", data);
      const { user } = response.data;
      toast.success(
        "Код подтверждения отправлен на ваш email. Пожалуйста, введите его для завершения регистрации."
      );
      router.push(`/verify-email/${encodeURIComponent(user.email)}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Ошибка регистрации");
      throw error;
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    try {
      await api.post("/auth/verify-email", { email, code });
      toast.success("Email успешно подтвержден!");

      // If user is already logged in, refresh user data
      if (user) {
        await fetchUser();
      } else {
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Ошибка подтверждения email"
      );
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    toast.success("Вы успешно вышли из системы");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, verifyEmail, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
