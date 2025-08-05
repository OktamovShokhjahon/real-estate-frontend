"use client";

import { useSearchParams } from "next/navigation";
import VerifyEmailPage from "./emailVerifier";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return <VerifyEmailPage email={email} />;
}
