"use client";

import { useParams } from "next/navigation";
import VerifyEmailPage from "./emailVerifier";

function page() {
  const params = useParams();

  const email = decodeURIComponent(params.mail);

  return <VerifyEmailPage email={email} />;
}

export default page;
