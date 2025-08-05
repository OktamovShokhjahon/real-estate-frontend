import { Metadata } from "next";
import VerifyEmailPage from "./emailVerifier";

export const metadata: Metadata = {
  title: "Подтверждение Email",
};

interface VerifyEmailProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function VerifyEmail({ searchParams }: VerifyEmailProps) {
  const email =
    typeof searchParams.email === "string" ? searchParams.email : "";

  return <VerifyEmailPage email={email} />;
}
