"use client";

import { useEffect, useState } from "react";
import VerifyEmailPage from "./emailVerifier";

export default function VerifyEmail() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Get email from URL query parameters on client side
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const emailParam = urlParams.get("email");
      if (emailParam) {
        setEmail(emailParam);
      }
    }
  }, []);

  return <VerifyEmailPage email={email} />;
}
