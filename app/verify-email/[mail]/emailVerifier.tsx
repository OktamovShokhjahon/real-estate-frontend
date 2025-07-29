"use client";

import { useState, useEffect } from "react";
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
import Link from "next/link";

export default function VerifyEmailPage({ email }: { email: string }) {
  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  // const [email, setEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const { verifyEmail } = useAuth();

  // useEffect(() => {
  //   if (!router.isReady) return;

  //   const emailParam = router.query.email;
  //   if (typeof emailParam === "string") {
  //     setEmail(decodeURIComponent(emailParam));
  //   } else {
  //     router.push("/register");
  //   }
  // }, [router.isReady, router.query]);
  // useEffect(() => {
  //   if (router.isReady) {
  //     const emailParam = router.query.email;
  //     if (typeof emailParam === "string") {
  //       setEmail(decodeURIComponent(emailParam));
  //     } else {
  //       router.push("/register");
  //     }
  //   }
  // }, [router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setVerificationError("Email is required");
      return;
    }

    setVerifying(true);
    setVerificationError("");

    try {
      await verifyEmail(email, verificationCode);
      // success handled in context
    } catch (error: any) {
      setVerificationError(
        error.response?.data?.message ||
          "Неверный или просроченный код подтверждения"
      );
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;

    setResendLoading(true);
    setResendMessage("");

    try {
      const response = await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setResendMessage("Код подтверждения отправлен повторно.");
      } else {
        const error = await response.json();
        setResendMessage(error.message || "Ошибка при отправке кода.");
      }
    } catch (error) {
      setResendMessage("Ошибка при отправке кода. Попробуйте позже.");
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="max-w-md mx-auto mt-16">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Загрузка...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-16">
      <Card>
        <CardHeader>
          <CardTitle>Подтверждение Email</CardTitle>
          <CardDescription>
            Введите код, отправленный на <b>{email}</b>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verificationCode">Код подтверждения</Label>
              <Input
                id="verificationCode"
                name="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Введите 6-значный код"
                required
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
              {verificationError && (
                <p className="text-sm text-red-600">{verificationError}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={verifying}>
              {verifying ? "Проверка..." : "Подтвердить"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading}
              className="text-sm text-blue-600 hover:underline disabled:opacity-50"
            >
              {resendLoading ? "Отправка..." : "Отправить код повторно"}
            </button>
            {resendMessage && (
              <div className="mt-2 text-sm text-green-600">{resendMessage}</div>
            )}
          </div>

          <div className="mt-4 text-center text-sm">
            <Link href="/login" className="text-blue-600 hover:underline">
              Вернуться к входу
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
