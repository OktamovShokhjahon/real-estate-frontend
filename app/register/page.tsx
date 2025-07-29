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
import { validateForm, sanitizers } from "@/lib/validation";
// import { useSearchParams } from "next/navigation";

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
  // const searchParams = useSearchParams();
  // const [showVerification, setShowVerification] = useState(false);
  // const [verificationEmail, setVerificationEmail] = useState("");
  // const [verificationCode, setVerificationCode] = useState("");
  // const [verifying, setVerifying] = useState(false);
  // const [verificationError, setVerificationError] = useState("");

  // const searchParams = useSearchParams();

  const validationSchema = {
    email: { type: "email" as const, required: true },
    password: { type: "password" as const, required: true },
    firstName: { type: "name" as const, required: true },
    lastName: { type: "name" as const, required: true },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Sanitize input data
    const sanitizedData = {
      email: sanitizers.sanitizeEmail(formData.email),
      password: formData.password, // Don't sanitize password
      firstName: sanitizers.sanitizeName(formData.firstName),
      lastName: sanitizers.sanitizeName(formData.lastName),
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
      await register(sanitizedData);
      setShowVerification(true);
      setVerificationEmail(sanitizedData.email);
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setLoading(false);
    }
  };

  // const handleVerify = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setVerifying(true);
  //   setVerificationError("");
  //   try {
  //     await verifyEmail(verificationEmail, verificationCode);
  //   } catch (error) {
  //     setVerificationError("Неверный или просроченный код подтверждения");
  //   } finally {
  //     setVerifying(false);
  //   }
  // };

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

  // if (showVerification || searchParams.get("email")) {
  //   const email = verificationEmail || searchParams.get("email") || "";
  //   return (
  //     <div className="max-w-md mx-auto mt-16">
  //       <Card>
  //         <CardHeader>
  //           <CardTitle>Подтверждение Email</CardTitle>
  //           <CardDescription>
  //             Введите код, отправленный на <b>{email}</b>
  //           </CardDescription>
  //         </CardHeader>
  //         <CardContent>
  //           <form onSubmit={handleVerify} className="space-y-4">
  //             <div className="space-y-2">
  //               <Label htmlFor="verificationCode">Код подтверждения</Label>
  //               <Input
  //                 id="verificationCode"
  //                 name="verificationCode"
  //                 value={verificationCode}
  //                 onChange={(e) => setVerificationCode(e.target.value)}
  //                 required
  //                 maxLength={6}
  //               />
  //               {verificationError && (
  //                 <p className="text-sm text-red-600">{verificationError}</p>
  //               )}
  //             </div>
  //             <Button type="submit" className="w-full" disabled={verifying}>
  //               {verifying ? "Проверка..." : "Подтвердить"}
  //             </Button>
  //           </form>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
  // }

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
