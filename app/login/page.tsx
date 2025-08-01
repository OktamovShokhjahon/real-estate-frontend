"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { validateForm, sanitizers } from "@/lib/validation";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [showResend, setShowResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const validationSchema = {
    email: { type: "email" as const, required: true },
    password: { type: "password" as const, required: true },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Sanitize input data
    const sanitizedData = {
      email: sanitizers.sanitizeEmail(formData.email),
      password: formData.password, // Don't sanitize password
    };

    // Validate form
    const validationErrors = validateForm(sanitizedData, validationSchema);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await login(sanitizedData.email, sanitizedData.password);
    } catch (error: any) {
      if (error?.response?.data?.message?.includes("verify your email")) {
        setUnverifiedEmail(sanitizedData.email);
        setShowResend(true);
      }
      // Error is handled in the auth context
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendMessage("");
    try {
      await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: unverifiedEmail }),
      });
      setResendMessage("Код подтверждения отправлен повторно.");
    } catch {
      setResendMessage("Ошибка при отправке кода. Попробуйте позже.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <Card>
        <CardHeader>
          <CardTitle>Вход</CardTitle>
          <CardDescription>
            Введите ваши учетные данные для доступа к аккаунту
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Вход..." : "Войти"}
            </Button>
          </form>
          {showResend && unverifiedEmail && (
            <div className="mt-4 text-center text-sm text-red-600">
              Ваш email не подтвержден. <br />
              <button
                className="text-blue-600 hover:underline disabled:opacity-50"
                onClick={handleResend}
                disabled={resendLoading}
              >
                {resendLoading ? "Отправка..." : "Отправить код повторно"}
              </button>
              {resendMessage && (
                <div className="mt-2 text-green-600">{resendMessage}</div>
              )}
            </div>
          )}
          <div className="mt-4 text-center text-sm">
            {"Нет аккаунта? "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Зарегистрироваться
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
