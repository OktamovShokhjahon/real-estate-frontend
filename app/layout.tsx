import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ThemeProvider } from "@/contexts/theme-context";
import { Navbar } from "@/components/navbar";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProKvartiru.kz - Отзывы о недвижимости и арендаторах",
  description:
    "Платформа для отзывов о недвижимости и арендаторах в Казахстане",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <Providers>
            <div className="min-h-screen bg-background text-foreground transition-colors">
              <Navbar />
              <main className="container mx-auto px-4 py-8">{children}</main>
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                className:
                  "dark:bg-card dark:text-card-foreground dark:border-border",
                style: {
                  background: "hsl(var(--card))",
                  color: "hsl(var(--card-foreground))",
                  border: "1px solid hsl(var(--border))",
                },
              }}
            />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
