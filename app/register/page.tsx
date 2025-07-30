"use client";

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

// --- Inline input validation logic ---

// Email regex (RFC 5322 simplified)
const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Password: min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

// Name: letters (latin/cyrillic), spaces, hyphens, apostrophes, 2-50 chars
const cyrillic = "\\u0400-\\u04FF\\u0500-\\u052F\\u2DE0-\\u2DFF\\uA640-\\uA69F";
const nameRegex = new RegExp(`^[a-zA-Z${cyrillic}\\s\\-']{2,50}$`);

// Sanitizers
const sanitizeEmail = (email: string) => email.trim().toLowerCase();
const sanitizeName = (name: string) => name.trim().replace(/\s+/g, " ");

// Validation function
function validateRegisterForm(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) {
  const errors: Record<string, string> = {};

  // Email
  if (!data.email || data.email.trim() === "") {
    errors.email = "Email обязателен";
  } else if (!emailRegex.test(data.email)) {
    errors.email = "Введите корректный email";
  }

  // Password
  if (!data.password || data.password.trim() === "") {
    errors.password = "Пароль обязателен";
  } else if (!passwordRegex.test(data.password)) {
    errors.password =
      "Пароль должен содержать минимум 8 символов, заглавные и строчные буквы и цифры";
  }

  // First Name
  if (!data.firstName || data.firstName.trim() === "") {
    errors.firstName = "Имя обязательно";
  } else if (!nameRegex.test(data.firstName)) {
    errors.firstName =
      "Имя может содержать только буквы, пробелы, дефисы и апострофы (2-50 символов)";
  }

  // Last Name
  if (!data.lastName || data.lastName.trim() === "") {
    errors.lastName = "Фамилия обязательна";
  } else if (!nameRegex.test(data.lastName)) {
    errors.lastName =
      "Фамилия может содержать только буквы, пробелы, дефисы и апострофы (2-50 символов)";
  }

  return errors;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Sanitize input data
    const sanitizedData = {
      email: sanitizeEmail(formData.email),
      password: formData.password, // Don't sanitize password
      firstName: sanitizeName(formData.firstName),
      lastName: sanitizeName(formData.lastName),
    };

    // Validate form
    const validationErrors = validateRegisterForm(sanitizedData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await register(sanitizedData);
      // If you want to show verification, add the state here
      // setShowVerification(true);
      // setVerificationEmail(sanitizedData.email);
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

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
          <CardTitle>Регистрация</CardTitle>
          <CardDescription>
            Создайте аккаунт, чтобы начать оставлять отзывы
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Имя</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Фамилия</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

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
                minLength={8}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
              <p className="text-xs text-gray-500">
                Пароль должен содержать минимум 8 символов с заглавными буквами,
                строчными буквами и цифрами
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Создание аккаунта..." : "Зарегистрироваться"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Войти
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
