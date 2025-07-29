import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  try {
    // Call backend endpoint to resend code (reuse /auth/register to trigger resend logic)
    await axios.post(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      }/auth/register`,
      {
        email,
        password: "dummy", // Backend should only send code if user exists and not verified
        firstName: "dummy",
        lastName: "dummy",
        resend: true,
      }
    );
    return res.status(200).json({ message: "Verification code resent" });
  } catch (error: any) {
    return res
      .status(500)
      .json({
        message: error.response?.data?.message || "Failed to resend code",
      });
  }
}
