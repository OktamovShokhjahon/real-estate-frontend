"use client";

import { useEffect, useState, useRef } from "react";
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
import { useRouter } from "next/navigation";

export default function VerifyEmailPage({ email }: { email: string }) {
  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const { verifyEmail } = useAuth();
  const router = useRouter();

  // Prevent double sending on mount
  const hasSentInitial = useRef(false);

  useEffect(() => {
    if (email && !hasSentInitial.current) {
      hasSentInitial.current = true;
      handleResend(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

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
      // Redirect to home page on successful verification
      router.push("/");
    } catch (error: any) {
      setVerificationError(
        error?.response?.data?.message ||
          "Неверный или просроченный код подтверждения"
      );
    } finally {
      setVerifying(false);
    }
  };

  // The `isInitial` flag disables the "resent" message on first mount
  async function handleResend(isInitial = false) {
    if (!email) return;

    setResendLoading(true);
    if (!isInitial) setResendMessage("");
    try {
      const response = await fetch(
        "http://localhost:4100/api/auth/register", // <-- use backend URL
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password: "",
            firstName: "",
            lastName: "",
            resend: true,
          }),
        }
      );

      if (response.ok) {
        if (!isInitial)
          setResendMessage("Код подтверждения отправлен повторно.");
      } else {
        const data = await response.json();
        setResendMessage(data.message || "Ошибка при отправке кода.");
      }
    } catch {
      setResendMessage("Ошибка при отправке кода. Попробуйте позже.");
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16">
      <Card>
        <CardHeader>
          <CardTitle>Подтверждение Email</CardTitle>
          <CardDescription>
            Введите код подтверждения, отправленный на {email}. Не получили код?
            Нажмите "Отправить код повторно" ниже.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Код подтверждения</Label>
              <Input
                id="code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Введите 6-значный код"
                maxLength={6}
                required
              />
              {verificationError && (
                <p className="text-sm text-red-600">{verificationError}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={verifying}>
              {verifying ? "Подтверждение..." : "Подтвердить Email"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => handleResend(false)}
              disabled={resendLoading}
              className="text-sm"
            >
              {resendLoading ? "Отправка..." : "Отправить код повторно"}
            </Button>
            {resendMessage && (
              <div className="mt-2 text-sm text-green-600">{resendMessage}</div>
            )}
          </div>

          <div className="mt-4 text-center text-sm">
            <Link href="/login.html" className="text-blue-600 hover:underline">
              Вернуться к входу
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
